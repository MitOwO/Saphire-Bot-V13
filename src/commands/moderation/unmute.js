const
    { e } = require('../../../database/emojis.json'),
    { ServerDb } = require('../../../Routes/functions/database')

module.exports = {
    name: 'unmute',
    aliases: ['desmutar'],
    category: 'moderation',
    UserPermissions: ['MANAGE_ROLES', 'MANAGE_CHANNELS'],
    ClientPermissions: ['MANAGE_ROLES'],
    emoji: `${e.ModShield}`,
    usage: '<unmute> <@user/id>',
    description: 'Desmute membros mutados',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]),
            role = message.guild.roles.cache.get(ServerDb.get(`Servers.${message.guild.id}.Roles.Muted`)),
            logchannel = message.guild.channels.cache.get(ServerDb.get(`Servers.${message.guild.id}.LogChannel`))

        if (!role)
            return message.reply(`${e.Info} | O sistema de mute está desativado neste servidor. Use o comando \`${prefix}mute config new\` e ative-o.`)

        if (!args[0])
            return message.reply(`${e.Info} | Para desmutar alguém, você pode usar esse comando assim: \`${prefix}unmute @user/Id\``)

        if (user.roles.cache.has(role.id)) {
            user.roles.remove(role, `${message.author.tag} ordenou o desmute.`).catch(err => {
                return message.channel.send(`${e.Warn} | Houve um erro ao desmutar este usuário.\n\`${err}\``)
            })

            logchannel?.send(`${e.Check} | O usuário ${user} foi desmutado*(a)* por ${message.author}`)

            sdb.delete(`Client.MuteSystem.${message.guild.id}.${user.id}`)
            return message.channel.send(`${e.Check} | Usuário desmutado com sucesso!`)
        }

        return message.reply(`${e.Deny} | Este usuário não está mutado*(a)*.`)

    }
}