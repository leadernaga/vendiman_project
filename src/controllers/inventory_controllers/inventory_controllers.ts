import { Request, Response } from 'express'
import inventory_query from '../../queries/inventory_queries/inventory_queries'

async function getlist(req: Request, res: Response) {
    try {
        const inventory_list = await inventory_query.getInventoryList()

        console.log(inventory_list)

        res.status(200).send({ message: 'success' })
    } catch (err) {
        res.status(500).send({ message: 'unsuccess' })
    }
}

export default { getlist }
