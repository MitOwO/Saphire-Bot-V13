const { e } = require('../../../database/emojis.json')
const ms = require("parse-ms")
const { f } = require('../../../database/frases.json')
const Moeda = require('../../../Routes/functions/moeda')

module.exports = {
    name: 'pig',
    aliases: ['porco'],
    category: 'economy',

    ClientPermissions: 'ADD_REACTIONS',
    emoji: `${e.Pig}`,
    usage: '<pig> [coins/status]',
    description: 'Tente obter toda a grana do porquinho',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let PorquinhoMoney = sdb.get('Porquinho.Money') || 0
        let LastWinner = sdb.get('Porquinho.LastWinner') || 'Ninguém por enquanto'
        let LastPrize = sdb.get('Porquinho.LastPrize') || 0

        if (['coins', 'moedas', 'moeda', 'status'].includes(args[0]?.toLowerCase())) {
            const StatusPigEmbed = new MessageEmbed().setColor('#BA49DA').setTitle(`${e.Pig} Status`).setDescription(`Tente quebrar o Pig e ganhe todo o dinheiro dele`).addField('Último ganhador', `${LastWinner}\n${LastPrize}${Moeda(message)}`, true).addField('Montante', `${PorquinhoMoney}${Moeda(message)}`, true)
            return message.reply({ embeds: [StatusPigEmbed] })
        }

        if (args[1]) { return message.reply(`${e.Deny} | Por favor, digite apenas \`${prefix}pig\` ou \`${prefix}pig status\``) }

        let time = ms(30000 - (Date.now() - sdb.get(`Users.${message.author.id}.Timeouts.Porquinho`)))
        if (sdb.get(`Users.${message.author.id}.Timeouts.Porquinho`) !== null && 30000 - (Date.now() - sdb.get(`Users.${message.author.id}.Timeouts.Porquinho`)) > 0) {
            return message.reply(`${e.Deny} | Tente quebrar o ${e.Pig} novamente em: \`${time.seconds}s\``)
        } else {

            if (request) return message.reply(`${e.Deny} | ${f.Request}${sdb.get(`Request.${message.author.id}`)}`)

            let money = db.get(`Balance_${message.author.id}`) || 0
            let bank = db.get(`Bank_${message.author.id}`) || 0

            if (money < 10000 && bank < 10000) return message.reply(`${e.Deny} | Você não possui dinheiro.`)
            if (money >= 10000) return Pig()
            if (bank >= 10000) return Question()

            function Pig() {
                sdb.set(`Users.${message.author.id}.Timeouts.Porquinho`, Date.now()); sdb.add('Porquinho.Money', 10000); db.subtract(`Balance_${message.author.id}`, 10000)

                let luck = ['win', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose'] // 1% de chance de vitória
                let result = luck[Math.floor(Math.random() * luck.length)]
                result === "win" ? PigBroken() : message.reply(`${e.Deny} | Não foi dessa vez! Veja o status: \`${prefix}pig coins\`\n-10000 ${Moeda(message)}!`)
            }

            function PigBroken() {
                db.add(`Balance_${message.author.id}`, sdb.get('Porquinho.Money'))
                sdb.set('Porquinho', {
                    Lastprize: sdb.get('Porquinho.Money'),
                    LastWinner: `${message.author.tag}\n*(${message.author.id})*`,
                    Money: 0
                })

                return message.reply(`${e.Check} | ${message.author} quebrou o porquinho e conseguiu +${sdb.get('Porquinho.Money')} ${Moeda(message)}!`)
            }

            function Question() {
                message.reply(`${e.QuestionMark} | Você não tem dinheiro na carteira, deseja retirar -10000 ${Moeda(message)} do banco? `).then(msg => {
                    sdb.set(`Request.${message.author.id}`, `${msg.url}`)
                    msg.react('✅').catch(() => { }) // Check
                    msg.react('❌').catch(() => { }) // X

                    const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                    msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                        const reaction = collected.first()

                        if (reaction.emoji.name === '✅') {
                            sdb.delete(`Request.${message.author.id}`)
                            db.add(`Balance_${message.author.id}`, 10000)
                            db.subtract(`Bank_${message.author.id}`, 10000)
                            Pig()
                            msg.delete().catch(() => { })
                        } else {
                            sdb.delete(`Request.${message.author.id}`)
                            return msg.edit(`${e.Deny} | Comando cancelado | ${message.author.id}`)
                        }
                    }).catch(() => {
                        sdb.delete(`Request.${message.author.id}`)
                        return msg.edit(`${e.Deny} | Comando cancelado: Tempo expirado | ${message.author.id}`)
                    })
                })
            }
        }
    }
}