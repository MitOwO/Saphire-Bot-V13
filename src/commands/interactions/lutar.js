const { g } = require('../../../Routes/Images/gifs.json')
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'lutar',
    aliases: ['fight', 'brigar', 'briga', 'luta'],
    category: 'interactions',
    UserPermissions: '',
    ClientPermissions: ['EMBED_LINKS', 'MANAGE_MESSAGES', 'ADD_REACTIONS'],
    emoji: 'vs',
    usage: '<lutar> <@user>',
    description: 'Treta, treta',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

        let NoReactAuthor = db.get(`${message.author.id}.NoReact`)
        if (NoReactAuthor) return message.reply(`${e.Deny} | Você está com o \`${prefix}noreact\` ativado.`)

        let rand = g.Lutar[Math.floor(Math.random() * g.Lutar.length)]
        let user = message.mentions.users.first() || message.member

        if (user.id === client.user.id) return message.reply(`Vou lentar responder, pqe eu ganharia facilmente...`)

        if (user.id === message.author.id) { return message.reply(`Você é estranho... Quer um psicólogo?`) }

        let NoReact = db.get(`${user.id}.NoReact`)
        if (NoReact) return message.reply(`${e.Deny} | Este usuário está com o \`${prefix}noreact\` ativado.`)

        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setDescription(`${message.author} está lutando contra ${user}`)
            .setImage(rand)

        return message.reply({ embeds: [embed] }).then(msg => {
            db.set(`Request.${message.author.id}`, `${msg.url}`)
            msg.react('🔁').catch(err => { }) // Check

            const filter = (reaction, u) => { return ['🔁'].includes(reaction.emoji.name) && u.id === user.id }

            msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                const reaction = collected.first()

                if (reaction.emoji.name === '🔁') {
                    db.delete(`Request.${message.author.id}`)
                    const TradeEmbed = new MessageEmbed().setColor('RED').setDescription(`${message.author} e ${user} estão lutando`).setImage(g.Lutar[Math.floor(Math.random() * g.Lutar.length)])
                    msg.edit({ embeds: [TradeEmbed] }).catch(err => { })
                }

            }).catch(() => {
                db.delete(`Request.${message.author.id}`)
                embed.setColor('RED').setFooter(`${message.author.id}/${user.id}`)
                msg.edit({ embeds: [embed] }).catch(err => { })
            })
        })
    }
}