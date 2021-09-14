const client = require('../../index')
const { MessageEmbed, Permissions } = require('discord.js')
const { e } = require('../../Routes/emojis.json')
const db = require('quick.db')
const { config } = require('../../Routes/config.json')

client.on("guildCreate", async (guild) => {

    if (!guild.available) return
    db.set(`Servers.${guild.id}`, guild.name)

    let owner = await guild.fetchOwner()
    let CanalDeConvite = await guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has(Permissions.FLAGS.SEND_MESSAGES))
    let ChannelId = config.guildCreateChannelId

    function WithChannel() {
        CanalDeConvite.createInvite({ maxAge: 0 }).then(ChannelInvite => {
            const Embed = new MessageEmbed().setColor('GREEN').setTitle(`${e.Loud} Um servidor me adicionou`).setDescription('Registro no banco de dados com concluido!').addField('Servidor', `[${guild.name}](${ChannelInvite.url}) *\`(${guild.id})\`*`).addField('Status', `**Dono:** ${owner.user.tag} *\`(${owner.user.id})\`*\n**Membros:** ${guild.memberCount}`)
            if (!ChannelId) { return } else { const channel = client.channels.cache.get(ChannelId); if (!channel) { return } else { channel.send({ embeds: [Embed] }) } }
        }).catch(() => {
            const Embed = new MessageEmbed().setColor('GREEN').setTitle(`${e.Loud} Um servidor me adicionou`).setDescription('Registro no banco de dados com concluido!').addField('Servidor', `${guild.name} *\`(${guild.id})\`*`).addField('Status', `**Dono:** ${owner.user.tag} *\`(${owner.user.id})\`*\n**Membros:** ${guild.memberCount}`)
            if (!ChannelId) { return } else { const channel = client.channels.cache.get(ChannelId); if (!channel) { return } else { channel.send({ embeds: [Embed] }) } }
        })
    }

    function WithoutChannel() {
        const Embed = new MessageEmbed().setColor('GREEN').setTitle(`${e.Loud} Um servidor me adicionou`).setDescription('Registro no banco de dados com concluido!').addField('Servidor', `${guild.name} *\`(${guild.id})\`*`).addField('Status', `**Dono:** ${owner.user.tag} *\`(${owner.user.id})\`*\n**Membros:** ${guild.memberCount}`)
        if (!ChannelId) { return } else { const channel = client.channels.cache.get(ChannelId); if (!channel) { return } else { channel.send({ embeds: [Embed] }) } }
    }

    CanalDeConvite ? WithChannel() : WithoutChannel()
})
