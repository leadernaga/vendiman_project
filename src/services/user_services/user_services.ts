import { Request } from 'express'
import utils from '../../utils/utils'
import user_queries from '../../queries/user_queries.ts/user_queries'
import custom_errors from '../../utils/Errors/custom_error'
import error_messages from '../../utils/Errors/error_message'
import status_codes from '../../utils/Errors/status_codes'
import otpGenerator from 'otp-generator'
import { jwtPayload } from '../../types/types'

async function login_otp_verify(req: Request) {
    const { email, otp } = req.body

    if (!email || !utils.validateEmail(email) || !otp) {
        const error = new custom_errors(
            error_messages.invalid_email_otp,
            status_codes.bad_request
        )

        throw error
    }

    const user_data = await user_queries.get_user_by_email(email)
    if (!user_data) {
        const error = new custom_errors(
            error_messages.user_notfound,
            status_codes.not_found
        )
        throw error
    }
    
    if (!user_data.token) {
        const error = new custom_errors(
            error_messages.no_otp_generated,
            status_codes.unauthorized
        )
        throw error
    }

    const verify_otp = utils.verifyJWT(user_data.token) as jwtPayload

    if (verify_otp.otp != otp) {
        const error = new custom_errors(
            error_messages.invalid_otp,
            status_codes.unauthorized
        )
        throw error
    }

    const jwt = utils.generateJWT(email, otp, user_data.role, '1d')

    return jwt
}

export default { login_otp_verify }
