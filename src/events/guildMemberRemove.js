const { e } = require('../../Routes/emojis.json')
const client = require('../../index')
const db = require('quick.db')
const { Permissions, MessageEmbed } = require('discord.js')
const Data = require('../../Routes/functions/data')

client.on('guildMemberRemove', async (member) => {

    if (!member.guild.available) return
    db.delete(`Servers.${member.guild.id}.AfkSystem.${member.id}`)

    LeaveMember(); Notify()

    async function Notify() {

        if (!member.guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG) || !member.guild) { return }
        const channel = client.channels.cache.get(db.get(`Servers.${member.guild.id}.LogChannel`))
        if (!channel) return

        const fetchedLogs = await member.guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_KICK' })
        const banLog = fetchedLogs.entries.first()
        const { executor, target, reason } = banLog
        if (!banLog || !executor) return

        target.id === member.user.id ? ModAuthor = executor.tag : 'Indefinido'
        if (target.id !== member.user.id) return
        if (ModAuthor === client.user.tag) return

        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(`🛰️ | Global System Notification | Kick`)
            .addFields(
                { name: '👤 Usuário', value: `${member.user.tag} - *\`${member.user.id}\`*` },
                { name: `${e.ModShield} Moderador`, value: `${ModAuthor}` },
                { name: '📝 Razão', value: `${reason || 'Sem motivo informado'}` },
                { name: '📅 Data', value: `${Data}` }
            )
            .setFooter(`${member.guild.name}`, member.guild.iconURL({ dynamic: true }))

        channel ? channel.send({ embeds: [embed] }).catch(err => { return }) : ''
    }

    async function LeaveMember() {
        let LeaveChannel = db.get(`Servers.${member.guild.id}.LeaveChannel`)
        const canal = await member.guild.channels.cache.get(LeaveChannel)
        if (!canal) return
        canal.send(`${e.SadPanda} | ${member.user.username} saiu do servidor.`).catch(err => { return })
    }
})