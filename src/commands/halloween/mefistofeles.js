const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const Error = require('../../../Routes/functions/errors')
const colors = require('../../../Routes/functions/colors')
const Moeda = require('../../../Routes/functions/moeda')

// #246FE0 - Azul Saphire
module.exports = {
    name: 'mefistofeles',
    aliases: ['mefistófeles'],
    category: 'halloween',
    ClientPermissions: ['MANAGE_MESSAGES', 'ADD_EMOJIS'],
    emoji: `${e.AnelDeSauro}`,
    usage: 'mefistófeles',
    description: 'Halloween Event',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (db.get(`Halloween.${message.author.id}.Slot.AnelDeSauro`))
            return message.reply(`🎃 | Você já obteve o ${e.AnelDeSauro} Anel de Sauro`)

        if (request) return message.reply(`🎃 | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

        return message.reply(`Tem certeza que deseja invocar o Mefistófeles? Isso irá te custar 15000 ${Moeda(message)}\n \nEle te fará uma pergunta, se acertar ganhará o ${e.AnelDeSauro} Anel de Sauron, se errar perderá a sua alma.`).then(msg => {
            db.set(`Request.${message.author.id}`, `${msg.url}`)
            msg.react('✅').catch(() => { }) // Check
            msg.react('❌').catch(() => { }) // X

            const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

            msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                const reaction = collected.first()

                if (reaction.emoji.name === '✅') {
                    db.delete(`Request.${message.author.id}`)
                    if (db.get(`Balance_${message.author.id}`) < 15000)
                        return msg.edit(`${e.Deny} | Você não possui 15000 ${Moeda(message)} na carteira.`)

                    msg.delete().catch(() => { })
                    return GetNewQuestion()
                } else {
                    db.delete(`Request.${message.author.id}`)
                    msg.edit(`🎃 | Comando cancelado.`).catch(() => { })
                }
            }).catch(() => {
                db.delete(`Request.${message.author.id}`)
                msg.edit(`🎃 | Comando cancelado por tempo expirado.`).catch(() => { })
            })

        }).catch(err => {
            Error(message, err)
            message.channel.send(`${e.SaphireCry} | Ocorreu um erro durante o processo. Por favor, reporte o ocorrido usando \`${prefix}bug\`\n\`${err}\``)
        })

        function GetNewQuestion() {
            let random = Math.floor(Math.random() * 3)
            db.subtract(`Balance_${message.author.id}`, 15000)

            switch (random) {
                case 1:
                    MefistofelesQuestion1()
                    break;
                case 2:
                    MefistofelesQuestion2()
                    break;
                case 3:
                    MefistofelesQuestion3()
                    break;
                case 4:
                    MefistofelesQuestion4()
                    break;
                case 5:
                    MefistofelesQuestion5()
                    break;
                case 6:
                    MefistofelesQuestion6()
                    break;
                default:
                    message.reply('🎃 | Mefistófeles se recusou a lhe fazer uma pergunta.').catch(() => { })
                    break;
            }
        }

        function MefistofelesQuestion1() {

            message.channel.send(`${message.author}, Mefistófeles diz:\n \nEu sou Mefistófeles é minha pergunta é...\n \n*É mais poderoso que os deuses, mais maligno que os demônios. É algo que os pobres tem e os ricos precisam. Se você comê-lo, você morre. O que é isto?*`).then(msg => {

                const filter = m => m.author.id === message.author.id
                const collector = message.channel.createMessageCollector({ filter, max: 1, time: 15000 });

                collector.on('collect', m => {

                    if (['o nada', 'nada'].includes(m.content.toLowerCase()))
                        return SetNewItem()
                    else WrongAnswer();

                    function SetNewItem() {
                        db.set(`Halloween.${message.author.id}.Slot.AnelDeSauro`, true)
                        msg.edit({
                            content: `Exato ${message.author}! O Anel é seu. Use-o com sabedoria!`,
                            embeds: [new MessageEmbed().setColor(colors(message.member)).setTitle(`🎃 ${client.user.username} Halloween Event`).setDescription(`Você obteve o ${e.AnelDeSauro} Anel de Sauro`)]
                        })
                    }

                    function WrongAnswer() {
                        db.subtract(`Balance_${message.author.id}`, 1000)
                        msg.edit({ content: `Parece que sua alma é minha. Aceito 1000 ${Moeda(message)} por ela, não vale muita coisa mesmo`, }).catch(() => { })
                        collector.stop()
                    }


                });

            }).catch(err => {
                Error(message, err)
                message.channel.send(`${e.SaphireCry} | Ocorreu um erro durante o processo. Por favor, reporte o ocorrido usando \`${prefix}bug\`\n\`${err}\``)
            })

        }

        function MefistofelesQuestion2() {

            message.channel.send(`${message.author}, Mefistófeles diz:\n \nEu sou Mefistófeles é minha pergunta é...\n \n*Eu nunca fui, mas sempre serei. Ninguém nunca me viu, e nunca verão. E ainda assim, sou a esperança de todos. Quem sou eu?*`).then(msg => {

                const filter = m => m.author.id === message.author.id
                const collector = message.channel.createMessageCollector({ filter, max: 1, time: 15000 });

                collector.on('collect', m => {

                    if (['o futuro', 'futuro'].includes(m.content.toLowerCase()))
                        return SetNewItem()
                    else WrongAnswer();

                    function SetNewItem() {
                        db.set(`Halloween.${message.author.id}.Slot.AnelDeSauro`, true)
                        msg.edit({
                            content: `Exato ${message.author}! O Anel é seu. Use-o com sabedoria!`,
                            embeds: [new MessageEmbed().setColor(colors(message.member)).setTitle(`🎃 ${client.user.username} Halloween Event`).setDescription(`Você obteve o ${e.AnelDeSauro} Anel de Sauro`)]
                        })
                    }

                    function WrongAnswer() {
                        db.subtract(`Balance_${message.author.id}`, 1000)
                        msg.edit({ content: `Parece que sua alma é minha. Aceito 1000 ${Moeda(message)} por ela, não vale muita coisa mesmo`, }).catch(() => { })
                        collector.stop()
                    }


                });

            }).catch(err => {
                Error(message, err)
                message.channel.send(`${e.SaphireCry} | Ocorreu um erro durante o processo. Por favor, reporte o ocorrido usando \`${prefix}bug\`\n\`${err}\``)
            })

        }

        function MefistofelesQuestion3() {

            message.channel.send(`${message.author}, Mefistófeles diz:\n \nEu sou Mefistófeles é minha pergunta é...\n \n*Diga o que sou e eu desapareço.*`).then(msg => {

                const filter = m => m.author.id === message.author.id
                const collector = message.channel.createMessageCollector({ filter, max: 1, time: 15000 });

                collector.on('collect', m => {

                    if (['o silêncio', 'silêncio'].includes(m.content.toLowerCase()))
                        return SetNewItem()
                    else WrongAnswer();

                    function SetNewItem() {
                        db.set(`Halloween.${message.author.id}.Slot.AnelDeSauro`, true)
                        msg.edit({
                            content: `Exato ${message.author}! O Anel é seu. Use-o com sabedoria!`,
                            embeds: [new MessageEmbed().setColor(colors(message.member)).setTitle(`🎃 ${client.user.username} Halloween Event`).setDescription(`Você obteve o ${e.AnelDeSauro} Anel de Sauro`)]
                        })
                    }

                    function WrongAnswer() {
                        db.subtract(`Balance_${message.author.id}`, 1000)
                        msg.edit({ content: `Parece que sua alma é minha. Aceito 1000 ${Moeda(message)} por ela, não vale muita coisa mesmo`, }).catch(() => { })
                        collector.stop()
                    }


                });

            }).catch(err => {
                Error(message, err)
                message.channel.send(`${e.SaphireCry} | Ocorreu um erro durante o processo. Por favor, reporte o ocorrido usando \`${prefix}bug\`\n\`${err}\``)
            })

        }

        function MefistofelesQuestion4() {

            message.channel.send(`${message.author}, Mefistófeles diz:\n \nEu sou Mefistófeles é minha pergunta é...\n \n*Eu sou o mais antigo, porém sou o mais novo. O que sou eu?*`).then(msg => {

                const filter = m => m.author.id === message.author.id
                const collector = message.channel.createMessageCollector({ filter, max: 1, time: 15000 });

                collector.on('collect', m => {

                    if (['tempo', 'o tempo'].includes(m.content.toLowerCase()))
                        return SetNewItem()
                    else WrongAnswer();

                    function SetNewItem() {
                        db.set(`Halloween.${message.author.id}.Slot.AnelDeSauro`, true)
                        msg.edit({
                            content: `Exato ${message.author}! O Anel é seu. Use-o com sabedoria!`,
                            embeds: [new MessageEmbed().setColor(colors(message.member)).setTitle(`🎃 ${client.user.username} Halloween Event`).setDescription(`Você obteve o ${e.AnelDeSauro} Anel de Sauro`)]
                        })
                    }

                    function WrongAnswer() {
                        db.subtract(`Balance_${message.author.id}`, 1000)
                        msg.edit({ content: `Parece que sua alma é minha. Aceito 1000 ${Moeda(message)} por ela, não vale muita coisa mesmo`, }).catch(() => { })
                        collector.stop()
                    }


                });

            }).catch(err => {
                Error(message, err)
                message.channel.send(`${e.SaphireCry} | Ocorreu um erro durante o processo. Por favor, reporte o ocorrido usando \`${prefix}bug\`\n\`${err}\``)
            })

        }

        function MefistofelesQuestion5() {

            message.channel.send(`${message.author}, Mefistófeles diz:\n \nEu sou Mefistófeles é minha pergunta é...\n \n*Eu nasci para servir o homem, mas o homem que me serve. Quem sou eu?*`).then(msg => {

                const filter = m => m.author.id === message.author.id
                const collector = message.channel.createMessageCollector({ filter, max: 1, time: 15000 });

                collector.on('collect', m => {

                    if (['dinheiro', 'o dinheiro'].includes(m.content.toLowerCase()))
                        return SetNewItem()
                    else WrongAnswer();

                    function SetNewItem() {
                        db.set(`Halloween.${message.author.id}.Slot.AnelDeSauro`, true)
                        msg.edit({
                            content: `Exato ${message.author}! O Anel é seu. Use-o com sabedoria!`,
                            embeds: [new MessageEmbed().setColor(colors(message.member)).setTitle(`🎃 ${client.user.username} Halloween Event`).setDescription(`Você obteve o ${e.AnelDeSauro} Anel de Sauro`)]
                        })
                    }

                    function WrongAnswer() {
                        db.subtract(`Balance_${message.author.id}`, 1000)
                        msg.edit({ content: `Parece que sua alma é minha. Aceito 1000 ${Moeda(message)} por ela, não vale muita coisa mesmo`, }).catch(() => { })
                        collector.stop()
                    }


                });

            }).catch(err => {
                Error(message, err)
                message.channel.send(`${e.SaphireCry} | Ocorreu um erro durante o processo. Por favor, reporte o ocorrido usando \`${prefix}bug\`\n\`${err}\``)
            })

        }

        function MefistofelesQuestion6() {

            message.channel.send(`${message.author}, Mefistófeles diz:\n \nEu sou Mefistófeles é minha pergunta é...\n \n*Grande e frio de perto, pequeno e quente de longe. Quem sou eu?*`).then(msg => {

                const filter = m => m.author.id === message.author.id
                const collector = message.channel.createMessageCollector({ filter, max: 1, time: 15000 });

                collector.on('collect', m => {

                     WrongAnswer();

                    function WrongAnswer() {
                        db.subtract(`Balance_${message.author.id}`, 1000)
                        msg.edit({ content: `Parece que sua alma é minha. Aceito 1000 ${Moeda(message)} por ela, não vale muita coisa mesmo`, }).catch(() => { })
                        collector.stop()
                    }
                });

            }).catch(err => {
                Error(message, err)
                message.channel.send(`${e.SaphireCry} | Ocorreu um erro durante o processo. Por favor, reporte o ocorrido usando \`${prefix}bug\`\n\`${err}\``)
            })

        }
    }
}