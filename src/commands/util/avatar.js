const { e } = require('../../../database/emojis.json')
const { f } = require('../../../database/frases.json')
const ms = require('parse-ms')

module.exports = {
    name: 'avatar',
    aliases: ['foto', 'pfp', 'pic', 'icon', 'icone'],
    category: 'util',
    ClientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
    emoji: '📷',
    description: "Veja a foto de perfil, sua ou a de alguém",
    usage: '<avatar> <user>',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${sdb.get(`Request.${message.author.id}`)}`)

        let linkavatar, avatar, user

        user = message.mentions.users.first() || await client.users.cache.get(args[0]) || message.author || message.mentions.repliedUser
        linkavatar = user.avatarURL({ dynamic: true, format: "png", size: 1024 })
        await message.guild.members.cache.get(user.id) ? avatar = await message.guild.members.cache.get(user.id).displayAvatarURL({ dynamic: true, format: "png", size: 1024 }) : avatar = client.users.cache.get(user.id).displayAvatarURL({ dynamic: true, format: "png", size: 1024 })

        const embed = new MessageEmbed()
            .setColor('#246FE0')
            .setDescription(`[Clique aqui](${linkavatar}) para baixar o avatar de ${user.tag}`)
            .setImage(avatar)

        const EmbedPV = new MessageEmbed()
            .setColor('#246FE0')
            .setDescription(`[Clique aqui](${linkavatar}) para baixar o avatar de ${user.tag}`)
            .setImage(avatar)
            .setFooter(`Foto enviada de: ${message.guild.name}`)

        return message.reply({ embeds: [embed] }).then(msg => {
            sdb.set(`Request.${message.author.id}`, `${msg.url}`)
            msg.react('❌').catch(() => { }) // X
            msg.react('📨').catch(() => { }) // Carta
            msg.react('💙').catch(() => { }) // Like

            let FilterX = (reaction, user) => { return reaction.emoji.name === '❌' && user.id === message.author.id };
            let Delete = msg.createReactionCollector({ filter: FilterX, max: 1, time: 30000, errors: 'max' })

            let FilterSend = (reaction, user) => { return reaction.emoji.name === '📨' && user.id === user.id };
            let PraDm = msg.createReactionCollector({ filter: FilterSend, time: 30000, errors: 'time' })

            let FilterLikes = (reaction, user) => { return reaction.emoji.name === '💙' && user.id === user.id };
            let LikeCollector = msg.createReactionCollector({ filter: FilterLikes, time: 30000, errors: 'time' })

            Delete.on('collect', () => {
                sdb.delete(`Request.${message.author.id}`)
                sdb.delete(`Users.${message.author.id}.AvatarSended`)
                msg.delete().catch(err => { return message.channel.send(`${e.Warn} | Ocorreu um erro ao excluir a mensagem.\n\`${err}\``) })
                message.delete().catch(err => { return message.channel.send(`${e.Warn} | Ocorreu um erro ao excluir a mensagem de origem.\n\`${err}\``) })
            })

            LikeCollector.on('collect', (reaction, User) => { NewLike(User) })

            PraDm.on('collect', (reaction, User) => {
                if (User.id === client.user.id) return
                if (sdb.get(`Users.${message.author.id}.AvatarSended.${User.id}`)) return
                return User.send({ embeds: [EmbedPV] }).then(() => {
                    sdb.set(`Users.${message.author.id}.AvatarSended.${User.id}`, true)
                    return message.channel.send(`${e.Check} | ${User} solicitou a foto de ${user.username} para sua DM.`)
                }).catch(err => {
                    return message.channel.send(`${e.Deny} | ${User}, sua DM está fechada. Verifique suas configurações e tente novamente.`)
                })
            })

            PraDm.on('end', () => {
                sdb.delete(`Users.${message.author.id}.AvatarSended`)
                sdb.delete(`Request.${message.author.id}`)
                embed.setColor('RED').setFooter('Tempo expirado.')
                msg.edit({ embeds: [embed] }).catch(() => { })
            })
        })

        function NewLike(User) {
            if (User.id === client.user.id) return
            if (User.id === user.id) return
            if (user.id === client.user.id) return message.channel.send(`${User}, olha... Eu agradeço... Mas você já viu meu \`${prefix}perfil @Saphire\`?`)

            let time = ms(1800000 - (Date.now() - sdb.get(`Users.${User.id}.Timeouts.Rep`)))
            if (sdb.get(`Users.${User.id}.Timeouts.Rep`) !== null && 1800000 - (Date.now() - sdb.get(`Users.${User.id}.Timeouts.Rep`)) > 0)
                return message.channel.send(`${e.Nagatoro} | ${User}, calminha aí Princesa! \`${time.minutes}m, e ${time.seconds}s\``)

            db.add(`Likes_${user.id}`, 1)
            sdb.set(`Users.${User.id}.Timeouts.Rep`, Date.now())

            message.channel.send(`${e.Check} | ${User} deu um like para ${user.tag}.\nAgora, ${user.tag} possui um total de ${e.Like} ${db.get(`Likes_${user.id}`)} likes.`)
        }

    }
}