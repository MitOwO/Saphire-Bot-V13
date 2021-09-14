const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'error',
    aliases: ['er', 'erro'],
    category: 'owner',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.OwnerCrow}`,
    usage: '<error>',
    description: 'Causa um erro para testar o sistema de segurança',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let b = 'a'
        return message.reply(a)
    }
}