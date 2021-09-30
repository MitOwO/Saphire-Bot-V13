
const { e } = require('../../../Routes/emojis.json')
const Moeda = require('../../../Routes/functions/moeda')
const { config } = require('../../../Routes/config.json')

module.exports = {
    name: 'tickets',
    aliases: ['ticket', 'loteria', 'lotery'],
    category: 'economy',
    emoji: '🎫',
    usage: '<tickets> [@user/id]',
    description: 'Confire as chances de ganhar na loteria',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (message.author.id === config.ownerId) {
            if (['lock', 'fechar', 'travar', 'close'].includes(args[0]?.toLowerCase())) return LockLotery()
            if (['unlock', 'abrir', 'destravar', 'open'].includes(args[0]?.toLowerCase())) return UnlockLotery()
        }

        if (db.get('Lotery.Close')) return message.reply(`${e.Deny} | A loteria não está aberta.`)
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        if (!isNaN(args[0])) {
            user = client.users.cache.get(args[0])
            if (!user) return message.reply(`${e.Deny} | Não achei ninguém com esse ID.`)
        }
        let tickets = db.get('Loteria.Users') || []

        let i = 0
        if (tickets) {
            tickets.forEach(tickets => {
                if (tickets === user.id)
                    i++
            });
        }

        !isNaN(args[0]) ? Id(user.username, i) : User(i)

        function Id(u, i) { message.channel.send(`${e.PandaProfit} | ${u} comprou ${i} 🎫 tickets da loteria\n💰 | ${parseInt(((i / tickets?.length) * 100) || 0).toFixed(2)}% de chance de ganhar.\n🌐 | ${db.get('Loteria.Users').length}/10000 🎫 tickets comprados ao todo\n${e.MoneyWings} | ${db.get('Loteria.Prize')?.toFixed(0) || 0} ${Moeda(message)} acumulados\n🏆 | Último vencedor(a): ${db.get('Loteria.LastWinner') || 'Ninguém | 0'} ${Moeda(message)}`) }
        function User(i) { message.channel.send(`${e.PandaProfit} | ${user.user.username} comprou ${i} 🎫 tickets da loteria\n💰 | ${parseInt(((i / tickets?.length) * 100) || 0).toFixed(2)}% de chance de ganhar.\n🌐 | ${db.get('Loteria.Users').length}/10000 🎫 tickets comprados ao todo\n${e.MoneyWings} | ${db.get('Loteria.Prize')?.toFixed(0) || 0} ${Moeda(message)} acumulados\n🏆 | Último vencedor(a): ${db.get('Loteria.LastWinner') || 'Ninguém | 0'} ${Moeda(message)}`) }

        function LockLotery() {
            if (db.get('Lotery.Close')) {
                message.channel.send(`${e.Info} | A loteria já está trancada.`)
            } else {
                db.set('Lotery.Close', true);
                message.channel.send(`${e.Check} | A loteria foi trancada com sucesso!`)
            }

        }

        function UnlockLotery() {
            if (db.get('Lotery.Close')) {
                db.delete('Lotery.Close');
                message.channel.send(`${e.Check} | A loteria foi destrancada com sucesso!`)
            } else {
                message.channel.send(`${e.Info} | A loteria já está destrancada.`)
            }
        }
    }
}
