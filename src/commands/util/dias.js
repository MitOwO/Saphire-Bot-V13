const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'dias',
    aliases: ['quantovivi', 'idade', 'tempodevida', 'tempovivido'],
    category: 'util',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: '⏲️',
    usage: '<dias> [anos]',
    description: 'Quanto tempo eu vivi?',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (!args[0]) return message.reply(`${e.QuestionMark} | Você precisa dizer quantos anos você tem.`)
        if (args[1]) return message.reply(`${e.Deny} | Nada além da sua idade`)

        let Anos = args[0]
        if (Anos.length > 2) return message.reply(`${e.Deny} | Idade com 2 dígitos, ok?`)
        if (isNaN(Anos)) return message.reply(`${e.Deny} | Essa idade não é um número.`)
        if (Anos < 1 || Anos > 100) return message.reply(`${e.Deny} | Por favooor, me fala uma idade entre 1~100, ok?`)

        let Meses = Anos * 12
        let Dias = Meses * 30
        let Horas = Dias * 744

        try {
            return message.reply(`${e.Nagatoro} | Você tem aproximadamente ${Meses} meses, ${Dias} dias e ${Horas} horas de vida.`).catch(err => { })
        } catch (err) { return message.reply(`${e.Deny} | Error: \`${err}\``) }
    }
}