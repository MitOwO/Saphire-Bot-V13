const { e } = require('../../../Routes/emojis.json')
const ms = require("parse-ms")
const Moeda = require('../../../Routes/functions/moeda')

module.exports = {
    name: 'trabalhar',
    aliases: ['work', 'trabalho'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.Coin}`,
    usage: '<trabalhar>',
    description: 'Trabalhe e ganhe uma quantia em dinheiro',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let timeout = 66400000
        let author = db.get(`${message.author.id}.Timeouts.Work`)

        if (author !== null && timeout - (Date.now() - author) > 0) {
            let time = ms(timeout - (Date.now() - author))

            return message.reply(`${e.Deny} | Você já trabalhou hoje, descance um pouco! Volte em \`${time.hours}h, ${time.minutes}m, e ${time.seconds}s\``)
        } else {

            let luck = ['win', 'lose', 'lose', 'lose', 'lose']
            let result = luck[Math.floor(Math.random() * luck.length)]
            let gorjeta = [Math.floor(Math.random() * 1000) + 1]
            let work = [Math.floor(Math.random() * 500) + 1]
            let xp = [Math.floor(Math.random() * 200) + 1]
            db.add(`Balance_${message.author.id}`, work)
            db.add(`Xp_${message.author.id}`, xp)
            db.set(`${message.author.id}.Timeouts.Work`, Date.now())

            if (result === "win") {
                db.add(`Balance_${message.author.id}`, gorjeta)
                db.add(`Balance_${message.author.id}`, work)
                db.add(`Xp_${message.author.id}`, xp)
                return message.reply(`${e.Check} | Você trabalhou e ganhou ${work} ${Moeda(message)}, ${xp} ${e.RedStar}XP e uma gorjeta de ${gorjeta} ${Moeda(message)}`)
            }

            if (result === 'lose') {
                db.add(`Balance_${message.author.id}`, work)
                db.add(`Xp_${message.author.id}`, xp)
                return message.reply(`${e.Check} | Você trabalhou e ganhou ${work} ${Moeda(message)} e ${xp} ${e.RedStar}XP`)
            }
        }
    }
}