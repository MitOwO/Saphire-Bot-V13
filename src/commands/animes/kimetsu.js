const { e } = require('../../../Routes/emojis.json')
const { g } = require('../../../Routes/Images/gifs.json')
const { f } = require('../../../Routes/frases.json')

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

        if (request) return message.reply(`${e.Deny} | ${f.Request}`)
        let gif = g.KimetsuNoYaiba[Math.floor(Math.random() * g.KimetsuNoYaiba.length)]

        const KimetsuEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(':tv: Anime: Demon Slayer: Kimetsu no Yaiba')
            .setImage(gif)

        return message.reply({ embeds: [KimetsuEmbed] }).then(msg => {
            db.set(`User.Request.${message.author.id}`, 'ON')
            msg.react('🔄').catch(err => { return }) // Troca
            msg.react('❌').catch(err => { return }) // Cancel

            const TradeFilter = (reaction, user) => { return reaction.emoji.name === '🔄' && user.id === message.author.id }
            let Collector = msg.createReactionCollector({ filter: TradeFilter, time: 40000, erros: ['time'] })

            const DenyFilter = (reaction, user) => { return reaction.emoji.name === '❌' && user.id === message.author.id }
            let Collector2 = msg.createReactionCollector({ filter: DenyFilter, max: 1, errors: ['max'] })

            Collector.on('collect', () => {
                db.add(`User.${message.author.id}.Kim`, 1)
                KimetsuEmbed.setImage(g.KimetsuNoYaiba[Math.floor(Math.random() * g.KimetsuNoYaiba.length)])
                msg.edit({ embeds: [KimetsuEmbed] }).catch(err => { return })
            })

            Collector.on('end', () => {
                db.delete(`User.Request.${message.author.id}`)
                db.delete(`User.${message.author.id}.Kim`)
                KimetsuEmbed.setColor('RED').setTitle(`${e.Deny} Anime: Demon Slayer: Kimetsu no Yaiba`).setFooter(`Sessão Expirada | ${db.get(`User.${message.author.id}.Kim`) || 0} Requests solicitadas.`)
                msg.edit({ embeds: [KimetsuEmbed] }).catch(err => { return })
            })

            Collector2.on('end', () => {
                db.delete(`User.Request.${message.author.id}`)
                db.delete(`User.${message.author.id}.Kim`)
                msg.delete().catch(err => { return })
            })
        }).catch(err => {
            db.delete(`User.Request.${message.author.id}`)
            return message.reply(`${Attention} | Houve um erro ao executar este comando\n\`${err}\``)
        })
    }
}