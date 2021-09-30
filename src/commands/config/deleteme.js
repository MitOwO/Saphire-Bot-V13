const { e } = require('../../../Routes/emojis.json')
const Data = require('../../../Routes/functions/data')

module.exports = {
    name: 'deleteme',
    aliases: ['deletartudo'],
    category: 'config',
    ClientPermissions: 'MANAGE_MESSAGES',
    emoji: `${e.Gear}`,
    usage: '<deleteme>',
    description: 'Delete todos os seus dados',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        return message.channel.send(`${e.Warn} | ${message.author}, você está prestes a apagar todos os seus dados do meu banco de dados, você deve confirmar sua ação digitando:\n**${message.author.id}**`).then(msg => {

            const filter = m => m.author.id === message.author.id
            const collector = message.channel.createMessageCollector({ filter, max: 1, time: 60000 });

            collector.on('collect', m => {
                m.content === message.author.id ? DeleteAllData(msg) : msg.edit(`${e.Deny} | Comando cancelado por resposta inválida.`)
            });
        })

        function DeleteAllData(msg) {
            let id = message.author.id
            msg.edit(`${e.Loading} | Deletando todos os dados \`${id}\`...`)
            setTimeout(() => {
                db.delete(`${id}`)
                db.delete(`Bank_${id}`)
                db.delete(`Balance_${id}`)
                db.delete(`Xp_${id}`)
                db.delete(`level_${id}`)
                db.delete(`Vip_${id}`)
                db.delete(`Likes_${id}`)
                db.delete(`Bitcoin_${id}`)
                msg.edit(`${e.Check} | ${message.author}, todos os seus dados foram apagado com sucesso.\nData da Exclusão: \`${Data}\``)
            }, 5000)
        }

    }
}