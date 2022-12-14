import request from 'supertest'
import app from './index'

describe('/ get', () => {


    it('on / get route should give 200 response', async () => {

        const response = await request(app).get('/')

        expect(response.status).toBe(200)
        expect(response.body.message).toMatch('welcome to vendiman')
    })

    it('on invalid route should get response 404', async () => {
        const response = await request(app).get('/wrongroute')
        expect(response.status).toBe(404)
        expect(response.body).toEqual({ message: 'route not found' })
    })
})
