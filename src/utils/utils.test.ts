import sinon from 'sinon'
import request from 'supertest'
import app from '../index'
import { nodemailer_response } from '../types/types'
import utils from '../utils/utils'

describe.only('utils', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('generate jwt should give token ', () => {
        const token = utils.generateJWT('naga@gmail.com', '12345', 'customer')

        expect(token).toBeDefined()
    })

    it('verify jwt should give false on wrong token ', () => {
        const result = utils.verifyJWT('wrongtoke')

        expect(result).toBe(false)
    })

    it('verify jwt should give correct response ', async () => {
        const result = await utils.verifyJWT(
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hZ2FAZ21haWwuY29tIiwib3RwIjoiMTIzNDUiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE2NzAwNzE0NDZ9.tyrZ-4QOmAX74fC_qsLZzRczKWdkNI0YhxDJOlFHE3M'
        )
        expect(result).toStrictEqual({
            email: 'naga@gmail.com',
            iat: 1670071446,
            otp: '12345',
            role: 'customer',
        })
    })

    it('validate gmail should give false on invalid mail ', () => {
        const result = utils.validateEmail('naga@gmailcom')

        expect(result).toBe(false)
    })

    it('validate gmail should give true on correct mail ', () => {
        const result = utils.validateEmail('naga@gmail.com')

        expect(result).toBe(true)
    })
    it('send mail should give message success ', async () => {
        const result: any = await utils.sendMail({
            email: 'pluralsightvendiman@gmail.com',
            username: 'naga',
            otp: '12345',
        })

        expect(result.message).toBe('success')
    })

    it('send mail should give message unsuccess on invalid mail ', async () => {
        const result: any = await utils.sendMail({
            email: '',
            otp: '',
            username: '',
        })

        expect(result.message).toBe('unsuccess')
    })
})
