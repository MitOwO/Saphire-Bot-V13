const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const ms = require('parse-ms')

module.exports = {
    name: 'avatar',
    aliases: ['foto', 'pfp', 'pic', 'icon', 'icone'],
    category: 'util',
    ClientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],
    emoji: '📷',
    description: "Veja a foto de perfil, sua ou de alguém",
    usage: '<user>',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

        let user = message.mentions.users.first() || message.author || message.mentions.repliedUser || message.member
        let avatar = user.avatarURL({ dynamic: true, format: "png", size: 1024 })
        let linkavatar = user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 })

        if (!isNaN(args[0])) {
            user = message.guild.members.cache.get(args[0])
            if (!user) return message.reply(`${e.Deny} | Não achei ninguém com esse ID no servidor`)
            avatar = user.user.avatarURL({ dynamic: true, format: "png", size: 1024 })
            linkavatar = user.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 })
        }

        const embed = new MessageEmbed()
            .setColor('#246FE0')
            .setDescription(`[Clique aqui](${linkavatar}) para baixar o avatar de ${user}`)
            .setImage(avatar)

        const EmbedPV = new MessageEmbed()
            .setColor('#246FE0')
            .setDescription(`[Clique aqui](${linkavatar}) para baixar o avatar de ${user.tag}`)
            .setImage(avatar)
            .setFooter(`Foto enviada de: ${message.guild.name}`)

        return message.reply({ embeds: [embed] }).then(msg => {
            db.set(`Request.${message.author.id}`, `${msg.url}`)
            msg.react('❌').catch(err => { }) // X
            msg.react('📨').catch(err => { }) // Carta
            msg.react('💙').catch(err => { }) // Like

            let FilterX = (reaction, user) => { return reaction.emoji.name === '❌' && user.id === message.author.id };
            let Delete = msg.createReactionCollector({ filter: FilterX, max: 1, time: 30000, errors: 'max' })

            let FilterSend = (reaction, user) => { return reaction.emoji.name === '📨' && user.id === user.id };
            let PraDm = msg.createReactionCollector({ filter: FilterSend, time: 30000, errors: 'time' })

            let FilterLikes = (reaction, user) => { return reaction.emoji.name === '💙' && user.id === user.id };
            let LikeCollector = msg.createReactionCollector({ filter: FilterLikes, time: 30000, errors: 'time' })

            Delete.on('collect', (reaction, user) => {
                db.delete(`Request.${message.author.id}`)
                msg.delete().catch(err => { return message.channel.send(`${e.Warn} | Ocorreu um erro ao excluir a mensagem.\n\`${err}\``) })
                message.delete().catch(err => { return message.channel.send(`${e.Warn} | Ocorreu um erro ao excluir a mensagem de origem.\n\`${err}\``) })
            })

            LikeCollector.on('collect', (reaction, User) => {
                NewLike(User)
            })

            PraDm.on('collect', (reaction, User) => {
                if (User.id === client.user.id) return
                setTimeout(() => {
                    return User.send({ embeds: [EmbedPV] }).then(() => {
                        return message.channel.send(`${e.Check} | ${User} solicitou a foto de ${user} para sua DM.`)
                    }).catch(err => {
                        return message.channel.send(`${e.Deny} | ${User}, sua DM está fechada. Verifique suas configurações.`)
                    })
                }, 1000)
            })

            PraDm.on('end', () => {
                db.delete(`Request.${message.author.id}`)
                embed.setColor('RED').setFooter('Tempo expirado.')
                msg.edit({ embeds: [embed] }).catch(err => { })
            })
        })

        function NewLike(User) {
            if (User.id === client.user.id) return
            if (User.id === user.id) return
            if (user.id === client.user.id) return message.channel.send(`${User}, olha... Eu agradeço... Mas você já viu meu \`${prefix}perfil @Saphire\`?`)
           
            let time = ms(1800000 - (Date.now() - db.get(`${User.id}.Timeouts.Rep`)))
            if (db.get(`${User.id}.Timeouts.Rep`) !== null && 1800000 - (Date.now() - db.get(`${User.id}.Timeouts.Rep`)) > 0)
                return message.channel.send(`${e.Nagatoro} | ${User}, calminha aí Princesa! \`${time.minutes}m, e ${time.seconds}s\``)

            db.add(`Likes_${user.id}`, 1)
            db.set(`${User.id}.Timeouts.Rep`, Date.now())

            message.channel.send(`${e.Check} | ${User} deu um like para ${user}.\nAgora, ${user} possui um total de ${e.Like} ${db.get(`Likes_${user.id}`)} likes.`)

        }

    }
}