
const { DatabaseObj } = require('../../../Routes/functions/database')
const { e } = DatabaseObj
const Moeda = require('../../../Routes/functions/moeda')
const Vip = require('../../../Routes/functions/vip')
const parsems = require('parse-ms')
const ms = require('ms')
const Error = require('../../../Routes/functions/errors')
const { PushTransaction } = require('../../../Routes/functions/transctionspush')

module.exports = {
    name: 'resgatar',
    aliases: ['resgate'],
    category: 'economy',
    emoji: `${e.MoneyWings}`,
    usage: '<resgatar>',
    description: 'Resgate seu dinheiro em cache',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        if (args[0]) return GiftCode()

        let cache = sdb.get(`Users.${message.author.id}.Cache.Resgate`) || 0
        if (cache <= 0) return message.reply(`${e.PandaProfit} | Você não possui dinheiro no cache.`)

        sdb.add(`Users.${message.author.id}.Balance`, cache)
        PushTransaction(
            message.author.id,
            `${e.BagMoney} Resgatou ${cache} Moedas`
        )
        sdb.delete(`Users.${message.author.id}.Cache.Resgate`)
        return message.channel.send(`${e.PandaProfit} | ${message.author} resgatou ${cache.toFixed(0)} ${Moeda(message)}`)

        function GiftCode() {

            if (Vip(message.author.id))
                return message.reply(`${e.Deny} | Vips não podem resgatar códigos de ativação Vip.`)

            let Code = args[0]

            if (!sdb.get(`Client.VipCodes.${Code}`))
                return message.reply(`${e.Deny} | Código inválido.`)

            let time = parsems(sdb.get(`Client.VipCodes.${Code}`))
            sdb.set(`Users.${message.author.id}.Timeouts.Vip`, { DateNow: Date.now(), TimeRemaing: sdb.get(`Client.VipCodes.${Code}`) })

            message.channel.send(`${e.Check} | ${message.author} ativou o vip por **${time.days} dias, ${time.hours} horas, ${time.minutes} minutos e ${time.seconds} segundos.**`)
            message.author.send(`${e.VipStar} | Você agora é **VIP** por **${time.days} dias, ${time.hours} horas, ${time.minutes} minutos e ${time.seconds} segundos**! Quer ver as vantagens dos membros vips? Use \`${prefix}vip vantagens\` e veja tudo o que você liberou!`).catch(err => {
                sdb.delete(`Client.VipCodes.${Code}`)
                if (err.code === 50007)
                    return

                Error(message, err)
            })
            return sdb.delete(`Client.VipCodes.${Code}`)
        }

    }
}