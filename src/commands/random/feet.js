const { g } = require('../../../Routes/Images/gifs.json')
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
  name: 'feet',
  aliases: ['pé', 'pezinho', 'pezin'],
  category: 'reactions',
  ClientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
  emoji: '🦶',
  usage: '<feet>',
  description: 'Vai um pézinho?',

  run: async (client, message, args, prefix, db, MessageEmbed, request) => {

    if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)
    let rand = g.Feet[Math.floor(Math.random() * g.Feet.length)]
    let texto = `${message.author}, curte um pézinho?`


    const embed = new MessageEmbed().setColor('#246FE0').setDescription(`${texto}`).setImage(rand)

    return message.reply({ embeds: [embed] }).then(msg => {
      db.set(`Request.${message.author.id}`, `${msg.url}`)
      msg.react('🔄').catch(err => { }) // 1º Embed
      msg.react('❌').catch(err => { }) // cancel

      let filter = (reaction, user) => { return reaction.emoji.name === '🔄' && user.id === message.author.id }; let Collector = msg.createReactionCollector({ filter: filter, time: 15000, errors: ['time'] })
      let filter2 = (reaction, user) => { return reaction.emoji.name === '❌' && user.id === message.author.id }; let Collector2 = msg.createReactionCollector({ filter: filter2, max: 1, time: 30000, errors: ['time', 'max'] })
      Collector.on('collect', (reaction, user) => { embed.setImage(g.Feet[Math.floor(Math.random() * g.Feet.length)]); msg.edit({ embeds: [embed] }).catch(err => { }) })
      Collector.on('end', (reaction, user) => { db.delete(`Request.${message.author.id}`); embed.setColor('RED').setFooter(`Sessão Expirada | ${message.author.id}`); msg.reactions.removeAll().catch(err => { }); msg.edit({ embeds: [embed] }).catch(err => { }) })

      Collector2.on('collect', (reaction, user) => { embed.setColor('RED').setFooter(`Comando Expirado | ${message.author.id}`); msg.reactions.removeAll().catch(err => { }); msg.edit({ embeds: [embed] }).catch(err => { }) })
      Collector2.on('end', (reaction, user) => { db.delete(`Request.${message.author.id}`); embed.setColor('RED').setFooter(`Tempo Expirado | ${message.author.id}`); msg.reactions.removeAll().catch(err => { }); msg.edit({ embeds: [embed] }).catch(err => { }) })
    }).catch(err => {
      db.delete(`Request.${message.author.id}`)
      return message.reply(`${e.Warn} | Houve um erro ao executar este comando\n\`${err}\``)
    })
  }
}