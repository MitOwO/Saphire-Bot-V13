
const { e } = require('../../../Routes/emojis.json')
const Moeda = require('../../../Routes/functions/moeda')
const { config } = require('../../../Routes/config.json')

module.exports = {
    name: 'tickets',
    aliases: ['ticket', 'loteria', 'lotery'],
    category: 'economy2',
    emoji: '🎫',
    usage: '<tickets> [@user/id]',
    description: 'Confire as chances de ganhar na loteria',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (message.author.id === config.ownerId) {
            if (['lock', 'fechar', 'travar', 'close'].includes(args[0]?.toLowerCase())) return LockLotery()
            if (['unlock', 'abrir', 'destravar', 'open'].includes(args[0]?.toLowerCase())) return UnlockLotery()
        }

        if (db.get('Lotery.Close')) return message.reply(`${e.Deny} | A loteria não está aberta.`)

        let u = message.mentions.users.first() || client.users.cache.get(args[0]) || message.repliedUser || message.author
        let user = client.users.cache.get(u.id)
        // let tickets = db.get('Loteria.Users') || []
        let tickets = db.get('Loteria.Users').concat(db.get('Loteria.Users1') || [], db.get('Loteria.Users2') || [], db.get('Loteria.Users3') || [], db.get('Loteria.Users4') || [], db.get('Loteria.Users5') || [], db.get('Loteria.Users6') || [], db.get('Loteria.Users7') || [], db.get('Loteria.Users8') || [], db.get('Loteria.Users9') || [], db.get('Loteria.Users10') || [], db.get('Loteria.Users11') || [], db.get('Loteria.Users12') || [], db.get('Loteria.Users13') || [], db.get('Loteria.Users14') || [], db.get('Loteria.Users15') || [], db.get('Loteria.Users16') || [], db.get('Loteria.Users17') || [], db.get('Loteria.Users18') || [], db.get('Loteria.Users19') || [], db.get('Loteria.Users20') || [])

        let i = 0
        if (tickets) {
            tickets.forEach(tickets => {
                if (tickets === user.id) i++
            });
        }

        message.channel.send(`${e.PandaProfit} | ${user.username} comprou ${i} 🎫 tickets da loteria\n💰 | ${parseInt(((i / tickets?.length) * 100) || 0).toFixed(2)}% de chance de ganhar.\n🌐 | ${tickets?.length}/10000 🎫 tickets comprados ao todo\n${e.MoneyWings} | ${db.get('Loteria.Prize')?.toFixed(0) || 0} ${Moeda(message)} acumulados\n🏆 | Último vencedor(a): ${db.get('Loteria.LastWinner') || 'Ninguém | 0'} ${Moeda(message)}`)

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
