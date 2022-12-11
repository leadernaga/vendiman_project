import { response } from 'express'
import knex from 'knex'
import sinon from 'sinon'
import request from 'supertest'
import inventory_controllers from '../../controllers/inventory_controllers/inventory_controllers'
import app from '../../index'
import auth_middlewere from '../../middleweres/Auth/auth_middlewere'
import inventory_queries from '../../queries/inventory_queries/inventory_queries'
import inventory_query from '../../queries/inventory_queries/inventory_queries'
import utils from '../../utils/utils'
import inventory_items_queries from '../../queries/inventory_items_queries/inventory_items_queries'

describe('inventory', () => {
    describe('/ post items', () => {
        afterEach(() => {
            sinon.restore()
        })

        it('should get response 401 on not providing token', async () => {
            sinon.stub(utils, 'verifyJWT').returns(false)
            const response = await request(app)
                .post('/inventory/items')
                .send({})

            expect(response.status).toBe(401)
            expect(response.body.message).toBe('please provide valid token')
        })

        it('should get response 401 on jwt failed', async () => {
            sinon.stub(utils, 'verifyJWT').returns(false)
            const response = await request(app)
                .post('/inventory/items')
                .send({ inventory_id: 'expample' })
                .set('Authorization', 'bearer 1234')

            expect(response.status).toBe(401)
            expect(response.body.message).toBe(
                'user authentication failed please login again'
            )
        })

        it('should get response 401 on user not Admin', async () => {
            sinon.stub(utils, 'verifyJWT').returns({ role: 'customer' })
            const response = await request(app)
                .post('/inventory/items')
                .send({ inventory_id: 'expample' })
                .set('Authorization', 'bearer 1234')

            expect(response.status).toBe(401)
            expect(response.body.message).toBe(
                'unauthorization cant access this route'
            )
        })

        it('should get response 400 on not providing inventory_id', async () => {
            sinon.stub(utils, 'verifyJWT').returns({ role: 'admin' })
            const response = await request(app)
                .post('/inventory/items')
                .send({ inventory: 'expample' })
                .set('Authorization', 'bearer 1234')

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('"inventory_id" is required')
        })

        it('should get response 500 on jwt throw error', async () => {
            sinon.stub(utils, 'verifyJWT').throwsException()
            const response = await request(app)
                .post('/inventory/items')
                .send({ inventory_id: 'expample' })
                .set('Authorization', 'bearer 1234')

            expect(response.status).toBe(500)
            expect(response.body.message).toBe('something went wrong')
        })

        it('should get response 200 on correct details', async () => {
            sinon.stub(utils, 'verifyJWT').returns({ role: 'admin' })
            sinon
                .stub(inventory_items_queries, 'post_items_on_inventory')
                .resolves({ message: 'success' })
            const response = await request(app)
                .post('/inventory/items')
                .send({
                    inventory_id: 'expample',
                    item_ids: [{ item_id: '123', qty: 10 }],
                })
                .set('Authorization', 'bearer 1234')

            expect(response.status).toBe(200)
            expect(response.body.message).toBe('success')
        })

        it('should get response 500 on post fail', async () => {
            sinon.stub(utils, 'verifyJWT').returns({ role: 'admin' })
            sinon
                .stub(inventory_items_queries, 'post_items_on_inventory')
                .rejects()
            const response = await request(app)
                .post('/inventory/items')
                .send({
                    inventory_id: 'expample',
                    item_ids: [{ item_id: '123', qty: 10 }],
                })
                .set('Authorization', 'bearer 1234')

            expect(response.status).toBe(500)
            expect(response.body.message).toBe(
                'something went wrong internally'
            )
        })

        it('should get response 500 on post fail', async () => {
            sinon.stub(utils, 'verifyJWT').returns({ role: 'admin' })
            sinon
                .stub(inventory_items_queries, 'post_items_on_inventory')
                .rejects()
            const response = await request(app)
                .post('/inventory/items')
                .send({
                    inventory_id: 'expample',
                    item_ids: [{ item_id: '123', qty: 10 }],
                })
                .set('Authorization', 'bearer 1234')

            expect(response.status).toBe(500)
            expect(response.body.message).toBe(
                'something went wrong internally'
            )
        })
    })

    describe('get /inventory', () => {
        afterEach(() => {
            sinon.restore()
        })

        it('should give response 200 on query success', async () => {
            sinon
                .stub(inventory_queries, 'getInventoryList')
                .resolves({ data: [''], message: 'success' })
            const response = await request(app).get('/inventory')
            expect(response.status).toBe(200)
            expect(response.body.message).toBe('success')
        })

        it('should give response 500 on query fail', async () => {
            sinon.stub(inventory_queries, 'getInventoryList').rejects()
            const response = await request(app).get('/inventory')

            // expect(response.status).toBe(500)
            expect(response.body.message).toBe(
                'something went wrong internally'
            )
        })
    })
})
