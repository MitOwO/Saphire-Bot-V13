
const { e } = require('../../../Routes/emojis.json')
const ms = require("parse-ms")
const Moeda = require('../../../Routes/functions/moeda')

module.exports = {
    name: 'daily',
    aliases: ['d', 'diário'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.Coin}`,
    usage: '<daily>',
    description: 'Pegue uma recompensa diária',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let timeout = 86400000 // 24hrs
        let daily = db.get(`${message.author.id}.Timeouts.Daily`)
        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = ms(timeout - (Date.now() - daily))
            return message.reply(`${e.Deny} | Espere calmamente jovem ser. \`${time.hours}h, ${time.minutes}m, e ${time.seconds}s\``)
        } else {

            const amountcoins = Math.floor(Math.random() * 500) + 1
            const amountxp = Math.floor(Math.random() * 500) + 1

            db.add(`Bank_${message.author.id}`, amountcoins)
            db.add(`Xp_${message.author.id}`, amountxp)
            db.set(`${message.author.id}.Timeouts.Daily`, Date.now())

            message.reply(`${e.Check} | Você adquiriu +${amountcoins} ${Moeda(message)} e +${amountxp} ${e.RedStar} XP`)
        }
    }
}