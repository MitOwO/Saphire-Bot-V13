const { e } = require('../../../database/emojis.json'),
    { ServerDb, Giveaway } = require('../../../Routes/functions/database'),
    ms = require('ms'),
    Data = require('../../../Routes/functions/data')

module.exports = {
    name: 'giveaway',
    aliases: ['sorteio', 'gw'],
    category: 'moderation',
    UserPermissions: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES'],
    ClientPermissions: ['ADD_REACTIONS'],
    emoji: `${e.Tada}`,
    usage: '<giveaway> <info>',
    description: 'Fazer sorteios é divertido, né?',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        return message.reply(`${e.Loading} | Comando em construção.`)

        //     const GiveawayData = Giveaway.get(`Giveaways.${message.guild.id}`),
        //         embed = new MessageEmbed().setColor(client.blue)

        //     if (['create', 'criar', 'new'].includes(args[0]?.toLowerCase())) return CreateNewGiveaway()
        //     if (['delete', 'deletar', 'apagar', 'excluir'].includes(args[0]?.toLowerCase())) return DeleteGiveaway()
        //     if (['Reroll', 'resortear'].includes(args[0]?.toLowerCase())) return Reroll()
        //     if (['finalizar', 'finish'].includes(args[0]?.toLowerCase())) return FinishGiveaway()
        //     if (['list', 'all', 'todos', 'lista'].includes(args[0]?.toLowerCase())) return GiveawayList()
        //     if (['info', 'help', 'ajuda'].includes(args[0]?.toLowerCase())) return GiveawayInfo()
        //     if (['setchannel', 'config'].includes(args[0]?.toLowerCase())) return ConfigGiveawayChannel()
        //     return NaoSabeUsarOComando()

        //     async function CreateNewGiveaway() {

        //         let WinnersAmount = args[1],
        //             Time = args[2],
        //             Prize = args.slice(3).join(' '),
        //             ChannelId = ServerDb.get(`Servers.${message.guild.id}.GiveawayChannel`),
        //             Channel = message.guild.channels.cache.get(ChannelId),
        //             TimeMs

        //         if (!ChannelId)
        //             return message.reply(`${e.Deny} | Para criar um sorteio, o servidor deve ter um canal de sorteio configurado. Tem tudo no \`${prefix}giveaway info\`, dá uma olhadinha.`)

        //         if (ChannelId && !Channel) {
        //             ServerDb.delete(`Servers.${message.guild.id}.GiveawayChannel`)
        //             return message.reply(`${e.Deny} | Para criar um sorteio, o servidor deve ter um canal de sorteio configurado. Tem tudo no \`${prefix}giveaway info\`, dá uma olhadinha.`)
        //         }

        //         if (!Channel)
        //             return message.reply(`${e.Deny} | Para criar um sorteio, o servidor deve ter um canal de sorteio configurado. Tem tudo no \`${prefix}giveaway info\`, dá uma olhadinha.`)

        //         if (!WinnersAmount)
        //             return NaoSabeUsarOComando()

        //         if (isNaN(WinnersAmount))
        //             return message.reply(`${e.Deny} | O número de vencedores deve ser um número, não acha? Olha um exemplo:\n\`${prefix}giveaway create <QuantidadeDeVencedores> <TempoDoSorteio> <O Prêmio do Sorteio>\` | \`${prefix}giveaway create 3 10h Cargo Mod\``)

        //         if (parseInt(WinnersAmount) > 20 || parseInt(WinnersAmount) < 1)
        //             return message.reply(`${e.Deny} | O limite máximo de vencedores é entre 1 e 20.`)

        //         if (!['s', 'm', 'h', 'd'].includes(Time.slice(-1)))
        //             return message.reply(`${e.Deny} | Tempo inválido! Tenta colocar o tempo assim: \`50s | 10m | 1h | 2d\`\nOu seja: Segundos, Minutos, Horas e Dias`)

        //         if (!Prize)
        //             return message.reply(`${e.Info} | O mais legal é que você disse tudo do sorteio e só se esqueceu do prêmio 🤡`)

        //         if (Prize.length > 200)
        //             return message.reply(`${e.Deny} | O prêmio não pode passar de **200 caracteres**`)

        //         try {
        //             TimeMs = ms(Time)
        //         } catch (err) { return message.reply(`${e.Deny} | O tempo informado é inválido.`) }

        //         if (TimeMs > 2592000000)
        //             return message.reply(`${e.Deny} | O tempo limite é de 30 dias.`)

        //         const msg = await Channel.send({
        //             embeds: [
        //                 embed.setTitle(`${e.Loading} | Construindo sorteio...`)

        //             ]
        //         })

        //         embed
        //             .setTitle(`🎉 Sorteios ${message.guild.name}`)
        //             .setDescription(`Prêmio: **${Prize}**\n \nPara entrar no sorteio, reaja em 🎉. Para sair, basta remover a sua reação.`)
        //             .addFields(
        //                 {
        //                     name: 'Data de Término',
        //                     value: `> \`${Data(TimeMs)}\``,
        //                     inline: true
        //                 },
        //                 {
        //                     name: 'Patrocinado por:',
        //                     value: `> ${message.author}`,
        //                     inline: true
        //                 },
        //                 {
        //                     name: 'Vencedores',
        //                     value: `> ${parseInt(WinnersAmount)}`,
        //                     inline: true
        //                 }
        //             )

        //         if (!msg.id)
        //             return message.reply(`${e.Deny} | Fala ao obter o ID da mensagem do sorteio. Verifique se eu realmente tenho permissão para enviar mensagem no canal de sorteios.`)

        //         Giveaway.set(`Giveaways.${message.guild.id}.${msg.id}`, {
        //             Prize: Prize,
        //             Winners: WinnersAmount,
        //             TimeMs: TimeMs,
        //             DateNow: Date.now(),
        //             ChannelId: ChannelId,
        //             Participants: [],
        //             Actived: true,
        //             MessageLink: msg.url,
        //             Sponsor: message.author.id
        //         })

        //         setTimeout(() => msg.edit({ embeds: [embed] }).catch((err) => {
        //             msg.delete().catch(() => { })

        //             Giveaway.delete(`Giveaways.${message.guild.id}.${msg.id}`)

        //             return message.channel.send(`${e.Warn} | Erro ao criar o sorteio.`)
        //         }), 1500)

        //         msg.react('🎉').catch(() => {
        //             msg.delete().catch(() => { })

        //             Giveaway.delete(`Giveaways.${message.guild.id}.${msg.id}`)

        //             return message.channel.send(`${e.Warn} | Erro ao reagir no sorteio.`)
        //         })

        //         return message.reply(`${e.Check} | Sorteio criado com sucesso!`)

        //     }

        //     function DeleteGiveaway() {

        //     }

        //     function Reroll() {

        //     }

        //     function FinishGiveaway() {

        //     }

        //     function GiveawayList() {

        //     }

        //     function GiveawayInfo() {

        //         let MessageId = args[1]

        //     }

        //     function NaoSabeUsarOComando() {
        //         return message.reply(`${e.Info} | Não sabe usar o comando de sorteio? Tenta usar o comando \`${prefix}giveaway info\``)
        //     }

        //     function ConfigGiveawayChannel() {

        //         let Channel = message.mentions.channels.first() || message.channel

        //         if (['off', 'desligar', 'excluir', 'apagar'].includes(args[1]?.toLowerCase())) return DeleteGiveawaysConfig()

        //         ServerDb.set(`Servers.${message.guild.id}.GiveawayChannel`, Channel.id)
        //         return message.reply(`${e.Check} | O canal ${Channel} foi configurado com sucesso como Canal de Sorteios!`)

        //         async function DeleteGiveawaysConfig() {

        //             const msg = await message.reply(`${e.QuestionMark} | Deseja deletar todos os sorteios e as configurações de canais?`)

        //             for (const emoji of ['✅', '❌'])
        //                 msg.react(emoji).catch(() => { })

        //             const collector = msg.createReactionCollector({
        //                 filter: (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id,
        //                 time: 30000
        //             })

        //                 .on('collect', (reaction) => {

        //                     return reaction.emoji.name === '✅'
        //                         ? (() => {
        //                             ServerDb.delete(`Servers.${message.guild.id}.GiveawayChannel`)
        //                             Giveaway.delete(`Giveaways.${message.guild.id}`)
        //                             return message.reply(`${e.Check} | Todos os sorteios e configurações foram deletados.`)
        //                         })()
        //                         : collector.stop()

        //                 })

        //                 .on('end', () => msg.edit(`${e.Deny} | Comando cancelado.`))



        //             return
        //         }

        //     }

    }
}