const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'user',
    aliases: ['tag'],
    category: 'util',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.Info}`,
    usage: '<user> <@user>',
    description: 'Veja o nome da conta de alguém',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let user = message.mentions.members.first() || message.member || message.repliedUser
        let avatar = user.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 })

        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(`${user.user.username}`, avatar)
            .setDescription(`📇 \`${user.user.tag}\``)

        return message.reply({ embeds: [embed] })
    }
}