const { e } = require('../../../database/emojis.json')
const Moeda = require('../../../Routes/functions/moeda')

module.exports = {
    name: 'depositar',
    aliases: ['dep', 'with', 'withdraw'],
    category: 'economy',
    emoji: `${e.Coin}`,
    usage: '<dep> [quantia] | <dep> [all]',
    description: 'Deposite dinheiro no banco',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let money = db.get(`Balance_${message.author.id}`) || 0

        if (!args[0]) return message.reply(`${e.Deny} | Tenta assim...\n\`${prefix}dep [quantia]/[all]\``)
        if (args[1]) return message.reply(`${e.Deny} | Apenas a quantia que você deseja depositar, tudo bem?`)
        if ([',', '.', '-'].includes(args[0])) return message.reply(`${e.Deny} | Nada de tentar quebrar o sistema com pontos e virgulas, tudo bem?`)

        let Amount = parseInt(args[0].replace(/k/g, '000'))

        if (['all', 'tudo'].includes(args[0]?.toLowerCase()) || Amount >= money) Amount = money
        if (Amount <= 0 || isNaN(Amount)) return message.reply(`${e.Deny} | O valor que você digitou não é um número ou é menor que 1.`)
        if (money <= 0 || money < Amount) return message.reply(`${e.Deny} | Você não tem **${Amount} ${Moeda(message)}** para depositar.`)

        db.add(`Bank_${message.author.id}`, Amount)
        db.subtract(`Balance_${message.author.id}`, Amount)
        return message.reply(`${e.Check} | ${message.author} depositou ${Amount} ${Moeda(message)}`)
    }
}