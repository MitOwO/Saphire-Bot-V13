const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'levelchannel',
    aliases: ['setlevelchannel', 'setlevel'],
    category: 'config',
    UserPermissions: 'MANAGE_GUILD',
    ClientPermissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
    emoji: `${e.ModShield}`,
    usage: '<levelchannel> [on/off]',
    description: 'Escolha um canal para eu notificar todos que passam de nível',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}`)
        let channel = message.mentions.channels.first() || message.channel
        let CanalAtual = db.get(`Servers.${message.guild.id}.XPChannel`)

        if (channel.id === CanalAtual) return message.reply(`${e.Info} | Este já é o canal de level up.`)

        return message.reply(`${e.QuestionMark} | Você deseja autenticar o canal ${channel} como Canal de Notificações de Level Up? `).then(msg => {
            db.set(`User.Request.${message.author.id}`, 'ON')
            msg.react('✅').catch(err => { return }) // 1º Embed
            msg.react('❌').catch(err => { return })

            let RequestFilter = (reaction, user) => { return reaction.emoji.name === '✅' && user.id === message.author.id }
            let ConfirmRequest = msg.createReactionCollector({ filter: RequestFilter, max: 1, time: 15000, errors: ['time', 'max'] })

            ConfirmRequest.on('collect', (reaction, user) => {
                msg.edit(`${e.Loading} | Entendido, espera um pouco enquanto eu arrumo umas coisas no meu banco de dados...`)
                message.channel.sendTyping().then(() => {
                    setTimeout(() => {
                        db.delete(`User.Request.${message.author.id}`)
                        db.set(`Servers.${message.guild.id}.XPChannel`, channel.id)
                        msg.edit(`${e.Check} | Request autenticada | ${message.channel.id}/${message.guild.id}/${message.author.id}`)
                        message.channel.send(`${e.CatJump} | Pode deixar comigo! Eu vou avisar no canal ${channel} sempre que alguém passar de level.`)
                    }, 5400)
                }).catch(err => {
                    db.delete(`User.Request.${message.author.id}`)
                    return message.channel.send(`${e.Attention} | Ocorreu um erro no processo deste comando.\n\`${err}\``)
                })
            })

            let CancelFilter = (reaction, user) => { return reaction.emoji.name === '❌' && user.id === message.author.id }
            let CancelSession = msg.createReactionCollector({ filter: CancelFilter, max: 1, time: 15000, errors: ['time', 'max'] })

            CancelSession.on('collect', (reaction, user) => {
                db.delete(`User.Request.${message.author.id}`)
                msg.edit(`${e.Deny} | Request cancelada. | ${message.author.id}`)
            })
            CancelSession.on('end', (reaction, user) => {
                db.delete(`User.Request.${message.author.id}`)
                msg.edit(`${e.Deny} | Request cancelada por tempo expirado. | ${message.author.id}`)
            })


        }).catch(err => {
            db.delete(`User.Request.${message.author.id}`)
            return message.reply(`${e.Attention} | Houve um erro ao executar este comando\n\`${err}\``)
        })
    }
}