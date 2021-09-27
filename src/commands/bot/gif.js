const { config } = require('../../../Routes/config.json')
const { e } = require('../../../Routes/emojis.json')
const { N } = require('../../../Routes/nomes.json')
const ms = require('parse-ms')
const Error = require('../../../Routes/functions/errors')

module.exports = {
    name: 'gif',
    aliases: ['sendgif', 'enviargif', 'gifs'],
    category: 'bot',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: '📨',
    usage: '<gifs> <tema> <linkdogif>',
    description: 'Envie gifs para serem adicionados ao meu package',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let block = db.get(`Client.BlockUsers.${message.author.id}`)
        if (block) return message.reply(`${e.Deny} | Você está bloqueado e perdeu acesso aos seguintes comandos: \`${prefix}bug\` \`${prefix}sendcantada\` \`${prefix}ideiasaphire\` \`${prefix}gif\``)

        const channel = config.GifsChannelId

        function is_url(str) {
            let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
            if (regexp.test(str)) { return true } else { return false }
        }

        let tema = args[0]
        let link = args[1]

        const noargs = new MessageEmbed()
            .setColor('BLUE')
            .setTitle('📢 Envie Gifs')
            .setDescription(`Por causa de tantos comandos e centenas de gifs, ficou ruim para apenas uma pessoa pegar todos os gifs, então, este comando foi feito.\n \nEnvie gifs pra ${client.user.username}! Só seguir os requisitos.`)
            .addField('Requisitos', '1. **NADA** pornográfico ou de cunho criminoso.\n2. Fale para qual tema você quer que eu coloque seu gif')
            .addField('Comando exemplo', `\`${prefix}gif Naruto https://imgur.com/F1nJKHZ\``)
            .setImage('https://imgur.com/F1nJKHZ.gif')
            .setFooter('O Gif será enviado diretamente para o meu criador.')

        if (!tema) { return message.reply({ embeds: [noargs] }) }

        let timeout = 900000
        let author = db.get(`${message.author.id}.Timeouts.Gif`)

        if (author !== null && timeout - (Date.now() - author) > 0) {
            let time = ms(timeout - (Date.now() - author))

            return message.reply(`⏱️ | Global Cooldown | \`${time.hours}h ${time.minutes}m e ${time.seconds}s\``).catch(err => { })
        } else {

            if (!link) { return message.reply(`${e.Deny} | Formato incorreto.\n\`${prefix}gif Naruto LINK\`, tipo assim -> https://imgur.com/F1nJKHZ`) }
            if (is_url(link) === false) { return message.reply(`${e.Deny} | **${link}** | Não é um link.`) }
            if (args[2]) { return message.reply(`${e.Deny} | Formato incorreto.\n\`${prefix}gif Naruto LINK\`, tipo assim -> https://imgur.com/F1nJKHZ`) }

            const newgif = new MessageEmbed()
                .setColor('BLUE')
                .setTitle('📢 Novo Gif')
                .addField('Enviado por', `${message.author.tag} *\`${message.author.id}\`*`, true)
                .addField('Servidor', message.guild.name, true)
                .addField('Tema', tema, true)
                .addField('Link do Gif', `[link](${link})`, true)

            const canal = await client.channels.cache.get(channel)
            if (!canal) return message.reply(`${e.Deny} | Eu não encontrei o canal de envio no meu servidor central.\nPor favor, contacte meu criador --> ${N.Rody} <---`)
            canal.send({ embeds: [newgif] }).then(() => {
                db.set(`${message.author.id}.Timeouts.Gif`, Date.now())
                message.channel.sendTyping()
                setTimeout(() => { message.reply(`${e.Check} | Sua sugestão foi enviada com sucesso!\nVocê vai receber uma recompensa no banco em breve.`) }, 2000)
            }).catch(err => {
                Error(message, err)
                return message.channel.send(`${e.Deny} | Ocorreu um erro no envio.\n\`${err}\``)
            })
        }
    }
}