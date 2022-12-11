import app from './index'
import utils from './utils/utils'
import 'dotenv/config'

const port =
    process.env.NODE_ENV == 'test'
        ? process.env.TEST_PORT || 3000
        : process.env.DEV_PORT || 8080

// console.log(process.env.DB_URL, "Server ");

app.listen(port, () => {
    utils.log.info(`Server is running on http://localhost:${port}`)
})
