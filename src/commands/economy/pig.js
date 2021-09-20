const { e } = require('../../../Routes/emojis.json')
const ms = require("parse-ms")
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'pig',
    aliases: ['porco'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: 'ADD_REACTIONS',
    emoji: `${e.Pig}`,
    usage: '<pig> [coins/status]',
    description: 'Tente obter toda a grana do porquinho',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let PorquinhoMoney = db.get('Porquinho.Money') || '0'
        let LastWinner = db.get('Porquinho.LastWinner') || 'Ninguém por enquanto'
        let LastPrize = db.get('Porquinho.LastPrize') || '0'

        if (['coins', 'moedas', 'moeda', 'status', 'moedas'].includes(args[0])) {
            const StatusPigEmbed = new MessageEmbed().setColor('#BA49DA').setTitle(`${e.Pig} Status`).setDescription(`Tente quebrar o Pig e ganhe todo o dinheiro dele`).addField('Último ganhador', `${LastWinner}\n${LastPrize}${e.Coin}`, true).addField('Montante', `${PorquinhoMoney}${e.Coin}`, true)
            return message.reply({ embeds: [StatusPigEmbed] })
        }

        let timeout2 = 7200000
        let author2 = db.get(`User.${message.author.id}.Timeouts.Preso`)
        if (author2 !== null && timeout2 - (Date.now() - author2) > 0) {
            let time = ms(timeout2 - (Date.now() - author2))
            return message.reply(`Você está preso! Liberdade em: \`${time.minutes}m e ${time.seconds}s\``)
        } else {

            if (args[1]) { return message.reply(`${e.Deny} | Por favor, digite apenas \`${prefix}pig\` ou \`${prefix}pig status\``) }

            let timeout1 = 30000 // 30 Segundos
            let author1 = db.get(`User.${message.author.id}.Timeouts.Porquinho`)

            if (author1 !== null && timeout1 - (Date.now() - author1) > 0) {
                let time = ms(timeout1 - (Date.now() - author1))
                return message.reply(`${e.Deny} | Tente quebrar o ${e.Pig} novamente em: \`${time.seconds}s\``)
            } else {

                if (request) return message.reply(`${e.Deny} | ${f.Request}`)

                let money = db.get(`Balance_${message.author.id}`) || 0
                let bank = db.get(`Bank_${message.author.id}`) || 0

                if (money < 10 && bank < 10) return message.reply(`${e.Deny} | Você não possui dinheiro.`)
                if (money >= 10) return Pig()
                if (bank >= 10) return Question()

                function Pig() {
                    db.set(`User.${message.author.id}.Timeouts.Porquinho`, Date.now()); db.add('Porquinho.Money', 10); db.subtract(`Balance_${message.author.id}`, 10)

                    let luck = ['win', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose'] // 1% de chance de vitória
                    let result = luck[Math.floor(Math.random() * luck.length)]
                    result === "win" ? PigBroken() : message.reply(`${e.Deny} | Não foi dessa vez! Veja o status: \`${prefix}pig coins\`\n-10 ${e.Coin}Moedas!`)
                }

                function PigBroken() {
                    db.set('Porquinho.LastPrize', PorquinhoMoney)
                    db.add(`Balance_${message.author.id}`, PorquinhoMoney)
                    db.delete('Porquinho.Money')
                    db.set(`Porquinho.LastWinner`, `${message.author.tag}\n*(${message.author.id})*`)
                    return message.reply(`${e.Check} | ${message.author} quebrou o porquinho e conseguiu +${PorquinhoMoney} ${e.Coin}Moedas!`)
                }

                function Question() {
                    message.reply(`${e.QuestionMark} | Você não tem dinheiro na carteira, deseja retirar -10 ${e.Coin}Moedas do banco? `).then(msg => {
                        db.set(`User.Request.${message.author.id}`, 'ON')
                        msg.react('✅').catch(err => { }) // Check
                        msg.react('❌').catch(err => { }) // X

                        const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                        msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                            const reaction = collected.first()

                            if (reaction.emoji.name === '✅') {
                                db.delete(`User.Request.${message.author.id}`)
                                db.add(`Balance_${message.author.id}`, 10)
                                db.subtract(`Bank_${message.author.id}`, 10)
                                Pig()
                                msg.delete().catch(() => { })
                            } else {
                                db.delete(`User.Request.${message.author.id}`)
                                return msg.edit(`${e.Deny} | Comando cancelado | ${message.author.id}`)
                            }
                        }).catch(() => {
                            db.delete(`User.Request.${message.author.id}`)
                            return msg.edit(`${e.Deny} | Comando cancelado: Tempo expirado | ${message.author.id}`)
                        })
                    })
                }
            }
        }
    }
}