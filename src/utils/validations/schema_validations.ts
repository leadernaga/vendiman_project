import joi from 'joi'
import { join } from 'path'

function post_inventory_items_schema() {
    const schema = joi.object({
        inventory_id: joi.string().required(),
        item_ids: joi
            .array()
            .items(
                joi
                    .object({
                        item_id: joi.string().required(),
                        qty: joi.number().required(),
                    })
                    .required()
            )
            .required(),
    })
    return schema
}

export default { post_inventory_items_schema }
