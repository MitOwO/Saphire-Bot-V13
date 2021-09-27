const { e } = require('../../../Routes/emojis.json')
const { g } = require('../../../Routes/Images/gifs.json')
const { f } = require('../../../Routes/frases.json')
const Error = require('../../../Routes/functions/errors')

module.exports = {
    name: 'kimetsu',
    aliases: ['kny'],
    category: 'animes',
    UserPermissions: '',
    ClientPermissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
    emoji: `${e.NezukoDance}`,
    usage: '<kimetsu>',
    description: 'Gifs do anime: Demon Slayer: Kimetsu no Yaiba',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)
        let gif = g.KimetsuNoYaiba[Math.floor(Math.random() * g.KimetsuNoYaiba.length)]

        const KimetsuEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(':tv: Anime: Demon Slayer: Kimetsu no Yaiba')
            .setImage(gif)

        return message.reply({ embeds: [KimetsuEmbed] }).then(msg => {
            db.set(`Request.${message.author.id}`, `${msg.url}`)
            msg.react('🔄').catch(err => { }) // Troca
            msg.react('❌').catch(err => { }) // Cancel

            const TradeFilter = (reaction, user) => { return reaction.emoji.name === '🔄' && user.id === message.author.id }
            let Collector = msg.createReactionCollector({ filter: TradeFilter, time: 40000, erros: ['time'] })

            const DenyFilter = (reaction, user) => { return reaction.emoji.name === '❌' && user.id === message.author.id }
            let Collector2 = msg.createReactionCollector({ filter: DenyFilter, max: 1, errors: ['max'] })

            i = 0
            Collector.on('collect', () => {
                i++
                KimetsuEmbed.setImage(g.KimetsuNoYaiba[Math.floor(Math.random() * g.KimetsuNoYaiba.length)])
                msg.edit({ embeds: [KimetsuEmbed] }).catch(err => { })
            })

            Collector.on('end', () => {
                db.delete(`Request.${message.author.id}`)
                KimetsuEmbed.setColor('RED').setTitle(`${e.Deny} Anime: Demon Slayer: Kimetsu no Yaiba`).setFooter(`Sessão Expirada | ${i} Requests solicitadas.`)
                msg.edit({ embeds: [KimetsuEmbed] }).then(() => { i = 0 }).catch(err => { })
            })

            Collector2.on('end', () => {
                db.delete(`Request.${message.author.id}`)
                msg.delete().then(() => { i = 0 }).catch(err => { })
            })
        }).catch(err => {
            Error(message, err)
            db.delete(`Request.${message.author.id}`)
            return message.reply(`${Attention} | Houve um erro ao executar este comando\n\`${err}\``)
        })
    }
}