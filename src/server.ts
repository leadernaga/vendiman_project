import app from './index'
import 'dotenv/config'

const port =
    process.env.NODE_ENV == 'test'
        ? process.env.TEST_PORT || 3000
        : process.env.DEV_PORT || 8080

// console.log(process.env.DB_URL, "Server ");

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
