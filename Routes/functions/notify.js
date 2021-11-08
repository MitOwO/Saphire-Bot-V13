const client = require('../../index')
const { sdb } = require('./database')

async function Notify(serverid, type, msg) {

    const canal = await client.channels.cache.get(sdb.get(`Servers.${serverid}.LogChannel`))
    
    if (!canal && sdb.get(`Servers.${serverid}.LogChannel`))
        sdb.delete(`Servers.${serverid}.LogChannel`)

    canal ? canal.send(`🛰️ | **Global System Notification** | ${type}\n \n${msg}`).catch(() => { }) : ''
}

module.exports = Notify