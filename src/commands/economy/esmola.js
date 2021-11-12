const ms = require("parse-ms")
const { e } = require('../../../database/emojis.json')
const { f } = require('../../../database/frases.json')
const Moeda = require('../../../Routes/functions/moeda')

module.exports = {
  name: 'esmola',
  aliases: ['mendigar'],
  category: 'economy',
  ClientPermissions: 'ADD_REACTIONS',
  emoji: `${e.Coin}`,
  usage: '<esmola>',
  description: 'Mendigue dinheiro no chat',

  run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

    let time = ms(300000 - (Date.now() - sdb.get(`Users.${message.author.id}.Timeouts.Esmola`)))
    if (sdb.get(`Users.${message.author.id}.Timeouts.Esmola`) !== null && 300000 - (Date.now() - sdb.get(`Users.${message.author.id}.Timeouts.Esmola`)) > 0)
      return message.reply(`${e.Deny} | Você já pediu esmola! Volte em: \`${time.minutes}m e ${time.seconds}s\``)

    if (request) return message.reply(`${e.Deny} | ${f.Request}${sdb.get(`Request.${message.author.id}`)}`)

    return message.reply(`${e.SadPepe} | ${message.author.username} está pedindo um pouco de dinheiro`).then(msg => {
      sdb.set(`Users.${message.author.id}.Timeouts.Esmola`, Date.now())
      sdb.set(`Request.${message.author.id}`, `${msg.url}`)
      msg.react('🪙').catch(() => { 
        sdb.delete(`Users.${message.author.id}.Timeouts.Esmola`)
      }) // Coin

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
        sdb.delete(`Request.${message.author.id}`)
        msg.edit(`${e.Deny} | ${message.author.username} está pedindo um pouco de dinheiro | Request expirada`)
      });
    })
  }
}