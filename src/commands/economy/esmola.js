const ms = require("parse-ms")
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

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

    let author = await db.get(`User.${message.author.id}.Timeouts.PresoMax`)
    if (author !== null && 9140000 - (Date.now() - author) > 0) {
      let time = ms(9140000 - (Date.now() - author))
      return message.reply(`${e.Sirene} Você está sob detenção máxima por mais \`${time.hours}h ${time.minutes}m e ${time.seconds}s\` `)
    } else {

      let timeout1 = 300000
      let author1 = await db.get(`esmolatimeout_${message.author.id}`)

      if (author1 !== null && timeout1 - (Date.now() - author1) > 0) {
        let time = ms(timeout1 - (Date.now() - author1))

        return message.reply(`${e.Deny} | Você já pediu esmola! Volte em: \`${time.minutes}m e ${time.seconds}s`)
      } else {

        if (request) return message.reply(`${e.Deny} | ${f.Request}`)
        db.set(`User.${message.author.id}.Timeouts.Esmola`, Date.now())

        return message.reply(`${e.SadPepe} | ${message.author.username} está pedindo um pouco de dinheiro`).then(msg => {
          db.set(`esmolatimeout_${message.author.id}`, Date.now())
          db.set(`User.Request.${message.author.id}`, 'ON')
          msg.react('🪙').catch(err => { return }) // Coin

          const filter = (reaction, user) => { return reaction.emoji.name === '🪙' && user.id === user.id; };

          const collector = msg.createReactionCollector({ filter, time: 30000 });

          collector.on('collect', (reaction, user) => {
            if (user.id === client.user.id || user.id === message.author.id) return
            let money = db.get(`Balance_${user.id}`)
            if (money < 50) { return message.channel.send(`${e.Deny} | ${user}, você não tem 50 ${e.Coin}Moedas na carteira para ajudar ${message.author}`) }
            db.subtract(`Balance_${user.id}`, 50)
            db.add(`Balance_${message.author.id}`, 50)
            message.channel.send(`${e.MoneyWings} | ${user} ajudou ${message.author} com 50 ${e.Coin}Moedas`)
          });

          collector.on('end', collected => {
            msg.edit(`${e.Deny} | ${message.author.username} está pedindo um pouco de dinheiro | Request expirada`)
          });
        })
      }
    }
  }
}