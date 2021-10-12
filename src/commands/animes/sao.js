const { g } = require('../../../Routes/Images/gifs.json')
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const Error = require('../../../Routes/functions/errors')

module.exports = {
  name: 'sao',
  aliases: ['swordart', 'swordartonline'],
  category: 'animes',
  UserPermissions: '',
  ClientPermissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
  emoji: `${e.Asuna}`,
  usage: '<sao>',
  description: 'Gifs do anime: Sword Art Online',

  run: async (client, message, args, prefix, db, MessageEmbed, request) => {

    if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)
    let saophotos = g.SwordArtOnline[Math.floor(Math.random() * g.SwordArtOnline.length)]

    const SAOEmbed = new MessageEmbed()
      .setColor('#246FE0')
      .setTitle('📺 Anime: SAO - Sword Art Online')
      .setImage(saophotos)

    return message.reply({ embeds: [SAOEmbed] }).then(msg => {
      db.set(`Request.${message.author.id}`, `${msg.url}`)
      msg.react('🔄').catch(() => { }) // 1º Embed
      msg.react('❌').catch(() => { })

      let filter = (reaction, user) => { return reaction.emoji.name === '🔄' && user.id === message.author.id }
      let Collector = msg.createReactionCollector({ filter: filter, time: 40000, errors: ['time'] })

      let filter2 = (reaction, user) => { return reaction.emoji.name === '❌' && user.id === message.author.id }
      let Collector2 = msg.createReactionCollector({ filter: filter2, max: 1, errors: ['max'] })

      i = 0
      Collector.on('collect', (reaction, user) => {
        i++
        SAOEmbed.setImage(g.SwordArtOnline[Math.floor(Math.random() * g.SwordArtOnline.length)])
        msg.edit({ embeds: [SAOEmbed] }).catch(() => { })
      })

      Collector.on('end', (reaction, user) => {
        db.delete(`Request.${message.author.id}`)
        SAOEmbed.setColor('RED').setTitle(`${e.Deny} Anime: SAO - Sword Art Online`).setFooter(`Sessão Expirada | ${i} Requests solicitadas.`)
        msg.edit({ embeds: [SAOEmbed] }).then(() => { i = 0 }).catch(() => { })
      })

      Collector2.on('end', (reaction, user) => {
        db.delete(`Request.${message.author.id}`)
        msg.delete().then(() => { i = 0 }).catch(() => { })
      })
    }).catch(err => {
      Error(message, err)
      db.delete(`Request.${message.author.id}`)
      return message.reply(`${Attention} | Houve um erro ao executar este comando\n\`${err}\``)
    })
  }
}