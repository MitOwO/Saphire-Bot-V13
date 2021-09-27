const { e } = require('../../../Routes/emojis.json')
const Moeda = require('../../../Routes/functions/moeda')

module.exports = {
    name: 'resgatar',
    aliases: ['resgate'],
    category: 'economy',
    emoji: `${e.MoneyWings}`,
    usage: '<resgatar>',
    description: 'Resgate seu dinheiro em cache',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let cache = db.get(`${message.author.id}.Cache.Resgate`) || 0
        if (cache <= 0) return message.reply(`${e.PandaProfit} | Você não possui dinheiro no cache.`)

        db.add(`Balance_${message.author.id}`, cache)
        message.channel.send(`${e.PandaProfit} | ${message.author} resgatou ${cache} ${Moeda(message)}`)
        db.delete(`${message.author.id}.Cache.Resgate`)
    }
}