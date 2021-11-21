const { DatabaseObj, sdb, db, lotery, CommandsLog } = require('../../Routes/functions/database')
const { e, config } = DatabaseObj
const client = require('../../index')
const Data = require('../../Routes/functions/data')

client.once("ready", async () => {

    sdb.delete('Client.Rebooting')
    sdb.delete('Request')
    sdb.delete('BetRequest')

    CommandsLog.clear()

    let Array2 = ['Procurando Nemo', 'Vingadores', 'Bob Esponja', 'Barbie Girl']
    let ActivityRandom = Array2[Math.floor(Math.random() * Array2.length)]

    let Activity = sdb.get('Client.Status.SetActivity') || ActivityRandom
    let Action = sdb.get('Client.Status.SetAction') || 'WATCHING'
    let Status = sdb.get('Client.Status.setStatus') || 'idle'

    client.user.setActivity(`${Activity}`, { type: `${Action}` })
    client.user.setStatus(`${Status}`)

    console.log('Event Ready | OK!')
    const msg = await client.channels.cache.get(config.LogChannelId)?.send(`⏱️ Initial Ping: \`${client.ws.ping}ms\`\n${e.Check} Login: \`${Data()}\``)
    setTimeout(() => {
        msg.delete().catch(() => { })
    }, 5000)

    // if (!sdb.get(`MuteSystem`))
    //     sdb.set(`MuteSystem`, {})

    // sdb.get(`MuteSystem`)

    // setInterval(() => {

    // }, 5000)

})