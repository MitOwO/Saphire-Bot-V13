const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'servericon',
    aliases: ['fotoserver'],
    category: 'servidor',
    emoji: '🌌',
    usage: '<servericon>',
    description: 'Veja o icone do servidor',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let url = message.guild.iconURL({ dynamic: true })
        url ? message.channel.send(url) : message.reply(`${e.Deny} | Este servidor não possui um icone.`)

    }
}