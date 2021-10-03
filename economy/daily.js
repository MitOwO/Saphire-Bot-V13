
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

        let vip = db.get(`Vip_${message.author.id}`) || false
        message.guild.id === config.guildId ? InsideGuild() : OutsideGuild()

        function InsideGuild() {
            let amountcoins = parseInt(Math.floor(Math.random() * 500) + 1)
            let amountxp = parseInt(Math.floor(Math.random() * 500) + 1)
            let Bonus1 = parseInt(Math.floor(Math.random() * 2000) + 1)
            let Bonus2 = parseInt(Math.floor(Math.random() * 2000) + 1)

            if (vip) {
                let MoneyVipBonus = parseInt(Math.floor(Math.random() * amountcoins))
                let XpVipBonus = parseInt(amountxp + Math.floor(Math.random() * 100))
                amountcoins = (amountcoins + MoneyVipBonus)
                amountxp = (amountxp + XpVipBonus)
            }

            db.add(`Bank_${message.author.id}`, amountcoins)
            db.add(`Xp_${message.author.id}`, amountxp)
            db.add(`Balance_${message.author.id}`, Bonus1)
            db.add(`Xp_${message.author.id}`, Bonus2)
            db.set(`${message.author.id}.Timeouts.Daily`, Date.now())

            let ComVip = `Bônus ${e.VipStar} | Você adquiriu +${amountcoins} ${Moeda(message)} e +${amountxp} ${e.RedStar} XP\n${e.SaphireHi} | Bônus: +${Bonus1} ${Moeda(message)} e +${Bonus2} ${e.RedStar} XP`
            let NoVip = `${e.Check} | Você adquiriu +${amountcoins} ${Moeda(message)} e +${amountxp} ${e.RedStar} XP\n${e.SaphireHi} | Bônus: +${Bonus1} ${Moeda(message)} e +${Bonus2} ${e.RedStar} XP`

            vip ? message.reply(ComVip) : message.reply(NoVip)
        }

        function OutsideGuild() {
            let amountcoins = parseInt(Math.floor(Math.random() * 500) + 1)
            let amountxp = parseInt(Math.floor(Math.random() * 500) + 1)

            if (vip) {
                let BonusVipMoney = Math.floor(Math.random() * amountcoins)
                let BonusVipXp = Math.floor(Math.random() * amountxp)

                prizemoney = amountcoins + BonusVipMoney
                prizexp = amountxp + BonusVipXp
            }

            db.add(`Bank_${message.author.id}`, amountcoins)
            db.add(`Xp_${message.author.id}`, amountxp)
            db.set(`${message.author.id}.Timeouts.Daily`, Date.now())

            let NoVip = `${e.Check} | Você adquiriu +${amountcoins} ${Moeda(message)} e +${amountxp} ${e.RedStar} XP\n${e.SaphireObs} | Sabia que se você der \`${prefix}daily\` dentro do meu servidor você pode ganhar até 4x a mais?`
            let WithVip = `Bônus ${e.VipStar} | Você adquiriu +${amountcoins} ${Moeda(message)} e +${amountxp} ${e.RedStar} XP\n${e.SaphireObs} | Sabia que se você der \`${prefix}daily\` dentro do meu servidor você pode ganhar até 4x a mais?`

            vip ? message.reply(WithVip) : message.reply(NoVip)

        }
    }
}
