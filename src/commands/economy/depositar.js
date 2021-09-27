const { e } = require('../../../Routes/emojis.json')
const Moeda = require('../../../Routes/functions/moeda')

module.exports = {
    name: 'depositar',
    aliases: ['dep', 'with', 'withdraw'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.Coin}`,
    usage: '<dep> [quantia] | <dep> [all]',
    description: 'Deposite dinheiro no banco',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

            let money = db.get(`Balance_${message.author.id}`) || 0

            if (!args[0]) { return message.reply(`${e.Deny} | Tenta assim...\n\`${prefix}dep [quantia]/[all]\``) }
            if (args[1]) { return message.reply(`${e.Deny} | Apenas a quantia que você deseja depositar, tudo bem?`)}
            if ([',', '.', '-'].includes(args[0])) { return message.reply(`${e.Deny} | Nada de tentar quebrar o sistema com pontos e virgulas, tudo bem?`) }

            if (['all', 'tudo'].includes(args[0])) {

                if (money === 0) { return message.reply(`${e.Deny} | Você não tem nada para depositar.`) }
                if (money < 0) { return message.reply(`${e.Deny} | Você está negativado.`) }

                if (money > 0) {
                    db.add(`Bank_${message.author.id}`, money)
                    db.subtract(`Balance_${message.author.id}`, money)
                    return message.reply(`${e.Check} | ${message.author} depositou ${money} ${Moeda(message)}`)
                }
            }

            let Amount = parseInt(args[0])
            if (isNaN(Amount)) { return message.reply(`${e.Deny} | O valor que você digitou não é um número.`) }
            if (money < 0) { return message.reply(`${e.Deny} | Você está negativado.`) }
            if (money < Amount) { return message.reply(`${e.Deny} | Você não possui todo esse dinheiro para depositar.`) }
            if (Amount < 0) { return message.reply(`${e.Deny} | Quer depositar um valor negativo é?`) }

            db.add(`Bank_${message.author.id}`, Amount)
            db.subtract(`Balance_${message.author.id}`, Amount)
            return message.reply(`${e.Check} | ${message.author} depositou ${Amount} ${Moeda(message)}`)
        }
}