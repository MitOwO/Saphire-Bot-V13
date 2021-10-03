const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'pin',
    aliases: ['fixa', 'fixar'],
    category: 'moderation',
    UserPermissions: 'MANAGE_MESSAGES',
    ClientPermissions: 'MANAGE_MESSAGES',
    emoji: '📌',
    usage: '<pin> (Mencione a mensagem em forma de resposta)',
    description: 'Fixa a mensagem mencionada',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        message.fetchReference(true).then(msg => {
            if (msg.pinned) return message.reply(`📌 | Este mensagem já está fixada.`)
            message.channel.messages.pin(message.reference.messageId).then(() => {
                return
            }).catch(err => { return message.reply(`${e.Warn} | Ocorreu um erro durante o processo.\n\`${err}\``) })
        }).catch(() => {
            return message.reply(`${e.Deny} | Mencione uma mensagem em forma de resposta`)
        })
    }
}