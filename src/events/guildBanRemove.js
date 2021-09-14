const { MessageEmbed, Permissions } = require('discord.js')
const { e } = require('../../Routes/emojis.json')
const client = require('../../index')
const db = require('quick.db')

client.on('guildBanRemove', async ban => {

    if (!ban.guild) return
    if (!ban.guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) { return }

    let IdChannel = db.get(`Servers.${ban.guild.id}.LogChannel`)
    const channel = client.channels.cache.get(IdChannel)
    if (!channel) return

    const fetchedLogs = await ban.guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_KICK', })
    const banLog = fetchedLogs.entries.first()
    const { executor, target } = banLog
    if (!banLog) return

    if (target.id === ban.user.id) ModAuthor = executor.tag
    if (target.id !== ban.user.id) ModAuthor = 'Indefinido'

    const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`${e.Loud} Sistema de Desbanimento`)
        .addFields(
            { name: 'Usuário', value: `${ban.user.tag} *\`${ban.user.id}\`*` },
            { name: 'Moderador', value: `${ModAuthor}` },
        )
        .setTimestamp()
        .setFooter(`${ban.guild.name}`, ban.guild.iconURL({ dynamic: true }))

    return channel.send({ embeds: [embed] })
})