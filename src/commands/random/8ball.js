const { e } = require('../../../Routes/emojis.json')
const { f } = require("../../../Routes/frases.json")

module.exports = {
    name: '8ball',
    aliases: ['pergunta', 'pgt'],
    category: 'random',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: '🎱',
    usage: '<random> <pergunta>',
    description: 'Pergunta que eu respondo',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let respostas = f['8Ball'][Math.floor(Math.random() * f['8Ball'].length)]
        let pergunta = args.join(" ")
        if (!pergunta) { return message.reply(`${e.QuestionMark} | O que você quer que eu responda?`) }
        if (!pergunta.endsWith('?')) return message.reply(`${e.QuestionMark} | Certeza que isso é uma pergunta?`)

        return message.reply(`Humm...`).then(msg => {
            setTimeout(function () { msg.edit(`:8ball: | ${respostas}`).catch(err => { return }) }, 2000)
        })
    }
}