const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'biscoitodasorte',
    aliases: ['biscoito'],
    category: 'random',
    emoji: '🥠',
    usage: '<biscoitodasorte>',
    description: 'Quer tentar a sorte hoje?',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let BiscMessage = f.BiscoitoDaSorte[Math.floor(Math.random() * f.BiscoitoDaSorte.length)]
        message.channel.send(`🥠 | ${BiscMessage}`)
    }
}