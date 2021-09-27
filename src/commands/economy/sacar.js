const { e } = require('../../../Routes/emojis.json')
const Moeda = require('../../../Routes/functions/moeda')

module.exports = {
    name: 'sacar',
    aliases: ['sc', 'saque', 'saq', 'sac'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.Coin}`,
    usage: '<saq> [quantia] | <sac> [all]',
    description: 'Saque dinheiro no banco',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {


        let money = db.get(`Bank_${message.author.id}`) || 0

        if (!args[0]) { return message.reply(`${e.Deny} | Tenta assim...\n\`${prefix}sacar [quantia]/[all]\``) }
        if (args[1]) { return message.reply(`${e.Deny} | Apenas a quantidade que você deseja sacar.`) }

        if (['all', 'tudo'].includes(args[0])) {

            if (money <= 0) { return message.reply(`${e.Deny} | Você não tem nada para sacar.`) }

            if (money > 0) {
                db.add(`Balance_${message.author.id}`, money)
                db.subtract(`Bank_${message.author.id}`, money)
                return message.reply(`${e.Check} | ${message.author} sacou ${money} ${Moeda(message)}`)
            }
        }

        let quantia = parseInt(args[0])
        if (isNaN(quantia)) { return message.reply(`${e.Deny} | O valor que você digitou não é um número.`) }
        if (money < 0) { return message.reply(`${e.Deny} | Você está negativado.`) }
        if (money < quantia) { return message.reply(`${e.Deny} | Você não possui todo esse dinheiro para sacar.`) }
        if (quantia < 0) { return message.reply(`${e.Deny} | Quer sacar um valor negativo é?`) }

        db.add(`Balance_${message.author.id}`, quantia)
        db.subtract(`Bank_${message.author.id}`, quantia)
        return message.reply(`${e.Check} | ${message.author} sacou ${quantia} ${Moeda(message)}`)
    }
}