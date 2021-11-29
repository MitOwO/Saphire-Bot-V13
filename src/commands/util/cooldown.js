const Colors = require('../../../Routes/functions/colors'),
    ms = require('parse-ms'),
    { DatabaseObj: { e } } = require('../../../Routes/functions/database')

// #246FE0 - Azul Saphire
module.exports = {
    name: 'cooldown',
    aliases: ['cd', 'timeouts', 'tm'],
    category: 'util',
    emoji: '⏱️',
    usage: '<cooldown> <@user/id>',
    description: 'Verifique os seus tempos',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let user = message.mentions.users.first() || message.mentions.repliedUser || client.users.cache.get(args[0]) || message.author
        if (!user) return message.reply(`${e.Deny} | Eu não achei, o que será que aconteceu?`)

        let Dpn, TPreso, TDaily, TPig, TWork, TRestoreDividas, TCu, TRoleta, TCrime, TBit, TLikes, THelpier, TWeek, TMonth, TReact, TAssalto, TRob, TBolsa, TVip

        const CooldownObj = {
            Preso: sdb.get(`Users.${user.id}.Timeouts.Preso`) || null,
            Daily: sdb.get(`Users.${user.id}.Timeouts.Daily`) || null,
            Porquinho: sdb.get(`Users.${user.id}.Timeouts.Porquinho`) || null,
            Work: sdb.get(`Users.${user.id}.Timeouts.Work`) || null,
            Monthly: sdb.get(`Users.${user.id}.Timeouts.Monthly`) || null,
            Weekly: sdb.get(`Users.${user.id}.Timeouts.Weekly`) || null,
            Cu: sdb.get(`Users.${user.id}.Timeouts.Cu`) || null,
            Roleta: sdb.get(`Users.${user.id}.Timeouts.Roleta`) || null,
            Roubo: sdb.get(`Users.${user.id}.Timeouts.Roubo`) || null,
            Assalto: sdb.get(`Users.${user.id}.Timeouts.Assalto`) || null,
            Bitcoin: sdb.get(`Users.${user.id}.Timeouts.Bitcoin`) || null,
            Rep: sdb.get(`Users.${user.id}.Timeouts.Rep`) || null,
            Crime: sdb.get(`Users.${user.id}.Timeouts.Crime`) || null,
            Bolsa: sdb.get(`Users.${user.id}.Timeouts.Bolsa`) || null,
            Helpier: sdb.get(`Users.${user.id}.Timeouts.Helpier`) || null,
            Vip: {
                DateNow: sdb.get(`Users.${user.id}.Timeouts.Vip.DateNow`) || null,
                TimeRemaing: sdb.get(`Users.${user.id}.Timeouts.Vip.TimeRemaing`) || 0,
                Permanent: sdb.get(`Users.${user.id}.Timeouts.Vip.Permanent`)
            }
        }

        const { Preso, Daily, Porquinho, Work, Monthly, Weekly, Cu, Roleta, Roubo, Assalto, Bitcoin, Rep, Crime, Bolsa, Helpier, Vip } = CooldownObj

        Dpn = `${e.Check} \`Disponível\``
        // Timeout Preso
        let TempoPreso = ms(1500000 - (Date.now() - Preso))
        if (Preso !== null && 1500000 - (Date.now() - Preso) > 0) {
            TPreso = `${e.Loading} \`${TempoPreso.minutes}m e ${TempoPreso.seconds}s\``
        } else { sdb.delete(`Users.${user.id}.Timeouts.Preso`); TPreso = `${e.Check} Livre` }

        // Timeout Daily
        let TimeDaily = ms(86400000 - (Date.now() - Daily))
        if (Daily !== null && 86400000 - (Date.now() - Daily) > 0) {
            TDaily = `${e.Loading} \`${TimeDaily.hours}h, ${TimeDaily.minutes}m, e ${TimeDaily.seconds}s\``
        } else { sdb.delete(`Users.${user.id}.Timeouts.Daily`); TDaily = Dpn }

        // Timeout Pig
        let TimePig = ms(30000 - (Date.now() - Porquinho))
        if (Porquinho !== null && 30000 - (Date.now() - Porquinho) > 0) {
            TPig = `${e.Loading} \`${TimePig.seconds}s\``
        } else { sdb.delete(`Users.${user.id}.Timeouts.Porquinho`); TPig = Dpn }

        // Timeout Work
        let TimeWork = ms(66400000 - (Date.now() - Work))
        if (Work !== null && 66400000 - (Date.now() - Work) > 0) {
            TWork = `${e.Loading} \`${TimeWork.hours}h, ${TimeWork.minutes}m, e ${TimeWork.seconds}s\``
        } else { sdb.delete(`Users.${user.id}.Timeouts.Work`); TWork = Dpn }

        // Timeout RestoreDividas
        let TimeRestoreDividas = ms(86400000 - (Date.now() - sdb.get(`Client.Timeouts.RestoreDividas`)))
        if (sdb.get(`Client.Timeouts.RestoreDividas`) !== null && 86400000 - (Date.now() - sdb.get(`Client.Timeouts.RestoreDividas`)) > 0) {
            TRestoreDividas = `${e.Loading} \`${TimeRestoreDividas.hours}h, ${TimeRestoreDividas.minutes}m, e ${TimeRestoreDividas.seconds}s\``
        } else { sdb.delete(`Client.Timeouts.RestoreDividas`); TRestoreDividas = Dpn }

        // Timeout Cu
        let TimeCu = ms(600000 - (Date.now() - Cu))
        if (Cu !== null && 600000 - (Date.now() - Cu) > 0) {
            TCu = `${e.Loading} \`${TimeCu.minutes}m e ${TimeCu.seconds}s\``
        } else { sdb.delete(`Users.${user.id}.Timeouts.Cu`); TCu = Dpn }

        // Timeout Roleta
        let TimeRoleta = ms(1200000 - (Date.now() - Roleta))
        if (Roleta !== null && 1200000 - (Date.now() - Roleta) > 0) {
            TRoleta = `${e.Loading} \`${TimeRoleta.minutes}m e ${TimeRoleta.seconds}s\``
        } else { sdb.delete(`Users.${user.id}.Timeouts.Roleta`); TRoleta = Dpn }

        // Timeout Crime
        let TimeCrime = ms(1200000 - (Date.now() - Crime))
        if (Crime !== null && 1200000 - (Date.now() - Crime) > 0) {
            TCrime = `${e.Loading} \`${TimeCrime.minutes}m e ${TimeCrime.seconds}s\``
        } else { sdb.delete(`Users.${user.id}.Timeouts.Crime`); TCrime = Dpn }

        // Timeout Bitcoin
        let TimeBitcoin = ms(7200000 - (Date.now() - Bitcoin))
        if (Bitcoin !== null && 7200000 - (Date.now() - Bitcoin) > 0) {
            TBit = `${e.Loading} \`${TimeBitcoin.hours}h ${TimeBitcoin.minutes}m e ${TimeBitcoin.seconds}s\``
        } else { sdb.delete(`Users.${user.id}.Timeouts.Bitcoin`); TBit = Dpn }

        // Timeout Likes
        let TimeLikes = ms(1800000 - (Date.now() - Rep))
        if (Rep !== null && 1800000 - (Date.now() - Rep) > 0) {
            TLikes = `${e.Loading} \`${TimeLikes.minutes}m e ${TimeLikes.seconds}s\``
        } else { sdb.delete(`Users.${user.id}.Timeouts.Rep`); TLikes = Dpn }

        // Timeout Helpier
        let TimeHelpier = ms(604800000 - (Date.now() - Helpier))
        if (Helpier !== null && 604800000 - (Date.now() - Helpier) > 0) {
            THelpier = `${e.Loading} \`${TimeHelpier.days}d ${TimeHelpier.hours}h ${TimeHelpier.minutes}m e ${TimeHelpier.seconds}s\``
        } else { sdb.delete(`Users.${user.id}.Timeouts.Helpier`); THelpier = `${e.Deny} \`Indisponível\`` }

        // Timeout Semanal
        let TimeWeek = ms(604800000 - (Date.now() - Weekly))
        if (Weekly !== null && 604800000 - (Date.now() - Weekly) > 0) {
            TWeek = `${e.Loading} \`${TimeWeek.days}d ${TimeWeek.hours}h ${TimeWeek.minutes}m e ${TimeWeek.seconds}s\``
        } else { sdb.delete(`Users.${user.id}.Timeouts.Weekly`); TWeek = Dpn }

        // Timeout Mensal
        let TimeMonth = ms(2592000000 - (Date.now() - Monthly))
        if (Monthly !== null && 2592000000 - (Date.now() - Monthly) > 0) {
            TMonth = `${e.Loading} \`${TimeMonth.days}d ${TimeMonth.hours}h ${TimeMonth.minutes}m e ${TimeMonth.seconds}s\``
        } else { sdb.delete(`Users.${user.id}.Timeouts.Monthly`); TMonth = Dpn }

        // Timeout Assalto
        let TimeAssalto = ms(1200000 - (Date.now() - Assalto))
        if (Assalto !== null && 1200000 - (Date.now() - Assalto) > 0) {
            TAssalto = (`${e.Loading} \`${TimeAssalto.minutes}m e ${TimeAssalto.seconds}s\``)
        } else { sdb.delete(`Users.${user.id}.Timeouts.Assalto`); TAssalto = Dpn }

        // Timeout Roubo
        let TimeRoubo = ms(1200000 - (Date.now() - Roubo))
        if (Roubo !== null && 1200000 - (Date.now() - Roubo) > 0) {
            TRob = (`${e.Loading} \`${TimeRoubo.minutes}m e ${TimeRoubo.seconds}s\``)
        } else { sdb.delete(`Users.${user.id}.Timeouts.Roubo`); TRob = Dpn }

        // Timeout Reacts
        let TimeReacts = ms(40000 - (Date.now() - sdb.get('Client.Timeouts.React')))
        if (sdb.get('Client.Timeouts.React') !== null && 40000 - (Date.now() - sdb.get('Client.Timeouts.React')) > 0) {
            TReact = `${e.Loading} \`${TimeReacts.seconds}s\``
        } else { sdb.delete(`Users.${user.id}.Timeouts.React`); TReact = Dpn }

        // Timeout Bolsa
        let TimeBolsa = ms(172800000 - (Date.now() - Bolsa))
        if (Bolsa !== null && 172800000 - (Date.now() - Bolsa) > 0) {
            TBolsa = `${e.Loading} \`${TimeBolsa.days}d ${TimeBolsa.hours}h ${TimeBolsa.minutes}m e ${TimeBolsa.seconds}s\``
        } else { sdb.delete(`Users.${user.id}.Timeouts.Bolsa`); TBolsa = Dpn }

        // Timeout Vip
        let TimeVip = ms(Vip.TimeRemaing - (Date.now() - Vip.DateNow))
        if (Vip.Permanent) {
            TVip = `\`Permanente\``
        } else {
            if (Vip.DateNow !== null && Vip.TimeRemaing - (Date.now() - Vip.DateNow) > 0) {
                TVip = `${e.Loading} \`${TimeVip.days}d ${TimeVip.hours}h ${TimeVip.minutes}m e ${TimeVip.seconds}s\``
            } else { sdb.delete(`Users.${user.id}.Timeouts.Vip`); TVip = `${e.GrayStar} \`Vip Indisponível\`` }
        }

        if (['global', 'globais', 'saphire'].includes(args[0]?.toLowerCase()))
            return SendCooldownsSaphire()

        const Embed = new MessageEmbed()
            .setColor(Colors(user))
            .setTitle(`⏱️ ${client.user.username} Timeouts | ${user?.username || "User not found."}`)
            .setDescription('Aqui você pode conferir todos os timeouts.')
            .addFields(
                {
                    name: `${e.VipStar} Vip`,
                    value: TVip || `\`Você não deveria ver essa mensagem... Usa "${prefix}bug", por favor?\``
                },
                {
                    name: `${e.PepePreso} Preso`,
                    value: TPreso || `\`Você não deveria ver essa mensagem... Usa "${prefix}bug", por favor?\``
                },
                {
                    name: `${e.Helpier} Ajudante`,
                    value: THelpier || `\`Você não deveria ver essa mensagem... Usa "${prefix}bug", por favor?\``
                },
                {
                    name: '📊 Bolsa de Valores',
                    value: TBolsa || `\`Você não deveria ver essa mensagem... Usa "${prefix}bug", por favor?\``
                },
                {
                    name: `${e.CashAndCash} ${prefix}mensal`,
                    value: TMonth || `\`Você não deveria ver essa mensagem... Usa "${prefix}bug", por favor?\``
                },
                {
                    name: `${e.BagMoney2} ${prefix}semanal`,
                    value: TWeek || `\`Você não deveria ver essa mensagem... Usa "${prefix}bug", por favor?\``
                },
                {
                    name: `${e.MoneyWings} ${prefix}daily`,
                    value: TDaily || `\`Você não deveria ver essa mensagem... Usa "${prefix}bug", por favor?\``
                },
                {
                    name: `${e.PepeRich} ${prefix}work`,
                    value: TWork || `\`Você não deveria ver essa mensagem... Usa "${prefix}bug", por favor?\``
                },
                {
                    name: `${e.Pig} ${prefix}pig`,
                    value: TPig || `\`Você não deveria ver essa mensagem... Usa "${prefix}bug", por favor?\``
                },
                {
                    name: `${e.PepeOk} ${prefix}cu`,
                    value: TCu || `\`Você não deveria ver essa mensagem... Usa "${prefix}bug", por favor?\``
                },
                {
                    name: `🎫 ${prefix}roleta`,
                    value: TRoleta || `\`Você não deveria ver essa mensagem... Usa "${prefix}bug", por favor?\``
                },
                {
                    name: `${e.PepeCrime} ${prefix}crime`,
                    value: TCrime || `\`Você não deveria ver essa mensagem... Usa "${prefix}bug", por favor?\``
                },
                {
                    name: `${e.PandaBag} ${prefix}assaltar`,
                    value: TAssalto || `\`Você não deveria ver essa mensagem... Usa "${prefix}bug", por favor?\``
                },
                {
                    name: `${e.PandaBag} ${prefix}roubar`,
                    value: TRob || `\`Você não deveria ver essa mensagem... Usa "${prefix}bug", por favor?\``
                },
                {
                    name: `${e.BitCoin} ${prefix}bitcoin`,
                    value: TBit || `\`Você não deveria ver essa mensagem... Usa "${prefix}bug", por favor?\``
                },
                {
                    name: `${e.Like} ${prefix}like`,
                    value: TLikes || `\`Você não deveria ver essa mensagem... Usa "${prefix}bug", por favor?\``
                },
            )
            .setFooter(`${prefix}cd Saphire`)
        return message.reply({ embeds: [Embed] })

        function SendCooldownsSaphire() {
            const Embed = new MessageEmbed()
                .setColor(Colors(user))
                .setTitle(`⏱️ ${client.user.username} Timeouts | Global`)
                .setDescription('Timeouts Globais')
                .addFields(
                    {
                        name: `${e.MoneyWings} Restaurar Dívida`,
                        value: TRestoreDividas || `\`Você não deveria ver essa mensagem... Usa "${prefix}bug", por favor?\``
                    },
                    {
                        name: 'Reações Automáticas',
                        value: TReact || `\`Você não deveria ver essa mensagem... Usa "${prefix}bug", por favor?\``
                    },
                )
            return message.reply({ embeds: [Embed] })
        }
    }
}