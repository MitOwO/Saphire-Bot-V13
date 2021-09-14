const { e } = require('../../Routes/emojis.json')
const client = require('../../index')
const db = require('quick.db')
const { config } = require('../../Routes/config.json')

client.on('guildMemberRemove', async (member) => {

    if (!member.guild.available) return

    let LeaveChannel = db.get(`Servers.${member.guild.id}.LeaveChannel`)
    const canal = await member.guild.channels.cache.get(LeaveChannel)

    if (!canal) return
    return canal.send(`${e.SadPanda} | ${member.user.username} saiu do servidor.`).catch(err => { return })
})