import request from 'supertest'
import sinon from 'sinon'
import app from '../../index'
// import inventory_queries from '../../queries/item_queries/inventory_queries'
import user_queries from '../../queries/user_queries.ts/user_queries'
import auth_middlewere from '../../middleweres/Auth/auth_middlewere'
import { NextFunction, Request, Response } from 'express'
import utils from '../../utils/utils'
import inventory_queries from '../../queries/inventory_queries/inventory_queries'
import inventory_items_queries from '../../queries/inventory_items_queries/inventory_items_queries'

describe('inventory', () => {
    describe('/items/filter', () => {
        afterEach(() => {
            sinon.restore()
        })

        it('should need to give an error on inventory id not found', async () => {
            const response = await request(app)
                .get('/inventory/filter?category=bevareges')
                .send({})

            expect(response.status).toBe(400)
            expect(response.body.message).toBe(
                'please provide valid inventory_id'
            )
        })

        it('should need to give an error on empty query', async () => {
            const response = await request(app)
                .get('/inventory/filter')
                .send({ inventory_id: 'q23434' })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe(
                'please filter on field name or category or price'
            )
        })

        it('should able to get response 400 on wrong query', async () => {
            sinon.stub(inventory_items_queries, 'filter_items').resolves({})
            const response = await request(app)
                .get('/inventory/filter?name=man')
                .send({ inventory_id: '12334' })
            // console.log(response.body)
            expect(response.status).toBe(404)
            expect(response.body.message).toBe('no result found on filter')
        })

        it('should able to get error 500 on database fail', async () => {
            sinon
                .stub(inventory_items_queries, 'filter_items')
                .throwsException()
            const response = await request(app)
                .get('/inventory/filter?name=man')
                .send({ inventory_id: '12334' })
            // console.log(response.body)
            expect(response.status).toBe(500)
            expect(response.body.message).toBe(
                'something went wrong internally'
            )
        })

        it('should able to search on name field', async () => {
            sinon
                .stub(inventory_items_queries, 'filter_items')
                .resolves({ name: 'mango' })
            const response = await request(app)
                .get('/inventory/filter?name=man')
                .send({ inventory_id: '12334' })
            // console.log(response.body)
            expect(response.body.data.name).toBe('mango')
            expect(response.body.message).toBe('success')
        })
    })

    describe('/items/search', () => {
        afterEach(() => {
            sinon.restore()
        })

        it('should get response 400 on empty inventory id', async () => {
            const response = await request(app)
                .get('/inventory/search')
                .send({})

            expect(response.status).toBe(400)
            expect(response.body.message).toBe(
                'please provide valid inventory_id'
            )
        })

        it('should get response 404 on no result found', async () => {
            sinon.stub(inventory_items_queries, 'search_items').resolves([])
            const response = await request(app)
                .get('/inventory/search?q=namaste')
                .send({ inventory_id: '12345' })

            expect(response.status).toBe(404)
            expect(response.body.message).toBe(
                'no result found on search query'
            )
        })

        it('should get response 200 on valid database result', async () => {
            sinon
                .stub(inventory_items_queries, 'search_items')
                .resolves([{ name: 'naga' }])
            const response = await request(app)
                .get('/inventory/search?q=namaste')
                .send({ inventory_id: '12345' })

            expect(response.status).toBe(200)
            expect(response.body.data).toMatchObject([{ name: 'naga' }])
        })

        it('should get response 500 on  database fail', async () => {
            sinon
                .stub(inventory_items_queries, 'search_items')
                .throwsException()
            const response = await request(app)
                .get('/inventory/search?q=namaste')
                .send({ inventory_id: '12345' })

            expect(response.status).toBe(500)
            expect(response.body.message).toBe(
                'something went wrong internally'
            )
        })
    })

    describe('items/place_order', () => {
        afterEach(() => {
            sinon.restore()
        })
        it('should give respons 401 on not provideing jwt token', async () => {
            const response = await request(app)
                .post('/inventory/place_order')
                .send({
                    inventory_id: '1234',
                    item_ids: [{ item_id: '1234', qty: 5 }],
                })

            expect(response.status).toBe(401)
            expect(response.body.message).toBe('please provide valid token')
        })

        it('should give respons 401 on not providing jwt token', async () => {
            const response = await request(app)
                .post('/inventory/place_order')
                .send({
                    inventory_id: '1234',
                    item_ids: [{ item_id: '1234', qty: 5 }],
                })
                .set('authorization', 'bearer wrongtoken')

            expect(response.status).toBe(401)
            expect(response.body.message).toBe(
                'user authorization failed please login again'
            )
        })

        it('should give respons 500 on jwt throw Exception', async () => {
            sinon.stub(utils, 'verifyJWT').throwsException()
            const response = await request(app)
                .post('/inventory/place_order')
                .set('authorization', 'bearer wrongtoken')

            expect(response.status).toBe(500)
            expect(response.body.message).toBe('something went wrong')
        })

        it('should give respons 400 on invalid details item_ids:string', async () => {
            sinon.stub(utils, 'verifyJWT').resolves()
            const response = await request(app)
                .post('/inventory/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({ inventory_id: '1234', item_ids: '123' })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('"item_ids" must be an array')
        })

        it('should give respons 400 on invalid details item_id:string ', async () => {
            sinon.stub(utils, 'verifyJWT').resolves()
            const response = await request(app)
                .post('/inventory/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({ inventory_id: '1234', item_ids: [''] })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe(
                '"item_ids[0]" must be of type object'
            )
        })

        it('should give respons 400 on invalid details on not prividing item:id in object ', async () => {
            sinon.stub(utils, 'verifyJWT').resolves()
            const response = await request(app)
                .post('/inventory/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({ inventory_id: '1234', item_ids: [{ item_i: '122' }] })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe(
                '"item_ids[0].item_id" is required'
            )
        })

        it('should give respons 400 on invalid details  on not providing quantity ', async () => {
            sinon.stub(utils, 'verifyJWT').resolves()
            const response = await request(app)
                .post('/inventory/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({ inventory_id: '1234', item_ids: [{ item_id: '122' }] })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('"item_ids[0].qty" is required')
        })

        it('should give respons 400 on wrong data type of item_id ', async () => {
            sinon.stub(utils, 'verifyJWT').resolves()
            const response = await request(app)
                .post('/inventory/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({
                    inventory_id: '1234',
                    item_ids: [{ item_id: 12 }],
                })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe(
                '"item_ids[0].item_id" must be a string'
            )
        })

        it('should give respons 400 on wrong data type of qty ', async () => {
            sinon.stub(utils, 'verifyJWT').resolves()
            const response = await request(app)
                .post('/inventory/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({
                    inventory_id: '1234',
                    item_ids: [{ item_id: '12', qty: 'h' }],
                })

            //   expect(response.status).toBe(400)
            expect(response.body.message).toBe(
                '"item_ids[0].qty" must be a number'
            )
        })

        it('should give respons 406 on less quantity', async () => {
            sinon.stub(utils, 'verifyJWT').resolves()
            sinon.stub(user_queries, 'get_user_by_email').resolves()
            sinon
                .stub(inventory_items_queries, 'get_inventory_items_data')
                .resolves([
                    { item_id: '123', price: 10, qty: 0, item_name: 'mango' },
                ])

            const response = await request(app)
                .post('/inventory/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({
                    inventory_id: '123',
                    item_ids: [{ item_id: '123', qty: 10 }],
                })

            expect(response.status).toBe(406)
            expect(response.body.message).toBe(
                'mango dont have enough quantity'
            )
        })

        it('should give respons 402 on less user balance', async () => {
            sinon.stub(utils, 'verifyJWT').resolves()
            sinon
                .stub(user_queries, 'get_user_by_email')
                .resolves({ email: 'email', name: 'naga', balance: 10 })
            sinon
                .stub(inventory_items_queries, 'get_inventory_items_data')
                .resolves([
                    { item_id: '123', price: 10, qty: 20, item_name: 'mango' },
                ])

            const response = await request(app)
                .post('/inventory/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({
                    inventory_id: '123',
                    item_ids: [{ item_id: '123', qty: 10 }],
                })

            expect(response.status).toBe(402)
            expect(response.body.message).toBe('user dont have enough balance')
        })

        it('should give respons 200 on successful place order', async () => {
            sinon.stub(utils, 'verifyJWT').resolves()
            sinon
                .stub(user_queries, 'get_user_by_email')
                .resolves({ email: 'email', name: 'naga', balance: 1000 })
            sinon
                .stub(inventory_items_queries, 'get_inventory_items_data')
                .resolves([
                    { item_id: '123', price: 10, qty: 20, item_name: 'mango' },
                ])
            sinon.stub(user_queries, 'update_user_token').resolves()
            sinon
                .stub(inventory_items_queries, 'post_ordered_items')
                .resolves({ message: 'success' })
            sinon
                .stub(inventory_items_queries, 'update_inventory_items_qty')
                .resolves()
            sinon.stub(user_queries, 'update_user_balance').resolves()

            const response = await request(app)
                .post('/inventory/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({
                    inventory_id: '123',
                    item_ids: [{ item_id: '123', qty: 10 }],
                })

            expect(response.status).toBe(200)
            expect(response.body.message).toBe('success')
        })

        it('should give respons 500 on database error', async () => {
            sinon.stub(utils, 'verifyJWT').resolves()
            sinon.stub(user_queries, 'get_user_by_email').throwsException()
            const response = await request(app)
                .post('/inventory/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({
                    inventory_id: '1234',
                    item_ids: [{ item_id: 'hello', qty: 1 }],
                })

            expect(response.status).toBe(500)
            expect(response.body.message).toBe(
                'something went wrong internally'
            )
        })
    })
})
