const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'noreact',
    aliases: ['semreação', 'nomentions', 'nmarca', 'nomention'],
    category: 'config',
    UserPermissions: '',
    ClientPermissions: 'ADD_REACTIONS',
    emoji: `${e.Deny}`,
    usage: '<noreact>',
    description: 'Bloqueie todos de usarem comandos de interação com você',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)
        let ReactStats = db.get(`${message.author.id}.NoReact`)

        function NoReact() {
            return message.reply(`${e.QuestionMark} | Deseja bloquear a interação dos comandos da categoria \`interação\`?`).then(msg => {
                db.set(`Request.${message.author.id}`, `${msg.url}`)
                msg.react('✅').catch(() => { }) // Check
                msg.react('❌').catch(() => { }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {
                        db.delete(`Request.${message.author.id}`)
                        db.set(`${message.author.id}.NoReact`, true)
                        msg.edit(`${e.Check} | Feito! Ninguém mais vai interagir com você usando os meus comandos da categoria \`Interação\``).catch(() => { })
                    } else {
                        db.delete(`Request.${message.author.id}`)
                        msg.edit(`${e.Deny} | Request cancelada | ${message.author.id}`).catch(() => { })
                    }
                }).catch(() => {
                    db.delete(`Request.${message.author.id}`)
                    msg.edit(`${e.Deny} | Request cancelada: Tempo expirado | ${message.author.id}`).catch(() => { })
                })
            })
        }

        function React() {
            return message.reply(`${e.QuestionMark} | Deseja retirar o bloqueio de interação?`).then(msg => {
                db.set(`Request.${message.author.id}`, `${msg.url}`)
                msg.react('✅').catch(() => { }) // Check
                msg.react('❌').catch(() => { }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {
                        db.delete(`Request.${message.author.id}`)
                        db.delete(`${message.author.id}.NoReact`)
                        msg.edit(`${e.Check} | Feito! Bloqueio retirados de todos comandos da categoria \`Interação\``).catch(() => { })
                    } else {
                        db.delete(`Request.${message.author.id}`)
                        msg.edit(`${e.Deny} | Request cancelada | ${message.author.id}`).catch(() => { })
                    }
                }).catch(() => {
                    db.delete(`Request.${message.author.id}`)
                    msg.edit(`${e.Deny} | Request cancelada: Tempo expirado | ${message.author.id}`).catch(() => { })
                })
            })
        }

        ReactStats ? React() : NoReact()
    }
}