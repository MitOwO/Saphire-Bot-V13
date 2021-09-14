const { config } = require('../../../Routes/config.json')
const { e } = require('../../../Routes/emojis.json')
const { N } = require('../../../Routes/nomes.json')
const ms = require('parse-ms')

module.exports = {
    name: 'ideiasaphire',
    aliases: ['sendideia', 'sugerir', 'sendsugest', 'sugest'],
    category: 'bot',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: '📨',
    usage: '<sugerir> <Sua sugestão>',
    description: 'Sugira algo para que meu criador insira no meu sistema',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let block = db.get(`Client.BlockUsers.${message.author.id}`)
        if (block) return message.reply(`${e.Deny} | Você está bloqueado e perdeu acesso aos seguintes comandos: \`${prefix}bug\` \`${prefix}sendcantada\` \`${prefix}ideiasaphire\` \`${prefix}gif\``)

        let timeout = 900000
        let author = await db.get(`User.${message.author.id}.Timeouts.Ideiasaphire`)

        if (author !== null && timeout - (Date.now() - author) > 0) {
            let time = ms(timeout - (Date.now() - author))

            return message.reply(`⏱️ | Global Cooldown | \`${time.hours}h ${time.minutes}m e ${time.seconds}s\``).catch(err => { return })
        } else {

            const channel = config.SugestChannelId

            let mensagem = args.join(" ")

            const noargs = new MessageEmbed()
                .setColor('BLUE')
                .setTitle(`${e.CoolDoge} Teve uma ideia daora?`)
                .setDescription('Com este comando, você manda sua ideia direto pro meu criador.')
                .addField('Requisitos', `**NADA** pornográfico ou de cunho criminoso.\nPara mandar um gif, \`${prefix}gif\`\nFale bem a sua ideia para não ser recusada/mal compreendida.\nSua ideia contém imagem? Manda com um link.`)
                .addField('Comando exemplo', `\`${prefix}sugerir Que tal colocar um comando em que todos podem dar suas ideias pra ${client.user.username}?\``)
                .addField('Comando exemplo com imagem', `\`${prefix}sugerir Que tal colocar um comando em que todos podem dar suas ideias pra ${client.user.username}? https://linkdaimagem.com\``)
                .setFooter(`Sugestão grande demais? Use o ${prefix}bin`)

            if (!args[0]) { return message.reply({ embeds: [noargs] }) }

            const newideia = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('📢 Nova Sugestão Recebida')
                .addField('Enviado por', `${message.author.tag} *\`(${message.author.id})\`*`, true)
                .addField('Sugestão', mensagem)

            if (mensagem.length < 10 || mensagem.length > 4000) { return message.reply(`${e.Deny} | Por favor, descreva sua sugestão entre **10~400 caracteres**.`) }

            const canal = await client.channels.cache.get(channel)
            if (!canal) return message.reply(`${e.Deny} | Eu não encontrei o canal de envio no meu servidor central.\nPor favor, contacte meu criador --> ${N.Rody} <---`)
            canal.send({ embeds: [newideia] }).then(() => {
                db.set(`User.${message.author.id}.Timeouts.Ideiasaphire`, Date.now())
                message.channel.sendTyping()
                setTimeout(() => { message.reply(`${e.Check} | Sua sugestão foi enviada com sucesso!\nVocê vai receber uma recompensa no banco em breve.`) }, 2000)
            }).catch(err => { return message.channel.send(`${e.Deny} | Ocorreu um erro no envio.\n\`${err}\``) })
        }
    }
}