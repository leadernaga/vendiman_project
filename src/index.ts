import express, { Request, Response } from 'express'
import cors from 'cors'
import login_route from './routes/login/login_route'
import inventory_route from './routes/inventory/inventory.route'
import items_route from './routes/items/items_route'
import 'dotenv/config'
import error_handler_middlewere from './middleweres/error_handler_middlewere/error_handler_middlewere'
import bunyan from 'bunyan'
import { v4 as uuid } from 'uuid'
import swaggerUi from 'swagger-ui-express'
import swagger_documentation from "./Docs/swagger_documentation.json"


declare global {
    namespace Express {
        export interface Request {
            logger?: any
        }
    }
}

const app = express()

// //middleweres

app.use((req, res, next) => {
    if (req.method !== 'GET') {
        if (req.headers['content-type'] !== 'application/json') {
            return res.status(400).send('please provide json type only')
        }
    }
    next()
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger_documentation))

//setting logger on req
app.use((req, res, next) => {
    const logger = bunyan.createLogger({
        name: 'vendiman',
        request_id: uuid(),
    })
    req.logger = logger
    next()
})

app.use(express.json())
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.status(200).send({ message: 'welcome to vendiman' })
})

app.use('/login', login_route)

app.use('/inventory', inventory_route)
app.use('/items', items_route)

app.use(error_handler_middlewere)

app.use((req: Request, res: Response) => {
    res.status(404).send({ message: 'route not found' })
})

export default app
