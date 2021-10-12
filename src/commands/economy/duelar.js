const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const Colors = require('../../../Routes/functions/colors')
const Moeda = require('../../../Routes/functions/moeda')
const Error = require('../../../Routes/functions/errors')

module.exports = {
    name: 'duelar',
    aliases: ['duelo', 'x1'],
    category: 'economy',
    ClientPermissions: ['MANAGE_MESSAGES', 'ADD_REACTIONS'],
    emoji: '⚔️',
    usage: '<duelar> <@user/id> <quantia>',
    description: 'Duelo. A mais antiga forma do X1',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        return message.reply(`${e.Loading} | Em criação.`)

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

        let user = message.mentions.members.first() || message.mentions.repliedUser || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[1])

        // '⚔️' - Emoji Espada

        if (db.get(`${message.author.id}.Duelo`))
            return message.reply(`${e.Deny} | Você está com um duelo aberto. Espere o duelo atual fechar.`)

        const NoArgsEmbed = new MessageEmbed()
            .setColor(Colors(message.member))
            .setTitle(`⚔️ Duelo ${client.user.username} Arena`)
            .setDescription(`O Duelo é um dos comandos da Classe Arena, onde você disputa com outros membros do servidor por alguma recompensa.\nCom o Duelo, você aposta uma quantia em ${Moeda(message)}, e o vencedor que tiver mais sorte ganha.`)
            .addField(`${e.SaphireObs} Comando`, `\`${prefix}duelar <@user/id> <quantia>\``)
            .setFooter(`A ${client.user.username} não se responsabiliza por dinheiro perdido.`)

        if (!args[0])
            return message.reply({ embeds: [NoArgsEmbed] })

        if (!user)
            return message.reply(`${e.SaphireObs} | Tenta assim: \`${prefix}duelar <@user/id> <quantia>\``)

        if (db.get(`${user.id}.Duelo`))
            return message.reply(`${e.Deny} | ${user.user.username} está com um duelo aberto no momento.`)

        if (user.user.bot) return message.reply(`${e.Deny} | Bots não podem duelar.`)
        if (user.id === client.user.id) return message.reply(`${e.SaphireCry} Eu sou fraquinha e nem sei segurar uma espada`)
        if (user.id === message.author.id) return message.reply(`${e.Deny} | Você não pode duelar com você mesmo.`)
        if (args[2]) return message.reply(`${e.Deny} | Por favor, não use nada além da quantia. Informações adicionais podem atrapalhar o meu processsamento.`)

        let AuthorMoney = db.get(`Balance_${message.author.id}`) || 0
        let UserMoney = db.get(`Balance_${user.id}`) || 0

        let Valor = parseInt(args[1])
        !isNaN(Valor) ? (Valor = args[1]) : (Valor = args[0])
        if (message.guild.members.cache.get(args[0])) { Valor = args[1] || 0 }
        if (message.guild.members.cache.get(args[1])) { Valor = args[0] || 0 }

        if (!Valor) return message.reply(`${e.Deny} | Você não disse o valor do duelo.`)
        if (isNaN(Valor)) return message.reply(`${e.Deny} | **${Valor}** | Não é um número! Siga o formato correto, por favor. \`${prefix}duelar @user quantia\``)

        if (AuthorMoney <= 0) return message.reply(`${e.Deny} | Você não pode duelar sem dinheiro na carteira.`)
        if (AuthorMoney < Valor) return message.reply(`${e.Deny} | Você não tem **${Valor}** ${Moeda(message)} na carteira. Saque o valor desejado sacando mais \`${prefix}sacar ${(AuthorMoney - Valor)}\` ${Moeda(message)}`)
        if (UserMoney <= 0) return message.reply(`${e.Deny} | ${user.user.username} não tem dinheiro na carteira.`)

        db.subtract(`Balance_${message.author.id}`, Valor)
        db.add(`${message.author.id}.Caches.Duelo`, parseInt(Valor))
        db.set(`${message.author.id}.Duelo`, true)

        return message.channel.send(`${e.Loading} | ${user}, você está sendo desafiado para um duelo.\nDesafiante: ${message.author}\nValor: ${Valor} ${Moeda(message)}`).then(msg => {
            msg.react('⚔️').catch(() => { })
            msg.react('❌').catch(() => { })

            const FilterInit = (reaction, u) => { return reaction.emoji.name === '⚔️' && u.id === u.id; };
            const CollectorInit = msg.createReactionCollector({ FilterInit, time: 30000 });

            const FilterCancel = (reaction, u) => { return reaction.emoji.name === '❌' && (u.id === message.author.id || u.id === user.id); };
            const CollectorCancel = msg.createReactionCollector({ FilterCancel, max: 1, time: 30000 });

            CollectorInit.on('collect', (reaction, u) => {
                if (u.id !== user.id)
                    return

                db.subtract(`Balance_${user.id}`, Valor)
                db.add(`${message.author.id}.Caches.Duelo`, parseInt(Valor))
                db.set(`${user.id}.Duelo`, true)
                CollectorInit.stop()
            });

            CollectorInit.on('end', collected => {
                DuelStart()
            });

            function DuelStart() {
                msg.reactions.removeAll().catch(() => { })
                msg.edit(`${message.author} ⚔️ ${user} ~~~~ ${db.get(`${message.author.id}.Caches.Duelo`).toFixed(0)} ${Moeda(message)}`).catch(() => { })
                setTimeout(() => {
                    db.delete(`${message.author.id}.Duelo`)
                    db.delete(`${user.id}.Duelo`)
                    let boolean = ['true', 'false']
                    let winner = boolean[Math.floor(Math.random() * boolean.length)]

                    winner === 'true' ? AuthorWinner() : UserWinner()
                }, 4000)
            }

            CollectorCancel.on('collect', (reaction, u) => {
                if (u.id === user.id || u.id === message.author.id) {
                    msg.reactions.removeAll().catch(() => { })
                    db.delete(`${user.id}.Duelo`)
                    db.delete(`${message.author.id}.Duelo`)
                    CollectorCancel.stop()
                } else { return }
            });

            CollectorCancel.on('end', collected => {
                if (db.get(`${message.author.id}.Duelo`)) return
                db.add(`Balance_${message.author.id}`, db.get(`${message.author.id}.Caches.Duelo`))
                db.delete(`${message.author.id}.Caches.Duelo`)
                msg.edit(`${e.Deny} | Duelo cancelado.`).catch(() => { })
            });

            function UserWinner() {
                db.add(`Balance_${user.id}`, db.get(`${message.author.id}.Caches.Duelo`))
                msg.edit(`${message.author} ${e.Deny} ⚔️ ${e.OwnerCrow} ${user}\n${e.PandaProfit} ${user.user.tag} +${db.get(`${message.author.id}.Caches.Duelo`).toFixed(0)} ${Moeda(message)}`).catch(() => { })
                db.delete(`${message.author.id}.Caches.Duelo`)
            }

            function AuthorWinner() {
                db.add(`Balance_${message.author.id}`, db.get(`${message.author.id}.Caches.Duelo`))
                msg.edit(`${message.author} ${e.OwnerCrow} ⚔️ ${e.Deny} ${user}\n${e.PandaProfit} ${message.author.tag} +${db.get(`${message.author.id}.Caches.Duelo`).toFixed(0)} ${Moeda(message)}`).catch(() => { })
                db.delete(`${message.author.id}.Caches.Duelo`)
            }


            function Question() {
                message.reply(`${e.QuestionMark} | Você não tem dinheiro na carteira, deseja retirar ${Valor} ${Moeda(message)} do banco? `).then(Msg => {
                    db.set(`Request.${message.author.id}`, `${Msg.url}`)
                    Msg.react('✅').catch(() => { }) // Check
                    Msg.react('❌').catch(() => { }) // X

                    const filter = (reaction, u) => { return ['✅', '❌'].includes(reaction.emoji.name) && u.id === user.id }

                    Msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                        const reaction = collected.first()

                        if (reaction.emoji.name === '✅') {
                            db.delete(`Request.${user.id}`)
                            db.subtract(`Bank_${user.id}`, Valor)
                            db.add(`${message.author.id}.Caches.Duelo`, parseInt(Valor))
                            Msg.delete().catch(() => { })
                            msg.delete().catch(() => { })
                            DuelStart()
                        } else {
                            db.delete(`Request.${user.id}`)
                            Msg.edit(`${e.Deny} | Duelo cancelado.`).catch(() => { })
                        }
                    }).catch(() => {
                        db.delete(`Request.${message.author.id}`)
                        Msg.edit(`${e.Deny} | Duelo cancelado por tempo expirado.`).catch(() => { })
                    })
                })
            }

        }).catch(err => {
            Error(message, err)
            message.channel.send(`${e.SaphireCry} | Ocorreu um erro durante o processo. Por favor, reporte o ocorrido usando \`${prefix}bug\`\n\`${err}\``)
        })
    }
}