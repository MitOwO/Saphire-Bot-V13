const { g } = require('../../../Routes/Images/gifs.json')
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const  Moeda = require('../../../Routes/functions/moeda')

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

    if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

    let NoReactAuthor = db.get(`${message.author.id}.NoReact`)
    if (NoReactAuthor) return message.reply(`${e.Deny} | Você está com o \`${prefix}noreact\` ativado.`)

    let rand = g.Atirar[Math.floor(Math.random() * g.Atirar.length)]
    let user = message.mentions.users.first() || message.member

    if (user.id === client.user.id) {
      db.subtract(`Balance_${message.author.id}`, 100); db.add(`Bank_${client.user.id}`, 100)
      return message.reply(`${e.Deny} | **NÃO** é pra atirar em mim, que isso? Só pela ousadia, eu peguei 100 ${Moeda(message)} emprestadas, ||pra sempre||.`)
    }

    if (user.id === message.author.id) { return message.reply(`${e.Deny} | Não atire em você mesmo, que coisa feia.`) }

    let NoReact = db.get(`${user.id}.NoReact`)
    if (NoReact) return message.reply(`${e.Deny} | Este usuário está com o \`${prefix}noreact\` ativado.`)

    const embed = new MessageEmbed()
      .setColor('#246FE0')
      .setDescription(`${e.GunRight} | ${message.author} está atirando em você ${user}`)
      .setImage(rand)
      .setFooter('🔁 retribuir')

    return message.reply({ embeds: [embed] }).then(msg => {
      db.set(`Request.${message.author.id}`, `${msg.url}`)
      msg.react('🔁').catch(err => { }) // Check

      const filter = (reaction, u) => { return ['🔁'].includes(reaction.emoji.name) && u.id === user.id }

      msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
        const reaction = collected.first()

        if (reaction.emoji.name === '🔁') {
          db.delete(`Request.${message.author.id}`)
          const TradeEmbed = new MessageEmbed().setColor('RED').setDescription(`${e.GunRight} ${message.author} e ${user} estão trocando tiros! ${e.GunLeft}`).setFooter(`${message.author.id}/${user.id}`).setImage(g.Atirar[Math.floor(Math.random() * g.Atirar.length)])
          msg.edit({ embeds: [TradeEmbed] }).catch(err => { })
        }

      }).catch(() => {
        db.delete(`Request.${message.author.id}`)
        embed.setColor('RED').setDescription(`${e.Deny} | ${message.author} atirou e ${user} saiu correndo.`).setFooter(`${message.author.id}/${user.id}`)
        msg.edit({ embeds: [embed] }).catch(err => { })
      })
    })
  }
}