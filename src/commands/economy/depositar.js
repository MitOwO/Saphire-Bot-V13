const { e } = require('../../../Routes/emojis.json')
const ms = require("parse-ms")

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

        let timeout1 = 9140000
        let author1 = await db.get(`User.${message.author.id}.Timeouts.PresoMax`)

        if (author1 !== null && timeout1 - (Date.now() - author1) > 0) {
            let time = ms(timeout1 - (Date.now() - author1))

            return message.reply(`${e.Sirene} Você está sob detenção máxima por mais \`${time.hours}h ${time.minutes}m e ${time.seconds}s\` `)
        } else {

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
                    return message.reply(`${e.Check} | ${message.author} depositou ${money} ${e.Coin} Moedas`)
                }
            }

            if (isNaN(args[0])) { return message.reply(`${e.Deny} | O valor que você digitou não é um número.`) }
            if (money < 0) { return message.reply(`${e.Deny} | Você está negativado.`) }
            if (money < args[0]) { return message.reply(`${e.Deny} | Você não possui todo esse dinheiro para depositar.`) }
            if (args[0] < 0) { return message.reply(`${e.Deny} | Quer depositar um valor negativo é?`) }

            db.add(`Bank_${message.author.id}`, args[0])
            db.subtract(`Balance_${message.author.id}`, args[0])
            return message.reply(`${e.Check} | ${message.author} depositou ${args[0]} ${e.Coin} Moedas`)
        }
    }
}