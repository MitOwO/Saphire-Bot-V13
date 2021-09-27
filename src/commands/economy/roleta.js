const ms = require("parse-ms")
const { e } = require('../../../Routes/emojis.json')
const Colors = require('../../../Routes/functions/colors')
const Moeda = require("../../../Routes/functions/moeda")

module.exports = {
    name: 'roleta',
    aliases: ['rol', 'roletar'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: 'MANAGE_MESSAGES',
    emoji: '🎟️',
    usage: '<rol> [quantia/all]',
    description: 'Roleta é um jogo que te faz enlouquecer',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let roletaembed = new MessageEmbed()
            .setColor(Colors(message.member))
            .setTitle(`🎟️ Roleta ${client.user.username}`)
            .setDescription(`Seja muito bem vindo a Roleta ${client.user.username}!\n \n${e.Info} **O que é a Roleta ${client.user.username}?**\n- A Roleta é um simples jogo onde você ganha ou perde dinheiro.\n \nA Roleta consiste em uma variavel de sorte, onde depende de um resultado aleatório para você ganhar.`)
            .addField(`${e.Obs} Como jogar`, `1. Compre algumas fichas na \`${prefix}loja\`\n2. Digite \`${prefix}roleta Valor\` ou \`${prefix}roleta all\` para jogar toda sua carteira e cache.\nProntinho, é só isso.`)
            .addField(`${e.Info} Informações adicionais`, '**1.** Todo o dinheiro perdido não vai a lugar nenhum\n**2.** O resultado de vitória é de 20%, derrota é de 40% e empate 40%\n**3. Resultado**\nVitória: Recebe de volta até o dobro do valor apostado\nEmpate: Recebe de volta o dinheiro apostado\nDerrota: O dinheiro apostado sumirá para sempre.')
            .setFooter(`A ${client.user.username} não se responsabiliza por dinheiro perdido.`)

        if (!args[0]) return message.reply({ embeds: [roletaembed] })

        let author1 = await db.get(`${message.author.id}.Timeouts.Roleta`)
        if (author1 !== null && 2400000 - (Date.now() - author1) > 0) {
            let time = ms(2400000 - (Date.now() - author1))

            return message.channel.send(`${e.Loading} | ${message.author}, as roletas estão voltando ao lugar, volte em: \`${time.minutes}m e ${time.seconds}s\``)
        } else {

            let fichas = db.get(`${message.author.id}.Slot.Fichas`) || 0
            let money = db.get(`Balance_${message.author.id}`)

            let valor = parseInt(args[0])

            if (fichas <= 0) return message.reply(`${e.Deny} | Você não tem fichas para jogar, compre uma algumas na loja.`)
            if (['all', 'tudo'].includes(args[0]?.toLowerCase())) { valor = ((money || 0) + (db.get(`${message.author.id}.Cache.Resgate`) || 0)) }
            if (isNaN(valor)) return message.reply(`${e.Deny} | **${args[0]}** | Não é um número.`)
            if (valor <= '0') return message.reply(`${e.Deny} | Você tem que apostar algúm valor maior que 1 ${Moeda(message)}, baka!`)

            db.set(`${message.author.id}.Timeouts.Roleta`, Date.now())
            db.subtract(`${message.author.id}.Slot.Fichas`, 1)
            db.add(`${message.author.id}.Cache.Roleta`, valor)
            if (['all', 'tudo'].includes(args[0]?.toLowerCase())) {
                db.set(`${message.author.id}.Cache.Resgate`, 0)
                db.subtract(`Balance_${message.author.id}`, db.get(`Balance_${message.author.id}`))
            } else {
                db.subtract(`Balance_${message.author.id}`, valor)
            }

            let DoubleMoney = valor
            let HalfMoney = valor / 2
            let QuartMoney = valor / 4
            let winratemoney = [DoubleMoney, HalfMoney, QuartMoney, HalfMoney, DoubleMoney, QuartMoney, HalfMoney, QuartMoney, HalfMoney, QuartMoney]
            let winprize = winratemoney[Math.floor(Math.random() * winratemoney.length)]
            let finalprize = parseInt(winprize + (db.get(`${message.author.id}.Cache.Roleta`) || 0))

            let chances = ["win", "lose", "draw"]
            let result = chances[Math.floor(Math.random() * chances.length)]

            switch (result) {
                case 'win': AddMoneyVictory(); break;
                case 'lose': SubtractMoneyLose(); break;
                case 'draw': GiveBackMoneyDraw(); break;
            }

            function AddMoneyVictory() {
                message.channel.send(`${e.MoneyWings} | ${message.author} iniciou um jogo na roleta...`).then(msg => {
                    setTimeout(function () {
                        db.add(`${message.author.id}.Cache.Resgate`, finalprize)
                        db.delete(`${message.author.id}.Cache.Roleta`)
                        msg.edit(`${e.Tada} | **GANHOU!** | ${message.author} jogou na roleta e faturou ${winprize} ${Moeda(message)} mais o dinheiro apostado.\n${e.Obs} | Para garantir que você não seja roubado, o dinheiro está em seu cache.`)
                    }, 4000)
                })
            }

            function SubtractMoneyLose() {
                message.channel.send(`${e.MoneyWings} | ${message.author} iniciou um jogo na roleta...`).then(msg => {
                    setTimeout(function () {
                        db.delete(`${message.author.id}.Cache.Roleta`)
                        msg.edit(`${e.SadPanda} | **PERDEU!** | ${message.author} jogou na roleta e perdeu ${valor} ${Moeda(message)}.`)
                    }, 4000)
                })
            }

            function GiveBackMoneyDraw() {
                message.channel.send(`${e.MoneyWings} | ${message.author} iniciou um jogo na roleta...`).then(msg => {
                    setTimeout(function () {
                        db.add(`${message.author.id}.Cache.Resgate`, db.get(`${message.author.id}.Cache.Roleta`))
                        db.delete(`${message.author.id}.Cache.Roleta`)
                        msg.edit(`${e.Nagatoro} | **EMPATE!** | ${message.author} jogou na roleta e empatou. O dinheiro foi retornado ao cache.`)
                    }, 4000)
                })
            }
        }
    }
}