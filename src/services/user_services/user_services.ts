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
    req.logger.info("user in login_otp_verify service")

    if (!email || !utils.validateEmail(email) || !otp) {
        req.logger.error("user email or otp is failed")
        const error = new custom_errors(
            error_messages.invalid_email_otp,
            status_codes.bad_request
        )

        throw error
    }

    const user_data = await user_queries.get_user_by_email(email,req)
    if (!user_data) {
        req.logger.error("user not found in database")
        const error = new custom_errors(
            error_messages.user_notfound,
            status_codes.not_found
        )
        throw error
    }

    if (!user_data.token) {
        req.logger.error("user dont have token and he may not went through sendotp")
        const error = new custom_errors(
            error_messages.no_otp_generated,
            status_codes.unauthorized
        )
        throw error
    }

    const verify_otp = utils.verifyJWT(user_data.token) as jwtPayload

    if (verify_otp.otp != otp) {
        req.logger.error("user entered wrong otp ")
        const error = new custom_errors(
            error_messages.invalid_otp,
            status_codes.unauthorized
        )
        throw error
    }

    const jwt = utils.generateJWT(email, otp, user_data.role, '1d')
    req.logger.info("jwt token created in verify_service and sending to verify_controllers")

    return jwt
}

async function send_otp_service(req: Request) {
    req.logger.info('user in send otp service')

    const { email } = req.body

    if (!email || !utils.validateEmail(email)) {
        req.logger.error("user email is not valid")
        const error = new custom_errors(
            error_messages.invalid_email,
            status_codes.bad_request
        )
        throw error
    }

    const user_data = await user_queries.get_user_by_email(email,req)

    if (!user_data) {
        req.logger.error("user email  not found in database")
        throw new custom_errors(
            error_messages.user_notfound,
            status_codes.not_found
        )
    }

    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
    })
    req.logger.info("otp is generated")
    const token = utils.generateJWT(user_data.email, otp, user_data.role)
    req.logger.info("jwt token is created")

     await user_queries.update_user_token(email, token)
    req.logger.info("sending otp to email")
    const result: any = await utils.sendMail({
        email,
        otp,
        username: user_data.name,
    })

    if (result.message === 'unsuccess') {
        req.logger.error("cant able to send email got error")
        throw new custom_errors(
            error_messages.email_sending_failed,
            status_codes.internal_error
        )
    }
    return result
}

export default { login_otp_verify, send_otp_service }
