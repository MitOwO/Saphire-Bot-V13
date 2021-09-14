const { MessageAttachment } = require('discord.js')
const canvacord = require("canvacord")
const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'triggered',
    aliases: ['trigger', 'trig'],
    category: 'random',
    UserPermissions: '',
    ClientPermissions: 'ATTACH_FILES',
    emoji: `${e.Trig}`,
    usage: '<trig> [@user]',
    description: 'Triggeeeeered!',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let user = message.mentions.users.first() || message.repliedUser || message.member

        let avatar = user.user.displayAvatarURL({ format: "png", size: 1024 })
        let image = await canvacord.Canvas.trigger(avatar)
        let attachment = new MessageAttachment(image, "triggered.gif")
        return message.reply({ files: [attachment] })
    }
}