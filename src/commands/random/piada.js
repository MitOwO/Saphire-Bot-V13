const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'piada',
    aliases: ['piadas'],
    category: 'random',
    emoji: '📨',
    usage: '<piada>',
    description: 'Vai uma piadinha aí?',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let rand = f.Piadas[Math.floor(Math.random() * f.Piadas.length)]
        return message.reply(rand)
    }
}