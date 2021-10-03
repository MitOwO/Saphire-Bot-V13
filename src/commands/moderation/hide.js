const { Permissions } = require('discord.js')
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'hide',
    aliases: ['esconder'],
    category: 'moderation',
    UserPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
    ClientPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
    emoji: '🔒',
    usage: 'hide <#channel>/<user>',
    description: 'Esconda o canal de todos (Exceto de quem tem permissão)',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)
        let channel = message.mentions.channels.first() || message.channel
        let user = message.mentions.members.first() || message.mentions.repliedUser || message.guild.members.cache.get(args[0])

        if (args[1]) { return message.reply(`${e.Deny} | Por favor, mencione apenas o canal/user que deseja esconder.`) }

        if (channel && !user) {
            channel.permissionOverwrites.create(channel.guild.roles.everyone, { VIEW_CHANNEL: false })
            return message.channel.send(`🔒 | ${message.author} escondeu o canal ${channel}! -> \`${prefix}unhide\``)
        }

        if (user) {
            if (user.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply(`${e.SaphireQ} | Por qual motivo você esconderia esse canal de um Administrador?`)
            message.channel.send(`${e.QuestionMark} | ${message.author}, ao esconder o canal de ${user}, você precisará entrar nas configurações do canal para reverter o ato ou responder qualquer mensagem do usuário e digitar o comando \`${prefix}unhide\``).then(msg => {
                db.set(`Request.${message.author.id}`, `${msg.url}`)
                msg.react('✅').catch(err => { }) // Check
                msg.react('❌').catch(err => { }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first()

                        if (reaction.emoji.name === '✅') {
                            msg.edit(`${e.Loading} | Retirando ${user} do chat...`).catch(err => { })
                                setTimeout(function () {
                                    db.delete(`Request.${message.author.id}`)
                                    message.channel.permissionOverwrites.create(user, { VIEW_CHANNEL: false })
                                    msg.edit(`🔒 | ${message.author} escondeu o canal de ${user}`)
                                }, 1700)
                        } else {
                            db.delete(`Request.${message.author.id}`)
                            msg.edit(`${e.NezukoDance} | Comando cancelado.`)
                            msg.reactions.removeAll().catch(err => { })
                        }
                    }).catch(() => {
                        db.delete(`Request.${message.author.id}`)
                        msg.edit(`${e.Deny} | Comando cancelado por: Tempo Expirado.`)
                    })
            })
        } else {
            return message.reply(`${Info} | Copia e cola, assim é mais rápido -> \`${prefix}hide\``)
        }
    }
}