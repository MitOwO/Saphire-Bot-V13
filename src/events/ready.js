const client = require('../../index')
const db = require('quick.db')
const { config } = require('../../Routes/config.json')
const { e } = require('../../Routes/emojis.json')

client.on("ready", () => {
    console.log('Event Ready | OK!')
    db.delete('Rebooting')
    db.delete(`User.Request`)
    
    let Options = [e.Pikachu, e.NezukoDance, e.Deidara, e.NezukoJump, e.CoolDoge, e.Nagatoro, e.PatBear]
    let Emoji = Options[Math.floor(Math.random() * Options.length)]

    let Activity = db.get('Client.Status.SetActivity')
    let Action = db.get('Client.Status.SetAction')
    let Status = db.get('Client.Status.setStatus')

    if (!Activity || Activity === null || Activity === undefined) Activity = 'Procurando Nemo'
    if (!Action || Action === null || Action === undefined) Action = 'WATCHING'
    if (!Status || Status === null || Status === undefined) Status = 'idle'

    client.user.setActivity(`${Activity}`, { type: `${Action}` })
    client.user.setStatus(`${Status}`)

    const channel = client.channels.cache.get(config.LoginChannelId)
    if (!channel) { return } else { channel.send(`${Emoji}`) }
})

client.once('ready', () => { client.user.setStatus('idle') })