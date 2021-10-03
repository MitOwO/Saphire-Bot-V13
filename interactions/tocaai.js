const { g } = require('../../../Routes/Images/gifs.json')
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'tocaai',
    aliases: ['highfive'],
    category: 'interactions',
    UserPermissions: '',
    ClientPermissions: ['EMBED_LINKS', 'MANAGE_MESSAGES', 'ADD_REACTIONS'],
    emoji: '🤝',
    usage: '<tocaai> <@user>',
    description: 'Comprimentos sempre são legais',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

        let NoReactAuthor = db.get(`${message.author.id}.NoReact`)
        if (NoReactAuthor) return message.reply(`${e.Deny} | Você está com o \`${prefix}noreact\` ativado.`)

        let rand = g.Tocaai[Math.floor(Math.random() * g.Tocaai.length)]
        let user = message.mentions.users.first() || message.member

        let NoReact = db.get(`${user.id}.NoReact`)
        if (NoReact) return message.reply(`${e.Deny} | Este usuário está com o \`${prefix}noreact\` ativado.`)

        if (user.id === client.user.id) return message.reply(e.Deidara)

        if (user.id === message.author.id) return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#246FE0')
                    .setDescription('🤝 Opa')
                    .setImage(rand)
            ]
        })

        return message.reply(`${user}, toca aí?`).then(msg => {
            db.set(`Request.${message.author.id}`, `${msg.url}`)
            msg.react('✅').catch(err => { }) // Check

            const filter = (reaction, u) => { return ['✅'].includes(reaction.emoji.name) && u.id === user.id }

            msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                const reaction = collected.first()

                if (reaction.emoji.name === '✅') {
                    db.delete(`Request.${message.author.id}`)
                    const TradeEmbed = new MessageEmbed().setColor('RED').setFooter(`${message.author.id}/${user.id}`).setImage(g.Tocaai[Math.floor(Math.random() * g.Tocaai.length)])
                    msg.edit({ content: `${user} 🤝 ${message.author}`, embeds: [TradeEmbed] }).catch(err => { })
                }

            }).catch(() => {
                db.delete(`Request.${message.author.id}`)
                msg.edit('Ish... Ficou no vácuo').catch(err => { })
            })
        })
    }
}