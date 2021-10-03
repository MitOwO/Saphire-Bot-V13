const { Permissions } = require('discord.js')
const client = require('../../index')
const { e } = require('../../Routes/emojis.json')
const db = require('quick.db')

client.on('channelCreate', async (channel) => {

    if (!channel.guild || !channel.guild.available || !channel.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return

    if (channel && channel.isText() && channel.viewable && channel.viewable && !channel.isVoice())
        channel.send(`First! ${e.NezukoJump}`).catch(err => { })
    return
})