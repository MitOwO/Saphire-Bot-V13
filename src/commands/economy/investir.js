// const { e } = require('../../../Routes/emojis.json')
// const { f } = require('../../../Routes/frases.json')
// const colors = require('../../../Routes/functions/colors')
// const Moeda = require('../../../Routes/functions/moeda')
// const PassCode = require('../../../Routes/functions/PassCode')

// // #246FE0 - Azul Saphire
// module.exports = {
//     name: 'investir',
//     aliases: ['bolsadevalores', 'bolsa'],
//     category: 'economy',
//     emoji: '📊',
//     usage: '<bolsa> <check/valor>',
//     description: 'Bolsa de Valores',

//     run: async (client, message, args, prefix, db, MessageEmbed, request) => {

//         let Timeout, Empresa, Invest, Pass, Bolsa, Money, Chance, Lucro, TimeBolsa

//         TimeBolsa = ms(172800000 - (Date.now() - db.get(`${user.id}.Timeouts.Bolsa`)))
//         if (db.get(`${message.author.id}.Timeouts.Bolsa`) !== null && 172800000 - (Date.now() - db.get(`${message.author.id}.Timeouts.Bolsa`)) > 0) {
//             Timeout = true
//         } else { Timeout = false }

//         // Timeout Bolsa
//         let TimeBolsa = ms(172800000 - (Date.now() - db.get(`${user.id}.Timeouts.Bolsa`)))
//         if (db.get(`${user.id}.Timeouts.Bolsa`) !== null && 172800000 - (Date.now() - db.get(`${user.id}.Timeouts.Bolsa`)) > 0) {
//             TBolsa = `${e.Loading} \`${TimeBolsa.days}d ${TimeBolsa.hours}h ${TimeBolsa.minutes}m e ${TimeBolsa.seconds}s\``
//         } else { TBolsa = Dpn }

//         Bolsa = db.get(`${message.author.id}.Bolsa`)?.toFixed(0) || 0
//         Money = db.get(`Balance_${message.author.id}`)?.toFixed(0) || 0
//         Pass = PassCode(10)

//         if (!args[0]) return InitialEmbed()
//         if (['info', 'help', 'ajuda'].includes(args[0]?.toLowerCase())) return BolsaInfo()
//         if (['resgate', 'sacar'].includes(args[0]?.toLowerCase())) return NewResgate()
//         if (['TSN', 'CNW'].includes(args[0]?.toLowerCase())) return NewInvest(args[0].toLowerCase())
//         if (['me', 'eu'].includes(args[0]?.toLowerCase())) return BolsaMeInfo()
//         return message.reply(`${e.Deny} | Empresa não encontrada. Use \`${prefix}bolsa\` que eu te mostra todas.`)

//         function InitialEmbed() {
//             return message.reply({
//                 embeds: [
//                     new MessageEmbed()
//                         .setColor(colors(message.member))
//                         .setTitle(`📊 ${client.user.username} Bolsa de Valores`)
//                         .setDescription(`${e.SaphireObs} Para investir, use a sigla da empresa`)
//                         .addField('🚝 Train Station NYL | > TSN', `Taxa de Lucro: \`70%\`\nValor Mínimo: \`5.000.000 ${Moeda(message)}\`\nGarantia: \`40%\``)
//                         .addField('🏗️ Construction Newest World | > CNW', `Taxa de Lucro: \`50%\`\nValor Mínimo: \`7.000.000 ${Moeda(message)}\`\nGarantia: \`50%\``)
//                 ]
//             })
//         }

//         function NewInvest(value) {

//             switch (value.toLowerCase()) {
//                 case 'TSN':
//                     Empresa = '🚝 Train Station NYL'
//                     Invest = 5000000
//                     Chance = '40'
//                     Lucro = '70'
//                     break;
//                 case 'CNW':
//                     Empresa = '🏗️ Construction Newest World'
//                     Invest = 7000000
//                     Chance = '50'
//                     Lucro = '50'
//                     break;
//                 default:
//                     message.reply(`${e.Deny} | Algo deu errado. Tente novamente.`)
//                     break;
//             }

//             if (Money < Invest) return message.reply(`${e.Deny} | Para investar na **${Empresa}**, você precisa de **${Invest}** ${Moeda(message)} na carteira.`)

//             db.add(`${message.author.id}.Cache.Bolsa`, Invest)
//             db.subtract(`Balance_${message.author.id}`, Invest)

//             return message.reply(`${e.QuestionMark} | Pedido: Investir **${Invest} ${Moeda(message)}** na empresa **${Empresa}**
//             \nVocê terá que esperar **2 dias** até o resultado do investimento sair. Você tem **${Chance}%** de garantia que receberá até **${Lucro}%** de lucro.\n 
//             \nUma vez ciente disso, você deve confirmar o investimento digitando o seu código passe: **${Pass}**`).then(msg => {

//                 const filter = m => m.author.id === message.author.id
//                 const collector = message.channel.createMessageCollector({ filter, time: 15000 });

//                 collector.on('collect', m => {
//                     if (m.content === `${Pass}`) {
//                         SetNewInvestiment(msg)
//                         collector.stop()
//                     } else {
//                         msg.edit(`${e.Deny} | Investimento cancelado.`).catch(() => { })
//                         collector.stop()
//                     }
//                 });
//             })
//         }

//         function SetNewInvestiment(msg) {
//             db.add(`${message.author.id}.Bolsa`, db.get(`${message.author.id}.Cache.Bolsa`))
//             db.delete(`${message.author.id}.Cache.Bolsa`)
//             db.set(`${message.author.id}.Timeouts.Bolsa`, Date.now())
//             msg.edit(`${e.Deny} | Investimento efetuado com sucesso! Daqui 2 dias, use o comando \`${prefix}bolsa me\` e veja seu resultado!`).catch(() => { })
//         }

//         function BolsaMeInfo() {
//             return message.reply({
//                 embeds: [
//                     new MessageEmbed()
//                         .setColor(colors(message.member))
//                         .setAuthor(`${message.author.username} Investimentos`, message.author.displayAvatarURL({ dynamic: true }))
//                         .addField()
//                 ]
//             })
//         }

//     }
// }