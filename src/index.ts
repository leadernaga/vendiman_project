import express, { Request, Response } from 'express'
import cors from 'cors'
import utils from './utils/utils'
import login_route from './routes/login/login_route'
import inventory_route from './routes/inventory/inventory.route'
import items_route from './routes/items/items_route'
import 'dotenv/config'
import error_handler_middlewere from './middleweres/error_handler_middlewere/error_handler_middlewere'

const app = express()

//middleweres

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).send({ message: 'welcome to vendiman' })
})

app.use('/login', login_route)

app.use('/inventory', inventory_route)
app.use('/items', items_route)

app.use(error_handler_middlewere)

app.use((req, res) => {
    res.status(404).send({ message: 'route not found' })
})

export default app
