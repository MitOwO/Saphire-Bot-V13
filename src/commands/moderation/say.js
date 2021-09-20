const { config } = require('../../../Routes/config.json')
const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'say',
    aliases: ['dizer', 'falar'],
    category: 'random',
    UserPermissions: 'MANAGE_MESSAGES',
    ClientPermissions: 'MANAGE_MESSAGES',
    emoji: '🗣️',
    usage: '<say> <conteúdo da sua mensagem>',
    description: 'Diga algo no chat atráves de mim',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let Message = args.join(' ')
        if (!Message) { return message.reply(`${e.Deny} | Você precisa dizer algo para que eu envie.`) }

        message.author.id === config.ownerId ? SendOwner() : SendCommum()

        function SendOwner() {
            message.delete().then(() => {
                return message.channel.send(Message)
            }).catch(err => {
                return message.channel.send(`${e.Warn} | Houve um erro ao executar este comando.\n\`${err}\``)
            })
        }

        function SendCommum() {
            message.delete().then(() => {
                return message.channel.send(`${Message}\n \n~Por: ${message.author.tag}`)
            }).catch(err => {
                return message.channel.send(`${e.Warn} | Houve um erro ao executar este comando.\n\`${err}\``)
            })
        }
    }
}
