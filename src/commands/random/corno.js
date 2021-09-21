module.exports = {
    name: 'corno',
    category: 'random',
    emoji: '🦌',
    usage: '<corno> [@user]',
    description: 'Quando corno(a) @user é?',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let num = Math.floor(Math.random() * 100) + 1
        let user = message.mentions.members.first() || message.member

        if (user.id === client.user.id) return message.reply('Eu nunca namorei, então não tem como eu ser corna.')

        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('PURPLE')
                    .setTitle(`🦌 ${client.user.username} Cornometro`)
                    .setDescription(`Pelo jeito de ${user}, posso dizer que é ${num}% corno.`)
            ]
        })
    }
}