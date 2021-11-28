const
    { e } = require('../../../database/emojis.json'),
    Data = require('../../../Routes/functions/data'),
    { Reminders } = require('../../../Routes/functions/database'),
    ms = require('ms'),
    parsems = require('parse-ms'),
    PassCode = require('../../../Routes/functions/PassCode'),
    Error = require('../../../Routes/functions/errors')

module.exports = {
    name: 'lembrar',
    aliases: ['lembrete', 'remind', 'reminder', 'lt', 'rm'],
    category: 'users',
    ClientPermissions: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'ADD_REACTIONS'],
    emoji: '🗒️',
    usage: '<lembrete> <Tempo> | <lembrete> <info>',
    description: 'Defina lembrete que eu te aviso no tempo definido',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let ReminderMessage = args.slice(0).join(' ')
        if (['info', 'help', 'ajuda'].includes(args[0]?.toLowerCase())) return ReminderInfo()
        if (['me', 'eu', 'list'].includes(args[0]?.toLowerCase())) return ReminderList()

        if (!ReminderMessage)
            return message.reply(`🗒️ | Defina lembretes usando este comando.\n\`${prefix}lembrete Fazer tal coisa em tal lugar\``)

        if (ReminderMessage.length > 1000)
            return message.reply(`${e.Deny} | O lembrete não pode ultrapassar 1000 caracteres.`)

        let msg = await message.reply(`${e.Loading} | Quando que eu devo te lembrar? Lembresse de me dizer no seguinte formato: \`h, m, s\`. Exemplo: 1h 10m 40s *(1 hora, 10 minutos, 40 segundos)* ou \`1m 10s\`, \`2h 10m\``),
            ReminderCode = PassCode(7).toUpperCase(),
            CollectControl = false

        const collector = message.channel.createMessageCollector({
            filter: (m) => m.author.id === message.author.id,
            time: 60000,
            max: 1
        });

        collector.on('collect', m => {

            const Args = m.content.trim().split(/ +/g)

            if (Args[2]) return HoursMinutesSeconds()
            if (Args[1]) return TwoArguments()
            if (Args[0]) return OnlyOneArgument()
            return msg.edit(`${e.Deny} | Comando cancelado por uso irregular/desconhecido.`).catch(() => { })

            function HoursMinutesSeconds() {

                let Hour = Args[0],
                    Minutes = Args[1],
                    Seconds = Args[2]

                if (!Hour.slice(-1).includes('h') || !Minutes.slice(-1).includes('m') || !Seconds.slice(-1).includes('s'))
                    return message.reply(`${e.Deny} | Tempo inválido! Verifique se o tempo dito segue esse formato: \`1h 2m 3s\``)

                let Hora = Hour.replace(/h/g, ''),
                    Minutos = Minutes.replace(/m/g, ''),
                    Segundos = Seconds.replace(/s/g, ''),
                    DefinedTime,
                    ParseTime

                if (isNaN(Hora) || isNaN(Minutos) || isNaN(Segundos))
                    return message.reply(`${e.Deny} | O tempo informado não é um número.\nEx: \`1h 2m 3s\``)

                if (Hora < 1 || Minutos < 1, Segundos < 1)
                    return message.reply(`${e.Deny} | Os tempos não podem ser menores que 1.`)

                try {
                    DefinedTime = ms(Hour) + ms(Minutes) + ms(Seconds)
                    ParseTime = parsems(DefinedTime)
                } catch (err) { return message.reply(`${e.Deny} | Definição inválida. Tenta escrever igual nos exemplos do comando, ok?`) }

                CollectControl = true

                Reminders.set(`Reminders.${message.author.id}.${ReminderCode}`, {
                    RemindMessage: ReminderMessage,
                    Time: DefinedTime,
                    DateNow: Date.now(),
                    ChannelId: message.channel.id
                })

                let Dias = ParseTime.days > 0 ? `${ParseTime.days} dias ` : '',
                    Horas = ParseTime.hours > 0 ? `${ParseTime.hours} horas ` : '',
                    minutos = ParseTime.minutes > 0 ? `${ParseTime.minutes} minutos ` : '',
                    segundos = ParseTime.seconds > 0 ? `${ParseTime.seconds} segundos` : ''

                return msg.edit(`${e.Check} | Tudo bem! Eu vou te lembrar de "**${ReminderMessage}**" em **${Dias}${Horas}${minutos}${segundos}**`).catch((err) => {
                    return Error(message, err)
                })

            }

            function TwoArguments() {

                let FirstTime = Args[0],
                    SecondTime = Args[1],
                    LastLetterFirstTime = FirstTime.slice(-1),
                    LastLetterSecondTime = SecondTime.slice(-1),
                    Control1 = false,
                    Control2 = false

                if (LastLetterFirstTime === LastLetterSecondTime)
                    return message.reply(`${e.Deny} | Os tempos não devem ser do mesmo tipo.`)

                for (const i of ['h', 'm']) {

                    if (LastLetterFirstTime === i) {
                        Control1 = false
                        break;
                    }
                    Control1 = true

                }

                for (const i of ['s', 'm']) {

                    if (LastLetterSecondTime === i) {
                        Control2 = false
                        break;
                    }
                    Control2 = true

                }

                if (Control1 || Control2)
                    return message.reply(`${e.Deny} | Tempo inválido! Verifique se o tempo dito segue esse formato: \`1h 2m\` ou \`10m 40s\``)

                let First = FirstTime.replace(/h/g, '').replace(/m/g, ''),
                    Second = SecondTime.replace(/m/g, '').replace(/s/g, ''),
                    DefinedTime,
                    ParseTime

                if (isNaN(First) || isNaN(Second))
                    return message.reply(`${e.Deny} | O tempo informado não é um número.\nEx: \`1h 2m\``)

                if (First < 1 || Second < 1)
                    return message.reply(`${e.Deny} | Os tempos não podem ser menores que 1.`)

                try {
                    DefinedTime = ms(FirstTime) + ms(SecondTime)
                    ParseTime = parsems(DefinedTime)
                } catch (err) { return message.reply(`${e.Deny} | Definição inválida. Tenta escrever igual nos exemplos do comando, ok?`) }

                CollectControl = true

                Reminders.set(`Reminders.${message.author.id}.${ReminderCode}`, {
                    RemindMessage: ReminderMessage,
                    Time: DefinedTime,
                    DateNow: Date.now(),
                    ChannelId: message.channel.id
                })

                let Dias = ParseTime.days > 0 ? `${ParseTime.days} dias ` : '',
                    Horas = ParseTime.hours > 0 ? `${ParseTime.hours} horas ` : '',
                    Minutos = ParseTime.minutes > 0 ? `${ParseTime.minutes} minutos ` : '',
                    Segundos = ParseTime.seconds > 0 ? `${ParseTime.seconds} segundos` : ''

                return msg.edit(`${e.Check} | Tudo bem! Eu vou te lembrar de | **${ReminderMessage}** | em **${Dias}${Horas}${Minutos}${Segundos}**`).catch((err) => {
                    return Error(message, err)
                })

            }

            function OnlyOneArgument() {

                let Time = Args[0],
                    LastCaracter = Time.slice(-1),
                    ValidLetters = ['h', 'm', 's'],
                    Invalid = false

                for (const letra of ValidLetters) {

                    if (LastCaracter === letra) {
                        Invalid = false
                        break
                    } else { Invalid = true }

                }

                if (Invalid)
                    return message.reply(`${e.Deny} | Tempo inválido! Verifique se o tempo dito segue esse formato: \`1h\``)

                let Timer = Time.replace(/h/g, '')
                    .replace(/m/g, '')
                    .replace(/s/g, ''),
                    DefinedTime,
                    ParseTime

                if (Timer < 1)
                    return message.reply(`${e.Deny} | O tempo não pode ser igual ou menor 0`)

                if (isNaN(Timer))
                    return message.reply(`${e.Deny} | O tempo informado não é um número.\nEx: \`1h\``)

                try {
                    DefinedTime = ms(Time)
                    ParseTime = parsems(DefinedTime)
                } catch (err) { return message.reply(`${e.Deny} | Definição inválida. Tenta escrever igual nos exemplos do comando, ok?`) }

                CollectControl = true

                Reminders.set(`Reminders.${message.author.id}.${ReminderCode}`, {
                    RemindMessage: ReminderMessage,
                    Time: DefinedTime,
                    DateNow: Date.now(),
                    ChannelId: message.channel.id
                })

                let Dias = ParseTime.days > 0 ? `${ParseTime.days} dias ` : '',
                    Horas = ParseTime.hours > 0 ? `${ParseTime.hours} horas ` : '',
                    Minutos = ParseTime.minutes > 0 ? `${ParseTime.minutes} minutos ` : '',
                    Segundos = ParseTime.seconds > 0 ? `${ParseTime.seconds} segundos` : ''

                return msg.edit(`${e.Check} | Tudo bem! Eu vou te lembrar de "**${ReminderMessage}**" em **${Dias}${Horas}${Minutos}${Segundos}**`).catch((err) => {
                    return Error(message, err)
                })

            }

        })

        collector.on('end', () => {
            return CollectControl ? null : msg.edit(`${e.Deny} | Comando cancelado.`).catch(() => { })
        })

        function ReminderInfo() {
            return message.reply(`${e.Haan} | 76hrs acordado. Eu realmente preciso dormir um pouco. Quando eu acordar eu faço esse comando e o \`${prefix}remind list\` que vai mostrar todos os seus lembretes ativos.`)
        }

        function ReminderList() {
            return message.reply(`${e.Haan} | Dormiiiiindo. Já já eu faço esse comando.`)
        }

    }
}