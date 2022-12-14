import jwt, { JwtPayload } from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { nodemailer_data_Type } from '../types/types'

const hbs: any = require('hbs')

import dotenv from 'dotenv'
dotenv.config()

function generateJWT(
    email: string,
    otp: number | string,
    role: string,
    expiresIn = '5m'
) {
    return jwt.sign({ email, otp, role }, process.env.jwt_secret as string, {
        expiresIn: expiresIn,
    })
}

function verifyJWT(token: string) {
    return jwt.verify(
        token,
        process.env.jwt_secret as string,
        (err, decoded) => {
            if (err) {
                return false
            }

            return decoded
        }
    ) as JwtPayload | boolean | void
}

function validateEmail(mail: string) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return true
    }

    return false
}

async function sendMail(data: nodemailer_data_Type) {
    try {
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.nodemailer_email,
                pass: process.env.nodemailer_password,
            },
        })

        const content = `
        <div style="margin: auto;">
            <h3>Hello, {{username}}</h3>
            <p>Here is your one time password </p>
            <h1>{{otp}}</h1>
            <p>Note: Please Note that otp is one time use only and it will expires in 2min.</p>
            <p>If you did not do this please reset your password immediately.</p>
        </div> `

        const template = hbs.compile(content)

        const info = await transport.sendMail({
            from: 'Vendiman Vendiman@gmail.com',
            to: data.email,
            subject: 'login OTP',
            html: template({
                username: data.username,
                otp: data.otp,
            }),
        })

        return { message: 'success' }
    } catch (e) {
        return { message: 'unsuccess' }
    }
}

export default { generateJWT, verifyJWT, validateEmail, sendMail }
