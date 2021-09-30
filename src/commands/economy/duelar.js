// const { e } = require('../../../Routes/emojis.json')
// const { f } = require('../../../Routes/frases.json')
// const Colors = require('../../../Routes/functions/colors')
// const Moeda = require('../../../Routes/functions/moeda')

// module.exports = {
//     name: 'duelar',
//     aliases: ['duelo', 'x1'],
//     category: 'economy',
//     ClientPermissions: 'MANAGE_MESSAGES',
//     emoji: '⚔️',
//     usage: '<duelar> <@user/id> <quantia>',
//     description: 'Duelo. A mais antiga forma do X1',

//     run: async (client, message, args, prefix, db, MessageEmbed, request) => {
//         if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

//         let user = message.mentions.members.first() || message.mentions.repliedUser || message.guild.members.cache.get(args[0])

//         const Espada = '⚔️'

//         if (db.get(`${message.author.id}.Duelo`))
//             return message.reply(`${e.Deny} | Você está com um duelo aberto. Espere o duelo atual fechar.`)

//         const NoArgsEmbed = new MessageEmbed()
//             .setColor(Colors(message.member))
//             .setTitle(`⚔️ Duelo ${client.user.username} Arena`)
//             .setDescription(`O Duelo é um dos comandos da Classe Arena, onde você disputa com outros membros do servidor por alguma recompensa.\nCom o Duelo, você aposta uma quantia em ${Moeda(message)}, e o vencedor que tiver mais sorte ganha.`)
//             .addField(`${e.SaphireObs} Comando`, `\`${prefix}duelar <@user/id> <quantia>\``)
//             .setFooter(`A ${client.user.username} não se responsabiliza por dinheiro perdido.`)

//         if (!args[0])
//             return message.reply({ embeds: [NoArgsEmbed] })

//         if (!user) return message.reply(`${e.SaphireObs} | Tenta assim: \`${prefix}duelar <@user/id> <quantia>\``)

//         if (db.get(`${user.id}.Duelo`))
//             return message.reply(`${e.Deny} | ${user.user.username} está com um duelo abreto no momento.`)

//         if (user.user.bot) return message.reply(`${e.Deny} | Bots não podem duelar.`)
//         if (user.id === client.user.id) return message.reply(`${e.SaphireCry} Eu sou fraquinha e nem sei segurar uma espada`)
//         if (user.id === message.author.id) return message.reply(`${e.Deny} | Você não pode duelar com você mesmo.`)
//         if (args[2]) return message.reply(`${e.Deny} | Por favor, não use nada além da quantia. Informações adicionais podem atrapalhar o meu processsamento.`)

//         let AuthorMoney = db.get(`Balance_${message.author.id}`) || 0
//         let AuthorBank = db.get(`Bank_${message.author.id}`) || 0
//         let UserMoney = db.get(`Balance_${user.id}`) || 0
//         let UserBank = db.get(`Bank_${user.id}`) || 0
//         let TotalUser = (UserMoney + UserBank) || 0
//         let TotalAuthor = (AuthorMoney + AuthorBank) || 0
//         let Valor = `${args[1]}`

//         if (!Valor) return message.reply(`${e.Deny} | Você não disse o valor do duelo.`)
//         if (isNaN(Valor)) return message.reply(`${e.Deny} | **${Valor}** | Não é um número, siga o formato correto, por favor. \`${prefix}duelar @user quantia\``)

//         if (AuthorMoney <= 0) return message.reply(`${e.Deny} | Você não pode duelar sem dinheiro.`)
//         if (TotalAuthor < Valor) return message.reply(`${e.Deny} | Você não tem todo esse dinheiro.`)
//         if (AuthorMoney < Valor) return message.reply(`${e.Deny} | Você não tem **${Valor}** ${Moeda(message)} na carteira. Saque o valor desejado sacando mais \`${prefix}sacar ${(AuthorMoney - Valor)}\` ${Moeda(message)}`)

//         if (TotalUser <= 0) return message.reply(`${e.Deny} | ${user.user.username} não tem dinheiro. Tenha piedade!`)

//         db.subtract(`Balance_${user.id}`, Valor)
//         db.subtract(`Balance_${message.author.id}`, Valor)
//         db.add(`${message.author.id}.Caches.Duelo`, parseInt(Valor * 2))

//         return message.channel.send(`${e.Loading} | ${user}, você está sendo desafiado para um duelo.\nDesafiante: ${message.author}\nValor: ${Valor} ${Moeda(message)}`).then(msg => {
//             msg.react('⚔️').catch(() => { })
//             msg.react('❌').catch(() => { })

//             const FilterInit = (reaction, u) => { return reaction.emoji.name === '⚔️' && u.id === user.id; };
//             const CollectorInit = msg.createReactionCollector({ FilterInit, max: 1, time: 30000 });

//             const FilterCancel = (reaction, u) => { return reaction.emoji.name === '❌' && (u.id === message.author.id || u.id === user.id); };
//             const CollectorCancel = msg.createReactionCollector({ FilterCancel, max: 1, time: 30000 });

//             CollectorInit.on('collect', (reaction, user) => {
//                 db.set(`${message.author.id}.Duelo`, true)
//                 db.set(`${user.id}.Duelo`, true)
//                 msg.reactions.removeAll().catch(() => { })
//                 msg.edit(`${message.author} ⚔️ ${user} ~~~~ ${db.get(`${message.author.id}.Caches.Duelo`).toFixed(0)} ${Moeda(message)}`).catch(() => { })
//             });

//             CollectorInit.on('end', collected => {

//                 setTimeout(() => {
//                     if (!db.get(`${message.author.id}.Duelo`)) return
//                     db.delete(`${message.author.id}.Duelo`)
//                     db.delete(`${user.id}.Duelo`)
//                     let boolean = [true, false]
//                     let winner = boolean[Math.floor(Math.random() * boolean.length)]

//                     winner ? AuthorWinner() : UserWinner()
//                 }, 4000)

//             });

//             CollectorCancel.on('collect', (reaction, user) => {
//                 msg.reactions.removeAll().catch(() => { })
//             });

//             CollectorCancel.on('end', collected => {
//                 db.delete(`${message.author.id}.Duelo`)
//                 db.delete(`${user.id}.Duelo`)
//                 db.add(`Balance_${message.author.id}`, db.get(`${message.author.id}.Caches.Duelo`))
//                 db.delete(`${message.author.id}.Caches.Duelo`)
//                 msg.edit(`${e.Deny} | Duelo cancelado.`).catch(() => { })
//             });

//             function UserWinner() {
//                 db.add(`Balance_${user.id}`, db.get(`${message.author.id}.Caches.Duelo`))
//                 msg.edit(`${message.author} ${e.Deny} ⚔️ ${e.OwnerCrow} ${user}\n${e.PandaProfit} ${user.user.tag} +${db.get(`${message.author.id}.Caches.Duelo`).toFixed(0)} ${Moeda(message)}`).catch(() => { })
//                 db.delete(`${message.author.id}.Caches.Duelo`)
//             }

//             function AuthorWinner() {
//                 db.add(`Balance_${message.author.id}`, db.get(`${message.author.id}.Caches.Duelo`))
//                 msg.edit(`${message.author} ${e.OwnerCrow} ⚔️ ${e.Deny} ${user}\n${e.PandaProfit} ${message.author.tag} +${db.get(`${message.author.id}.Caches.Duelo`).toFixed(0)} ${Moeda(message)}`).catch(() => { })
//                 db.delete(`${message.author.id}.Caches.Duelo`)
//             }
//         })
//     }
// }