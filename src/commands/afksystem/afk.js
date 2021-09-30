const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'afk',
    aliases: ['off', 'offline'],
    category: 'afksystem',
    UserPermissions: '',
    ClientPermissions: ['ADD_REACTIONS', 'MANAGE_MASSAGES'],
    emoji: `${e.Afk}`,
    usage: '<afk> <motivo>',
    description: 'Com este comando, eu aviso pra todos que chamarem você que você está offline',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

        let Motivo = args.join(" ")
        if (Motivo.length > 150) return message.reply(`${e.Deny} | O seu motivo não pode passar de 150 caracteres.`)
        if (!Motivo) Motivo = 'Sem recado definido.'
        
        const AfkInfoEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(`${e.Planet} Afk Global System`)
            .setDescription('Utilize este comando para avisar que você está offline.')
            .addField(`${e.Info} | Emojis de Ativação`, `✅ | Ative o AFK somente no servidor\n🌎 | Ative o AFK em todos os servidores\n❓ | Esta paginazinha de Ajuda\n❌ | Cancele o comando`)
            .addField(`${e.Warn} | Atenção!`, `1. \`Modo Global\` Será desativado quando você mandar mensagem em qualquer servidor que eu esteja.\n2. \`Ativação sem mensagem\` Eu direi que você está offline, porém, sem recado algum.`)

        return message.reply(`${e.Planet} | AFK Global System`).then(msg => {
            db.set(`Request.${message.author.id}`, `${msg.url}`)
            msg.react('✅').catch(err => { }) // AFK Server
            msg.react('🌎').catch(err => { }) // AFK Global
            msg.react('❓').catch(err => { }) // AFK Info
            msg.react('❌').catch(err => { }) // Cancelar

            let FilterServer = (reaction, user) => { return reaction.emoji.name === '✅' && user.id === message.author.id };
            let AfkServer = msg.createReactionCollector({ filter: FilterServer, max: 1, errors: ['max'] })

            let FilterGlobal = (reaction, user) => { return reaction.emoji.name === '🌎' && user.id === message.author.id };
            let AfkGlobal = msg.createReactionCollector({ filter: FilterGlobal, max: 1, errors: ['max'] })

            let FilterInfo = (reaction, user) => { return reaction.emoji.name === '❓' && user.id === message.author.id };
            let AfkInfo = msg.createReactionCollector({ filter: FilterInfo, max: 1, errors: ['max'] })

            let FilterCancel = (reaction, user) => { return reaction.emoji.name === '❌' && user.id === message.author.id };
            let Cancel = msg.createReactionCollector({ filter: FilterCancel, time: 15000, max: 1, errors: ['max', 'time'] })

            AfkServer.on('collect', (reaction, user) => {
                db.set(`Servers.${message.guild.id}.AfkSystem.${message.author.id}`, Motivo)
                message.channel.sendTyping().then(() => {
                    setTimeout(() => {
                        db.delete(`Request.${message.author.id}`);
                        return message.reply(`${e.Check} | Pode deixar! Vou avisar a todos nesse servidor que te chamarem que você está offline. ${e.SaphireFeliz}`)
                    }, 2000)
                }).catch(err => { })
            })

            AfkGlobal.on('collect', (reaction, user) => {
                db.set(`Client.AfkSystem.${message.author.id}`, Motivo)
                message.channel.sendTyping().then(() => { setTimeout(() => { db.delete(`Request.${message.author.id}`); return message.reply(`${e.Planet} | Deixa comigo! Vou avisar em todos os servidores que você está offline. ${e.Menhera}`) }, 2000) }).catch(err => { })
            })

            AfkInfo.on('collect', () => { message.channel.sendTyping().then(() => { setTimeout(() => { db.delete(`Request.${message.author.id}`); return message.reply({ embeds: [AfkInfoEmbed] }) }, 2000) }).catch(err => { }) })

            Cancel.on('collect', () => { db.delete(`Request.${message.author.id}`); msg.delete().catch(err => { }) })
            AfkServer.on('end', () => { db.delete(`Request.${message.author.id}`); msg.delete().catch(err => { }) })
            AfkGlobal.on('end', () => { db.delete(`Request.${message.author.id}`); msg.delete().catch(err => { }) })
            AfkInfo.on('end', () => { db.delete(`Request.${message.author.id}`); msg.delete().catch(err => { }) })
            Cancel.on('end', () => { db.delete(`Request.${message.author.id}`); msg.delete().catch(err => { }) })
        }).catch(err => {
            return message.reply(`${e.Warn} | Houve um erro ao executar este comando.\n\`${err}\``)
        })
    }
}