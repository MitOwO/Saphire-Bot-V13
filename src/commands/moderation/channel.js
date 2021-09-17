const { e } = require('../../../Routes/emojis.json')
const { Permissions } = require('discord.js')

module.exports = {
    name: 'channel',
    aliases: ['setchannel', 'canal'],
    category: 'moderation',
    UserPermissions: 'MANAGE_CHANNELS',
    ClientPermissions: 'MANAGE_CHANNELS',
    emoji: `${e.ModShield}`,
    usage: '<channel>',
    description: 'Configure os canais rapidamente',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        const noargs = new MessageEmbed()
            .setColor('BLUE')
            .setTitle('🛠️ Gerenciamento de Canais')
            .setDescription('Com este comando você pode gerenciar os canais rapidamente.\n<opicional>')
            .addField('Mude o Nome', `\`${prefix}channel name <#canal> NomeDoCanal\``)
            .addField('Mude o Tópico', `\`${prefix}channel topic <#canal> O novo tópico irado do canal\``)
            .addField('Crie Canais', `\`${prefix}channel create text/voice NomeDoCanal\``)
            .addField('Delete Canais', `\`${prefix}channel delete <#canal>\``)
            .addField('Clone', `\`${prefix}channel clone <#canal>\``)
            .addField('Pegue o ID', `\`${prefix}channel id <#canal>\``)
            .addField('Crie um convite', `\`${prefix}channel invite <#canal>\``)
            .addField('Sincrozine as permissiões com a categoria', `\`${prefix}channel sync [#canal]\``)

        const canal = message.mentions.channels.first() || message.channel
        if (!args[0]) return message.reply({ embeds: [noargs] })

        switch (args[0]) {
            case 'name': case 'nome':
                SetName();
                break;
            case 'tópico': case 'topic': case 'topica':
                canal.isText() ? SetTopic() : message.reply(`${e.Deny} | Canais de voz não possuem tópicos.`)
                break;
            case 'create': case 'criar':
                CreateChannel()
                break;
            case 'delete': case 'deletar':
                ChannelDelete()
                break;
            case 'clone': case 'clonar': case 'duplicar':
                ChannelClone()
                break;
            case 'id':
                ChannelId()
                break;
            case 'invite': case 'convite': case 'inv':
                canal.permissionsFor(message.guild.me).has(Permissions.FLAGS.CREATE_INSTANT_INVITE) ? ChannelInvite() : message.reply(`${e.Deny} | Eu não tenho permissão para criar convites neste canal.`)
                break;
            case 'sync': case 'sincronize': case 'sincronizar':
                Sync()
                break;
            default: message.reply(`${e.Deny} | **${args[0]}** | Não está na lista de sub-comandos do comando \`${prefix}channel\`. <- Use este comando que te mando tudinho sobre o comando.`)
                break;
        }

        function Sync() {
            if (args[2]) return message.reply(`${e.Deny} | Não diga nada além do canal. Mencione o #canal ou digite \`${prefix}sync\` no canal no qual deseja sincronizar com sua categoria.`)

            if (!canal.parent) return message.reply(`${e.Deny} | Este canal não está em nenhuma categoria.`)
            if (canal.permissionsLocked === true) return message.reply(`${e.Check} | Este canal já está sincronizado.`)

            canal.lockPermissions().then(() => {
                return message.reply(`${e.Check} | Prontinho, o canal ${canal} foi sincronizado com as permissões da categoria **${canal.parent.name.toUpperCase()}**`)
            }).catch(err => {
                return message.reply(`${e.Attention} | Ocorreu um erro na execução da sincronização.\n\`${err}\``)
            })
        }

        function ChannelInvite() {
            if (!message.member.permissions.has(Permissions.FLAGS.CREATE_INSTANT_INVITE)) return message.reply(`${e.Deny} | Você não tem a permissão "Criar convite".`)
            canal.createInvite().then(invite => {
                return message.reply(`${e.Check} | Ok ok, está aqui o link.\nhttps://discord.gg/${invite.code}`)
            }).catch(err => {
                return message.channel.send(`${e.Deny} | Eu não tenho permissão para criar convites.`)
            });
        }

        function CreateChannel() {
            if (!args[1]) return message.reply(`${e.Deny} | Por favor, siga o formato correto.\n\`${prefix}channel create text/voice NomeDoCanal\``)

            if (['texto', 'text'].includes(args[1])) {

                const NomeDoCanal = args.slice(2).join(" ").toLowerCase()
                if (!NomeDoCanal) { return message.reply(`${e.Deny} | Você se esqueceu do nome do canal.\n\`${prefix}channel create text NomeDoCanal\``) }
                if (NomeDoCanal.length > 40) { return message.reply(`${e.Deny} | O nome do canal não pode ultrapassar **40 caracteres**`) }
                message.guild.channels.create(NomeDoCanal, { type: 'GUILD_TEXT' }).then(channel => {
                    return message.reply(`${e.Check} | Canal de texto criado com sucesso. | ${channel}`)
                }).catch(err => {
                    return message.channel.send(`${e.Deny} | Ocorreu um erro ao criar um novo canal.\n\`${err}\``)
                })

            } else if (['voice', 'voz'].includes(args[1])) {

                const NomeDoCanal = args.slice(2).join(" ").toLowerCase()
                if (!NomeDoCanal) { return message.reply(`${e.Deny} | Você se esqueceu do nome do canal.\n\`${prefix}channel create voice NomeDoCanal\``) }
                if (NomeDoCanal.length > 40) { return message.reply(`${e.Deny} | O nome do canal não pode ultrapassar **40 caracteres**`) }
                message.guild.channels.create(NomeDoCanal, { type: 'GUILD_VOICE' }).then(channel => {
                    return message.reply(`${e.Check} | Canal de voz criado com sucesso. ${channel}`)
                }).catch(err => {
                    return message.channel.send(`${e.Deny} | Ocorreu um erro ao criar um novo canal.\n\`${err}\``)
                })

            } else {
                return message.reply(`${e.Deny} | Por favor, siga o formato correto.\n\`${prefix}channel create text/voice NomeDoCanal\``)
            }
        }

        function ChannelId() { return message.reply(`${e.Info} | ${canal.name} | :id: *\`${canal.id}\`*`) }

        function ChannelClone() {
            canal.clone().then(channel => {
                return message.channel.send(`${e.Check} | Feito! O canal tá aqui: ${channel}`)
            }).catch(err => {
                return message.channel.send(`${e.Deny} | Houve um erro ao clonar o canal.\n\`${err}\``)
            })
        }

        function ChannelDelete() {
            if (request) return message.reply(`${e.Deny} | ${f.Request}`)
            if (args[2]) { return message.reply(`${e.Deny} | Tenta usar assim.\n\`${prefix}channel delete [#Canal(opcional)]\``) }

            return message.reply(`${e.QuestionMark} | Este comando vai literalmente deletar este canal, deseja prosseguir?`).then(msg => {
                db.set(`User.Request.${message.author.id}`, 'ON')
                msg.react('✅').catch(err => { return }) // Check
                msg.react('❌').catch(err => { return }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {
                        db.delete(`User.Request.${message.author.id}`)
                        canal.delete().catch(err => {
                            return message.reply('Ocorreu um erro na exclusão do canal.\n \n ' + err)
                        })
                    } else {
                        db.delete(`User.Request.${message.author.id}`)
                        msg.edit(`${e.Deny} | Request cancelada.`)
                    }
                }).catch(() => {
                    db.delete(`User.Request.${message.author.id}`)
                    msg.edit(`${e.Deny} | Request cancelada por tempo expirado.`)
                })
            })
        }

        function SetTopic() {
            const TopicoDoCanal = args.slice(1).join(" ")
            if (!TopicoDoCanal) { return message.reply(`${e.Deny} | Você não disse o novo tópico do canal.\n\`${prefix}channel topic O tópico do canal em diante.\``) }
            if (TopicoDoCanal.length > 1024) { return message.reply(`${e.Deny} | O novo tópico do canal não pode ultrapassar **1024 caracteres**`) }
            canal.setTopic(TopicoDoCanal).then(NewTopic => {
                return message.reply(`${e.Check} | Tópico do Canal alterado para - **${NewTopic}** - com sucesso.`)
            }).catch(err => {
                return message.channel.send(`${e.Deny} | Ocorreu um erro ao trocar o tópico do canal.\n\`${err}\``)
            })
        }

        function SetName() {
            const NovoNome = args.slice(2).join(" ").toLowerCase()
            if (!NovoNome) { return message.reply(`${e.Deny} | Você não me disse o novo nome do canal.\n\`${prefix}channel name #canal NomeDoCanal\``) }
            if (NovoNome.length > 40) { return message.reply(`${e.Deny} | O nome do canal não pode ultrapassar **40 caracteres**`) }
            canal.setName(NovoNome, [`Author: ${message.author.tag}`]).then(NewName => {
                return message.reply(`${e.Check} | Canal renomeado para **${NewName}**`)
            }).catch(err => { return message.channel.send(`${e.Deny} | Ocorreu um erro ao trocar o nome do canal.\n\`${err}\``) })
        }

    }
}