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

        return message.reply(`${e.SaphireFeliz} | Quase terminando`)

        if (!args[0]) return message.reply(`${e.QuestionMark} | Você precisa dizer sua data de aniversário.`)
        if (args[3]) return message.reply(`${e.Deny} | Nada além da sua data de aniversário.`)

        let DataAtual = new Date()
        let DiaAtual = DataAtual.getDate()
        let MesAtual = DataAtual.getMonth() + 1
        let AnoAtual = DataAtual.getFullYear()

        let dia = parseInt(args[0])
        let mes = parseInt(args[1])
        let ano = parseInt(args[2])
        if (!dia || !mes || !ano) return message.reply(`${e.Info} | Segue esse formato -> **DD MM AAAA** | **26 06 1999**`)
        if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return message.reply(`${e.Deny} | Datas são **NÚMEROS**, ok?`)
        if (args[0].length !== 2) return message.reply(`${e.Deny} | Dias contém apenas 2 caractes, ele vão de 01 a 31`)
        if (args[1].length !== 2) return message.reply(`${e.Deny} | Meses contém apenas 2 caractes, ele vão de 01 a 12`)
        if (args[2].length !== 4) return message.reply(`${e.Deny} | Os anos válidos estão entre 1910 e 2015`)

        // Dia
        if (dia > 31 || dia < 1) return message.reply(`${e.Deny} | Hey, fala um dia do mês! Eu acho que os meses começa no dia 1 e termina no dia 31`)

        // Mês
        if (mes > 12 || mes < 1) return message.reply(`${e.Deny} | Quantos meses tem seu ano?`)
        if (dia > 28 && mes === 02) return message.reply(`${e.Deny} | Fevereiro não tem mais de 28 dias`)
        if ((dia >= 31) && ['04', '06', '09', '11'].includes(args[1])) return message.reply(`${e.Deny} | Esse mês não tem o dia 31, baka.`)

        // Ano
        if (ano > AnoAtual || ano < 1500) return message.reply(`${e.Deny} | Os anos válidos estão entre 1920 e 2021`)

        let Meses = ''
        let Idade = AnoAtual - ano
        if ((MesAtual === mes && DiaAtual < dia) || (MesAtual < mes)) Idade--
        if (Idade < 0) Idade = 0
        if (Idade >= 1) Meses = MesAtual - 1
        if (Meses < 0) return message.reply(`${e.Deny} | Este ser ainda não nasceu.`)

        if (Idade === 0) {
            if (mes > MesAtual) return message.reply(`${e.Deny} | Este serzinho ainda não nasceu.`)
            Meses = MesAtual - mes
        }

        let Semanas = Meses * 4
        let Dias = (Idade * 365) - 8
        let Horas = Dias * 24 // 720 = 24 * 30
        let Minutos = Horas * 60

        try {
            return message.reply(`${e.Nagatoro} | Você tem ${Idade} anos, ${Meses} meses, ${Semanas} semanas, ${Dias} dias, ${Horas} horas e ${Minutos} minutos de vida.`).catch(err => { })
        } catch (err) { return message.reply(`${e.Deny} | Error: \`${err}\``) }
    }
}