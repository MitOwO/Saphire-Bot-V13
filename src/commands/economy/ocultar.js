const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'ocultar',
    aliases: ['ocult'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: 'EMBED_LINKS',
    emoji: `${e.Coin}`,
    usage: '<ocultar> [off]',
    description: 'Oculte o dinheiro do seu banco para todos',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let oculto = db.get(`User.${message.author.id}.BankOcult`)
        if (args[1]) return message.reply(`${e.Deny} | Não diga nada além do comando em si.`)

        if (['off', 'desligar', 'no'].includes(args[0])) {
            if (!oculto) {
                return message.reply(`${e.Deny} | O seu banco não está ocultado.`)
            } else {
                db.delete(`User.${message.author.id}.BankOcult`)
                return message.reply(`${e.Check} | O seu banco não está mais ocultado.`)
            }
        }

        if (oculto) {
            return message.reply(`${e.Deny} | O seu banco já está ocultado.`)
        } else {
            db.set(`User.${message.author.id}.BankOcult`, 'OCULT')
            return message.reply(`${e.Check} | O seu banco está ocultado.`)
        }

    }
}
