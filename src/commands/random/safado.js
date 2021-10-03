const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'safado',
    aliases: ['safada'],
    category: 'random',
    emoji: '😏',
    usage: '<safado(a)> [@user]',
    description: 'Quando gado(a) @user é?',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let num = Math.floor(Math.random() * 100) + 1
        let user = message.mentions.members.first() || message.mentions.repliedUser || message.member

        if (user.id === client.user.id) { return message.reply(`${e.SaphireTimida} | Eu não sou gada, sai pra lá.`) }

        return message.reply({
            embeds: [new MessageEmbed()
                .setColor('PURPLE')
                .setTitle(`😏 ${client.user.username} Safadometro`)
                .setDescription(`Passo falar com certeza, que ${user} é ${num}% safado*(a)*.`)]
        })
    }
}