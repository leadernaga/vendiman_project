import express, { Request, Response } from 'express'
import cors from 'cors'
import utils from './utils/utils'
import login_route from './routes/login/login_route'

require('dotenv').config()

const app = express()
export default app

//middleweres

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).send({ message: "welcome to vendiman" })
})

app.use('/login', login_route)

app.use((req, res) => {
    res.status(404).send({ message: 'route not found' })
})

app.listen(process.env.PORT, () => {
    utils.log.info(`server running on  port ${process.env.PORT}`)
})
