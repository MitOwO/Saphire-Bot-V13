// const
//     { e } = require('../../../database/emojis.json'),
//     GiveawayManager = require('../../../Routes/classes/GiveawayManager'),
//     { ServerDb } = require('../../../Routes/functions/database'),
//     ms = require('ms'),
//     parsems = require('parse-ms'),
//     { MessageActionRow, MessageButton } = require('discord.js')

// module.exports = {
//     name: 'giveaway',
//     aliases: ['sorteio', 'sortear', 'gw'],
//     category: 'moderation',
//     UserPermissions: ['ADMINISTRATOR'],
//     ClientPermissions: ['ADD_REACTIONS'],
//     emoji: '🎉',
//     usage: '<gw> [info]',
//     description: 'Fazer sorteio nunca foi tão legal',

//     run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

//         const Giveaway = new GiveawayManager(),
//             CanalAtual = Giveaway.Channel(message.guild),
//             CanalDatabase = Giveaway.DatabaseChannel(message.guild.id)

//         switch (args[0]) {
//             case 'canal': case 'channel':
//                 ConfigGiveawayChannel()
//                 break;
//             case 'create': case 'criar':
//                 NewGiveaway()
//                 break;
//             case 'delete': case 'deletar': case 'apagar': case 'excluir':
//                 DeleteGiveaway()
//                 break;
//             case 'reroll':
//                 Reroll()
//                 break;
//             case 'terminar': case 'finish':
//                 FinishGiveaway()
//                 break;
//             case 'todos': case 'list': case 'all':
//                 AllGiveawayOpnenList()
//                 break;
//             case 'vencedores': case 'histórico': case 'winners':
//                 WinnerHistoricGiveaways()
//                 break;
//             case 'info': case 'help': case 'ajuda':
//                 GiveawayInfo()
//                 break;
//             default:
//                 break;
//         }

//         function ConfigGiveawayChannel() {

//             let Channel = message.mentions.channels.first() || message.channel

//             if (['delete', 'deletar', 'apagar', 'excluir'].includes(args[1]?.toLowerCase())) return DeleteGiveawayChannel()
//             if (!CanalAtual) return NewSetGiveawayChannel()

//             if (Channel.id === CanalDatabase)
//                 return message.reply(`${e.Deny} | Este canal já foi configurado como canal de sorteio.`)

//             return message.reply(`${e.Info} | Está com dúvidas em usar o comando de sorteios? Use \`${prefix}giveaway info\``)

//             function DeleteGiveawayChannel() {

//                 if (!CanalDatabase)
//                     return message.reply(`${e.Deny} | Não há nenhum canal de sorteios configurado.`)

//                 Giveaway.DeleteChannel(message.guild.id)
//                 return message.reply(`${e.Check} | O canal de sorteio foi deletado com sucesso!`)
//             }

//             function NewSetGiveawayChannel() {

//                 Giveaway.SetChannel(message.guild.id, Channel.id)
//                 return message.reply(`${e.Tada} | O canal de sorteios foi configurado em ${Channel}`)

//             }

//         }

//         async function NewGiveaway() {

//             if (!CanalAtual)
//                 return message.reply(`${e.Deny} | Este servidor não possui um canal de sorteio definido. Use o comando \`${prefix}giveaway channel [#canal](opicional)\` para configurar um canal de sorteio.`)

//             let GiveawayCode = Giveaway.NewGiveawayCode(5),
//                 Winners = args[1],
//                 Tempo = args[2],
//                 Prize = args.slice(3).join(' '),
//                 reg = /^\d+$/,
//                 RealTime = ms(parseInt(Tempo)),
//                 AuthorId = message.author.id

//             if (!args[1])
//                 return message.reply(`${e.Info} | Para criar um sorteio, você tem que usar o comando assim: \`${prefix}giveaway <QuantidadeDeVencedores> <TempoDoSorteio> <O prêmio a ser dado>\`\nExemplo: \`${prefix}giveaway 2 4h Cargo de Mod\` - Sorteando o cargo de Mod para 2 vencedores em 4 horas.`)

//             if (!reg.test(Winners))
//                 return message.reply(`${e.Deny} | A quantidade de vencedores contém caracteres indevidos. Confira se realmente o número de vencedores é realmente um número.\nExemplo: \`${prefix}giveaway <QuantidadeDeVencedores> <TempoDoSorteio> <O prêmio a ser dado>\``)

//             if (!['m', 'h', 'd'].includes(Tempo.slice(-1)))
//                 return message.reply(`${e.Deny} | Tempo inválido! O tempo deve terminar com **\`s, m, h, d\`** *(minutos, horas, dias)*\nExemplo: \`${prefix}giveaway <QuantidadeDeVencedores> <TempoDoSorteio> <O prêmio a ser dado>\``)

//             if (!Prize)
//                 return message.reply(`${e.Deny} | Você tem que dizer qual é o prêmio do sorteio.\nExemplo: \`${prefix}giveaway <QuantidadeDeVencedores> <TempoDoSorteio> <O prêmio a ser dado>\``)

//             if (Prize.length > 100)
//                 return message.reply(`${e.Deny} | O prêmio não pode ultrapassar 100 caracteres`)

//             let TempoFormated = `${parsems(RealTime).days} Dias, ${parsems(RealTime).hours} horas e ${parsems(RealTime).minutes}} minutos.`

//             Giveaway.NewGiveaway(message.guild.id, GiveawayCode, RealTime, Winners, Prize, AuthorId)

//             CanalAtual.send({
//                 embeds: [
//                     new MessageEmbed()
//                         .setColor(client.blue)
//                         .setTitle(`${e.Tada} | ${message.guild.name} Sorteios`)
//                         .setDescription(`Prêmio: **${Prize}**\nVencedores: **${Winners}**\nTempo do prêmio: ${TempoFormated}`)
//                 ]
//             })
//             return message.reply(`${e.Check} | Sorteio criado com sucesso! Você pode vê-lo em: ${CanalAtual}`)

//         }

//         function GiveawayInfo() {
//             return message.reply(
//                 {
//                     emdeds:
//                         [
//                             new MessageEmbed()
//                                 .setColor(client.blue)
//                                 .setTitle(`${e.Tada} ${client.user.username}'s Giveaways Manager | Info`)
//                         ]
//                 }
//             )
//         }

//     }
// }