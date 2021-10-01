
const { e } = require('../../../Routes/emojis.json')
const { config } = require('../../../Routes/config.json')
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

        // 86400000 ---> 24hrs
        let time = ms(86400000 - (Date.now() - db.get(`${message.author.id}.Timeouts.Daily`)))
        if (db.get(`${message.author.id}.Timeouts.Daily`) !== null && 86400000 - (Date.now() - db.get(`${message.author.id}.Timeouts.Daily`)) > 0)
            return message.reply(`${e.Deny} | Espere calmamente jovem ser. \`${time.hours}h, ${time.minutes}m, e ${time.seconds}s\``)

        message.guild.id === config.guildId ? InsideGuild() : OutsideGuild()

        function InsideGuild() {
            const amountcoins = Math.floor(Math.random() * 500) + 1
            const amountxp = Math.floor(Math.random() * 500) + 1
            const Bonus1 = Math.floor(Math.random() * 2000) + 1
            const Bonus2 = Math.floor(Math.random() * 2000) + 1

            db.add(`Bank_${message.author.id}`, amountcoins)
            db.add(`Xp_${message.author.id}`, amountxp)
            db.add(`Balance_${message.author.id}`, Bonus1)
            db.add(`Xp_${message.author.id}`, Bonus2)
            db.set(`${message.author.id}.Timeouts.Daily`, Date.now())

            message.reply(`${e.Check} | Você adquiriu +${amountcoins} ${Moeda(message)} e +${amountxp} ${e.RedStar} XP\n${e.SaphireHi} | Bônus: +${Bonus1} ${Moeda(message)} e +${Bonus2} ${e.RedStar} XP`)
        }

        function OutsideGuild() {
            const amountcoins = Math.floor(Math.random() * 500) + 1
            const amountxp = Math.floor(Math.random() * 500) + 1

            db.add(`Bank_${message.author.id}`, amountcoins)
            db.add(`Xp_${message.author.id}`, amountxp)
            db.set(`${message.author.id}.Timeouts.Daily`, Date.now())

            message.reply(`${e.Check} | Você adquiriu +${amountcoins} ${Moeda(message)} e +${amountxp} ${e.RedStar} XP\n${e.SaphireObs} | Sabia que se você der \`${prefix}daily\` dentro do meu servidor você pode ganhar até 4x a mais?`)
        }
    }
}
