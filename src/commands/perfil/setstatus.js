const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'setstatus',
    aliases: ['status'],
    category: 'perfil',
    ClientPermissions: 'ADD_REACTIONS',
    emoji: '✍️',
    usage: '<setstatus> <Seu Novo Status>',
    description: 'Escolha um título grandioso',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {
        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

        if (!args[0]) return message.reply(`${e.SaphireObs} | Você precisa me dizer qual o seu novo status.`)

        let NewStatus = args.join(' ')
        if (NewStatus.length > 140) { return message.reply(`${e.Deny} | O status não pode ultrapassar **140 caracteres**`) }

        let status = db.get(`${message.author.id}.Perfil.Status`)
        if (status === NewStatus) return message.reply(`${e.Info} | Este já é o seu status.`)

        return message.reply(`${e.QuestionMark} | Deseja alterar seu status para:\n**${NewStatus}**`).then(msg => {
            db.set(`Request.${message.author.id}`, `${msg.url}`)
            msg.react('✅').catch(err => { }) // Check
            msg.react('❌').catch(err => { }) // X

            const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

            msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                const reaction = collected.first()

                if (reaction.emoji.name === '✅') {
                    db.delete(`Request.${message.author.id}`)
                    db.set(`${message.author.id}.Perfil.Status`, NewStatus)
                    msg.edit(`${e.Check} | Você alterou seu status com sucesso! Confira usando \`${prefix}perfil\``)
                } else {
                    db.delete(`Request.${message.author.id}`)
                    msg.edit(`${e.Deny} | Request cancelada.`)
                }
            }).catch(() => {
                db.delete(`Request.${message.author.id}`)
                msg.edit(`${e.Deny} | Request cancelada por tempo expirado.`)
            })
        })
    }

}