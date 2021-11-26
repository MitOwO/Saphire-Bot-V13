const PassCode = require('../../../Routes/functions/PassCode')
const { e } = require('../../../database/emojis.json')
const Super = require('../../../Routes/classes/SupremacyClass')
const { ServerDb } = require('../../../Routes/functions/database')

module.exports = {
    name: 'giveaway',
    aliases: ['sorteio', 'sortear'],
    category: 'moderation',
    UserPermissions: ['ADMINISTRATOR'],
    ClientPermissions: ['ADD_REACTIONS'],
    emoji: '🎉',
    usage: '<gw> [info]',
    description: 'Fazer sorteio nunca foi tão legal',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        return message.reply(`${e.Loading} | Em construção`)

    }
}