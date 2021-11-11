const PassCode = require('../../../Routes/functions/PassCode')
const { e } = require('../../../database/emojis.json')
const Super = require('../../../Routes/classes/SupremacyClass')
const { ServerDb } = require('../../../Routes/functions/database')

module.exports = {
    name: 'giveaway',
    aliases: ['sorteio', 'sortear'],
    category: 'moderation',
    UserPermissions: ['ADMINISTRATOR'],
    ClientPermissions: ['ADD_REACTIONS'],
    emoji: '🎉',
    usage: '<gw> [info]',
    description: 'Fazer sorteio nunca foi tão legal',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {


        return message.reply(`${e.Loading} | Em construção`)

        // const GwManager = new Super.GiveawayManager(message.guild)

        // const { ms, parsems, NewGiveAwayCode, SorteiosAtivados, Emojis } = {
        //     ms: Super.ms,
        //     parsems: Super.parsems,
        //     NewGiveAwayCode: PassCode(7),
        //     SorteiosAtivados: GwManager.openGiveaways(),
        //     Emojis: ['✅', '❌'],
        //     GwChannel: GwManager.Channel(),
        //     Tada: e.Tada
        // }

        // if (!GwChannel) return message.reply(`${e.Info} | Não sabe usar o comando de sorteio? Use  \`${prefix}giveaway info\`.`)

        // if (['setchannel'].includes(args[0]?.toLowerCase())) return SetGiveawayChannel()
        // if (['new', 'create', 'novo'].includes(args[0]?.toLowerCase())) return NewGiveaway()

        // function NewGiveaway() {

        //     const time = args[1]
        //     const winners = args[2]
        //     const description = args.slice(3).join(' ')

        //     const WrongParams = `${e.Info} | Para criar um novo sorteio, use esses parâmetros: \`${prefix}gw [tempo] [vencedores] [descrição do sorteio/prêmio]\`\nExemplo: \`${prefix}gw 2h 2 Vaga na Staff\` -> 2 horas, 2 vencedores, vaga na staff`

        //     if (!time) return message.reply(`${e.Deny} Sem tempo definido\n \n${WrongParams}`)
        //     if (!winners) return message.reply(`${e.Deny} Sem vencedores definido\n \n${WrongParams}`)
        //     if (!description) return message.reply(`${e.Deny} Sem descrição definida\n \n${WrongParams}`)

        //     const Time, Winners, Description


        //     if (!['m', 'h', 'd'].includes(time.slice(-1)))
        //         return message.reply(`${e.Deny} | Tempo inválido! Verifique se o tempo termina com **"m, h, d"** *(minutos, horas, dias)*`)

        // }

        // function SetGiveawayChannel() {
        //     const Canal = message.mentions.channels.first()

        //     if (!Canal)
        //         return message.reply(`${e.Info} | Mencione um #canal para que eu possa configura-lo como um canal de sorteio.`)

        //     ServerDb.set(`Servers.${message.guild.id}.GiveawayChannel`, Canal.id)
        //     return message.channel.send(`${e.Check} | O canal ${Canal} foi configurado como canal de sorteio. Agora, todos os sorteios serão enviados neste canal.`)
        // }

    }
}