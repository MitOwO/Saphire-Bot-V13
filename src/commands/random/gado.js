const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'gado',
    aliases: ['boi'],
    category: 'random',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: '🐂',
    usage: '<gado> [@user]',
    description: 'Quando gado(a) @user é?',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let num = Math.floor(Math.random() * 100) + 1
        let user = message.mentions.members.first() || message.member

        if (user.id === client.user.id) { return message.reply(`${e.SaphireTimida} | Eu não sou gada, sai pra lá.`) }

        return message.reply({
            embeds: [new MessageEmbed()
                .setColor('PURPLE')
                .setTitle(`🐂 ${client.user.username} Gadometro`)
                .setDescription(`Pelo histórico de ${user}, posso afirmar que é ${num}% gado.`)]
        })
    }
}