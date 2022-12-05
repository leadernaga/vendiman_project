import userdb from '../../configs/connection'

async function get_user(email: string) {
    try {
        const user = await userdb
            .select('*')
            .where('email', email)
            .from('users')
            .first()
        if (!user.email) {
            return { message: 'not found' }
        }
        return { ...user, message: 'success' }
    } catch (err: any) {
        return { message: 'unsuccess' }
    }
}

async function update_user_token(email: string, token: string) {
    try {
        const user = await userdb('users')
            .update({ token: token })
            .where('email', email)

        return { ...user, message: 'success' }
    } catch (err) {
        return { message: 'unsuccess' }
    }
}

export default { get_user, update_user_token }
