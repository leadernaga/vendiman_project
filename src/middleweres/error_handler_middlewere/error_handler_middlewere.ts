import { NextFunction, Response, Request } from 'express'
import custom_error from '../../utils/Errors/custom_error'
import status_codes from '../../utils/Errors/status_codes'
import error_message from '../../utils/Errors/error_message'

async function error_handler_middlewere(
    error: custom_error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let message
    if (error.message === 'Error') {
        message = error_message.internal_error
    } else {
        message = error.message
    }

    if (error) {
        return res
            .status(error.status || status_codes.internal_error)
            .send({ message })
    }
}

export default error_handler_middlewere
