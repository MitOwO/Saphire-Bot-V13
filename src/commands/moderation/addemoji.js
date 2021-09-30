
const { Util } = require('discord.js')
const { parse } = require("twemoji-parser")
const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'addemoji',
    aliases: ['emojiadd', 'adicionaremoji', 'addemote', 'emotecreate', 'steal', 'stealemoji'],
    category: 'moderation',
    emoji: `${e.ModShield}`,
    UserPermissions: 'MANAGE_EMOJIS_AND_STICKERS',
    ClientPermissions: 'MANAGE_EMOJIS_AND_STICKERS',
    usage: 'addemoji <emoji> <emoji> <emoji> <emoji>',
    description: 'Adicione Emojis no Servidor',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (!args.length) return message.reply(`${e.Info} | Adicione emojis no servidor. Posso adicionar vários de uma vez, só mandar seperados com espaços. <EMOJI> <EMOJI> <EMOJI> `)

        for (const rawEmoji of args) {
            const parsedEmoji = Util.parseEmoji(rawEmoji)

            if (parsedEmoji.id) {
                const extension = parsedEmoji.animated ? ".gif" : ".png"
                const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`
                message.guild.emojis.create(url, parsedEmoji.name)
                    .then((emoji) => message.channel.send(`${e.Check} | Prontinho!\n${emoji.url}`))
                    .catch(err => { message.reply(`${e.Deny} | Não foi possivel adicionar não... Isso é mesmo um emoji?`) })
            } else {
                message.reply(`${e.Deny} | Este emoji não é um emoji customizado ou não há mais espaços disponíveis.`)
            }
        }
    }
}