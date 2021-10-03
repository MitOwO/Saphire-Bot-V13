const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const ms = require("parse-ms")
const Moeda = require('../../../Routes/functions/moeda')

module.exports = {
    name: 'cu',
    aliases: ['anus', 'bunda', 'traseiro', 'popo'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: 'ADD_REACTIONS',
    emoji: `${e.Warn}`,
    usage: '<cu>',
    description: 'Você daria seu traseiro por dinheiro?',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let time = ms(600000 - (Date.now() - db.get(`${message.author.id}.Timeouts.Cu`)))
        if (db.get(`${message.author.id}.Timeouts.Cu`) !== null && 600000 - (Date.now() - db.get(`${message.author.id}.Timeouts.Cu`)) > 0) {
            return message.reply(`${e.Deny} | Pelo bem do seu querido anûs, espere mais \`${time.minutes}m e ${time.seconds}s\``)
        } else {

            if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])

            let msg = `${e.Warn} | O anús é algo valioso, você realmente deseja entrega-lo por dinheiro?`
            if (user) msg = `${e.Warn} | Você realmente deseja sacrificar o anûs de ${user.user.username} por dinheiro?`
            if (user?.id === client.user.id) return message.reply('Saiiii, fumo pólvora?')

            return message.reply(`${msg}`).then(msg => {
                db.set(`Request.${message.author.id}`, `${msg.url}`)
                msg.react('✅').catch(err => { }) // e.Check
                msg.react('❌').catch(err => { }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {

                        let winlose = ['win', 'lose']
                        let result = winlose[Math.floor(Math.random() * winlose.length)]
                        let din = Math.floor(Math.random() * 100) + 1

                        if (result === "win") {
                            db.delete(`Request.${message.author.id}`)
                            db.add(`Balance_${message.author.id}`, din)
                            db.set(`${message.author.id}.Timeouts.Cu`, Date.now())
                            return msg.edit(`${e.Check} | ${message.author}, o cliente anônimo gostou dos serviços e te pagou +${din}${Moeda(message)}`).catch(err => { })
                        } else {
                            db.delete(`Request.${message.author.id}`)
                            db.subtract(`Balance_${message.author.id}`, din)
                            db.set(`${message.author.id}.Timeouts.Cu`, Date.now())
                            return msg.edit(`${e.Deny} | ${message.author}, o cliente anônimo não gostou dos serviços e seu prejuízo foi de -${din}${Moeda(message)}`).catch(err => { })
                        }
                    } else {
                        db.delete(`Request.${message.author.id}`)
                        msg.edit(`${e.Deny} | Comando cancelado`).catch(err => { })
                    }
                }).catch(() => {
                    db.delete(`Request.${message.author.id}`)
                    msg.edit(`${e.Deny} | Comando cancelado | Tempo expirado`).catch(err => { })
                })

            })
        }
    }
}
