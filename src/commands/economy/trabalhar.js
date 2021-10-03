const { e } = require('../../../Routes/emojis.json')
const ms = require("parse-ms")
const Moeda = require('../../../Routes/functions/moeda')

module.exports = {
    name: 'trabalhar',
    aliases: ['work'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.Coin}`,
    usage: '<trabalhar>',
    description: 'Trabalhe e ganhe uma quantia em dinheiro',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let vip = db.get(`Vip_${message.author.id}`) || false

        let time = ms(66400000 - (Date.now() - db.get(`${message.author.id}.Timeouts.Work`)))
        if (db.get(`${message.author.id}.Timeouts.Work`) !== null && 66400000 - (Date.now() - db.get(`${message.author.id}.Timeouts.Work`)) > 0)
            return message.reply(`${e.Deny} | Você já trabalhou hoje, descance um pouco! Volte em \`${time.hours}h, ${time.minutes}m, e ${time.seconds}s\``)

        let luck = ['win', 'lose', 'lose', 'lose', 'lose']
        let result = luck[Math.floor(Math.random() * luck.length)]
        let gorjeta = parseInt([Math.floor(Math.random() * 1000) + 1])
        let work = parseInt([Math.floor(Math.random() * 500) + 1])
        let xp = parseInt([Math.floor(Math.random() * 200) + 1])
        db.set(`${message.author.id}.Timeouts.Work`, Date.now())

        if (vip) {
            gorjeta = parseInt(gorjeta) + parseInt([Math.floor(Math.random() * gorjeta)])
            work = parseInt(work) + parseInt([Math.floor(Math.random() * work)])
            xp = parseInt(xp) + parseInt([Math.floor(Math.random() * xp)])
        }

        result === "win" ? NewGorjeta() : Commum()

        function Commum() {
            db.add(`Balance_${message.author.id}`, work)
            db.add(`Xp_${message.author.id}`, xp)

            let comvip = `Bônus ${e.VipStar} | Você trabalhou e ganhou ${work} ${Moeda(message)} e ${xp} ${e.RedStar}XP`
            let semvip = `${e.Check} | Você trabalhou e ganhou ${work} ${Moeda(message)} e ${xp} ${e.RedStar}XP\n${e.SaphireObs} | Sabia que Vips ganham bônus? \`${prefix}vip\``

            vip ? message.reply(comvip) : message.reply(semvip)
        }

        function NewGorjeta() {
            db.add(`Balance_${message.author.id}`, gorjeta)
            db.add(`Balance_${message.author.id}`, work)
            db.add(`Xp_${message.author.id}`, xp)

            let comvip = `Bônus ${e.VipStar} | Você trabalhou e ganhou ${work} ${Moeda(message)}, ${xp} ${e.RedStar}XP e uma gorjeta de ${gorjeta} ${Moeda(message)}`
            let semvip = `${e.Check} | Você trabalhou e ganhou ${work} ${Moeda(message)}, ${xp} ${e.RedStar}XP e uma gorjeta de ${gorjeta} ${Moeda(message)}\n${e.SaphireObs} | Sabia que Vips ganham bônus? \`${prefix}vip\``

            vip ? message.reply(comvip) : message.reply(semvip)
        }
    }
}