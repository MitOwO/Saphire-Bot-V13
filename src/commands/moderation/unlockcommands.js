const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'unlockcommands',
    aliases: ['unblockcommands'],
    category: 'moderation',
    UserPermissions: 'MANAGE_CHANNELS',
    ClientPermissions: ['MANAGE_MESSAGES', 'ADD_REACTIONS'],
    emoji: '🔓',
    usage: '<unlockcommands> <channel>',
    description: 'Destranque meus comandos em canais que foram bloqueados.',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)
        let channel = message.mentions.channels.first() || message.channel

        if (!db.get(`Servers.${message.guild.id}.Blockchannels.${channel.id}`) && !db.get(`Servers.${message.guild.id}.Blockchannels.Bots.${message.channel.id}`)) return message.reply(`${e.Check} | ${channel} já está desbloqueado.`)

        return message.reply(`${e.QuestionMark} | Você deseja desbloquear todos os comandos no canal ${channel}?`).then(msg => {
            db.set(`Request.${message.author.id}`, `${msg.url}`)
            msg.react('✅').catch(() => { }) // e.Check
            msg.react('❌').catch(() => { }) // X

            const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

            msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                const reaction = collected.first()

                if (reaction.emoji.name === '✅') {
                    msg.edit(`${e.Loading} | Autenticando...`)
                    setTimeout(() => {
                        db.delete(`Request.${message.author.id}`)
                        db.delete(`Servers.${message.guild.id}.Blockchannels.${message.channel.id}`)
                        db.delete(`Servers.${message.guild.id}.Blockchannels.Bots.${message.channel.id}`)
                        msg.edit(`${e.Check} | Request autenticada.`)
                        return message.reply(`🔓 | ${message.author} desbloqueou todos os comandos (meu e de outros bots) no canal ${channel}.`)
                    }, 2000)

                } else {
                    db.delete(`Request.${message.author.id}`)
                    msg.edit(`${e.Deny} | Request cancelada por: ${message.author}`)
                }
            }).catch(err => {
                db.delete(`Request.${message.author.id}`)
                msg.edit(`${e.Deny} | Request cancelada por: Tempo expirado.`)
            })
        })
    }
}