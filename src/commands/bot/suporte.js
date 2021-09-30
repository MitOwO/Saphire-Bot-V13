const { e } = require('../../../Routes/emojis.json')
const { config } = require('../../../Routes/config.json')

module.exports = {
    name: 'suporte',
    aliases: ['support'],
    category: 'bot',
    ClientPermissions: 'EMBED_LINKS',
    emoji: `${e.SaphireHi}`,
    usage: '<suporte>',
    description: 'Obtenha ajuda com a Saphire',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {
        message.channel.send(`${config.SuportServerLink}`)
    }
}