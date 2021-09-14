const client = require('../../index')
const { MessageEmbed } = require('discord.js')
const { e } = require('../../Routes/emojis.json')
const db = require('quick.db')
const { config } = require('../../Routes/config.json')

client.on("guildCreate", async (guild) => {

    if (!guild.available) return
    db.set(`Servers.${guild.id}`, guild.name)

    let owner = await guild.fetchOwner()

    const Embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`${e.Loud} Um servidor me adicionou`)
        .setDescription('Registro no banco de dados com concluido!')
        .addField('Servidor', `${guild.name} *\`(${guild.id})\`*`)
        .addField('Status', `**Dono:** ${owner.user.tag} *\`(${owner.user.id})\`*\n**Membros:** ${guild.memberCount}`)

    let ChannelId = config.guildCreateChannelId
    if (!ChannelId || ChannelId === null || ChannelId === undefined) {
        return
    } else {
        const channel = client.channels.cache.get(ChannelId)
        if (!channel) { return } else { channel.send({ embeds: [Embed] }) }
    }
})