
import userdb from '../../configs/connection'
import { Request } from 'express'

async function get_user_by_email(email: string, req: Request) {
    req.logger.info('user in get_user_by_email query')
    return await userdb.select('*').where('email', email).from('users').first()
}

async function update_user_token(email: string, token: string) {
    return await userdb('users').update({ token: token }).where('email', email)
}

async function update_user_balance(email: string, balance: number,req:Request) {
    req.logger.info("user request in update_user_balance query")
    return userdb
        .select('*')
        .from('users')
        .where('email', email)
        .decrement('balance', balance)
}

export default { get_user_by_email, update_user_token, update_user_balance }
