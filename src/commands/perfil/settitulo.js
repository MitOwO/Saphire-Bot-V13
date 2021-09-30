const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'settitulo',
    aliases: ['titulo', 'settitle', 'title', 'título'],
    category: 'perfil',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: '🔰',
    usage: '<setitulo> <Seu Título>',
    description: 'Escolha um título grandioso',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {
        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

        db.get(`${message.author.id}.Perfil.TitlePerm`) ? AlterarTitulo() : message.reply(`${e.Deny} | Você não tem a permissão 🔰 **Título**. Você pode compra-la na \`${prefix}loja\``)

        function AlterarTitulo() {

            if (!args[0]) return message.reply(`${e.SaphireObs} | Você precisa me dizer qual o seu novo título.`)

            let NewTitle = args.join(' ')
            if (NewTitle.length > 20) { return message.reply(`${e.Deny} | O título não pode ultrapassar **20 caracteres**`) }

            if (NewTitle === db.get(`${message.author.id}.Perfil.Titulo`)) return message.reply(`${e.Info} | Este já é o seu Título atual.`)

            return message.reply(`${e.QuestionMark} | Deseja alterar seu título para: **${NewTitle}** ?`).then(msg => {
                db.set(`Request.${message.author.id}`, `${msg.url}`)
                msg.react('✅').catch(err => { }) // Check
                msg.react('❌').catch(err => { }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {
                        db.delete(`Request.${message.author.id}`)
                        db.set(`${message.author.id}.Perfil.Titulo`, NewTitle)
                        msg.edit(`${e.Check} | Você alterou seu título com sucesso! Confira usando \`${prefix}perfil\``)
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
}