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

        if (user) {
            if (user.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply(`${e.Confuse} | Por qual motivo você bloquearia esse canal de um Administrador?`)
            message.channel.permissionOverwrites.create(user, { SEND_MESSAGES: false })
            return message.channel.send(`🔒 | ${message.author} proibiu ${user} de falar neste canal. -> \`${prefix}unlock @user\``)
        }

        if (channel && !user) {
            channel.permissionOverwrites.create(channel.guild.roles.everyone, { SEND_MESSAGES: false })
            return message.channel.send(`🔒 | ${message.author} fechou o canal ${channel}! -> \`${prefix}unlock\``)
        }
    }
}