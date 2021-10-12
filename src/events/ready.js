const client = require('../../index')
const db = require('quick.db')
const { config } = require('../../Routes/config.json')
const { e } = require('../../Routes/emojis.json')
const Data = require('../../Routes/functions/data')

client.on("ready", () => {

    console.log('Event Ready | OK!')
    db.delete('Rebooting')
    db.delete('Request')
    db.delete('BetRequest')
    db.delete('Lotery.Close')
    db.delete(`TimeoutXP`)

    setInterval(() => { db.delete('RateLimit') }, 4000)

    let Array2 = ['Procurando Nemo', 'Vingadores', 'Bob Esponja', 'Barbie Girl']
    let ActivityRandom = Array2[Math.floor(Math.random() * Array2.length)]

    let Activity = db.get('Client.Status.SetActivity') || ActivityRandom
    let Action = db.get('Client.Status.SetAction') || 'WATCHING'
    let Status = db.get('Client.Status.setStatus') || 'idle'

    client.user.setActivity(`${Activity}`, { type: `${Action}` })
    client.user.setStatus(`${Status}`)

    let Shard, Index, Event, Command
    db.get('Client.Status.Shard') ? Shard = e.Check : Shard = e.Deny
    db.get('Client.Status.Index') ? Index = e.Check : Index = e.Deny
    db.get('Client.Status.Event') ? Event = e.Check : Event = e.Deny
    db.get('Client.Status.Command') ? Command = e.Check : Command = e.Deny

    const channel = client.channels.cache.get(config.LoginChannelId)
    channel ? channel.send(`Client Login: ${e.Check}\nEvents: ${Event}\nCommands: ${Command}\nShard: ${Shard}\nIndex: ${Index}\nGlobal System Notification: ${e.Check}\nGlobal System Secutiry: ${e.Check}\nD/H: \`${Data}\`\nErrors Found: \`0\`\nInital Latency: \`${client.ws.ping}ms\``) : ''
})