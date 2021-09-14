const canvacord = require('canvacord/src/Canvacord')
const Discord = require("discord.js")
const { e } = require('../../../Routes/emojis.json')

module.exports = {
  name: 'affect',
  aliases: ['afeta'],
  category: 'interactions',
  UserPermissions: '',
  ClientPermissions: 'ATTACH_FILES',
  emoji: '🤰',
  usage: '<affect> [@user]',
  description: 'Isso não afeta o bebê',

  run: async (client, message, args, prefix, db, MessageEmbed, request) => {

    let user = message.mentions.users.first() || message.author || message.repliedUser
    // let avatar = user.avatarURL({ dynamic: true, format: "png", size: 1024 })
    let avatar = user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 })

    // let avatar = user.displayAvatarURL({ dynamic: false })

    const image = await canvacord.affect(avatar)
    const affect = new Discord.MessageAttachment(image, 'affect.png')
    return message.reply({ files: [affect] })
  }
}