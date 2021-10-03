const { e } = require('../../../Routes/emojis.json')
const { Permissions } = require('discord.js')

module.exports = {
    name: 'unlock',
    aliases: ['destrancar', 'abrir'],
    category: 'moderation',
    UserPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
    ClientPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
    emoji: '🔓',
    usage: 'unlock <#channel>/<@user>',
    description: 'Abra o canal para todos/user falarem',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let channel = message.mentions.channels.first() || message.channel
        let user = message.mentions.members.first() || message.mentions.repliedUser || message.guild.members.cache.get(args[0])
        let Role = channel.guild.roles.cache.get(message.mentions.roles.first()?.id)

        if (args[1]) { return message.reply(`${e.Deny} | Por favor, mencione apenas o canal/user que deseja desbloquear.`) }

        if (channel && !user && !Role) {
            channel.permissionOverwrites.delete(channel.guild.roles.everyone, { SEND_MESSAGES: true })
            return message.channel.send(`🔓 | ${message.author} abriu o canal ${channel}!`)
        }

        if (Role && !message.mentions.members.first() && !message.mentions.channels.first())
            message.channel.permissionsFor(Role).has(Permissions.FLAGS.SEND_MESSAGES) ? AnswerRole() : UnlockRole()

        if (user && !message.mentions.channels.first() && !Role) {
            if (user.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                return message.reply(`${e.SaphireQ} | Um administrador pode falar neste canal mesmo bloqueado, sabia? Mas vou liberar mesmo assim.`).then(() => {

                    message.channel.sendTyping().then(() => {
                        setTimeout(() => {
                            message.channel.permissionOverwrites.create(user, { SEND_MESSAGES: true })
                            message.channel.send(`🔓 | ${message.author} liberou ${user}(adm kkk) para falar neste canal.`)
                        }, 2000)
                    })
                })
            } else {
                message.channel.permissionOverwrites.create(user, { SEND_MESSAGES: true })
                message.channel.send(`🔓 | ${message.author} liberou ${user} para falar neste canal.`)
            }
        }

        function UnlockRole() {
            channel.permissionOverwrites.delete(Role)
            return message.channel.send(`🔓 | ${message.author} liberou o canal para o cargo ${Role}.`)
        }

        function AnswerRole() {
            message.reply(`${e.Check} | Este canal já está aberto para este cargo.`)
        }
    }
}