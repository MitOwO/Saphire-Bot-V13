const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'stonks',
    aliases: ['stonksup'],
    category: 'random',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.Stonks}`,
    usage: '<stonks>',
    description: 'Stonks',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {
        let list = ['https://imgur.com/jVL0mbR.gif', 'https://imgur.com/TRHBCon.gif']
        let rand = list[Math.floor(Math.random() * list.length)]
        const embed = new MessageEmbed().setColor('BLUE').setImage(rand)
        return message.reply({ embeds: [embed] })
    }
}