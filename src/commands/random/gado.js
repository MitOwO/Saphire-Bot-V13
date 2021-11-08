const { e } = require('../../../database/emojis.json')

module.exports = {
    name: 'gado',
    aliases: ['boi'],
    category: 'random',
    
    
    emoji: '🐂',
    usage: '<gado> [@user]',
    description: 'Quanto % @user é gado(a)?',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let num = Math.floor(Math.random() * 100) + 1
        let user = message.mentions.members.first() || message.member

        if (user.id === client.user.id) { return message.reply(`${e.SaphireTimida} | Eu não sou gada, sai pra lá.`) }

        return message.reply(`🐂 | Pelo histórico de ${user}, posso afirmar que é ${num}% gado.`)
    }
}