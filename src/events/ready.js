const { DatabaseObj, sdb, db, lotery } = require('../../Routes/functions/database')
const { e, config } = DatabaseObj
const client = require('../../index')
const Data = require('../../Routes/functions/data')

client.once("ready", async () => {

    sdb.delete('Client.Rebooting')

    if (!lotery.get('Loteria.Users'))
        lotery.set('Loteria.Users', [])

    sdb.delete('Request')
    sdb.delete('BetRequest')

    let Array2 = ['Procurando Nemo', 'Vingadores', 'Bob Esponja', 'Barbie Girl']
    let ActivityRandom = Array2[Math.floor(Math.random() * Array2.length)]

    let Activity = sdb.get('Client.Status.SetActivity') || ActivityRandom
    let Action = sdb.get('Client.Status.SetAction') || 'WATCHING'
    let Status = sdb.get('Client.Status.setStatus') || 'idle'

    client.user.setActivity(`${Activity}`, { type: `${Action}` })
    client.user.setStatus(`${Status}`)

    console.log('Event Ready | OK!')
    const channel = await client.channels.cache.get(config.LogChannelId)
    channel ? channel.send(`⏱️ Initial Ping: \`${client.ws.ping}ms\`\n${e.Check} Login: \`${Data()}\``) : ''
})