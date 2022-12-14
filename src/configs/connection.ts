const environment =  'development'
const config = require('../../knexfile')[environment]
const knex = require('knex')(config)
export default knex
