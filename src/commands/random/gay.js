
const { e } = require('../../../database/emojis.json')

module.exports = {
    name: 'gay',
    aliases: ['gai', 'guey', 'guei', 'yag'],
    category: 'random',
    emoji: '🏳️‍🌈',
    usage: '<gay> [@user]',
    description: 'Quanto % @user é gay?',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let num = Math.floor(Math.random() * 100) + 1

        let user = message.mentions.members.first() || message.member
        if (user.id === client.user.id) return message.reply('Eu não tenho gênero, eu acho.')

        return message.reply(`🏳️‍🌈 | Pela minha análise, ${user} é ${num}% gay.`)
    }
}