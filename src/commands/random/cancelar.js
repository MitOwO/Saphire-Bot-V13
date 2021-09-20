const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'cancelar',
    aliases: ['cancel'],
    category: 'random',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.Deny}`,
    usage: '<cancel> <@user>',
    description: 'Cancele os outros',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let cancel = f.Cancelamentos[Math.floor(Math.random() * f.Cancelamentos.length)]
        let user = message.mentions.members.first() || message.member

        args[0] ? CancelWithArgs() : CancelWithoutArgs()

        function CancelWithoutArgs() {
            if (user.id === message.author.id) return message.reply(`${e.Deny} | Marque alguém para ser cancelado`)
            if (user.id === client.user.id) { return message.channel.send(`🔇 | ${message.author} foi cancelado por tentar me cancelar.`) }
            return message.channel.send(`🔇 | ${user.user.username} ${cancel}`)
        }

        function CancelWithArgs() {
            let Mensagem = args.join(' ')
            if (Mensagem.length > 250) return message.reply(`${e.Deny} | Seu motivo de cancelamento não pode ultrapassar **250 caracteres**`)
            if (user.id === message.author.id) return message.reply(`${e.Deny} | Marque alguém para ser cancelado`)
            if (user.id === client.user.id) { return message.channel.send(`🔇 | ${message.author} foi cancelado por tentar me cancelar.`) }
            return message.channel.send(`🔇 | ${message.author.username} cancelou ${user.user.username}.\n${args.slice(1).join(' ')}`)
        }
    }
}