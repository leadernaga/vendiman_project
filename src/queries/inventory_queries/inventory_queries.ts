import inventoryDB from '../../configs/connection'

async function getInventoryList() {
    try {
        const data = await inventoryDB.select('*').from('inventory')

        return { ...data, message: 'success' }
    } catch (err) {
        return { message: 'unsuccess' }
    }
}

export default { getInventoryList }
