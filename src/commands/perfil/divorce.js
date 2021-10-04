const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const Data = require('../../../Routes/functions/data')

module.exports = {
    name: 'divorcio',
    aliases: ['divórcio', 'divorce'],
    category: 'perfil',
    ClientPermissions: 'ADD_REACTIONS',
    emoji: '💔',
    usage: '<divorce>',
    description: 'Divórcie do seu casamento',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)
        if (!db.get(`${message.author.id}.Perfil.Marry`)) return message.reply(`${e.Deny} | Você não está em um relacionamento.`)
        let ParID = db.get(`${message.author.id}.Perfil.Marry`)

        return message.reply(`${e.QuestionMark} | Você deseja colocar um fim no seu casamento com <@${ParID}>?`).then(msg => {
            db.set(`Request.${message.author.id}`, `${msg.url}`)
            msg.react('✅').catch(err => { }) // Check
            msg.react('❌').catch(err => { }) // X

            const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

            msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                const reaction = collected.first()

                if (reaction.emoji.name === '✅') {
                    db.delete(`Request.${message.author.id}`)
                    Divorce()
                } else {
                    db.delete(`Request.${message.author.id}`)
                    msg.edit(`${e.Deny} | Comando cancelado.`)
                }
            }).catch(() => {
                db.delete(`Request.${message.author.id}`)
                msg.edit(`${e.Deny} | Comando cancelado por tempo expirado.`)
            })

            function Divorce() {
                db.delete(`${ParID}.Perfil.Marry`)
                db.delete(`${message.author.id}.Perfil.Marry`)

                msg.edit(`${e.Check} | Divórcio concluído! Você não está mais se relacionando com <@${ParID}>.\nDivórcio pedido em: \`${Data}\``)

                let Par = client.users.cache.get(ParID)
                Par ? Par.send(`${e.Info} | ${message.author} > ${message.author.tag} \`${message.author.id}\` < pôs um fim no casamento.\nDivórcio pedido em: \`${Data}\``).catch(() => { }) : ''
            }
        })
    }
}