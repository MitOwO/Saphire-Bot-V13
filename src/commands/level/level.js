const { e } = require('../../../Routes/emojis.json')
const { MessageAttachment } = require('discord.js')
const canvacord = require("canvacord")

module.exports = {
    name: 'level',
    aliases: ['xp', 'nivel', 'lvl', 'l'],
    category: 'level',
    ClientPermissions: 'ATTACH_FILES',
    emoji: `${e.Star}`,
    usage: '<xp> [@user]',
    description: 'Confira seu nível ou o de alguém',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let u = message.mentions.users.first() || client.users.cache.get(args[0]) || message.mentions.repliedUser || message.author
        let user = client.users.cache.get(u.id)

        let avatar = user.displayAvatarURL({ format: "png", size: 1024 })

        if (user.bot) return message.reply(`${e.Deny} | Bots não possuem experiência.`)

        let level = db.get(`level_${user.id}`) || + 1
        let exp = db.get(`Xp_${user.id}`) || + 1
        let xpNeeded = level * 550

        let every = db.all().filter(i => i.ID.startsWith("level_")).sort((a, b) => b.data - a.data)
        let rank = every.map(x => x.ID).indexOf(`level_${user.id}`) + 1

        const card = new canvacord.Rank()
            .setAvatar(avatar)
            .setCurrentXP(exp)
            .setRequiredXP(xpNeeded)
            .setUsername(user.username)
            .setDiscriminator(user.discriminator)
            .setProgressBar(["#CE1919"], "GRADIENT")
            .setProgressBarTrack('#F1E2E2')
            .setRank(rank)
            .setProgressBarTrack('#FFFFFF')
            .setLevel(level)

        user.presence?.status ? card.setStatus(user.presence.status) : ''

        await card.build().then(card => {
            const RankImage = new MessageAttachment(card, 'RankCard.png')
            message.reply({ files: [RankImage] })
        }).catch(err => { return message.reply(`${e.Warn} | Um erro foi detectado na execução de CANVACORD\n\`${err}\``) })
    }
}