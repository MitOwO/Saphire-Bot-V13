const client = require('../../index')
const { sdb, ServerDb } = require('./database')

async function Notify(serverid, type, msg) {

    const canal = await client.channels.cache.get(ServerDb.get(`Servers.${serverid}.LogChannel`))
    
    if (!canal && ServerDb.get(`Servers.${serverid}.LogChannel`))
        ServerDb.delete(`Servers.${serverid}.LogChannel`)

    canal ? canal.send(`🛰️ | **Global System Notification** | ${type}\n \n${msg}`).catch(() => { }) : ''
}

module.exports = Notify