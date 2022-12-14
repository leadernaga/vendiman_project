import { NextFunction, Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import utils from '../../utils/utils'


async function auth_middlewere(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.headers.authorization?.split(' ')[1]

    try {
        if (!token) {
            return res
                .status(401)
                .send({ message: 'please provide valid token' })
        }

        const decoded_data = utils.verifyJWT(token)

        if (!decoded_data) {
            return res.status(401).send({
                message: 'user authorization failed please login again',
            })
        }

        next()
    } catch (err) {
        
        return res.status(500).send({ message: 'something went wrong' })
    }
}

async function admin_middlewere(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.headers.authorization?.split(' ')[1]

    try {
        if (!token) {
            return res
                .status(401)
                .send({ message: 'please provide valid token' })
        }

        const decoded_data = utils.verifyJWT(token) as JwtPayload

        if (!decoded_data) {
            return res.status(401).send({
                message: 'user authentication failed please login again',
            })
        }

        if (decoded_data.role != 'admin') {
            return res
                .status(401)
                .send({ message: 'unauthorization cant access this route' })
        }

        next()
    } catch (err) {
        return res.status(500).send({ message: 'something went wrong' })
    }
}

export default { auth_middlewere, admin_middlewere }
