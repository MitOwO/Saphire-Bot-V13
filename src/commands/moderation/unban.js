const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'unban',
    aliases: ['desbanir', 'desban'],
    category: 'moderation',
    UserPermissions: 'BAN_MEMBERS',
    ClientPermissions: 'BAN_MEMBERS',
    emoji: `${e.ModShield}`,
    usage: '<unban> <id>',
    description: 'Desban membros banidos',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}`)
        if (!args[0]) return message.reply(`${e.Info} | Para desbanir um usuário, é necessário o ID dele. Para ver todos os membros banidos do servidor, use \`${prefix}ban list\`, basta copiar o ID e usar \`${prefix}unban ID [razão...(opicional)]\``)

        let reason = `${message.author.tag} diz: ${args.slice(1).join(" ")}`
        if (!reason) { reason = `${message.author.tag} não especificou nenhuma razão.` }
        let msgreason = args.slice(1).join(" ")
        if (!msgreason) msgreason = 'Sem motivo especificado'

        let ID = args[0]
        if (ID.length !== 18) return message.reply(`${e.Deny} | ID invalido. Todos os ID's possuem 18 caracteres, verique o ID informado.`)

        await message.guild.bans.fetch(ID).then(() => {
            return message.channel.send(`${e.QuestionMark} | Deseja desbanir o ID \`${ID}\` ?`).then(msg => {
                db.set(`User.Request.${message.author.id}`, 'ON')
                msg.react('✅').catch(err => { return }) // e.Check
                msg.react('❌').catch(err => { return }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {
                        message.guild.bans.remove(ID, reason).then(user => {
                            db.delete(`User.Request.${message.author.id}`)
                            return message.reply(`${e.Check} | Prontinho! Eu desbani ${user.username} com sucesso!`)
                        }).catch(err => { return message.channel.send(`${e.Attention} | O desban falhou! Caso você não saiba resolver o problema, use \`${prefix}bug\` e reporte o problema.\n\`${err}\``) })

                    } else {
                        db.delete(`User.Request.${message.author.id}`)
                        msg.edit(`${e.Check} | Request abortada | ${ID}/${message.author.id}/${message.guild.id}`)
                    }
                }).catch(() => {
                    db.delete(`User.Request.${message.author.id}`)
                    msg.edit(`${e.Check} | Request abortada: Tempo expirado | ${ID}/${message.author.id}/${message.guild.id}`)
                })

            })
        }).catch(() => { return message.reply(`${e.Deny} | Este ID não existe ou não está banido.`) })
    }
}