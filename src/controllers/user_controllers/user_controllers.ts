import user_queries from '../../queries/user_queries.ts/user_queries'
const otpGenerator = require('otp-generator')
import { Request, Response } from 'express'
import utils from '../../utils/utils'
import { JwtPayload } from 'jsonwebtoken'
import { jwtPayload } from '../../types/types'
require('dotenv').config()

async function login_user(req: Request, res: Response) {
    const { email, otp } = req.body
    utils.log.info('user in login route')
    try {
        if (!email || !otp) {
            return res.status(400).send({
                message: 'please enter valid email and otp',
            })
        }

        const user_data = await user_queries.get_user(email)

        if (user_data.message == 'not found') {
            return res.status(404).send({ message: 'user not found' })
        }

        if (user_data.message == 'unsuccess') {
            return res.status(400).send({ message: 'email is not valid' })
        }

        if (!user_data.token) {
            return res
                .status(401)
                .send({ message: 'please enter click on get otp' })
        }

        const verify_otp = utils.verifyJWT(user_data.token) as JwtPayload
        if (verify_otp.otp != otp) {
            return res.status(401).send({ message: 'please enter correct otp' })
        }

        const jwt = utils.generateJWT(email, otp, user_data.role)

        res.status(200).send({ message: 'success', token: jwt })
    } catch (err) {
        res.status(500).send({
            message: 'something happened internally please try again',
        })
    }
}

async function get_otp(req: Request, res: Response) {
    const { email } = req.body
    try {
        if (!email || !utils.validateEmail(email)) {
            return res
                .status(400)
                .send({ message: 'please enter a valid email address' })
        }
        const user_data = await user_queries.get_user(email)
        if (user_data.message === 'not found') {
            return res.status(404).send({ message: 'user not found' })
        }

        if (user_data.message == 'unsuccess') {
            return res
                .status(400)
                .send({ message: 'please enter a valid email id' })
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
        })
        const token = utils.generateJWT(user_data.email, otp, user_data.role)

        let update_result: any = await user_queries.update_user_token(
            email,
            token
        )

        if (update_result.message == 'unsuccess') {
            return res
                .status(500)
                .send({ message: 'something happened internally' })
        }

        const result: any = await utils.sendMail({
            email,
            otp,
            username: user_data.name,
        })
        if (result.message === 'unsuccess') {
            return res.status(500).send({
                message: 'cant able to sendmail',
            })
        }

        res.status(200).send({ message: 'successfully message sended' })
    } catch (err) {
        res.status(500).send({ message: 'something happened internally' })
    }
}

export default { login_user, get_otp }
