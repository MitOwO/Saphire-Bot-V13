
const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'gay',
    aliases: ['gai', 'guey', 'guei'],
    category: 'random',
    emoji: '🏳️‍🌈',
    usage: '<gay> [@user]',
    description: 'Quando gay @user é?',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let gif = 'https://imgur.com/8SbJOzL.gif'
        let num = Math.floor(Math.random() * 100) + 1

        let user = message.mentions.members.first() || message.member
        if (user.id === client.user.id) return message.reply('Eu não tenho gênero, eu acho.')

        let rand = ['YELLOW', 'RED', 'GREEN', 'PURPLE']
        let calors = rand[Math.floor(Math.random() * rand.length)]

        const gay = new MessageEmbed()
            .setColor(calors)
            .setTitle(`🏳️‍🌈 ${client.user.username} Gaymometro`)
            .setDescription(`Pela minha análise, ${user} é ${num}% gay.`)

        if (num > 80) { gay.setImage(gif) }
        return message.reply({
            embeds: [gay]
        })
    }
}