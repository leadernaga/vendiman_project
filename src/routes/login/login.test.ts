import request, { Response } from 'supertest'
import sinon from 'sinon'
import app from '../../index'
import user_queries from '../../queries/user_queries.ts/user_queries'
import utils from '../../utils/utils'

describe('/login', () => {
    describe('/getotp', () => {
        afterEach(() => {
            sinon.restore()
        })

        it('get otp should fail on invalid email', async () => {
            let response = await request(app)
                .get('/login/getotp')
                .send({ email: 'pnaga234@gmailcom' })
            expect(response.status).toBe(400)
            expect(response.body.message).toBe(
                'please enter a valid email address'
            )
        })

        it('get otp should fail on user not found', async () => {
            sinon.stub(user_queries, 'get_user_by_email').resolves({
                message: 'not found',
            })

            let response = await request(app)
                .get('/login/getotp')
                .send({ email: 'pnaga234@gmail.com' })
            expect(response.status).toBe(404)
            expect(response.body.message).toBe('user not found')
        })

        it('get otp should fail on unsuccess while get_user', async () => {
            sinon.stub(user_queries, 'get_user_by_email').resolves({
                message: 'unsuccess',
            })
            let response = await request(app)
                .get('/login/getotp')
                .send({ email: 'pnaga234@gmail.com' })
            expect(response.status).toBe(400)
            expect(response.body.message).toBe('please enter a valid email id')
        })

        it('get otp should fail on unsuccess while update_user', async () => {
            sinon.stub(user_queries, 'get_user_by_email').resolves({
                name: 'naga',
                email: 'pnaga234@gmail.com',
                token: null,
                role: 'admin',
            })
            sinon.stub(user_queries, 'update_user_token').resolves({
                message: 'unsuccess',
            })

            let response = await request(app)
                .get('/login/getotp')
                .send({ email: 'pnaga234@gmail.com' })
            expect(response.status).toBe(500)
            expect(response.body.message).toBe('something happened internally')
        })

        it('get otp should fail on failing to send mail', async () => {
            sinon.stub(user_queries, 'get_user_by_email').resolves({
                name: 'naga',
                email: 'pnaga234@gmail.com',
                token: null,
                role: 'admin',
            })

            sinon.stub(utils, 'sendMail').resolves({ message: 'unsuccess' })

            let response = await request(app)
                .get('/login/getotp')
                .send({ email: 'pnaga234@gmail.com' })
            expect(response.status).toBe(500)
            expect(response.body.message).toBe('cant able to sendmail')
        })

        it('get otp should send success message', async () => {
            sinon.stub(user_queries, 'get_user_by_email').resolves({
                name: 'naga',
                email: 'pnaga234@gmail.com',
                token: null,
                role: 'admin',
            })

            sinon.stub(utils, 'sendMail').resolves({ message: 'success' })

            let response = await request(app)
                .get('/login/getotp')
                .send({ email: 'pnaga234@gmail.com' })
            expect(response.status).toBe(200)
            expect(response.body.message).toBe('successfully message sended')
        })

        it('get otp should fail on rejects', async () => {
            sinon.stub(user_queries, 'get_user_by_email').rejects()
            let response = await request(app)
                .get('/login/getotp')
                .send({ email: 'pnaga234@gmail.com' })
            expect(response.status).toBe(500)
            expect(response.body.message).toBe('something happened internally')
        })
    })

    describe.only('/verify', () => {
        afterEach(() => {
            sinon.restore()
        })

        it('on invalid email and otp  should give error', async () => {
            const response: request.Response = await request(app)
                .get('/login/verify')
                .send({})

            expect(response.status).toBe(400)
            expect(response.body.message).toBe(
                'please enter valid email and otp'
            )
        })

        it('on user not found should get a response 404', async () => {
            sinon.stub(user_queries, 'get_user_by_email').resolves()
            const response: request.Response = await request(app)
                .get('/login/verify')
                .send({ email: 'pnag234@gmail.com', otp: '112344' })

            expect(response.status).toBe(404)
            expect(response.body.message).toBe('user not found please register')
        })

        it('on token null should give 401 response', async () => {
            sinon
                .stub(user_queries, 'get_user_by_email')
                .resolves({ token: null })
            const response: request.Response = await request(app)
                .get('/login/verify')
                .send({ email: 'pnaga234@gmail.com', otp: '112344' })

            expect(response.status).toBe(401)
            expect(response.body.message).toBe('please click on get otp')
        })

        it('on jwt token verify fail should give 401 response', async () => {
            sinon
                .stub(user_queries, 'get_user_by_email')
                .resolves({ message: 'success', token: 'hello babai' })
            sinon.stub(utils, 'verifyJWT').resolves(false)
            const response: request.Response = await request(app)
                .get('/login/verify')
                .send({ email: 'pnaga234@gmail.com', otp: '112344' })

            expect(response.status).toBe(401)
            expect(response.body.message).toBe('please enter correct otp')
        })

        it('on jwt token verify fail should give response', async () => {
            sinon
                .stub(user_queries, 'get_user_by_email')
                .resolves({ message: 'success', token: 'hello babai' })
            sinon.stub(utils, 'verifyJWT').resolves(false)
            const response: request.Response = await request(app)
                .get('/login/verify')
                .send({ email: 'pnaga234@gmail.com', otp: '112344' })

            expect(response.status).toBe(401)
            expect(response.body.message).toBe('please enter correct otp')
        })

        it('on correct details should give response 200', async () => {
            sinon
                .stub(user_queries, 'get_user_by_email')
                .resolves({ message: 'success', token: 'hello babai' })
            sinon.stub(utils, 'verifyJWT').returns({ otp: '112344' })
            const response: request.Response = await request(app)
                .get('/login/verify')
                .send({ email: 'pnaga234@gmail.com', otp: '112344' })

            expect(response.status).toBe(200)
            expect(response.body.message).toBe('success')
        })

        it('on db fail should give 500 response', async () => {
            sinon.stub(user_queries, 'get_user_by_email').throwsException()
            sinon.stub(utils, 'verifyJWT').returns({ otp: '112344' })
            const response: request.Response = await request(app)
                .get('/login/verify')
                .send({ email: 'pnaga234@gmail.com', otp: '112344' })

            expect(response.status).toBe(500)
            expect(response.body.message).toBe(
                'something went wrong internally'
            )
        })
    })
})
