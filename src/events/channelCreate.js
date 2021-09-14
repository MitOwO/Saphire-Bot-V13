const { Permissions } = require('discord.js')
const client = require('../../index')
const { e } = require('../../Routes/emojis.json')

client.on('channelCreate', async (channel) => {

    if (!channel.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return
    if (!channel.guild || !channel.guild.available) return

    if (!channel || channel.isVoice() || !channel.viewable || channel.deleted)
        return

    if (channel && channel.isText() && channel.viewable)
        channel.send(`First! ${e.NezukoJump}`).catch(err => { return })
    return
})