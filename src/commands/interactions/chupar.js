const { g } = require('../../../Routes/Images/gifs.json')
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'chupar',
    aliases: ['suck'],
    category: 'interactions',
    UserPermissions: '',
    ClientPermissions: ['EMBED_LINKS', 'MANAGE_MESSAGES', 'ADD_REACTIONS'],
    emoji: '😏',
    usage: '<chupar> <@user>',
    description: 'Huuuum',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}`)

        let NoReactAuthor = db.get(`User.${message.author.id}.NoReact`)
        if (NoReactAuthor) return message.reply(`${e.Deny} | Você está com o \`${prefix}noreact\` ativado.`)

        let rand = g.Chupar[Math.floor(Math.random() * g.Chupar.length)]
        let user = message.mentions.users.first() || message.member

        if (user.id === client.user.id) {
            db.subtract(`Balance_${message.author.id}`, 100); db.add(`Bank_${client.user.id}`, 100)
            return message.reply(`${e.MaikaAngry} Sai pra lá, HENTAI!!!`)
        }

        if (user.id === message.author.id) { return message.reply(`${e.Deny} | Você é esquisito(a)`) }

        let NoReact = db.get(`User.${user.id}.NoReact`)
        if (NoReact) return message.reply(`${e.Deny} | Este usuário está com o \`${prefix}noreact\` ativado.`)

        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setDescription(`😏 | ${message.author} está chupando você ${user}`)
            .setImage(rand)
            .setFooter('🔁 retribuir')

        return message.reply({ embeds: [embed] }).then(msg => {
            db.set(`User.Request.${message.author.id}`, 'ON')
            db.set(`User.Request.${user.id}`, 'ON')
            msg.react('🔁').catch(err => { }) // Check

            const filter = (reaction, u) => { return ['🔁'].includes(reaction.emoji.name) && u.id === user.id }

            msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                const reaction = collected.first()

                if (reaction.emoji.name === '🔁') {
                    db.delete(`User.Request.${message.author.id}`)
                    const TradeEmbed = new MessageEmbed().setColor('RED').setDescription(`${message.author}, ${user} retribuiu a chupada`).setFooter(`${message.author.id}/${user.id}`).setImage(g.Chupar[Math.floor(Math.random() * g.Chupar.length)])
                    msg.edit({ embeds: [TradeEmbed] }).catch(err => { })
                }

            }).catch(() => {
                db.delete(`User.Request.${message.author.id}`)
                embed.setColor('RED').setFooter(`${message.author.id}/${user.id}`)
                msg.edit({ embeds: [embed] }).catch(err => { })
            })
        })
    }
}