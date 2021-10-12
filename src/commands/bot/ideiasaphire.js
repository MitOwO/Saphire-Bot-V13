const { config } = require('../../../Routes/config.json')
const { e } = require('../../../Routes/emojis.json')
const { N } = require('../../../Routes/nomes.json')
const ms = require('parse-ms')
const Error = require('../../../Routes/functions/errors')

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

        let time = ms(900000 - (Date.now() - db.get(`${message.author.id}.Timeouts.Ideiasaphire`)))
        if (db.get(`${message.author.id}.Timeouts.Ideiasaphire`) !== null && 900000 - (Date.now() - db.get(`${message.author.id}.Timeouts.Ideiasaphire`)) > 0)
            return message.reply(`⏱️ | Global Cooldown | \`${time.hours}h ${time.minutes}m e ${time.seconds}s\``).catch(() => { })

        const ChannelId = config.SugestChannelId
        let mensagem = args.join(" ")

        const noargs = new MessageEmbed().setColor('#246FE0').setTitle(`${e.CoolDoge} Teve uma ideia daora?`).setDescription('Com este comando, você manda sua ideia direto pro meu criador.').addField('Requisitos', `**NADA** pornográfico ou de cunho criminoso.\nPara mandar um gif, \`${prefix}gif\`\nFale bem a sua ideia para não ser recusada/mal compreendida.\nSua ideia contém imagem? Manda com um link.`).addField('Comando exemplo', `\`${prefix}sugerir Que tal colocar um comando em que todos podem dar suas ideias pra ${client.user.username}?\``).addField('Comando exemplo com imagem', `\`${prefix}sugerir Que tal colocar um comando em que todos podem dar suas ideias pra ${client.user.username}? https://linkdaimagem.com\``).setFooter(`Sugestão grande demais? Use o ${prefix}bin`)
        if (!args[0]) { return message.reply({ embeds: [noargs] }) }
        if (mensagem.length < 15 || mensagem.length > 2000) { return message.reply(`${e.Deny} | Por favor, descreva sua sugestão entre **10~2000 caracteres**.`) }

        let CanalDeConvite = await message.channel

        function WithChannel() {
            db.set(`${message.author.id}.Timeouts.Ideiasaphire`, Date.now())
            CanalDeConvite.createInvite({ maxAge: 0 }).then(ChannelInvite => {
                const newideia = new MessageEmbed().setColor('GREEN').setTitle('📢 Nova Sugestão Recebida').addField('Enviado por', `${message.author.tag} - *\`${message.author.id}\`*`, true).addField('Servidor', `[${message.guild.name}](${ChannelInvite.url}) - *\`${message.guild.id}\`*`).addField('Sugestão', mensagem)
                if (!ChannelId) { return message.reply(`${e.Deny} | Eu não encontrei o canal de envio no meu servidor central.\nPor favor, contacte meu criador --> ${N.Rody} <---`) } else {
                    const channel = client.channels.cache.get(ChannelId); if (!channel) { return message.reply(`${e.Deny} | Eu não encontrei o canal de envio no meu servidor central.\nPor favor, contacte meu criador --> ${N.Rody} <---`) } else {
                        channel.send({ embeds: [newideia] }).then(() => {
                            setTimeout(() => { message.reply(`${e.Check} | Sua sugestão foi enviada com sucesso!\nVocê vai receber uma recompensa no banco em breve.`) }, 2000)
                        }).catch(err => {
                            Error(message, err)
                            return message.reply(`${e.Deny} | Ocorreu um erro no envio da mensagem... Contacte meu criador, por favor. --> ${N.Rody} <--\n\`${err}\``)
                        })
                    }
                }
            }).catch(() => {
                db.set(`${message.author.id}.Timeouts.Ideiasaphire`, Date.now())
                const newideianoinvite = new MessageEmbed().setColor('GREEN').setTitle('📢 Nova Sugestão Recebida').addField('Enviado por', `${message.author.tag} - *\`${message.author.id}\`*`, true).addField('Servidor', `${message.guild.name} - *\`${message.guild.id}\`*`).addField('Sugestão', mensagem)
                if (!ChannelId) { return message.reply(`${e.Deny} | Eu não encontrei o canal de envio no meu servidor central.\nPor favor, contacte meu criador --> ${N.Rody} <---`) } else {
                    const channel = client.channels.cache.get(ChannelId); if (!channel) { return } else {
                        channel.send({ embeds: [newideianoinvite] }).then(() => {
                            setTimeout(() => { message.reply(`${e.Check} | Sua sugestão foi enviada com sucesso!\nVocê vai receber uma recompensa no banco em breve.`) }, 2000)
                        }).catch(err => {
                            Error(message, err)
                            return message.reply(`${e.Deny} | Ocorreu um erro no envio da mensagem... Contacte meu criador, por favor. --> ${N.Rody} <--\n\`${err}\``)
                        })
                    }
                }
            })
        }

        function WithoutChannel() {
            db.set(`${message.author.id}.Timeouts.Ideiasaphire`, Date.now())
            const newideianoinvite = new MessageEmbed().setColor('GREEN').setTitle('📢 Nova Sugestão Recebida').addField('Enviado por', `${message.author.tag} - *\`${message.author.id}\`*`, true).addField('Servidor', `${message.guild.name} - *\`${message.guild.id}\`*`).addField('Sugestão', mensagem)
            if (!ChannelId) { return message.reply(`${e.Deny} | Eu não encontrei o canal de envio no meu servidor central.\nPor favor, contacte meu criador --> ${N.Rody} <---`) } else {
                const channel = client.channels.cache.get(ChannelId); if (!channel) { return } else {
                    channel.send({ embeds: [newideianoinvite] }).then(() => {
                        setTimeout(() => { message.reply(`${e.Check} | Sua sugestão foi enviada com sucesso!\nVocê vai receber uma recompensa no banco em breve.`) }, 2000)
                    }).catch(err => {
                        Error(message, err)
                        return message.reply(`${e.Deny} | Ocorreu um erro no envio da mensagem... Contacte meu criador, por favor. --> ${N.Rody} <--\n\`${err}\``)
                    })
                }
            }
        }

        CanalDeConvite ? WithChannel() : WithoutChannel()
    }
}