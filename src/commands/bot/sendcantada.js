const { DatabaseObj } = require('../../../Routes/functions/database')
const { e } = DatabaseObj

module.exports = {
    name: 'sendcantada',
    aliases: ['enviarcantada'],
    category: 'bot',
    emoji: '📨',
    usage: 'sendcantada',
    description: 'Envie cantadas para o comando `cantada`',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        return message.channel.send(`${e.SaphireFeliz} | Você pode mandar suas cantadas no meu formulário! Aqui está o link: https://forms.gle/4sQ1mgRdP4b1fUnx7`)
    }
}