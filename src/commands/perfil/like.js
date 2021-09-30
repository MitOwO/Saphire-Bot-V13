const { e } = require('../../../Routes/emojis.json')
const ms = require("parse-ms")

module.exports = {
    name: 'like',
    aliases: ['curtir'],
    category: 'perfil',
    emoji: `${e.Like}`,
    usage: '<like> [@user]',
    description: 'Curta quem você gosta',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.mentions.repliedUser
        // let timeout = 1800000 // 30 Minutos
        let rptimeout = db.get(`${message.author.id}.Timeouts.Rep`)

        if (!user || user.id === message.author.id) return message.reply(`${e.Like} | @marca, responda a mensagem ou diga o ID da pessoa que deseja dar like.`)
        if (user.id === client.user.id) return message.reply(`Olha, eu agradeço... Mas você já viu meu \`${prefix}perfil @Saphire\`?`)
        if (user.bot) return message.reply(`${e.Deny} | Sem likes para bots.`)

        if (rptimeout !== null && 1800000 - (Date.now() - rptimeout) > 0) {
            let time = ms(1800000 - (Date.now() - rptimeout))
            return message.reply(`${e.Nagatoro} | Calminha aí Princesa! \`${time.minutes}m, e ${time.seconds}s\``)
        } else {

            let cp = db.get(`Likes_${user.id}`) + 1 || '0'

            db.add(`Likes_${user.id}`, 1)
            db.set(`${message.author.id}.Timeouts.Rep`, Date.now())

            message.reply(`${e.Check} Você deu um like para ${user.username}.\nAgora, ${user.username} possui um total de ${e.Like} ${cp} likes.`)
        }
    }
}