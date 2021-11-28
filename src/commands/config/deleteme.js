const { e } = require('../../../database/emojis.json')
const Data = require('../../../Routes/functions/data')
const PassCode = require('../../../Routes/functions/PassCode')
const { Transactions, Reminders } = require('../../../Routes/functions/database')

module.exports = {
    name: 'deleteme',
    aliases: ['deletartudo'],
    category: 'config',
    emoji: `${e.Gear}`,
    usage: '<deleteme>',
    description: 'Delete todos os seus dados',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let Pass = PassCode(50)
        const msg = await message.channel.send(`${e.Warn} | ${message.author}, você está prestes a apagar todos os seus dados do meu banco de dados, você deve confirmar sua ação digitando:\n**${Pass}**`)

        const filter = m => m.author.id === message.author.id
        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 120000 });
        let respondido = false

        collector.on('collect', m => {
            respondido = true
            m.content === `${Pass}` ? DeleteAllData(msg) : msg.edit(`${e.Deny} | Comando cancelado por resposta inválida.`)
        });

        collector.on('end', () => {
            if (!respondido)
                return msg.edit(`${e.Deny} | Comando cancelado por tempo expirado`)
        })

        function DeleteAllData(msg) {
            respondido = true
            let Timeouts = sdb.get(`Users.${message.author.id}.Timeouts`)
            sdb.set(`Users.${message.author.id}`, { Timeouts: Timeouts })
            Transactions.delete(`Transactions.${id}`)
            Reminders.delete(`Reminders.${id}`)
            db.delete(`${message.author.id}`)
            msg.edit(`${e.Check} | ${message.author}, todos os seus dados foram apagado com sucesso.\nData da Exclusão: \`${Data()}\``)
        }
    }
}

