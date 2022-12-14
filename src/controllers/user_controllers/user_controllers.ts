
import { NextFunction, Request, Response } from 'express'

import user_services from '../../services/user_services/user_services'
import status_codes from '../../utils/Errors/status_codes'

import dotenv from "dotenv"
dotenv.config()

async function verify_otp(req: Request, res: Response, next: NextFunction) {

    req.logger.info('user in user_controllers verify')

    try {
        const jwt = await user_services.login_otp_verify(req)
        req.logger.info(
            'user_services login_otp_verify success and sending response to user'
        )
        res.status(200).send({ message: 'success', token: jwt })
    } catch (err) {
        req.logger.info('user_services verify_otp got error')
        next(err)
    }
}

async function send_otp(req: Request, res: Response, next: NextFunction) {


    req.logger.info('user in send otp controller')

    try {
        await user_services.send_otp_service(req)

        req.logger.info(
            'user services successfull sending response 200 to user'
        )
        res.status(status_codes.ok).send({
            message: 'successfully message sended',
        })
    } catch (err) {
        req.logger.error('user control got an error')
        next(err)
    }
}

export default { verify_otp, send_otp }
