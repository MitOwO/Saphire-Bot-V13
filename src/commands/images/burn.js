const { MessageAttachment } = require('discord.js')
const { e } = require('../../../database/emojis.json')
const { Canvas } = require('canvacord')
const Error = require('../../../Routes/functions/errors')

// #246FE0 - Azul Saphire
module.exports = {
    name: 'burn',
    aliases: ['fire'],
    category: 'images',
    ClientPermissions: ['ATTACH_FILES'],
    emoji: '🔥',
    usage: '<fire> <@user> [number]',
    description: 'Efeito de queimação',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let user = message.mentions.users.first() || message.mentions.repliedUser || await client.users.cache.get(args[0]) || message.author
        let avatar = user.displayAvatarURL({ format: 'png' })

        let number = parseInt(args[1]) || parseInt(args[0]) || 1
        if (isNaN(number)) number = 1

        if (number > 100 || number < 1)
            return message.reply(`${e.Deny} | O número não pode ser maior que **100**`)

        try {
            return message.reply(`${e.Loading} | Carregando...`).then(async msg => {
                msg.delete().catch(() => { })
                message.reply({ files: [new MessageAttachment(await Canvas.burn(avatar, number), 'burn.png')] })
            })
        } catch (err) {
            Error(message, err)
        }
    }
}