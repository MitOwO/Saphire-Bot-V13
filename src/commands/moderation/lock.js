const { Permissions } = require('discord.js')
const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'lock',
    aliases: ['trancar', 'fechar', 'clbc'],
    category: 'moderation',
    UserPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
    ClientPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
    emoji: '🔒',
    usage: 'lock <#channel>/<@user>',
    description: 'Tranque o canal para que  ninguém/user fale nele',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let channel = message.mentions.channels.first() || message.channel
        let user = message.mentions.members.first() || message.repliedUser

        if (args[1]) { return message.reply(`${e.Deny} | Por favor, mencione apenas o canal/user que deseja bloquear.`) }

        if (channel && !user)
            message.channel.permissionsFor(channel.guild.roles.everyone).has(Permissions.FLAGS.SEND_MESSAGES) ? LockChannel() : AnswerChannel()

        if (user && !message.mentions.channels.first())
            message.channel.permissionsFor(user).has(Permissions.FLAGS.SEND_MESSAGES) ? LockUser() : AnswerUser()

        function LockUser() {
            if (user.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply(`${e.Confuse} | Por qual motivo você bloquearia esse canal de um Administrador?`)
            message.channel.permissionOverwrites.create(user, { SEND_MESSAGES: false })
            return message.channel.send(`🔒 | ${message.author} proibiu ${user} de falar neste canal. -> \`${prefix}unlock @user\``)
        }

        function LockChannel() {
            channel.permissionOverwrites.create(channel.guild.roles.everyone, { SEND_MESSAGES: false })
            return message.channel.send(`🔒 | ${message.author} fechou o canal ${channel}! -> \`${prefix}unlock\``)
        }

        function AnswerChannel() {
            message.reply(`${e.Check} | Este canal já está trancado para everyone.`)
        }

        function AnswerUser() {
            message.reply(`${e.Check} | Este usuário já está bloqueado.`)
        }
    }
}