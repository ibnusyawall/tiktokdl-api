var Nedb = require('nedb')

DB = new Nedb({ filename: process.cwd() + '/database/db.json' })

DB.loadDatabase(e => e ? console.log(e) : console.log('[√] success db loaded') )

//DB.insert({ ip: '127.0.0.1', location: '' }, (e, res) => console.log(res))
DB.find({}, (e, res) => console.log(res))
module.exports = DB
