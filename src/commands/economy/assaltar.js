const { e } = require('../../../database/emojis.json')
const ms = require('parse-ms')
const Error = require('../../../Routes/functions/errors')
const Moeda = require('../../../Routes/functions/moeda')

module.exports = {
    name: 'assaltar',
    aliases: ['assalto'],
    category: 'economy',
    emoji: '🔫',
    usage: '<assaltar> <@user> | <assaltar info>',
    description: 'Assalte todo o dinheiro da carteira de alguém',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        let TargetMoney = db.get(`Balance_${target.id}`) || 0
        let Amount = Math.floor(Math.random() * TargetMoney) + 1

        const AssaltoEmbed = new MessageEmbed().setColor('#246FE0').setTitle(`${e.PandaBag} Comando Assalto`).setDescription('Função: Assaltar **100%** do dinheiro presente na carteira do alvo definido.')
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
                    value: `Assaltar alguém que tenha uma arma é um pouco mais complicado. Chances:\n**25% de sucesso\n25% de ser assaltado de volta** e o alvo receber um valor aleatório do próprio dinheiro\n**25% de ser preso\n25% de receber um tiro** e pagar o tratamento de **1~5000 ${Moeda(message)}**`
                },
                {
                    name: `${e.Info} Preso`,
                    value: 'Ser preso te bloqueia do sistema de economia por **20 minutos**'
                }
            )

        if (['info', 'informação', 'help', 'ajuda'].includes(args[0]?.toLowerCase())) return message.reply({ embeds: [AssaltoEmbed] })

        let time = ms(1200000 - (Date.now() - sdb.get(`Users.${message.author.id}.Timeouts.Assalto`)))
        if (sdb.get(`Users.${message.author.id}.Timeouts.Assalto`) !== null && 1200000 - (Date.now() - sdb.get(`Users.${message.author.id}.Timeouts.Assalto`)) > 0)
            return message.reply(`Calminha! Cooldown Assalto: \`${time.minutes}m e ${time.seconds}s\``)


        let arma = sdb.get(`Users.${message.author.id}.Slot.Arma`)
        if (!arma) return message.reply(`${e.Deny} | É necessário que você tenha uma **🔫 Arma** para utilizar este comando.`)
        if (target.id === message.author.id) return message.reply(`${e.Deny} | @Marque alguém ou responda a mensagem da pessoa. Você também pode usar \`${prefix}assalto info\``)

        let TargetGun = sdb.get(`Users.${target.id}.Slot.Arma`)
        if (target.id === client.user.id) return AssaltClient()
        if (TargetMoney <= 0) return message.reply(`${e.PandaProfit} | ${target.user.username} não possui dinheiro na carteira.`)

        TargetGun ? TargetHasAGun() : TargetDontHaveAGun()
        sdb.set(`Users.${message.author.id}.Timeouts.Assalto`, Date.now())

        function TargetHasAGun() {

            let luck = ['win', 'lose', 'preso', 'ferido']
            let result = luck[Math.floor(Math.random() * luck.length)]
            let tratamento = Math.floor(Math.random() * 5000) + 1

            sdb.add(`Users.${message.author.id}.Cache.Assalto`, TargetMoney)
            db.subtract(`Balance_${target.id}`, TargetMoney)

            let cache = sdb.get(`Users.${message.author.id}.Cache.Assalto`)

            if (result === 'win') {
                message.reply(`${e.Loading} | ${message.author} está assaltando ${target}`).then(msg => {
                    setTimeout(() => {
                        AuthorAdd(cache); Timeout()
                        msg.edit(`${e.PandaBag} | ${message.author} assaltou todo o dinheiro de ${target}.\n${e.PandaProfit} Panda Profit Stats\n${message.author.tag} +${cache} ${Moeda(message)}\n${target.user.tag} -${cache} ${Moeda(message)}`).catch(() => { })
                        sdb.set(`Users.${message.author.id}.Cache.Assalto`, 0)
                    }, 4500)
                }).catch(err => {
                    Error(message, err)
                    return message.channel.send(`${e.Deny} | Ocorreu um erro na execução do assalto.\n\`${err}\``)

                })
            }

            if (result === 'lose') {
                message.reply(`${e.Loading} | ${message.author} está assaltando ${target}`).then(msg => {
                    setTimeout(() => {
                        db.add(`Balance_${target.id}`, (cache + Amount))
                        db.subtract(`Balance_${message.author.id}`, Amount)
                        Timeout()
                        msg.edit(`${e.Deny} | ${target} estava armado e assaltou ${message.author} devolta.\n${e.PandaProfit} Panda Profit Stats\n${message.author.tag} -${Amount} ${Moeda(message)}\n${target.user.tag} +${Amount} ${Moeda(message)}`).catch(() => { })
                        sdb.set(`Users.${message.author.id}.Cache.Assalto`, 0)
                    }, 4500)
                }).catch(err => {
                    Error(message, err)
                    return message.channel.send(`${e.Deny} | Ocorreu um erro na execução do assalto.\n\`${err}\``)
                })
            }

            if (result == 'preso') {
                message.reply(`${e.Loading} | ${message.author} está assaltando ${target}`).then(msg => {
                    setTimeout(() => {
                        Timeout()
                        TargetAdd(cache)
                        sdb.set(`Users.${message.author.id}.Timeouts.Preso`, Date.now())
                        msg.edit(`${e.Deny} | ${target} te rendeu e você foi preso sem direito a fiança!`).catch(() => { })
                        sdb.set(`Users.${message.author.id}.Cache.Assalto`, 0)
                    }, 4500)
                }).catch(err => {
                    Error(message, err)
                    return message.channel.send(`${e.Deny} | Ocorreu um erro na execução do assalto.\n\`${err}\``)
                })
            }

            if (result == 'ferido') {
                message.reply(`${e.Loading} | ${message.author} está assaltando ${target}`).then(msg => {
                    setTimeout(() => {
                        AuthorSubtract(tratamento)
                        Timeout()
                        TargetAdd(cache)
                        msg.edit(`🏥 | ${message.author}, você levou um tiro e correu perigo de vida. Debitamos do seu banco os gastos necessário.\n${e.PandaProfit} -${tratamento} ${Moeda(message)}`).catch(() => { })
                        sdb.set(`Users.${message.author.id}.Cache.Assalto`, 0)
                    }, 4500)
                }).catch(err => {
                    Error(message, err)
                    return message.channel.send(`${e.Deny} | Ocorreu um erro na execução do assalto.\n\`${err}\``)
                })

            }
        }

        function TargetDontHaveAGun() {

            let result = Math.floor(Math.random() * 100)

            if (result <= 70) {
                AuthorAdd(TargetMoney); TargetSubtract(TargetMoney)
                return message.reply(`${e.PandaBag} | ${message.author} assaltou todo o dinheiro de ${target}.\n${e.PandaProfit} +${TargetMoney} ${Moeda(message)}`)
            } else {
                Timeout()
                sdb.set(`Users.${message.author.id}.Timeouts.Preso`, Date.now())
                return message.reply(`${e.Sirene} | Havia policías por perto e você foi preso!`)
            }
        }

        function AssaltClient() {
            let multa = Math.floor(Math.random() * 3000)
            AuthorSubtract(multa)
            Loteria(multa / 2)
            sdb.set(`Users.${message.author.id}.Timeouts.Preso`, Date.now())
            return message.channel.send(`👩‍⚖️ | Eu decreto a prisão de ${message.author} *\`${message.author.tag} | ${message.author.id}\`* por tentar me assaltar mais multa.\n${e.PandaProfit} -${multa} ${Moeda(message)}`)
        }

        function AuthorAdd(x) { db.add(`Balance_${message.author.id}`, x) }
        function AuthorSubtract(x) { db.subtract(`Balance_${message.author.id}`, x) }
        function TargetAdd(x) { db.add(`Balance_${target.id}`, x) }
        function TargetSubtract(x) { db.subtract(`Balance_${target.id}`, x) }
        function Loteria(x) { sdb.add(`Loteria.Prize`, x) }
        function Timeout() { sdb.set(`Users.${message.author.id}.Timeouts.Assalto`, Date.now()) }

    }
}