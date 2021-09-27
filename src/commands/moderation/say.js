const { config } = require('../../../Routes/config.json')
const { e } = require('../../../Routes/emojis.json')
const { Permissions } = require('discord.js')

module.exports = {
    name: 'say',
    aliases: ['dizer', 'falar'],
    category: 'random',
    emoji: '🗣️',
    usage: '<say> <conteúdo da sua mensagem>',
    description: 'Diga algo no chat atráves de mim',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        message.author.id === config.ownerId ? SendOwner() : SendCommum()

        function SendOwner() {
            let Message = args.join(' ')
            if (!Message) { return message.reply(`${e.Deny} | Você precisa dizer algo para que eu envie.`) }
            message.delete().then(() => {
                return message.channel.send(Message)
            }).catch(err => {
                return message.channel.send(`${e.SadPanda} | Não tenho permissão pra executar esse comando`)
            })
        }

        function SendCommum() {

            if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
                return message.reply(`${e.Deny} | Permissão necessária: Gerenciar Mensagens`)

            let Message = args.join(' ')
            if (!Message) { return message.reply(`${e.Deny} | Você precisa dizer algo para que eu envie.`) }

            message.delete().then(() => {
                return message.channel.send(`${Message}\n \n~Por: ${message.author.tag}`)
            }).catch(err => {
                return message.channel.send(`${e.SadPanda} | Não tenho permissão pra executar esse comando`)
            })
        }
    }
}