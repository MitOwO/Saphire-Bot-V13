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
        let user = message.mentions.members.first() || message.repliedUser

        if (args[1]) { return message.reply(`${e.Deny} | Por favor, mencione apenas o canal/user que deseja desbloquear.`) }

        if (channel && !user) {
            channel.permissionOverwrites.delete(channel.guild.roles.everyone, { SEND_MESSAGES: true })
            return message.channel.send(`🔓 | ${message.author} abriu o canal ${channel}!`)
        }

        if (user) {
            if (user.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                return message.reply(`${e.Confuse} | Um administrador pode falar neste canal mesmo bloqueado, sabia? Mas vou liberar mesmo assim.`).then(() => {

                    message.channel.sendTyping().then(() => {
                        setTimeout(() => {
                            channel.permissionOverwrites.delete(user)
                            message.channel.send(`🔓 | ${message.author} liberou ${user}(adm kkk) para falar neste canal.`)
                        }, 2000)
                    })
                })
            } else {
                channel.permissionOverwrites.delete(user)
                message.channel.send(`🔓 | ${message.author} liberou ${user} para falar neste canal.`)
            }
        }
    }
}