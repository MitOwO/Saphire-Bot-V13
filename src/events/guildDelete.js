const client = require('../../index')
const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
const { e } = require('../../Routes/emojis.json')
const { config } = require('../../Routes/config.json')

client.on("guildDelete", async (guild) => {

    db.delete(`Servers.${guild.id}`)
    let owner = await guild.fetchOwner()

    const Embed = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${e.Loud} Um servidor me removeu`)
        .setDescription('Todos os dados deste servidor foram apagados.')
        .addField('Servidor', `${guild.name} *\`(${guild.id})\`*`)
        .addField('Status', `**Dono:** ${owner.user.tag} *\`(${owner.user.id})\`*\n**Membros:** ${guild.memberCount}`)

    let ChannelId = config.guildDeleteChannelId
    if (!ChannelId) return

    const channel = client.channels.cache.get(ChannelId)
    channel ? channel.send({ embeds: [Embed] }).catch(err => { }) : ''
})