const { e } = require('../../../Routes/emojis.json')
const ms = require('parse-ms')
const Error = require('../../../Routes/functions/errors')

module.exports = {
    name: 'assaltar',
    aliases: ['assalto'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: '🔫',
    usage: '<assaltar> <@user> | <assaltar info>',
    description: 'Assalte todo o dinheiro da carteira de alguém',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let target = message.mentions.members.first() || message.member

        const AssaltoEmbed = new MessageEmbed().setColor('BLUE').setTitle(`${e.PandaBag} Comando Assalto`).setDescription('Função: Assaltar **100%** do dinheiro presente na carteira do alvo definido.')
            .addFields(
                {
                    name: `${e.Info} Item necessário`,
                    value: '🔫 Arma'
                },
                {
                    name: `${e.Info} Alvo sem arma`,
                    value: 'Assaltar alguém que não tenha arma te garante **70% de chance de sucesso** e **30% de chance de ser preso**.'
                },
                {
                    name: `${e.Info} Alvo com arma`,
                    value: 'Assaltar alguém que tenha uma arma é um pouco mais complicado. Chances:\n**25% de sucesso\n25% de ser assaltado de volta** e alvo receber um valor aleatório do próprio dinheiro\n**25% de ser preso\n25% de receber um tiro** e pagar o tramatamento de **1~5000 moedas**'
                },
                {
                    name: `${e.Info} Preso`,
                    value: 'Ser preso te bloqueia do sistema de economia por **1 hora**'
                }
            )

        if (['info', 'informação', 'help', 'ajuda'].includes(args[0]?.toLowerCase())) return message.reply({ embeds: [AssaltoEmbed] })

        let timeout1 = 7200000
        let author1 = db.get(`User.${message.author.id}.Timeouts.Preso`)
        if (author1 !== null && timeout1 - (Date.now() - author1) > 0) {
            let time = ms(timeout1 - (Date.now() - author1))
            return message.reply(`Você está preso! Liberdade em: \`${time.minutes}m e ${time.seconds}s\``)
        } else {
            let timeout = db.get(`User.${message.author.id}.Timeouts.Assalto`)
            if (timeout !== null && 1200000 - (Date.now() - timeout) > 0) {
                let time = ms(1200000 - (Date.now() - timeout))
                return message.reply(`Calminha! Cooldown Assalto: \`${time.minutes}m e ${time.seconds}s\``)
            } else {

                let arma = db.get(`User.${message.author.id}.Slot.Arma`)
                if (!arma) return message.reply(`${e.Deny} | É necessário que você tenha uma **🔫 Arma** para utilizar este comando.`)
                if (target.id === message.author.id) return message.reply(`${e.Deny} | @Marque alguém ou responda a mensagem da pessoa. Você também pode usar \`${prefix}assalto info\``)

                let TargetGun = db.get(`User.${target.id}.Slot.Arma`)

                let TargetMoney = db.get(`Balance_${target.id}`) || 0
                let AuthorMoney = db.get(`Balance_${message.author.id}`) || 0
                let Amount = Math.floor(Math.random() * AuthorMoney) + 1

                if (target.id === client.user.id) return AssaltClient()
                if (TargetMoney <= 0) return message.reply(`${e.PandaProfit} | ${target.user.username} não possui dinheiro na carteira.`)

                TargetGun ? TargetHasAGun() : TargetDontHaveAGun()

                function TargetHasAGun() {

                    let luck = ['win', 'lose', 'preso', 'ferido']
                    let result = luck[Math.floor(Math.random() * luck.length)]
                    let tratamento = Math.floor(Math.random() * 5000) + 1

                    db.add(`User.${message.author.id}.Caches.Assalto`, TargetMoney)
                    db.subtract(`Balance_${target.id}`, TargetMoney)

                    let cache = db.get(`User.${message.author.id}.Caches.Assalto`)

                    if (result === 'win') {
                        message.reply(`${e.Loading} | ${message.author} está assaltando ${target}`).then(msg => {
                            setTimeout(function () {
                                AuthorAdd(cache); Timeout()
                                msg.edit(`${e.PandaBag} | ${message.author} assaltou todo o dinheiro de ${target}.\n${e.PandaProfit} Panda Profit Stats\n${message.author.tag} +${cache} ${e.Coin} Moedas\n${target.user.tag} -${cache} ${e.Coin} Moedas`)
                                db.delete(`User.${message.author.id}.Caches.Assalto`)
                            }, 4500)
                        }).catch(err => {
                            Error(message, err)
                            return message.channel.send(`${e.Deny} | Ocorreu um erro na execução do assalto.\n\`${err}\``)

                        })
                    }

                    if (result === 'lose') {
                        message.reply(`${e.Loading} | ${message.author} está assaltando ${target}`).then(msg => {
                            setTimeout(function () {
                                AuthorSubtract(Amount); TargetAdd(cache + Amount)
                                Timeout()
                                msg.edit(`${e.Deny} | ${target} estava armado e assaltou ${message.author} devolta.\n${e.PandaProfit} Panda Profit Stats\n${message.author.tag} -${Amount} ${e.Coin} Moedas\n${target.user.tag} +${Amount} ${e.Coin} Moedas`)
                                db.delete(`User.${message.author.id}.Caches.Assalto`)
                            }, 4500)
                        }).catch(err => {
                            Error(message, err)
                            return message.channel.send(`${e.Deny} | Ocorreu um erro na execução do assalto.\n\`${err}\``)
                        })
                    }

                    if (result == 'preso') {
                        message.reply(`${e.Loading} | ${message.author} está assaltando ${target}`).then(msg => {
                            setTimeout(function () {
                                Timeout()
                                TargetAdd(cache)
                                db.set(`User.${message.author.id}.Timeouts.Preso`, Date.now())
                                msg.edit(`${e.Deny} | ${target} te rendeu e você foi preso sem direito a fiança!`)
                                db.delete(`User.${message.author.id}.Caches.Assalto`)
                            }, 4500)
                        }).catch(err => {
                            Error(message, err)
                            return message.channel.send(`${e.Deny} | Ocorreu um erro na execução do assalto.\n\`${err}\``)
                        })
                    }

                    if (result == 'ferido') {
                        message.reply(`${e.Loading} | ${message.author} está assaltando ${target}`).then(msg => {
                            setTimeout(function () {
                                AuthorSubtract(tratamento)
                                Timeout()
                                TargetAdd(cache)
                                msg.edit(`🏥 | ${message.author}, você levou um tiro e correu perigo de vida. Debitamos do seu banco os gastos necessário.\n${e.PandaProfit} -${tratamento} ${e.Coin} Moedas`)
                                db.delete(`User.${message.author.id}.Caches.Assalto`)
                            }, 4500)
                        }).catch(err => {
                            Error(message, err)
                            return message.channel.send(`${e.Deny} | Ocorreu um erro na execução do assalto.\n\`${err}\``)
                        })

                    }
                }
            }

            function TargetDontHaveAGun() {

                let result = Math.floor(Math.random() * 100)

                if (result <= 70) {
                    AuthorAdd(TargetMoney); TargetSubtract(TargetMoney)
                    return message.reply(`${e.PandaBag} | ${message.author} assaltou todo o dinheiro de ${target}.\n${e.PandaProfit} +${TargetMoney} ${e.Coin} Moedas`)
                } else {
                    Timeout()
                    return message.reply(`${e.Sirene} | Havia policías por perto e você foi preso!`)
                }
            }

            function AssaltClient() {
                let multa = Math.floor(Math.random() * 3000)
                AuthorSubtract(multa)
                Loteria(multa / 2)
                db.set(`User.${message.author.id}.Timeouts.Preso`, Date.now())
                return message.channel.send(`👩‍⚖️ | Eu decreto a prisão de ${message.author} *\`${message.author.tag} | ${message.author.id}\`* por tentar me assaltar mais multa.\n${e.PandaProfit} -${multa} ${e.Coin} Moedas`)
            }

            function AuthorAdd(x) { db.add(`Balance_${message.author.id}`, x) }
            function AuthorSubtract(x) { db.subtract(`Balance_${message.author.id}`, x) }
            function TargetAdd(x) { db.add(`Balance_${target.id}`, x) }
            function TargetSubtract(x) { db.subtract(`Balance_${target.id}`, x) }
            function Loteria(x) { db.add(`Loteria.Prize`, x) }
            function Timeout() { db.set(`User.${message.author.id}.Timeouts.Assalto`, Date.now()) }

        }
    }
}