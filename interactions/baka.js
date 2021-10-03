const { e } = require('../../../Routes/emojis.json')
const { g } = require('../../../Routes/Images/gifs.json')
const Moeda = require('../../../Routes/functions/moeda')

module.exports = {
  name: 'baka',
  aliases: ['idiota'],
  category: 'interactions',
  UserPermissions: '',
  ClientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
  emoji: `${e.SaphireQ}`,
  usage: '<baka> [@user]',
  description: 'Baka baka baka',

  run: async (client, message, args, prefix, db, MessageEmbed, request) => {

    let avatar = message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 })
    let rand = g.Baka[Math.floor(Math.random() * g.Baka.length)]

    let NoReactAuthor = db.get(`${message.author.id}.NoReact`)
    if (NoReactAuthor) return message.reply(`${e.Deny} | Você está com o \`${prefix}noreact\` ativado.`)

    let user = message.mentions.members.first() || message.member

    if (user.id === message.author.id) { return message.reply(`${e.Drinking} | Você não é baka, ||baka!||`) }

    let NoReact = db.get(`${user.id}.NoReact`)
    if (NoReact) return message.reply(`${e.Deny} | Este usuário está com o \`${prefix}noreact\` ativado.`)

    if (user.id === client.user.id) {
      db.subtract(`Balance_${message.author.id}`, 60); db.add(`Bank_${client.user.id}`, 60)
      db.set(`${message.author.id}.Baka`, true)
      return message.reply(`${e.Deny} | Você que é baka! To magoada, peguei 60 ${Moeda(message)} emprestadas pra comprar sorvetes, bye bye!`)
    }

    const embed = new MessageEmbed()
      .setColor('#246FE0')
      .setAuthor(`${message.author.username} chamou ${user.user.username} de baka`, avatar)
      .setImage(rand)
    return message.reply({ embeds: [embed] })
  }
}