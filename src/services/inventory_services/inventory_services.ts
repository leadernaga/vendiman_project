import inventory_queries from '../../queries/inventory_queries/inventory_queries'

async function get_inventories_service() {
    return await inventory_queries.getInventoryList()
}

export default { get_inventories_service }
