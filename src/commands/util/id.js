const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'id',
    aliases: [],
    category: 'util',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.Info}`,
    usage: '<id> <@user>',
    description: 'Confira o ID de qualquer um',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let user = message.mentions.members.first() || message.member || message.mentions.repliedUser
        let avatar = user.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 })

        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(`${user.user.username}`, avatar)
            .setDescription(`🆔 \`${user.id}\``)

        return message.reply({ embeds: [embed] })
    }
}