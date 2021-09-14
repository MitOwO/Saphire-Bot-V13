const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'patnezuko',
    aliases: ['nezukopat'],
    category: 'random',
    UserPermissions: '',
    ClientPermissions: 'USE_EXTERNAL_EMOJIS',
    emoji: `${e.PatNezuko}`,
    usage: '<patnezuko>',
    description: 'Carinho na Nezuko-chan',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {
        return message.reply(e.PatNezuko)
    }
}