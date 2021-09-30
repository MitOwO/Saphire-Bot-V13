const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'banner',
    aliases: ['serverbanner'],
    category: 'servidor',
    emoji: '🌌',
    usage: '<banner>',
    description: 'Veja o banner do servidor (se tiver)',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let banner = message.guild.bannerURL({ format: 'jpeg', size: 1024 })
        banner ? message.channel.send(banner) : message.reply(`${e.Deny} | Este servidor não possui um banner.`)

    }
}