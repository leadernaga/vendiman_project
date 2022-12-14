import inventoryDB from '../../configs/connection'

async function getInventoryList() {
    const data = await inventoryDB.select('*').from('inventory')

    return { data, message: 'success' }
}

export default {
    getInventoryList,
}
