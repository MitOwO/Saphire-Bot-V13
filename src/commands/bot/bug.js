const { config } = require('../../../Routes/config.json')
const { e } = require('../../../Routes/emojis.json')
const { N } = require('../../../Routes/nomes.json')
const ms = require('parse-ms')

module.exports = {
    name: 'bug',
    aliases: ['sendbug', 'reportbug'],
    category: 'bot',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: '📨',
    usage: '<bug> <Report um bug>',
    description: 'Report bugs/erros diretamente pro meu criador',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let block = db.get(`Client.BlockUsers.${message.author.id}`)
        if (block) return message.reply(`${e.Deny} | Você está bloqueado e perdeu acesso aos seguintes comandos: \`${prefix}bug\` \`${prefix}sendcantada\` \`${prefix}ideiasaphire\` \`${prefix}gif\``)

        const channel = config.BugsChannelId

        const noargs = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(`${e.Gear} Reporte bugs/erros`)
            .setDescription('Com este comando, você reporta bugs/erros direto pro meu criador. Assim tudo é resolvido de maneira rápida! *(Links são permitidos)*')
            .addField('Comando exemplo', `\`${prefix}bug Quando eu uso "comando x" tal bug acontece\``)
            .setFooter('Quaisquer abuso deste comando não será tolerado.')

        if (!args[0]) { return message.reply({ embeds: [noargs] }) }

        let timeout = 900000
        let author = await db.get(`User.${message.author.id}.Timeouts.Bug`)

        if (author !== null && timeout - (Date.now() - author) > 0) {
            let time = ms(timeout - (Date.now() - author))

            return message.reply(`⏱️ | Global Cooldown | \`${time.hours}h ${time.minutes}m e ${time.seconds}s\``).catch(err => { return })
        } else {

            let mensagem = args.join(" ")
            if (mensagem === 'Quando eu uso "comando x" tal bug acontece') return message.reply(`${e.Nagatoro} | Está mensagem claramente não é permitida, né?`)
            if (mensagem.length < 10 || mensagem.length > 400) { return message.reply(`${e.Deny} | Por favor, relate o bug dentro de **10~400 caracteres.**`) }

            const ReportBugEmbed = new MessageEmbed()
                .setColor('BLUE')
                .setTitle('📢 Report de Bugs/Erros Recebido')
                .addField('Enviado por', `${message.author.tag} (*\`${message.author.id}\`*)`, true)
                .addField('Relatório', mensagem)

            const canal = await client.channels.cache.get(channel)
            if (!canal) return message.reply(`${e.Deny} | Eu não encontrei o canal de envio no meu servidor central.\nPor favor, contacte meu criador --> ${N.Rody} <---`)
            canal.send({ embeds: [ReportBugEmbed] }).then(() => {
                db.set(`User.${message.author.id}.Timeouts.Bug`, Date.now())
                message.channel.sendTyping()
                setTimeout(() => { message.reply(`${e.Check} | Seu reporte foi enviado com sucesso!\nVocê vai receber uma recompensa no banco em breve.`) }, 2000)

            }).catch(err => { return message.channel.send(`${e.Deny} | Ocorreu um erro no envio.\n\`${err}\``) })

        }
    }
}