
const { e } = require('../../../Routes/emojis.json')
const ms = require("parse-ms")

module.exports = {
    name: 'daily',
    aliases: ['d'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.Coin}`,
    usage: '<daily>',
    description: 'Pegue uma recompensa diária',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {
        let timeout = 86400000 // 24hrs

        let timeout1 = 9140000
        let author1 = await db.get(`User.${message.author.id}.Timeouts.PresoMax`)

        if (author1 !== null && timeout1 - (Date.now() - author1) > 0) {
            let time = ms(timeout1 - (Date.now() - author1))

            return message.reply(`${e.Sirene} Você está sob detenção máxima por mais \`${time.hours}h ${time.minutes}m e ${time.seconds}s\` `)
        } else {

            let daily = await db.get(`User.${message.author.id}.Timeouts.Daily`)
            if (daily !== null && timeout - (Date.now() - daily) > 0) {
                let time = ms(timeout - (Date.now() - daily))
                return message.reply(`${e.Deny} | Espere calmamente jovem ser. \`${time.hours}h, ${time.minutes}m, e ${time.seconds}s\``)
            } else {

                const amountcoins = Math.floor(Math.random() * 500) + 1
                const amountxp = Math.floor(Math.random() * 500) + 1

                db.add(`Bank_${message.author.id}`, amountcoins)
                db.add(`Xp_${message.author.id}`, amountxp)
                db.set(`User.${message.author.id}.Timeouts.Daily`, Date.now())

                message.reply(`${e.Check} | Você adquiriu +${amountcoins} ${e.Coin} Moedas e +${amountxp} ${e.RedStar} XP`)
            }
        }
    }
}