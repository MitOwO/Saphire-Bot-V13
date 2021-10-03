const ms = require("parse-ms")
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const Moeda = require('../../../Routes/functions/moeda')

module.exports = {
  name: 'esmola',
  aliases: ['mendigar'],
  category: 'economy',
  UserPermissions: '',
  ClientPermissions: 'ADD_REACTIONS',
  emoji: `${e.Coin}`,
  usage: '<esmola>',
  description: 'Mendigue dinheiro no chat',

  run: async (client, message, args, prefix, db, MessageEmbed, request) => {

    let timeout1 = 300000
    let author1 = db.get(`esmolatimeout_${message.author.id}`)
    if (author1 !== null && timeout1 - (Date.now() - author1) > 0) {
      let time = ms(timeout1 - (Date.now() - author1))
      return message.reply(`${e.Deny} | Você já pediu esmola! Volte em: \`${time.minutes}m e ${time.seconds}s\``)
    } else {

      if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)
      db.set(`${message.author.id}.Timeouts.Esmola`, Date.now())

      return message.reply(`${e.SadPepe} | ${message.author.username} está pedindo um pouco de dinheiro`).then(msg => {
        db.set(`esmolatimeout_${message.author.id}`, Date.now())
        db.set(`Request.${message.author.id}`, `${msg.url}`)
        msg.react('🪙').catch(err => { }) // Coin

        const filter = (reaction, user) => { return reaction.emoji.name === '🪙' && user.id === user.id; };

        const collector = msg.createReactionCollector({ filter, time: 30000 });

        collector.on('collect', (reaction, user) => {
          if (user.id === client.user.id || user.id === message.author.id) return
          let money = db.get(`Balance_${user.id}`)
          if (money < 50) { return message.channel.send(`${e.Deny} | ${user}, você não tem 50 ${Moeda(message)} na carteira para ajudar ${message.author}`) }
          db.subtract(`Balance_${user.id}`, 50)
          db.add(`Balance_${message.author.id}`, 50)
          message.channel.send(`${e.MoneyWings} | ${user} ajudou ${message.author} com 50 ${Moeda(message)}`)
        });

        collector.on('end', collected => {
          db.delete(`Request.${message.author.id}`)
          msg.edit(`${e.Deny} | ${message.author.username} está pedindo um pouco de dinheiro | Request expirada`)
        });
      })
    }
  }
}