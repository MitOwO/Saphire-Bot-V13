const { e } = require('../../../Routes/emojis.json')
const ms = require("parse-ms")

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

        let timeout1 = 9140000
        let author1 = await db.get(`User.${message.author.id}.Timeouts.PresoMax`)

        if (author1 !== null && timeout1 - (Date.now() - author1) > 0) {
            let time = ms(timeout1 - (Date.now() - author1))

            return message.reply(`${e.Sirene} Você está sob detenção máxima por mais \`${time.hours}h ${time.minutes}m e ${time.seconds}s\` `)
        } else {

            let money = db.get(`Bank_${message.author.id}`) || 0

            if (!args[0]) { return message.reply(`${e.Deny} | Tenta assim...\n\`${prefix}sacar [quantia]/[all]\``) }
            if (args[1]) { return message.reply(`${e.Deny} | Apenas a quantidade que você deseja sacar.`) }
            if ([',', '.', '-'].includes(args[0])) { return message.reply(`${e.Deny} | Nada de tentar quebrar o sistema com pontos e virgulas, tudo bem?`) }

            if (['all', 'tudo'].includes(args[0])) {

                if (money <= 0) { return message.reply(`${e.Deny} | Você não tem nada para sacar.`) }

                if (money > 0) {
                    db.add(`Balance_${message.author.id}`, money)
                    db.subtract(`Bank_${message.author.id}`, money)
                    return message.reply(`${e.Check} | ${message.author} sacou ${money} ${e.Coin} Moedas`)
                }
            }

            if (isNaN(args[0])) { return message.reply(`${e.Deny} | O valor que você digitou não é um número.`) }
            if (money < 0) { return message.reply(`${e.Deny} | Você está negativado.`) }
            if (money < args[0]) { return message.reply(`${e.Deny} | Você não possui todo esse dinheiro para sacar.`) }
            if (args[0] < 0) { return message.reply(`${e.Deny} | Quer sacar um valor negativo é?`) }

            db.add(`Balance_${message.author.id}`, args[0])
            db.subtract(`Bank_${message.author.id}`, args[0])
            return message.reply(`${e.Check} | ${message.author} sacou ${args[0]} ${e.Coin} Moedas`)
        }
    }
}