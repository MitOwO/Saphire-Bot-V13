// const { e } = require('../../../database/emojis.json'),
//     { sdb, ServerDb, Giveaway } = require('../../../Routes/functions/database'),
//     PassCode = require('../../../Routes/functions/PassCode'),
//     ms = require('ms'),
//     parsems = require('parse-ms')

// module.exports = {
//     name: 'giveaway',
//     aliases: ['sorteio'],
//     category: 'moderation',
//     UserPermissions: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES'],
//     ClientPermissions: ['ADD_REACTIONS'],
//     emoji: `${e.Tada}`,
//     usage: '<giveaway> <info>',
//     description: 'Fazer sorteios é divertido, né?',

//     run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

//         const GiveawayData = Giveaway.get(`Giveaways.${message.guild.id}`)

//         if (['create', 'criar', 'new'].includes(args[0]?.toLowerCase())) return CreateNewGiveaway()
//         if (['delete', 'deletar', 'apagar', 'excluir'].includes(args[0]?.toLowerCase())) return DeleteGiveaway()
//         if (['Reroll', 'resortear'].includes(args[0]?.toLowerCase())) return Reroll()
//         if (['finalizar', 'finish'].includes(args[0]?.toLowerCase())) return FinishGiveaway()
//         if (['list', 'all', 'todos', 'lista'].includes(args[0]?.toLowerCase())) return GiveawayList()
//         if (['info', 'help', 'ajuda'].includes(args[0]?.toLowerCase())) return GiveawayInfo()
//         return NaoSabeUsarOComando()

//         function CreateNewGiveaway() {

//             let GCode = PassCode(5).toUpperCase(),
//                 WinnersAmount = args[1],
//                 Time = args[2],
//                 Prize = args.slice(2).join(' '),
//                 ChannelId = ServerDb.get(`Servers.${message.guild.id}.GiveawayChannel`),
//                 Channel = message.guild.channels.cache.get(ChannelId),
//                 Emojis = ['🎉'],
//                 TimeMs

//             if (!ChannelId)
//                 return message.reply(`${e.Deny} | Para criar um sorteio, o servidor deve ter um canal de sorteio configurado. Tem tudo no \`${prefix}giveaway info\`, dá uma olhadinha.`)

//             if (ChannelId && !Channel) {
//                 ServerDb.delete(`Servers.${message.guild.id}.GiveawayChannel`)
//                 return message.reply(`${e.Deny} | Para criar um sorteio, o servidor deve ter um canal de sorteio configurado. Tem tudo no \`${prefix}giveaway info\`, dá uma olhadinha.`)
//             }

//             if (!Channel)
//                 return message.reply(`${e.Deny} | Para criar um sorteio, o servidor deve ter um canal de sorteio configurado. Tem tudo no \`${prefix}giveaway info\`, dá uma olhadinha.`)

//             if (!WinnersAmount)
//                 return NaoSabeUsarOComando()

//             if (isNaN(WinnersAmount))
//                 return message.reply(`${e.Deny} | O número de vencedores deve ser um número, não acha? Olha um exemplo:\n\`${prefix}giveaway create <QuantidadeDeVencedores> <TempoDoSorteio> <O Prêmio do Sorteio>\` | \`${prefix}giveaway create 3 10h Cargo Mod\``)

//             if (!['s', 'm', 'h', 'd'].includes(Time.slice(-1)))
//                 return message.reply(`${e.Deny} | Tempo inválido! Tenta colocar o tempo assim: \`50s | 10m | 1h | 2d\`\nOu seja: Segundos, Minutos, Horas e Dias`)

//             if (!Prize)
//                 return message.reply(`${e.Info} | O mais legal é que você disse tudo do sorteio e só se esqueceu do prêmio 🤡`)

//             if (Prize.length > 200)
//                 return message.reply(`${e.Deny} | O prêmio não pode passar de **200 caracteres**`)

//             try {
//                 TimeMs = ms(Time)
//             } catch (err) { return message.reply(`${e.Deny} | O tempo informado é inválido.`) }

//             const msg = await Channel.send({
//                 embeds: [
//                     new MessageEmbed()
//                         .setColor(client.blue)
//                         .setTitle(`🎉 ${message.guild.name} Sorteios`)
//                         .setDescription(`Prêmio: **${Prize}**\nPatrocinado por: ${message.author}`)
//                 ]
//             })

//             Giveaway.set(`Giveaways.${message.guild.id}`, {
//                 GCode: GCode,
//                 Prize: Prize,
//                 TimeMs: TimeMs,
//                 DateNow: Date.now(),
//                 ChannelId: ChannelId
//             })


//         }

//         function DeleteGiveaway() {

//         }

//         function Reroll() {

//         }

//         function FinishGiveaway() {

//         }

//         function GiveawayList() {

//         }

//         function GiveawayInfo() {

//         }

//         function NaoSabeUsarOComando() {
//             return message.reply(`${e.Info} | Não sabe usar o comando de sorteio? Tenta usar o comando \`${prefix}giveaway info\``)
//         }

//     }
// }