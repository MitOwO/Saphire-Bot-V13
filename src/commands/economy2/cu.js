const { e } = require('../../../database/emojis.json')
const { f } = require('../../../database/frases.json')
const ms = require("parse-ms")
const Moeda = require('../../../Routes/functions/moeda')
const { PushTrasaction } = require('../../../Routes/functions/transctionspush')

module.exports = {
    name: 'cu',
    aliases: ['anus', 'bunda', 'traseiro', 'popo'],
    category: 'economy2',
    
    ClientPermissions: 'ADD_REACTIONS',
    emoji: `${e.Warn}`,
    usage: '<cu>',
    description: 'Você daria seu traseiro por dinheiro?',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let time = ms(600000 - (Date.now() - sdb.get(`Users.${message.author.id}.Timeouts.Cu`)))
        if (sdb.get(`Users.${message.author.id}.Timeouts.Cu`) !== null && 600000 - (Date.now() - sdb.get(`Users.${message.author.id}.Timeouts.Cu`)) > 0) {
            return message.reply(`${e.Deny} | Pelo bem do seu querido anûs, espere mais \`${time.minutes}m e ${time.seconds}s\``)
        } else {

            if (request) return message.reply(`${e.Deny} | ${f.Request}${sdb.get(`Request.${message.author.id}`)}`)

            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])

            let msg = `${e.Warn} | O anús é algo valioso, você realmente deseja entrega-lo por dinheiro?`
            if (user) msg = `${e.Warn} | Você realmente deseja sacrificar o anûs de ${user.user.username} por dinheiro?`
            if (user?.id === client.user.id) return message.reply('Saiiii, fumo pólvora?')

            if (sdb.get(`Users.${user?.id}.NoReact`))
                return message.reply(`${e.Deny} | Este usuário está com o \`${prefix}noreact\` ativado.`)

            return message.reply(`${msg}`).then(msg => {
                sdb.set(`Request.${message.author.id}`, `${msg.url}`)
                msg.react('✅').catch(() => { }) // e.Check
                msg.react('❌').catch(() => { }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {

                        let winlose = ['win', 'lose']
                        let result = winlose[Math.floor(Math.random() * winlose.length)]
                        let din = Math.floor(Math.random() * 100) + 1

                        if (result === "win") {
                            sdb.delete(`Request.${message.author.id}`)
                            db.add(`Balance_${message.author.id}`, din)
                            sdb.set(`Users.${message.author.id}.Timeouts.Cu`, Date.now())
                            PushTrasaction(
                                message.author.id,
                                `${e.BagMoney} Ganhou ${din} Moedas dando o cú`
                            )
                            return msg.edit(`${e.Check} | ${message.author}, o cliente anônimo gostou dos serviços e te pagou +${din}${Moeda(message)}`).catch(() => { })
                        } else {
                            sdb.delete(`Request.${message.author.id}`)
                            db.subtract(`Balance_${message.author.id}`, din)
                            sdb.set(`Users.${message.author.id}.Timeouts.Cu`, Date.now())
                            PushTrasaction(
                                message.author.id,
                                `${e.MoneyWithWings} Perdeu ${din} Moedas dando o cú`
                            )
                            return msg.edit(`${e.Deny} | ${message.author}, o cliente anônimo não gostou dos serviços e seu prejuízo foi de -${din}${Moeda(message)}`).catch(() => { })
                        }
                    } else {
                        sdb.delete(`Request.${message.author.id}`)
                        msg.edit(`${e.Deny} | Comando cancelado`).catch(() => { })
                    }
                }).catch(() => {
                    sdb.delete(`Request.${message.author.id}`)
                    msg.edit(`${e.Deny} | Comando cancelado | Tempo expirado`).catch(() => { })
                })

            })
        }
    }
}
