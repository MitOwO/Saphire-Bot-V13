const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'celar',
    aliases: ['cancel', 'cancelar'],
    category: 'random',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.Deny}`,
    usage: '<cancel> <@user>',
    description: 'Cancele os outros',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let cancel = f.Cancelamentos[Math.floor(Math.random() * f.Cancelamentos.length)]
        if (args[1]) { return message.reply(`${e.Deny} | Nada além do @user!\nFaz assim: \`${prefix}cancelar @user\``) }

        let user = message.mentions.members.first() || message.member
        if (user.id === message.author.id) return message.reply(`${e.Deny} | Marque alguém para ser cancelado`)
        if (user.id === client.user.id) { return message.channel.send(`🔇 | ${message.author} foi cancelado  por tentar me cancelar.`) }
        return message.channel.send(`🔇 | ${user.user.username} ${cancel}`)
    }
}