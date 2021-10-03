const { e } = require('../../../Routes/emojis.json')
const Colors = require('../../../Routes/functions/colors')
const ms = require('parse-ms')

// #246FE0 - Azul Saphire
module.exports = {
    name: 'cooldown',
    aliases: ['cd', 'timeouts', 'tm'],
    category: 'util',
    emoji: '⏱️',
    usage: '<cooldown> <@user/id>',
    description: 'Verifique os seus tempos',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let user = message.mentions.members.first() || message.mentions.repliedUser || message.guild.members.cache.get(args[0]) || client.users.cache.get(args[0]) || message.member
        if (!user) return message.reply(`${e.Deny} | Eu não achei, o que será que aconteceu?`)

        let TPreso, TDaily, TPig, TWork, TRestoreDividas, TCu
        let Dpn = `${e.Check} \`Disponível\``

        // Timeout Preso
        let TempoPreso = ms(1500000 - (Date.now() - db.get(`${user.id}.Timeouts.Preso`)))
        if (db.get(`${user.id}.Timeouts.Preso`) !== null && 1500000 - (Date.now() - db.get(`${user.id}.Timeouts.Preso`)) > 0) {
            TPreso = `${e.Loading} \`${TempoPreso.minutes}m e ${TempoPreso.seconds}s\``
        } else { TPreso = Dpn }

        // Timeout Daily
        let TimeDaily = ms(86400000 - (Date.now() - db.get(`${user.id}.Timeouts.Daily`)))
        if (db.get(`${user.id}.Timeouts.Daily`) !== null && 86400000 - (Date.now() - db.get(`${user.id}.Timeouts.Daily`)) > 0) {
            TDaily = `${e.Loading} \`${TimeDaily.hours}h, ${TimeDaily.minutes}m, e ${TimeDaily.seconds}s\``
        } else { TDaily = Dpn }

        // Timeout Pig
        let TimePig = ms(30000 - (Date.now() - db.get(`${user.id}.Timeouts.Porquinho`)))
        if (db.get(`${user.id}.Timeouts.Porquinho`) !== null && 30000 - (Date.now() - db.get(`${user.id}.Timeouts.Porquinho`)) > 0) {
            TPig = `${e.Loading} \`${TimePig.seconds}s\``
        } else { TPig = Dpn }

        // Timeout Work
        let TimeWork = ms(66400000 - (Date.now() - db.get(`${user.id}.Timeouts.Work`)))
        if (db.get(`${user.id}.Timeouts.Work`) !== null && 66400000 - (Date.now() - db.get(`${user.id}.Timeouts.Work`)) > 0) {
            TWork = `${e.Loading} \`${TimeWork.hours}h, ${TimeWork.minutes}m, e ${TimeWork.seconds}s\``
        } else { TWork = Dpn }

        // Timeout RestoreDividas
        let TimeRestoreDividas = ms(86400000 - (Date.now() - db.get(`Client.Timeouts.RestoreDividas`)))
        if (db.get(`Client.Timeouts.RestoreDividas`) !== null && 86400000 - (Date.now() - db.get(`Client.Timeouts.RestoreDividas`)) > 0) {
            TRestoreDividas = `${e.Loading} \`${TimeRestoreDividas.hours}h, ${TimeRestoreDividas.minutes}m, e ${TimeRestoreDividas.seconds}s\``
        } else { TRestoreDividas = Dpn }

        // Timeout Cu
        let TimeCu = ms(600000 - (Date.now() - db.get(`${user.id}.Timeouts.Cu`)))
        if (db.get(`${user.id}.Timeouts.Cu`) !== null && 600000 - (Date.now() - db.get(`${user.id}.Timeouts.Cu`)) > 0) {
            TCu = `${e.Loading} \`${TimeCu.minutes}m e ${TimeCu.seconds}s\``
        } else { TCu = Dpn }

        const Embed = new MessageEmbed()
            .setColor(Colors(user))
            .setTitle(`⏱️ ${client.user.username} Timeouts`)
            .setDescription('Aqui você pode conferir todos os timeouts.')
            .addFields(
                {
                    name: 'Preso',
                    value: TPreso
                },
                {
                    name: `${prefix}daily`,
                    value: TDaily
                },
                {
                    name: `${prefix}pig`,
                    value: TPig
                },
                {
                    name: `${prefix}work`,
                    value: TWork
                },
                {
                    name: `${prefix}cu`,
                    value: TCu
                },
                {
                    name: `Restaurar Dívida`,
                    value: TRestoreDividas
                },
            )
        return message.reply({ embeds: [Embed] })
    }
}