const { config } = require('../../../Routes/config.json')
const { e } = require('../../../Routes/emojis.json')
const { N } = require('../../../Routes/nomes.json')
const ms = require('parse-ms')
const Error = require('../../../Routes/functions/errors')

module.exports = {
    name: 'sendcantada',
    aliases: ['enviarcantada'],
    category: 'bot',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: '📨',
    usage: '<sendcantada> <A sua cantada>',
    description: 'Envie cantadas para o comando `cantada`',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let block = db.get(`Client.BlockUsers.${message.author.id}`)
        if (block) return message.reply(`${e.Deny} | Você está bloqueado e perdeu acesso aos seguintes comandos: \`${prefix}bug\` \`${prefix}sendcantada\` \`${prefix}ideiasaphire\` \`${prefix}gif\``)

        const channel = config.CantadasChannelId

        const noargs = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(':heart_on_fire: Envie suas cantadas!')
            .setDescription('Com este comando, você envia cantadas para serem adicionadas ao meu pack de cantadas!')
            .addField('Comando', `\`${prefix}sendcantada\` Sua cantada em diante`)
            .setFooter('Limite de 200 caracteres.')

        if (!args[0]) { return message.reply({ embeds: [noargs] }) }

        let timeout = 900000
        let author = db.get(`User.${message.author.id}.Timeouts.Cantada`)

        if (author !== null && timeout - (Date.now() - author) > 0) {
            let time = ms(timeout - (Date.now() - author))

            return message.reply(`⏱️ | Global Cooldown | \`${time.hours}h ${time.minutes}m e ${time.seconds}s\``).catch(err => { })
        } else {

            const cantada = args.join(" ")

            const NovaCantadaEmbed = new MessageEmbed()
                .setColor('BLUE')
                .setTitle('📢 Nova Cantada Recebida')
                .setDescription(`**Enviado por:** ${message.author.tag} *\`(${message.author.id})\`*`)
                .addField('Cantada', cantada)

            if (cantada.length < 15 || cantada.length > 200) { return message.reply(`${e.Deny} | Por favor, escreva uma cantada que tenha entre **15~200 caracteres**.`) }

            const canal = await client.channels.cache.get(channel)
            if (!canal) return message.reply(`${e.Deny} | Eu não encontrei o canal de envio no meu servidor central.\nPor favor, contacte meu criador --> ${N.Rody} <---`)
            canal.send({ embeds: [NovaCantadaEmbed] }).then(() => {
                db.set(`User.${message.author.id}.Timeouts.Cantada`, Date.now())
                message.channel.sendTyping()
                setTimeout(() => { message.reply(`${e.Check} | Sua cantada foi enviada com sucesso!\nVocê vai receber uma recompensa no banco em breve.`) }, 2000)

            }).catch(err => {
                Error(message, err)
                return message.channel.send(`${e.Deny} | Ocorreu um erro no envio.\n\`${err}\``) })
        }
    }
}