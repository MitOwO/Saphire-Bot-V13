const { e } = require('../../../database/emojis.json')
const { f } = require('../../../database/frases.json')
const Moeda = require('../../../Routes/functions/moeda')
const Data = require('../../../Routes/functions/data')
const Error = require('../../../Routes/functions/errors')
const { default: Users } = require('node-os-utils/lib/users')

module.exports = {
    name: 'pagar',
    aliases: ['pay', 'transferir'],
    category: 'economy',
    ClientPermissions: 'ADD_REACTIONS',
    emoji: `${e.Coin}`,
    usage: '<pay> <@user> <quantia/all>',
    description: 'Pague outras pessoas',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        const noargs = new MessageEmbed()
            .setColor('#246FE0')
            .setTitle('💸 Sistema de Pagamento')
            .setDescription(`Pague a galera, é simples e rápido!\n \n${e.Warn} *Dinheiro perdido não serão recuperados. Cuidado para não ser enganado*`)
            .addField(`${e.On} Comando`, `\`${prefix}pay <@user/id> <quantia/all>\``)
            .setFooter('Apenas o dinheiro na carteira será válido para pagamentos.')

        if (request) return message.reply(`${e.Deny} | ${f.Request}${sdb.get(`Request.${message.author.id}`)}`)

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[1]) || message.mentions.repliedUser
        if (!isNaN(args[0]) && !user) return message.reply(`${e.Deny} | Eu não encontrei ninguém com esse no servidor...`)
        if (!user) return message.reply({ embeds: [noargs] })
        if (user.id === client.user.id) return message.reply(`${e.HiNagatoro} | Preciso não coisa fofa, eu já sou rica.`)
        if (user.id === message.author.id) return message.reply(`${e.Deny} | Nada de pagar você mesmo.`)
        if (user.bot) return message.reply(`${e.Deny} | Nada de bots.`)

        let money = db.get(`Balance_${message.author.id}`) || 0
        if (money <= 0) return message.reply(`${e.Deny} | Você não possui dinheiro na carteira. Que tal um \`${prefix}pix\`.`)

        let quantia = args[1]?.replace(/k/g, '000')
        !isNaN(quantia) ? (quantia = quantia) : (quantia = args[0]?.replace(/k/g, '000'))
        if (message.guild.members.cache.get(args[0])) quantia = args[1]?.replace(/k/g, '000') || 0
        if (message.guild.members.cache.get(args[1])) quantia = args[0]?.replace(/k/g, '000') || 0
        if (['all', 'tudo'].includes(args[0]?.toLowerCase()) || ['all', 'tudo'].includes(args[1]?.toLowerCase())) quantia = money
        if (!quantia) return message.reply(`${e.Deny} | Só faltou dizer o valor do pagamento`)
        if (isNaN(quantia)) return message.reply(`${e.Deny} | **${quantia}** | A quantia deve ser um número.`)
        if (quantia > money) return message.reply(`${e.Deny} | Você não tem essa quantia na sua carteira.`)
        if (quantia <= 0) return message.reply(`${e.Deny} | Você não pode fazer um pagamento menor que 1 ${Moeda(message)}, baaaaka.`)

        let UsersPay = []
        sdb.add(`Users.${message.author.id}.Cache.Pay`, parseInt(quantia))
        db.subtract(`Balance_${message.author.id}`, parseInt(quantia))

        return message.reply(`${e.QuestionMark} | ${message.author} e ${user}, vocês confirmam a transferência?\n${sdb.get(`Users.${message.author.id}.EmojiAuthor`) || `${e.Loading}`} | \`${message.author.tag}\` **-${quantia} ${Moeda(message)}**\n${sdb.get(`Users.${message.author.id}.EmojiUser`) || `${e.Loading}`} | \`${user.user.tag}\` **+${quantia} ${Moeda(message)}**`).then(msg => {
            msg.react('✅').catch(() => { }) // Check
            msg.react('❌').catch(() => { }) // X

            const PaymentFilter = (reaction, u) => { return reaction.emoji.name === '✅' && u.id === u.id; };
            const PaymentCollector = msg.createReactionCollector({ filter: PaymentFilter, time: 60000 });

            const DeniedPaymentFilter = (reaction, us) => { return reaction.emoji.name === '❌' && (us.id === message.author.id || us.id === user.id); };
            const DeniedPaymentCollector = msg.createReactionCollector({ filter: DeniedPaymentFilter, max: 1, time: 60000 });

            PaymentCollector.on('collect', (reaction, u) => {
                UsersPay.push(`${u.id}`)

                switch (u.id) {
                    case user.id:
                        sdb.set(`Users.${message.author.id}.EmojiUser`, e.Check)
                        msg.edit(`${e.QuestionMark} | ${message.author} e ${user}, vocês confirmam a transferência?\n${sdb.get(`Users.${message.author.id}.EmojiAuthor`) || `${e.Loading}`} | \`${message.author.tag}\` **-${quantia} ${Moeda(message)}**\n${sdb.get(`Users.${message.author.id}.EmojiUser`) || `${e.Check}`} | \`${user.user.tag}\` **+${quantia} ${Moeda(message)}**`).catch(() => { })
                        break;
                    case message.author.id:
                        sdb.set(`Users.${message.author.id}.EmojiAuthor`, e.Check)
                        msg.edit(`${e.QuestionMark} | ${message.author} e ${user}, vocês confirmam a transferência?\n${sdb.get(`Users.${message.author.id}.EmojiAuthor`) || `${e.Check}`} | \`${message.author.tag}\` **-${quantia} ${Moeda(message)}**\n${sdb.get(`Users.${message.author.id}.EmojiUser`) || `${e.Loading}`} | \`${user.user.tag}\` **+${quantia} ${Moeda(message)}**`).catch(() => { })
                        break;
                    default: break;
                }

                if (UsersPay.includes(`${user.id}`) && UsersPay.includes(`${message.author.id}`)) {
                    sdb.set(`Users.${message.author.id}.Allowed`, true)
                    PaymentCollector.stop()
                }
            })

            PaymentCollector.on('end', () => {
                sdb.get(`Users.${message.author.id}.Allowed`) ? NewPaymentStart(msg) : CancelPayment(msg)
            })

            DeniedPaymentCollector.on('collect', (r, u) => {
                if (u.id === client.user.id) return

                if (u.id === user.id)
                    sdb.set(`Users.${message.author.id}.EmojiUser`, e.Deny)

                if (u.id === message.author.id)
                    sdb.set(`Users.${message.author.id}.EmojiAuthor`, e.Deny)
                PaymentCollector.stop()
                DeniedPaymentCollector.stop()
            })

        }).catch(err => {
            Error(message, err)
            message.channel.send(`${e.SaphireCry} | Ocorreu um erro durante o processo. Por favor, reporte o ocorrido usando \`${prefix}bug\`\n\`${err}\``)
        })

        function NewPaymentStart(msg) {
            msg.reactions.removeAll().catch(() => { })
            msg.edit(`${e.Check} | Transferência realizada com sucesso!\n${(sdb.get(`Users.${message.author.id}.EmojiAuthor`) ? sdb.get(`Users.${message.author.id}.EmojiAuthor`) : e.Check)} | \`${message.author.tag}\` **-${quantia} ${Moeda(message)}**\n${(sdb.get(`Users.${message.author.id}.EmojiUser`) ? sdb.get(`Users.${message.author.id}.EmojiUser`) : e.Check)} | \`${user.user.tag}\` **+${quantia} ${Moeda(message)}**\n⏱️ | \`${Data()}\``).catch(() => { })
            sdb.delete(`Request.${message.author.id}`)
            db.add(`Balance_${user.id}`, (sdb.get(`Users.${message.author.id}.Cache.Pay`) || 0))
            sdb.delete(`Users.${message.author.id}.Allowed`)
            sdb.delete(`Users.${message.author.id}.Cache.Pay`)
            sdb.delete(`Users.${message.author.id}.EmojiUser`)
            sdb.delete(`Users.${message.author.id}.EmojiAuthor`)
        }

        function CancelPayment(msg) {
            msg.reactions.removeAll().catch(() => { })
            msg.edit(`${e.Deny} | Transferência cancelada!\n${(sdb.get(`Users.${message.author.id}.EmojiAuthor`) ? sdb.get(`Users.${message.author.id}.EmojiAuthor`) : '❔')} | \`${message.author.tag}\` **+0 ${Moeda(message)}**\n${(sdb.get(`Users.${message.author.id}.EmojiUser`) ? sdb.get(`Users.${message.author.id}.EmojiUser`) : '❔')} | \`${user.user.tag}\` **+0 ${Moeda(message)}**`).catch(() => { })
            db.add(`Balance_${message.author.id}`, (sdb.get(`Users.${message.author.id}.Cache.Pay`) || 0))
            sdb.delete(`Request.${message.author.id}`)
            sdb.delete(`Users.${message.author.id}.Allowed`)
            sdb.delete(`Users.${message.author.id}.Cache.Pay`)
            sdb.delete(`Users.${message.author.id}.EmojiUser`)
            sdb.delete(`Users.${message.author.id}.EmojiAuthor`)
        }
    }
}