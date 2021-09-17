const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'notstonks',
    aliases: ['nostonks', 'stonksdown'],
    category: 'random',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.NotStonks}`,
    usage: '<notstonks>',
    description: 'No Stonks...',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {
        let list = ['https://imgur.com/qPzrtI3.gif', 'https://imgur.com/DA1TD46.gif']
        let rand = list[Math.floor(Math.random() * list.length)]
        const embed = new MessageEmbed().setColor('BLUE').setImage(rand)
        return message.reply({ embeds: [embed] })
    }
}