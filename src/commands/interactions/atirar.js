const { g } = require('../../../Routes/Images/gifs.json')
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
  name: 'atirar',
  aliases: ['shoot', 'tiro'],
  category: 'interactions',
  UserPermissions: '',
  ClientPermissions: ['EMBED_LINKS', 'MANAGE_MESSAGES', 'ADD_REACTIONS'],
  emoji: '🔫',
  usage: '<atirar> <@user>',
  description: 'Atire em alguém',

  run: async (client, message, args, prefix, db, MessageEmbed, request) => {

    if (request) return message.reply(`${e.Deny} | ${f.Request}`)

    let NoReactAuthor = db.get(`User.${message.author.id}.NoReact`)
    if (NoReactAuthor) return message.reply(`${e.Deny} | Você está com o \`${prefix}noreact\` ativado.`)

    let rand = g.Atirar[Math.floor(Math.random() * g.Atirar.length)]
    let user = message.mentions.users.first() || message.member

    if (user.id === client.user.id) {
      db.subtract(`Balance_${message.author.id}`, 100); db.add(`Bank_${client.user.id}`, 100)
      return message.reply(`${e.Deny} | **NÃO** é pra atirar em mim, que isso? Só pela ousadia, eu peguei 100 ${e.Coin}Moedas emprestadas, ||pra sempre||.`)
    }

    if (user.id === message.author.id) { return message.reply(`${e.Deny} | Não atire em você mesmo, que coisa feia.`) }

    let NoReact = db.get(`User.${user.id}.NoReact`)
    if (NoReact) return message.reply(`${e.Deny} | Este usuário está com o \`${prefix}noreact\` ativado.`)

    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setDescription(`${e.GunRight} | ${message.author} está atirando em você ${user}`)
      .setImage(rand)
      .setFooter('🔁 retribuir')

    return message.reply({ embeds: [embed] }).then(msg => {
      db.set(`User.Request.${message.author.id}`, 'ON')
      db.set(`User.Request.${user.id}`, 'ON')
      msg.react('🔁').catch(err => { }) // Check

      const filter = (reaction, u) => { return ['🔁'].includes(reaction.emoji.name) && u.id === user.id }

      msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
        const reaction = collected.first()

        if (reaction.emoji.name === '🔁') {
          db.delete(`User.Request.${message.author.id}`)
          db.delete(`User.Request.${user.id}`)
          const TradeEmbed = new MessageEmbed().setColor('RED').setDescription(`${e.GunRight} ${message.author} e ${user} estão trocando tiros! ${e.GunLeft}`).setFooter(`${message.author.id}/${user.id}`).setImage(g.Atirar[Math.floor(Math.random() * g.Atirar.length)])
          msg.edit({ embeds: [TradeEmbed] }).catch(err => { })
        }

      }).catch(() => {
        db.delete(`User.Request.${message.author.id}`)
        db.delete(`User.Request.${user.id}`)
        embed.setColor('RED').setDescription(`${e.Deny} | ${message.author} atirou e ${user} saiu correndo.`).setFooter(`${message.author.id}/${user.id}`)
        msg.edit({ embeds: [embed] }).catch(err => { })
      })
    })
  }
}