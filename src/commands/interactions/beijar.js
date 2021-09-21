const { g } = require('../../../Routes/Images/gifs.json')
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'beijar',
    aliases: ['kiss', 'beijo'],
    category: 'interactions',
    UserPermissions: '',
    ClientPermissions: ['EMBED_LINKS', 'MANAGE_MESSAGES', 'ADD_REACTIONS'],
    emoji: '👨‍❤️‍💋‍👨',
    usage: '<beijar> <@user>',
    description: 'Beijos e mais beijos',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}`)

        let NoReactAuthor = db.get(`User.${message.author.id}.NoReact`)
        if (NoReactAuthor) return message.reply(`${e.Deny} | Você está com o \`${prefix}noreact\` ativado.`)

        let rand = g.Beijar[Math.floor(Math.random() * g.Beijar.length)]
        let user = message.mentions.users.first() || message.member

        let NoReact = db.get(`User.${user.id}.NoReact`)
        if (NoReact) return message.reply(`${e.Deny} | Este usuário está com o \`${prefix}noreact\` ativado.`)

        if (user.id === client.user.id) {
            db.subtract(`Balance_${message.author.id}`, 100); db.add(`Bank_${client.user.id}`, 100)
            return message.reply(`${e.Aa} | Beija eu naaaum.`)
        }

        if (user.id === message.author.id) { return message.reply(`${e.Confuse} | Beijar você mesmo é meio impossível, não?`) }

        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setDescription(`${e.BlueHeart} | ${message.author} está beijando ${user}`)
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
                    const TradeEmbed = new MessageEmbed().setColor('RED').setDescription(`${e.BlueHeart} ${user} retribuiu o beijo de ${message.author} ${e.BlueHeart}`).setFooter(`${message.author.id}/${user.id}`).setImage(g.Beijar[Math.floor(Math.random() * g.Beijar.length)])
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