const { g } = require('../../../Routes/Images/gifs.json')
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

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

    if (request) return message.reply(`${e.Deny} | ${f.Request}`)
    let saophotos = g.SwordArtOnline[Math.floor(Math.random() * g.SwordArtOnline.length)]

    const SAOEmbed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle('📺 Anime: SAO - Sword Art Online')
      .setImage(saophotos)

    return message.reply({ embeds: [SAOEmbed] }).then(msg => {
      db.set(`User.Request.${message.author.id}`, 'ON')
      msg.react('🔄').catch(err => { return }) // 1º Embed
      msg.react('❌').catch(err => { return })

      let filter = (reaction, user) => { return reaction.emoji.name === '🔄' && user.id === message.author.id }
      let Collector = msg.createReactionCollector({ filter: filter, time: 40000, errors: ['time'] })

      let filter2 = (reaction, user) => { return reaction.emoji.name === '❌' && user.id === message.author.id }
      let Collector2 = msg.createReactionCollector({ filter: filter2, max: 1, errors: ['max'] })

      Collector.on('collect', (reaction, user) => {
        db.add(`User.${message.author.id}.Sao`, 1)
        SAOEmbed.setImage(g.SwordArtOnline[Math.floor(Math.random() * g.SwordArtOnline.length)])
        msg.edit({ embeds: [SAOEmbed] }).catch(err => { return })
      })

      Collector.on('end', (reaction, user) => {
        db.delete(`User.Request.${message.author.id}`)
        SAOEmbed.setColor('RED').setTitle(`${e.Deny} Anime: SAO - Sword Art Online`).setFooter(`Sessão Expirada | ${db.get(`User.${message.author.id}.Sao`) || 0} Requests solicitadas.`)
        db.delete(`User.${message.author.id}.Sao`)
      })

      Collector2.on('end', (reaction, user) => {
        db.delete(`User.Request.${message.author.id}`)
        db.delete(`User.${message.author.id}.Sao`)
        msg.delete().catch(err => { return })
      })
    }).catch(err => {
      db.delete(`User.Request.${message.author.id}`)
      return message.reply(`${Attention} | Houve um erro ao executar este comando\n\`${err}\``)
  })
  }
}