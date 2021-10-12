const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'safari',
    aliases: ['zoo'],
    category: 'perfil',
    ClientPermissions: 'MANAGE_CHANNELS',
    emoji: '🦁',
    usage: 'zoo',
    description: 'Caçe e adote bichinhos',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        return message.reply(`${e.Loading} | Código em construção.`)

    }
}
