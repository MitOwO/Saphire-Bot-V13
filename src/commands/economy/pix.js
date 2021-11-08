const { e } = require('../../../database/emojis.json')
const ms = require('parse-ms')
const Moeda = require('../../../Routes/functions/moeda')
const { f } = require('../../../database/frases.json')

module.exports = {
    name: 'pix',
    category: 'economy',
    ClientPermissions: 'ADD_REACTIONS',
    emoji: `${e.Pix}`,
    usage: '<pix> <user/id> <quantia>',
    description: 'Faça um Pix direto pro banco de alguém.',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${sdb.get(`Request.${message.author.id}`)}`)
        if (['info', 'help', 'ajuda'].includes(args[0]?.toLowerCase())) return InfoPix()

        let user = message.mentions.users.first() || await client.users.cache.get(args[0]) || await client.users.cache.get(args[1]) || message.mentions.repliedUser
        if (!isNaN(args[0]) && !user) return message.reply(`${e.Deny} | Eu não encontrei ninguém com esse ID...`)
        if (!user) return message.reply(`${e.Pix} | Transfira dinheiro de banco para banco, evitando roubos e assaltos. É assim olha: \`${prefix}pix <@user/id> <quantia>\``)
        if (user.id === client.user.id) return message.reply(`${e.HiNagatoro} | Preciso não coisa fofa, eu já sou rica.`)
        if (user.id === message.author.id) return message.reply(`${e.Deny} | Nada de pix para você mesmo.`)
        if (user.bot) return message.reply(`${e.Deny} | Nada de bots.`)

        let money = parseInt(db.get(`Bank_${message.author.id}`)) || 0
        if (money <= 0) return message.reply(`${e.Deny} | Você não possui dinheiro no banco para fazer Pix.`)

        let quantia = parseInt(args[1]?.replace(/k/g, '000'))
        !isNaN(quantia) ? (quantia = quantia) : (quantia = parseInt(args[0]?.replace(/k/g, '000')))

        if (['all', 'tudo'].includes(args[0]?.toLowerCase()) || ['all', 'tudo'].includes(args[1]?.toLowerCase())) quantia = money || 0
        if (!quantia) return message.reply(`${e.Deny} | Só faltou dizer o valor do pix`)
        if (isNaN(quantia)) return message.reply(`${e.Deny} | **${quantia}** | A quantia deve ser um número.`)
        if (quantia > money) return message.reply(`${e.Deny} | Você não tem essa quantia no seu banco.`)
        if (quantia <= 0) return message.reply(`${e.Deny} | Você não pode fazer um pix menor que 1 ${Moeda(message)}, baaaaka.`)
        sdb.add(`Users.${message.author.id}.Cache.Pix`, quantia)
        db.subtract(`Bank_${message.author.id}`, quantia)

        return message.reply(`${e.Pix} | Você confirma a Transação PIX no valor de **${sdb.get(`Users.${message.author.id}.Cache.Pix`)} ${Moeda(message)}** para ${user.username}?`).then(msg => {
            sdb.set(`Request.${message.author.id}`, `${msg.url}`)
            msg.react('✅').catch(() => { }) // Check
            msg.react('❌').catch(() => { }) // X

            const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }
            msg.awaitReactions({ filter, max: 1, time: 20000, errors: ['time'] }).then(collected => {
                const reaction = collected.first()
                sdb.delete(`Request.${message.author.id}`)

                if (reaction.emoji.name === '✅') { NewPix(msg) } else { PixCancel(msg) }
            }).catch(() => {
                sdb.delete(`Request.${message.author.id}`)
                PixTimeout(msg)
            })
        })

        function NewPix(msg) {
            db.add(`Bank_${user.id}`, (sdb.get(`Users.${message.author.id}.Cache.Pix`) || 0))
            msg.edit(`${e.Pix} | Transação PIX efetuada com sucesso!\n${e.PandaProfit} Stats\n${message.author.tag} -${sdb.get(`Users.${message.author.id}.Cache.Pix`) || 0} ${Moeda(message)}\n${user.username} +${sdb.get(`Users.${message.author.id}.Cache.Pix`) || 0} ${Moeda(message)}`).catch(() => { })
            sdb.set(`Users.${message.author.id}.Cache.Pix`, 0)
        }

        function PixCancel(msg) {
            db.add(`Bank_${message.author.id}`, (sdb.get(`Users.${message.author.id}.Cache.Pix`) || 0))
            sdb.set(`Users.${message.author.id}.Cache.Pix`, 0)

            return msg.edit(`${e.Deny} | Transação PIX cancelada.`)
        }

        function PixTimeout(msg) {
            db.add(`Bank_${message.author.id}`, (sdb.get(`Users.${message.author.id}.Cache.Pix`) || 0))
            sdb.set(`Users.${message.author.id}.Cache.Pix`, 0)

            return msg.edit(`${e.Deny} | Transação PIX cancelada por tempo expirado.`)
        }

        function InfoPix() {
            const PixEmbed = new MessageEmbed().setColor('#00BDAE').setTitle(`${e.Pix} ${client.user.username} PIX`).setDescription(`${e.SaphireObs} Com o comando \`${prefix}pix\`, você pode fazer uma transferência de banco para banco.`).addField(`- Comando`, `\`${prefix}pix <@user/Id> <quantia>\``)
            return message.reply({ embeds: [PixEmbed] })
        }
    }
}