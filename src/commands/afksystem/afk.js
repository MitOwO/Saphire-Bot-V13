const
    { e } = require('../../../database/emojis.json'),
    { f } = require('../../../database/frases.json'),
    { ServerDb } = require('../../../Routes/functions/database'),
    Error = require('../../../Routes/functions/errors'),
    Data = require('../../../Routes/functions/data')

module.exports = {
    name: 'afk',
    aliases: ['off', 'offline'],
    category: 'afksystem',
    ClientPermissions: ['ADD_REACTIONS'],
    emoji: `${e.Afk}`,
    usage: '<afk> <motivo>',
    description: 'Com este comando, eu aviso pra todos que chamarem você que você está offline',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${sdb.get(`Request.${message.author.id}`)}`)

        let Motivo = args.join(" ") || 'Sem recado definido.'
        if (Motivo.length > 500) return message.reply(`${e.Deny} | O seu motivo não pode passar de 500 caracteres.`)

        let BlockWords = ['undefined', 'false', 'null', 'nan']
        for (const word of BlockWords)
            if (Motivo.toLowerCase() === word)
                return message.channel.send(`${e.Deny} | ${message.author}, somente a palavra **${word}** é proibida neste comando. Escreva algo mais.`)

        const AfkInfoEmbed = new MessageEmbed()
            .setColor('#246FE0')
            .setTitle(`${e.Planet} Afk Global System`)
            .setDescription('Utilize este comando para avisar que você está offline.')
            .addField(`${e.Info} | Emojis de Ativação`, `✅ | Ative o AFK somente no servidor\n🌎 | Ative o AFK em todos os servidores\n❓ | Esta paginazinha de Ajuda\n❌ | Cancele o comando`)
            .addField(`${e.Warn} | Atenção!`, `1. \`Modo Global\` Será desativado quando você mandar mensagem em qualquer servidor que eu esteja.\n2. \`Ativação sem mensagem\` Eu direi que você está offline, porém, sem recado algum.`)

        return message.reply(`${e.Planet} | AFK Global System`).then(async msg => {
            sdb.set(`Request.${message.author.id}`, `${msg.url}`)

            for (const emoji of ['✅', '🌎', '❓', '❌']) msg.react(emoji).catch(() => { })

            let collector = msg.createReactionCollector({
                filter: (reaction, user) => ['✅', '🌎', '❓', '❌'].includes(reaction.emoji.name) && user.id === message.author.id,
                max: 1,
                time: 15000
            })

            collector.on('collect', (reaction, user) => {

                switch (reaction.emoji.name) {
                    case '❌':
                        collector.stop()
                        break;
                    case '✅':
                        ServerDb.set(`Servers.${message.guild.id}.AfkSystem.${message.author.id}`, `\`${Data()}\` | ${Motivo}`)
                        sdb.delete(`Request.${message.author.id}`)
                        message.reply(`${e.Check} | Pode deixar! Vou avisar a todos nesse servidor que te chamarem que você está offline. ${e.SaphireFeliz}`)
                        break;
                    case '🌎':
                        sdb.set(`Users.${message.author.id}.AfkSystem`, `\`${Data()}\` | ${Motivo}`)
                        sdb.delete(`Request.${message.author.id}`)
                        message.reply(`${e.Planet} | Deixa comigo! Vou avisar em todos os servidores que você está offline. ${e.Menhera}`)
                        break;
                    case '❓':
                        sdb.delete(`Request.${message.author.id}`)
                        message.reply({ embeds: [AfkInfoEmbed] })
                        break;
                    default:
                        collector.stop()
                        break;
                }
                
            })

            collector.on('end', () => {
                sdb.delete(`Request.${message.author.id}`)
                msg.delete().catch(() => { })
            })


        }).catch(err => {
            Error(message, err)
            sdb.delete(`Request.${message.author.id}`)
            return message.reply(`${e.Warn} | Houve um erro ao executar este comando.\n\`${err}\``)
        })
    }
}