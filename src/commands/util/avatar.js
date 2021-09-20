const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'avatar',
    aliases: ['foto', 'pfp', 'pic'],
    category: 'util',
    UserPermissions: '',
    ClientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],
    emoji: '📷',
    description: "Veja a foto de perfil, sua ou de alguém",
    usage: '<user>',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}`)
        let user = message.mentions.users.first() || message.author || message.repliedUser || message.member
        let avatar = user.avatarURL({ dynamic: true, format: "png", size: 1024 })
        let linkavatar = user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 })

        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setDescription(`[Clique aqui](${linkavatar}) para baixar o avatar de ${user}`)
            .setImage(avatar)

        const EmbedPV = new MessageEmbed()
            .setColor('BLUE')
            .setDescription(`[Clique aqui](${linkavatar}) para baixar o avatar de ${user.tag}`)
            .setImage(avatar)
            .setFooter(`Foto enviada de: ${message.guild.name}`)

        return message.reply({ embeds: [embed] }).then(msg => {
            db.set(`User.Request.${message.author.id}`, 'ON')
            msg.react('❌').catch(err => { }) // X
            msg.react('📨').catch(err => { }) // Carta

            let FilterX = (reaction, user) => { return reaction.emoji.name === '❌' && user.id === message.author.id };
            let Delete = msg.createReactionCollector({ filter: FilterX, max: 1, time: 30000, errors: 'max' })

            let FilterSend = (reaction, user) => { return reaction.emoji.name === '📨' && user.id === user.id };
            let PraDm = msg.createReactionCollector({ filter: FilterSend, time: 30000, errors: 'time' })

            Delete.on('collect', (reaction, user) => {
                db.delete(`User.Request.${message.author.id}`)
                msg.delete().catch(err => { return message.channel.send(`${e.Warn} | Ocorreu um erro ao excluir a mensagem.\n\`${err}\``) })
                message.delete().catch(err => { return message.channel.send(`${e.Warn} | Ocorreu um erro ao excluir a mensagem dde origem.\n\`${err}\``) })
            })

            PraDm.on('collect', (reaction, User) => {
                if (User.id === client.user.id) return
                message.channel.sendTyping()

                setTimeout(() => {
                    return User.send({ embeds: [EmbedPV] }).then(() => {
                        return message.channel.send(`${e.Check} | ${User} solicitou a foto de ${user} para sua DM.`)
                    }).catch(err => {
                        return message.channel.send(`${e.Deny} | ${User}, sua DM está fechada. Verifique suas configurações.`)
                    })
                }, 1000)
            })

            PraDm.on('end', () => {
                db.delete(`User.Request.${message.author.id}`)
                embed.setColor('RED').setFooter('Tempo expirado.')
                msg.edit({ embeds: [embed] }).catch(err => { })
            })
        })
    }
}