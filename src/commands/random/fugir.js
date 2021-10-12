const ms = require("parse-ms")
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const Moeda = require("../../../Routes/functions/moeda")

module.exports = {
    name: 'fuga',
    aliases: ['fugir'],
    category: 'random',
    ClientPermissions: 'ADD_REACTIONS',
    emoji: `${e.PandaBag}`,
    usage: '<fugir>',
    description: 'Tente fugir da prisão',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (['info', 'help'].includes(args[0]?.toLowerCase())) return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#246FE0')
                    .setTitle(`${e.PandaBag} Comando Fugir`)
                    .setDescription('Tente fugir da cadeia, mas tome cuidado!')
                    .addField(`${e.Info} Informações`, `Você tem **30% de chance de fuga**. Caso fuja com sucesso, você será liberto(a) da prisão, caso seja pego na tentativa da fuga, você perderá entre \`1~20000\` ${Moeda(message)}`)
            ]
        })
           

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)
        let timeout2 = 2400000
        let PresoTimeout = db.get(`${message.author.id}.Timeouts.Preso`)
        if (PresoTimeout !== null && timeout2 - (Date.now() - PresoTimeout) > 0) {

            return message.reply(`${e.Warn} | Você está prestes a tentar fugir da penitenciária. Você pode ser preso novamente e perder dinheiro.\n${e.QuestionMark} | Você deseja tentar a fuga?`).then(msg => {
                db.set(`Request.${message.author.id}`, `${msg.url}`)
                msg.react('✅').catch(() => { }) // Check
                msg.react('❌').catch(() => { }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {
                        db.delete(`Request.${message.author.id}`)
                        let result = Math.floor(Math.random() * 100)
                        let amount = Math.floor(Math.random() * 20000)

                        if (result <= 30) {
                            db.delete(`${message.author.id}.Timeouts.Preso`)
                            return message.channel.send(`${e.Loading} | Fugindo da detenção...`).then(msg => {
                                setTimeout(() => { db.delete(`${message.author.id}.Timeouts.Preso`); msg.edit(`${e.Check} | ${message.author} fugiu da detenção com sucesso!`).catch(() => { }) })
                            })
                        } else {
                            db.set(`${message.author.id}.Timeouts.Preso`, Date.now())
                            return message.channel.send(`${e.Loading} | Fugindo da detenção...`).then(msg => {
                                setTimeout(() => { db.subtract(`Balance_${message.author.id}`, amount); msg.edit(`${e.Deny} | ${message.author} tentou fugir da cadeia e foi pego!\n${e.PandaProfit} -${amount} ${Moeda(message)}`).catch(() => { }) })
                            })
                        }

                    } else {
                        db.delete(`Request.${message.author.id}`)
                        msg.edit(`${e.Deny} | Fuga cancelada.`).catch(() => { })
                    }
                }).catch(() => {
                    db.delete(`Request.${message.author.id}`)
                    msg.edit(`${e.Deny} | Tempo expirado.`).catch(() => { })
                })

            })
        } else {
            return message.channel.send(`${e.Deny} | Você não está preso.`)
        }
    }
}