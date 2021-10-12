const ms = require("parse-ms")
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const Colors = require('../../../Routes/functions/colors')
const Moeda = require("../../../Routes/functions/moeda")
const Error = require('../../../Routes/functions/errors')

module.exports = {
    name: 'roleta',
    aliases: ['rol', 'roletar', 'r'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: ['MANAGE_MESSAGES', 'ADD_REACTIONS'],
    emoji: '🎟️',
    usage: '<rol> [quantia/all]',
    description: 'Roleta é um jogo que te faz enlouquecer',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

        const roletaembed = new MessageEmbed()
            .setColor(Colors(message.member))
            .setTitle(`🎟️ Roleta ${client.user.username}`)
            .setDescription(`Seja muito bem vindo a Roleta ${client.user.username}!\n \n${e.Info} **O que é a Roleta ${client.user.username}?**\n- A Roleta é um simples jogo onde você ganha ou perde dinheiro.\n \nA Roleta consiste em uma variavel de sorte, onde depende de um resultado aleatório para você ganhar.`)
            .addField(`${e.SaphireObs} Como jogar`, `1. Compre algumas fichas na \`${prefix}loja\`\n2. Digite \`${prefix}roleta Valor\` ou \`${prefix}roleta all\` para jogar toda sua carteira e cache.\nProntinho, é só isso.`)
            .addField(`${e.Info} Informações adicionais`, '**1.** Todo o dinheiro perdido não vai a lugar nenhum\n**2.** O resultado de vitória é de 20%, derrota é de 40% e empate 40%\n**3. Resultado**\nVitória: Recebe de **0 a 100%** do valor apostado\nEmpate: Recebe de volta o dinheiro apostado\nDerrota: O dinheiro apostado sumirá para sempre.')
            .setFooter(`A ${client.user.username} não se responsabiliza por dinheiro perdido.`)

        if (['info', 'help', 'ajuda'].includes(args[0]?.toLowerCase()) || !args[0]) return message.reply({ embeds: [roletaembed] })

        let time = ms(2400000 - (Date.now() - db.get(`${message.author.id}.Timeouts.Roleta`)))
        if (db.get(`${message.author.id}.Timeouts.Roleta`) !== null && 2400000 - (Date.now() - db.get(`${message.author.id}.Timeouts.Roleta`)) > 0)
            return message.channel.send(`${e.Loading} | ${message.author}, as roletas estão voltando ao lugar, volte em: \`${time.minutes}m e ${time.seconds}s\``)

        let fichas = db.get(`${message.author.id}.Slot.Fichas`) || 0
        let valor = parseInt(args[0])

        let numbers = ''
        let result = Math.floor(Math.random() * 100)
        if (result >= 81) numbers = '1'
        if (result <= 80 && result >= 41) numbers = '2'
        if (result <= 40) numbers = '3'

        if (fichas <= 0)
            return message.reply(`${e.Deny} | Você não tem fichas para jogar, compre uma algumas na loja.`)

        if (['all', 'tudo'].includes(args[0]?.toLowerCase()))
            return SetValueAll()

        if (isNaN(valor))
            return message.reply(`${e.Deny} | **${args[0]}** | Não é um número.`)

        if (valor > (db.get(`Balance_${message.author.id}`) || 0))
            return message.reply(`${e.Deny} | Você não tem todo esse dinheiro na carteira.`)

        if (valor <= 0)
            return message.reply(`${e.Deny} | Você tem que apostar algúm valor maior que 1 ${Moeda(message)}, baaaka!`)

        let winprize = Math.floor(Math.random() * (valor / 2)).toFixed(0)

        StartNewRol(valor, winprize)

        function SetValueAll() {

            if (request)
                return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

            if ((db.get(`Balance_${message.author.id}`) || 0) + (db.get(`${message.author.id}.Cache.Resgate`) || 0) <= 0)
                return message.reply(`${e.Deny} | Você não tem dinheiro na carteira nem no cache.`)

            db.set(`${message.author.id}.Timeouts.Roleta`, Date.now())
            db.add(`${message.author.id}.Cache.ValueAll`, (db.get(`Balance_${message.author.id}`) || 0) + (db.get(`${message.author.id}.Cache.Resgate`) || 0))
            db.delete(`${message.author.id}.Cache.Resgate`)
            db.delete(`Balance_${message.author.id}`)
            valor = db.get(`${message.author.id}.Cache.ValueAll`) || 0

            let winprize = Math.floor(Math.random() * (db.get(`${message.author.id}.Cache.ValueAll`) || 0))

            return message.reply(`${e.QuestionMark} | Você confirma apostar o valor de **${db.get(`${message.author.id}.Cache.ValueAll`) || 0} ${Moeda(message)}**?\n${e.SaphireObs} | No \`-rol all\` você aposta o dinheiro da sua carteira mais o dinheiro em cache.`).then(msg => {
                db.set(`Request.${message.author.id}`, `${msg.url}`)
                msg.react('✅').catch(() => { }) // Check
                msg.react('❌').catch(() => { }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {
                        db.delete(`Request.${message.author.id}`)
                        RolAllFunction(valor, winprize, msg)
                    } else {
                        db.delete(`Request.${message.author.id}`)
                        db.delete(`${message.author.id}.Timeouts.Roleta`)
                        msg.edit(`${e.Deny} | Comando cancelado.`).catch(() => { })
                        db.add(`${message.author.id}.Cache.Resgate`, (db.get(`${message.author.id}.Cache.ValueAll`) || 0))
                        db.delete(`${message.author.id}.Cache.ValueAll`)
                    }
                }).catch(() => {
                    db.delete(`Request.${message.author.id}`)
                    msg.edit(`${e.Deny} | Comando cancelado por tempo expirado.`).catch(() => { })
                    db.add(`${message.author.id}.Cache.Resgate`, db.get(`${message.author.id}.Cache.ValueAll`) || 0)
                    db.delete(`${message.author.id}.Cache.ValueAll`)
                    db.delete(`${message.author.id}.Timeouts.Roleta`)
                })

            }).catch(err => {
                db.delete(`Request.${message.author.id}`)
                Error(message, err)
                return message.channel.send(`${e.SaphireCry} | Ocorreu um erro durante o processo. Por favor, reporte o ocorrido usando \`${prefix}bug\`\n\`${err}\``)
            })
        }

        function RolAllFunction(value, prize, mensagem) {
            db.subtract(`${message.author.id}.Slot.Fichas`, 1)
            db.add(`${message.author.id}.Cache.Roleta`, value)
            db.add(`${message.author.id}.Cache.Roleta`, prize)

            mensagem.edit(`${e.MoneyWings} | ${message.author} iniciou um jogo na roleta no valor de **${value} ${Moeda(message)}**...`).then(msg => {
                setTimeout(() => {
                    switch (numbers) {
                        case '1': AddMoneyVictory(prize, msg); break;
                        case '2': SubtractMoneyLose(prize, msg); break;
                        case '3': GiveBackMoneyDraw(prize, msg); break;
                        default: message.channel.send('Default'); break
                    }
                    db.delete(`${message.author.id}.Cache.ValueAll`)
                }, 4000)
            }).catch(err => {
                Error(message, err)
                message.channel.send(`${e.SaphireCry} | Ocorreu um erro durante o processo. Por favor, reporte o ocorrido usando \`${prefix}bug\`\n\`${err}\``)
            })
        }

        function StartNewRol(value, prize) {
            db.set(`${message.author.id}.Timeouts.Roleta`, Date.now())
            db.subtract(`${message.author.id}.Slot.Fichas`, 1)
            db.add(`${message.author.id}.Cache.Roleta`, value)
            db.add(`${message.author.id}.Cache.Roleta`, prize)
            db.subtract(`Balance_${message.author.id}`, value)
            db.delete(`${message.author.id}.Cache.ValueAll`)

            message.channel.send(`${e.MoneyWings} | ${message.author} iniciou um jogo na roleta no valor de **${value} ${Moeda(message)}**...`).then(msg => {
                setTimeout(() => {
                    switch (numbers) {
                        case '1': AddMoneyVictory(prize, msg); break;
                        case '2': SubtractMoneyLose(prize, msg); break;
                        case '3': GiveBackMoneyDraw(prize, msg); break;
                        default: message.channel.send('Default'); break
                    }
                }, 4000)
            })
        }

        function AddMoneyVictory(prize, msg) {
            db.add(`${message.author.id}.Cache.Resgate`, (db.get(`${message.author.id}.Cache.Roleta`) || 0))
            msg.edit(`${e.Tada} | **GANHOU!** | ${message.author} jogou na roleta e teve o retorno de **${(db.get(`${message.author.id}.Cache.Roleta`) || 0).toFixed(0)} ${Moeda(message)}** com um lucro de **${prize} ${Moeda(message)}**.\n${e.SaphireObs} | Para garantir que você não seja roubado, o dinheiro está em seu cache.`)
            db.delete(`${message.author.id}.Cache.Roleta`)
        }

        function SubtractMoneyLose(prize, msg) {
            msg.edit(`${e.SaphireCry} | **PERDEU!** | ${message.author} jogou na roleta e perdeu **${((db.get(`${message.author.id}.Cache.Roleta`) || 0) - prize).toFixed(0)} ${Moeda(message)}**.`)
            db.delete(`${message.author.id}.Cache.Roleta`)
        }

        function GiveBackMoneyDraw(prize, msg) {
            db.add(`${message.author.id}.Cache.Resgate`, ((db.get(`${message.author.id}.Cache.Roleta`) || 0) - prize))
            db.delete(`${message.author.id}.Cache.Roleta`)
            db.delete(`${message.author.id}.Timeouts.Roleta`)
            msg.edit(`${e.Nagatoro} | **EMPATE!** | ${message.author} jogou na roleta e empatou. O dinheiro foi retornado ao cache e o timeout zerado.`)
        }
    }
}