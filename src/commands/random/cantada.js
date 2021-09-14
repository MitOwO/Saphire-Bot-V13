const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
  name: 'cantadas',
  aliases: ['cantada'],
  category: 'random',
  UserPermissions: '',
  ClientPermissions: '',
  emoji: '💌',
  usage: '<cantada>',
  description: 'Veja cantadas muito "boas"',

  run: async (client, message, args, prefix, db, MessageEmbed, request) => {
    if (request) return message.reply(`${e.Deny} | ${f.Request}`)

    const Cantadas = f.Cantadas[Math.floor(Math.random() * f.Cantadas.length)]

    const CantadasEmbed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle(`❤️ Cantadas da Turma`)
      .addField('----------', `${Cantadas}`)

    return message.reply({ embeds: [CantadasEmbed] }).then(msg => {
      db.set(`User.Request.${message.author.id}`, 'ON')
      msg.react('🔄').catch(err => { return }) // 1º Embed
      msg.react('❌').catch(err => { return }) // Cancel

      const FilterTrade = (reaction, user) => { return reaction.emoji.name === '🔄' && user.id === message.author.id; };
      const collector = msg.createReactionCollector({ filter: FilterTrade, max: 15, time: 20000, errors: ['time'] })

      let CancelFilter = (reaction, user) => { return reaction.emoji.name === '❌' && user.id === message.author.id }
      let CancelCollector = msg.createReactionCollector({ filter: CancelFilter, max: 1, time: 20000, errors: ['max', 'time'] })

      collector.on('collect', (reaction, user) => {
        CantadasEmbed.setColor('BLUE').addField('----------', `${f.Cantadas[Math.floor(Math.random() * f.Cantadas.length)]}`)
        msg.edit({ embeds: [CantadasEmbed] }).catch(err => { return })
      });

      collector.on('end', collected => {
        db.delete(`User.Request.${message.author.id}`)
        CantadasEmbed.setColor('RED').setFooter(`Tempo expirado | ${message.author.id} | ${prefix}sendcantada`)
        msg.edit({ embeds: [CantadasEmbed] }).catch(err => { return })
      })

      CancelCollector.on('collect', (reaction, user) => {
        db.delete(`User.Request.${message.author.id}`)
        CantadasEmbed.setColor('RED').setFooter(`Comando cancelado | ${message.author.id} | ${prefix}sendcantada`)
        msg.edit({ embeds: [CantadasEmbed] }).catch(err => { return })
        msg.reactions.removeAll().catch(err => { return })
      });
    })
  }
}