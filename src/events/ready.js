const client = require('../../index')
const db = require('quick.db')
const { config } = require('../../Routes/config.json')
const { e } = require('../../Routes/emojis.json')

client.on("ready", () => {

    console.log('Event Ready | OK!')
    db.delete('Rebooting'); db.delete(`Request`);
    db.delete('Lotery.Close')

    let Options = [e.Pikachu, e.NezukoDance, e.Deidara, e.NezukoJump, e.CoolDoge, e.Nagatoro, e.PatBear, 'Tô online.', 'Online', 'Login successfully']
    let Emoji = Options[Math.floor(Math.random() * Options.length)]

    let Array2 = ['Procurando Nemo', 'Vingadores', 'Bob Esponja', 'Barbie Girl']
    let ActivityRandom = Array2[Math.floor(Math.random() * Array2.length)]

    let Activity = db.get('Client.Status.SetActivity') || ActivityRandom
    let Action = db.get('Client.Status.SetAction') || 'WATCHING'
    let Status = db.get('Client.Status.setStatus') || 'idle'

    client.user.setActivity(`${Activity}`, { type: `${Action}` })
    client.user.setStatus(`${Status}`)

    const channel = client.channels.cache.get(config.LoginChannelId)
    channel ? channel.send(`${Emoji}`) : ''
})