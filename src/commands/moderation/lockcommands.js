const { f } = require('../../../Routes/frases.json')
const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'lockcommands',
    aliases: ['nocommands', 'blockcommands'],
    category: 'moderation',
    UserPermissions: 'MANAGE_CHANNELS',
    ClientPermissions: 'MANAGE_MESSAGES',
    emoji: '🔒',
    usage: '<lockcommands> <channel>',
    description: 'Tranque meus comandos em canais específicos para que não seja usados. (ADM\'s são imunes)',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}`)
        let channel = message.mentions.channels.first() || message.channel

        if (db.get(`Servers.${message.guild.id}.Blockchannels.${channel.id}`)) { return message.reply(`${e.Check} | ${channel} já está bloqueado.`) }

        const confirm = new MessageEmbed()
            .setColor('BLUE')
            .setDescription(`${e.QuestionMark} | Você deseja bloquear todos os meus comandos no canal ${channel}?`)

        return message.reply({ embeds: [confirm] }).then(msg => {
            db.set(`User.Request.${message.author.id}`, 'ON')
            msg.react('✅').catch(err => { }) // e.Check
            msg.react('❌').catch(err => { }) // X

            const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

            msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                const reaction = collected.first()

                if (reaction.emoji.name === '✅') {
                    confirm.setDescription(`${e.Loading} | Autenticando...`)
                    msg.edit({ embeds: [confirm] })
                    message.channel.sendTyping()
                    setTimeout(() => {
                        db.delete(`User.Request.${message.author.id}`)
                        db.set(`Servers.${message.guild.id}.Blockchannels.${message.channel.id}`, 'BLOCK')
                        confirm.setColor('GREEN').setDescription(`${e.Check} | Request autenticada`).setFooter(`Channel ID: ${channel.id}`)
                        msg.edit({ embeds: [confirm] })
                        return message.reply(`✅ | ${message.author} bloqueou todos os meus comandos no canal ${channel}.`)
                    }, 2000)

                } else {
                    db.delete(`User.Request.${message.author.id}`)
                    confirm.setColor('RED').setDescription(`${e.Deny} | Request cancelada por: ${message.author}`)
                    msg.edit({ embeds: [confirm] })
                }
            }).catch(err => {
                db.delete(`User.Request.${message.author.id}`)
                confirm.setColor('RED').setDescription(`${e.Deny} | Request cancelada por: Tempo expirado.`)
                msg.edit({ embeds: [confirm] })
            })
        })
    }
}