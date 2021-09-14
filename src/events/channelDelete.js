const client = require('../../index')
const db = require('quick.db')

client.on('channelDelete', async (channel) => {

    if (channel.id === db.get(`Servers.${channel.guild.id}.LeaveChannel`) || '1')
        db.delete(`Servers.${channel.guild.id}.LeaveChannel`)

    if (channel.id === db.get(`Servers.${channel.guild.id}.WelcomeChannel`) || '1')
        db.delete(`Servers.${channel.guild.id}.WelcomeChannel`)

    if (channel.id === db.get(`Servers.${channel.guild.id}.LogChannel`) || '1')
        db.delete(`Servers.${channel.guild.id}.LogChannel`)
})