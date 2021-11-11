const { e } = require('../../../database/emojis.json')
const { f } = require('../../../database/frases.json')
const { ServerDb } = require('../../../Routes/functions/database')
const Error = require('../../../Routes/functions/errors')

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

        let Motivo = args.join(" ")
        if (Motivo.length > 150) return message.reply(`${e.Deny} | O seu motivo não pode passar de 150 caracteres.`)
        if (!Motivo) Motivo = 'Sem recado definido.'

        const AfkInfoEmbed = new MessageEmbed()
            .setColor('#246FE0')
            .setTitle(`${e.Planet} Afk Global System`)
            .setDescription('Utilize este comando para avisar que você está offline.')
            .addField(`${e.Info} | Emojis de Ativação`, `✅ | Ative o AFK somente no servidor\n🌎 | Ative o AFK em todos os servidores\n❓ | Esta paginazinha de Ajuda\n❌ | Cancele o comando`)
            .addField(`${e.Warn} | Atenção!`, `1. \`Modo Global\` Será desativado quando você mandar mensagem em qualquer servidor que eu esteja.\n2. \`Ativação sem mensagem\` Eu direi que você está offline, porém, sem recado algum.`)

        return message.reply(`${e.Planet} | AFK Global System`).then(async msg => {
            sdb.set(`Request.${message.author.id}`, `${msg.url}`)
            msg.react('✅').catch(() => { }) // AFK Server
            msg.react('🌎').catch(() => { }) // AFK Global
            msg.react('❓').catch(() => { }) // AFK Info
            msg.react('❌').catch(() => { }) // Cancelar

            let FilterServer = (reaction, user) => { return reaction.emoji.name === '✅' && user.id === message.author.id };
            let AfkServer = msg.createReactionCollector({ filter: FilterServer, max: 1, errors: ['max'] })

            let FilterGlobal = (reaction, user) => { return reaction.emoji.name === '🌎' && user.id === message.author.id };
            let AfkGlobal = msg.createReactionCollector({ filter: FilterGlobal, max: 1, errors: ['max'] })

            let FilterInfo = (reaction, user) => { return reaction.emoji.name === '❓' && user.id === message.author.id };
            let AfkInfo = msg.createReactionCollector({ filter: FilterInfo, max: 1, errors: ['max'] })

            let FilterCancel = (reaction, user) => { return reaction.emoji.name === '❌' && user.id === message.author.id };
            let Cancel = msg.createReactionCollector({ filter: FilterCancel, time: 15000, max: 1, errors: ['max', 'time'] })

            AfkServer.on('collect', (reaction, user) => {
                ServerDb.set(`Servers.${message.guild.id}.AfkSystem.${message.author.id}`, `${Motivo}`)
                sdb.delete(`Request.${message.author.id}`);
                return message.reply(`${e.Check} | Pode deixar! Vou avisar a todos nesse servidor que te chamarem que você está offline. ${e.SaphireFeliz}`)

            })

            AfkGlobal.on('collect', (reaction, user) => {
                sdb.set(`Users.${message.author.id}.AfkSystem`, `${Motivo}`)
                sdb.delete(`Request.${message.author.id}`);
                return message.reply(`${e.Planet} | Deixa comigo! Vou avisar em todos os servidores que você está offline. ${e.Menhera}`)
            })

            AfkInfo.on('collect', () => {
                sdb.delete(`Request.${message.author.id}`);
                return message.reply({ embeds: [AfkInfoEmbed] })
            })

            Cancel.on('collect', () => { sdb.delete(`Request.${message.author.id}`); msg.delete().catch(() => { }) })
            AfkServer.on('end', () => { sdb.delete(`Request.${message.author.id}`); msg.delete().catch(() => { }) })
            AfkGlobal.on('end', () => { sdb.delete(`Request.${message.author.id}`); msg.delete().catch(() => { }) })
            AfkInfo.on('end', () => { sdb.delete(`Request.${message.author.id}`); msg.delete().catch(() => { }) })
            Cancel.on('end', () => { sdb.delete(`Request.${message.author.id}`); msg.delete().catch(() => { }) })
        }).catch(err => {
            Error(message, err)
            sdb.delete(`Request.${message.author.id}`)
            return message.reply(`${e.Warn} | Houve um erro ao executar este comando.\n\`${err}\``)
        })
    }
}