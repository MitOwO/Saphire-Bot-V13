const Moeda = require('../../../Routes/functions/moeda')
const { lotery, DatabaseObj } = require('../../../Routes/functions/database')
const { e, config } = DatabaseObj

module.exports = {
    name: 'tickets',
    aliases: ['ticket', 'loteria', 'lotery'],
    category: 'economy2',
    emoji: '🎫',
    usage: '<tickets> [@user/id]',
    description: 'Confire as chances de ganhar na loteria',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        if (message.author.id === config.ownerId) {
            if (['lock', 'fechar', 'travar', 'close'].includes(args[0]?.toLowerCase())) return LockLotery()
            if (['unlock', 'abrir', 'destravar', 'open'].includes(args[0]?.toLowerCase())) return UnlockLotery()
        }

        let u = message.mentions.users.first() || await client.users.cache.get(args[0]) || message.repliedUser || message.author,
            user = await client.users.cache.get(u.id),
            tickets = lotery.get('Loteria.Users') || [],
            Prize = lotery.get('Loteria.Prize'),
            i = 0

        for (const ts of tickets)
            if (ts === user.id)
                i++

        return message.channel.send(`${e.PandaProfit} | ${user.username} comprou ${i} 🎫 tickets da loteria\n💰 | ${parseInt(((i / tickets?.length) * 100) || 0).toFixed(3)}% de chance de ganhar.\n🌐 | ${tickets?.length}/15000 🎫 tickets comprados ao todo\n${e.MoneyWings} | ${Prize?.toFixed(0) || 0} ${Moeda(message)} acumulados\n🏆 | Último vencedor(a): ${lotery.get('Loteria.LastWinner') || 'Ninguém | 0'} ${Moeda(message)}`)

        function LockLotery() {
            lotery.get('Loteria.Close') ? message.channel.send(`${e.Info} | A loteria já está trancada.`) : Lock()

            function Lock() {
                lotery.set('Loteria.Close', true)
                return message.channel.send(`${e.Check} | A loteria foi trancada com sucesso!`)
            }
        }

        function UnlockLotery() {
            lotery.get('Loteria.Close') ? Open() : message.channel.send(`${e.Info} | A loteria já está destrancada.`)
            function Open() {
                lotery.set('Loteria.Close', false)
                message.channel.send(`${e.Check} | A loteria foi destrancada com sucesso!`)
            }
        }
    }
}
