const { e } = require('../../../Routes/emojis.json')
const { g } = require('../../../Routes/Images/gifs.json')

module.exports = {
    name: 'soco',
    aliases: ['punch', 'socar'],
    category: 'interactions',
    UserPermissions: '',
    ClientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
    emoji: `${e.Confuse}`,
    usage: '<soco> [@user]',
    description: 'Dê um soco em quem merece',
    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}`)

        let NoReactAuthor = db.get(`User.${message.author.id}.NoReact`)
        if (NoReactAuthor) return message.reply(`${e.Deny} | Você está com o \`${prefix}noreact\` ativado.`)

        let rand = g.Soco[Math.floor(Math.random() * g.Soco.length)]
        let user = message.mentions.users.first() || message.member

        if (user.id === client.user.id) {
            db.subtract(`Balance_${message.author.id}`, 40); db.add(`Bank_${client.user.id}`, 40)
            return message.reply(`${e.Deny} | Por tentar me bater, você perdeu 40 ${e.Coin} Moedas, baka!`)
        }

        if (user.id === message.author.id) { return message.reply(`${e.Deny} | Não bata em você mesmo, poxa...`) }

        let NoReact = db.get(`User.${user.id}.NoReact`)
        if (NoReact) return message.reply(`${e.Deny} | Este usuário está com o \`${prefix}noreact\` ativado.`)

        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setDescription(`${e.GunRight} | ${message.author} está dando socos em você ${user}`)
            .setImage(rand)
            .setFooter('🔁 retribuir')

        return message.reply({ embeds: [embed] }).then(msg => {
            db.set(`User.Request.${message.author.id}`, 'ON')
            db.set(`User.Request.${user.id}`, 'ON')
            msg.react('🔁').catch(err => { return }) // Check

            const filter = (reaction, u) => { return ['🔁'].includes(reaction.emoji.name) && u.id === user.id }

            msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                const reaction = collected.first()

                if (reaction.emoji.name === '🔁') {
                    db.delete(`User.Request.${message.author.id}`)
                    db.delete(`User.Request.${user.id}`)
                    const TradeEmbed = new MessageEmbed().setColor('RED').setDescription(`${message.author} e ${user} estão trocando socos!`).setFooter(`${message.author.id}/${user.id}`).setImage(g.Soco[Math.floor(Math.random() * g.Soco.length)])
                    msg.edit({ embeds: [TradeEmbed] }).catch(err => { return })
                }

            }).catch(() => {
                db.delete(`User.Request.${message.author.id}`)
                db.delete(`User.Request.${user.id}`)
                embed.setColor('RED').setDescription(`${e.Deny} | ${message.author} deu socos em ${user} e ele(a) saiu correndo.`).setFooter(`${message.author.id}/${user.id}`)
                msg.edit({ embeds: [embed] }).catch(err => { return })
            })
        })
    }
}