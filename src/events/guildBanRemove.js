const { MessageEmbed, Permissions } = require('discord.js')
const { e } = require('../../Routes/emojis.json')
const client = require('../../index')
const db = require('quick.db')
const Data = require('../../Routes/functions/data')

client.on('guildBanRemove', async ban => {

    if (!ban.guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG) || !ban.guild) { return }

    let IdChannel = db.get(`Servers.${ban.guild.id}.LogChannel`)
    const channel = client.channels.cache.get(IdChannel)
    if (!channel) return

    const fetchedLogs = await ban.guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_BAN_REMOVE', })
    const banLog = fetchedLogs.entries.first()
    const { executor, target, reason } = banLog
    if (!banLog) return

    executor ? executor : executor === 'Indefinido'
    if (target.id === ban.user.id) ModAuthor = executor.tag
    if (target.id !== ban.user.id) ModAuthor = 'Indefinido'
    if (ModAuthor === client.user.tag) return

    const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`🛰️ | Global System Notification | Desbanimento`)
        .addFields(
            { name: '👤 Usuário', value: `${ban.user.tag} - *\`${ban.user.id}\`*` },
            { name: `${e.ModShield} Moderador`, value: `${ModAuthor}` },
            { name: '📝 Razão', value: `${reason || 'Sem motivo informado'}` },
            { name: '📅 Data', value: `${Data}` }
        )
        .setFooter(`${ban.guild.name}`, ban.guild.iconURL({ dynamic: true }))

    channel ? channel.send({ embeds: [embed] }).catch(err => { return }) : ''
})