const { Permissions } = require('discord.js')
const { e } = require('../../../Routes/emojis.json')
const Moeda = require('../../../Routes/functions/moeda')
const colors = require('../../../Routes/functions/colors')

module.exports = {
    name: 'buscar',
    aliases: ['bus', 'busca'],
    category: 'economy',
    ClientPermissions: 'ADD_REACTIONS',
    emoji: '🔦',
    usage: '<buscar>',
    description: 'Ajude a Princesa Kaya',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
            return message.channel.send(`${e.Deny} | Eu preciso da permissão \`GERENCIAR CANAIS\` para executar este comando.`)

        let timeout2 = 1500
        let author2 = await db.get(`${message.author.id}.Timeouts.Buscar`)
        if (author2 !== null && timeout2 - (Date.now() - author2) > 0) {
            return
        } else {

            let canal = message.guild.channels.cache.get(db.get(`Servers.${message.guild.id}.BuscaChannel`)) || false
            let comida = db.get(`${message.author.id}.Slot.Comidas`) || 0
            let machado = db.get(`${message.author.id}.Slot.Machado`) || false
            let MachadoUsos = db.get(`${message.author.id}.Slot.Machado.Usos`) || 0
            let bola = db.get(`${message.author.id}.Slot.Bola`) || false
            let dima = db.get(`${message.author.id}.Slot.DiamanteNegro`) || false
            let cachorro = db.get(`${message.author.id}.Slot.Cachorro`) || false
            let ossos = db.get(`${message.author.id}.Slot.Ossos`) || 0
            let DarkApple = db.get(`Halloween.${message.author.id}.Slot.DarkApple`) || false
            let PenaCorvo = db.get(`Halloween.${message.author.id}.Slot.Pena`) || false

            if (!canal)
                return message.reply(`${e.Deny} | Este comando requer um canal específico.\n${e.SaphireObs} | Você pode usar \`${prefix}channel farm buscar\` que eu faço tudo pra você!`)

            if (canal.id !== message.channel.id)
                return message.reply(`${e.SaphireObs} | Este não é o canal de busca. Chega mais, é aqui: ${canal}`)

            if (canal.rateLimitPerUser < 1)
                canal.setRateLimitPerUser(1, ['Cooldown é necessário.']).catch(err => { return message.channel.send(`${e.Warn} | Falha ao configurar o cooldown em 1 segundos.\n\`\`\`${err}\`\`\``) })

            if (!machado)
                return message.reply(`${e.Deny} | ${message.author}, você precisa de um machado. Compre um na \`${prefix}loja\``)

            if (MachadoUsos <= 0)
                return message.reply(`${e.Deny} | Seu machado está danificado! Restaure ele na \`${prefix}loja\``)

            if (comida >= 1) {
                db.subtract(`Xp_${message.author.id}`, 1)
                let rand = Math.floor(Math.random() * 100)
                let randa = Math.floor(Math.random() * 100)

                db.subtract(`Xp_${message.author.id}`, 2)
                db.set(`${message.author.id}.Timeouts.Buscar`, Date.now())
                db.subtract(`${message.author.id}.Slot.Comidas`, 1)
                db.subtract(`${message.author.id}.Slot.Machado.Usos`, 1)

                // TAG: HALLOWEEN EVENT
                if (!PenaCorvo && rand === 3)
                    return GetNewPena()

                if (!DarkApple && rand <= 2)
                    return GetNewDarkApple()

                function GetNewDarkApple() {
                    db.set(`Halloween.${message.author.id}.Slot.DarkApple`, true)
                    const DarkAppleEmbed = new MessageEmbed().setColor(colors(message.member)).setTitle(`🎃 ${client.user.username} Halloween Event`).setDescription(`Você obteve a ${e.DarkApple} Maça Negra`)
                    return message.reply({ embeds: [DarkAppleEmbed] })
                }

                function GetNewPena() {
                    db.set(`Halloween.${message.author.id}.Slot.Pena`, true)
                    const DarkAppleEmbed = new MessageEmbed().setColor(colors(message.member)).setTitle(`🎃 ${client.user.username} Halloween Event`).setDescription(`Você obteve a ${e.Pena} Pena de Corvo`)
                    return message.reply({ embeds: [DarkAppleEmbed] })
                }
                // ------------

                if (rand > 15) {
                    Lose()
                } else {

                    if (randa <= 4) {
                        let dinh = Math.floor(Math.random() * 30) + 1
                        let apple = Math.floor(Math.random() * 4) + 1
                        let comidas = Math.floor(Math.random() * 3) + 1
                        let rosas = Math.floor(Math.random() * 2) + 1

                        if (!bola) {
                            db.add(`${message.author.id}.Slot.Apple`, apple); db.add(`${message.author.id}.Slot.Comida`, comidas); db.add(`${message.author.id}.Slot.Rosas`, rosas); db.add(`Balance_${message.author.id}`, dinh); db.set(`${message.author.id}.Slot.Bola`, true);
                            const FlorestaEmbed = new MessageEmbed()
                                .setColor('GREEN')
                                .setTitle('⭐ Você adquiriu um item de Classe Especial')
                                .addField('Item: 🥎 Bola do Brown', `Você obteve: ${dinh} ${Moeda(message)}, ${apple} 🍎 Maças, ${comidas} 🥘 Comidas e ${rosas} 🌹 Rosas`)
                            return message.reply({ embeds: [FlorestaEmbed] })
                        } else {
                            db.add(`${message.author.id}.Slot.Apple`, apple)
                            db.add(`${message.author.id}.Slot.Comida`, comidas)
                            db.add(`${message.author.id}.Slot.Rosas`, rosas)
                            db.add(`Balance_${message.author.id}`, dinh)
                            const FlorestaEmbed = new MessageEmbed()
                                .setColor('GREEN')
                                .addField('🪙 🪙 Baú perdido! 🪙 🪙', `Você obteve: ${dinh} ${Moeda(message)}, ${apple} 🍎 Maças, ${comidas} 🥘 Comidas e ${rosas} 🌹 Rosas`)
                            return message.reply({ embeds: [FlorestaEmbed] })
                        }

                    } else if (randa === 5) {

                        if (!dima) {
                            db.set(`${message.author.id}.Slot.DiamanteNegro`, true)
                            const DimaEmbed = new MessageEmbed()
                                .setColor('GREEN')
                                .setTitle('⭐ Você adquiriu um item de Classe Especial')
                                .setDescription(`Item: ${e.DarkDiamond} Diamante Negro`)
                            return message.reply({ embeds: [DimaEmbed] })
                        } else {
                            let dinh = Math.floor(Math.random() * 30) + 1
                            let apple = Math.floor(Math.random() * 4) + 1
                            let comidas = Math.floor(Math.random() * 3) + 1
                            let rosas = Math.floor(Math.random() * 2) + 1
                            db.add(`${message.author.id}.Slot.Apple`, apple)
                            db.add(`${message.author.id}.Slot.Comida`, comidas)
                            db.add(`${message.author.id}.Slot.Rosas`, rosas)
                            db.add(`Balance_${message.author.id}`, dinh)
                            const FlorestaEmbed = new MessageEmbed()
                                .setColor('GREEN')
                                .addField('🪙 🪙 Baú perdido! 🪙 🪙', `Você obteve: ${dinh} ${Moeda(message)}, ${apple} 🍎 Maças, ${comidas} 🥘 Comidas e ${rosas} 🌹 Rosas`)
                            return message.reply({ embeds: [FlorestaEmbed] })
                        }

                    } else if (randa > 15) {

                        let apple = Math.floor(Math.random() * 4) + 1
                        let comidas = Math.floor(Math.random() * 2) + 1
                        let rosas = Math.floor(Math.random() * 2) + 1
                        let dinh = Math.floor(Math.random() * 20) + 1
                        db.add(`${message.author.id}.Slot.Apple`, apple)
                        db.add(`${message.author.id}.Slot.Comida`, comidas)
                        db.add(`${message.author.id}.Slot.Rosas`, rosas)
                        db.add(`Balance_${message.author.id}`, dinh)
                        const FlorestaEmbed = new MessageEmbed()
                            .setColor('GREEN')
                            .addField('🪙 🪙 Baú perdido! 🪙 🪙', `Você obteve: ${dinh} ${Moeda(message)}, ${apple} 🍎 Maças, ${comidas} 🥘 Comidas e ${rosas} 🌹 Rosas`)
                        return message.reply({ embeds: [FlorestaEmbed] })
                    }

                    if (randa === 6) {
                        if (!cachorro) {

                            const embed = new MessageEmbed()
                                .setColor('#246FE0')
                                .setTitle('🐶 Você achou o Brown!!!')
                                .setDescription('Ele está com medo! Dê 5 🦴 `Ossos` para ele se acalmar!')
                                .setFooter('Você tem 20 segundos até as reações sumirem!')

                            await message.reply({ embeds: [embed] }).then(msg => {
                                db.set(`Request.${message.author.id}`, `${msg.url}`)
                                msg.react('✅').catch(() => { }) // Check
                                msg.react('❌').catch(() => { }) // X

                                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                                msg.awaitReactions({ filter, max: 1, time: 20000, errors: ['time'] }).then(collected => {
                                    const reaction = collected.first()

                                    if (reaction.emoji.name === '✅') {
                                        db.delete(`Request.${message.author.id}`)

                                        if (ossos < 5) {
                                            return message.reply(`${e.Deny} | Você não tem ossos suficiente! Brown se assustou e saiu correndo.`)
                                        } else {
                                            db.subtract(`${message.author.id}.Slot.Ossos`, 5)
                                            db.set(`${message.author.id}.Slot.Cachorro`, true)
                                            const FlorestaEmbed = new MessageEmbed()
                                                .setColor('GREEN')
                                                .setTitle('🌲 Você adquiriu um item de Clase Especial')
                                                .setDescription(`${e.Doguinho} Au au au!`)
                                            return msg.edit({ embeds: [FlorestaEmbed] }).catch(() => { })
                                        }

                                    } else {
                                        db.delete(`Request.${message.author.id}`)
                                        msg.delete().catch(() => { })
                                        message.reply(`${e.Deny} | Você se recusou a resgatar o Brown!`)
                                    }
                                }).catch(() => {
                                    db.delete(`Request.${message.author.id}`)
                                    const FlorestaEmbed = new MessageEmbed()
                                        .setColor('RED')
                                        .setTitle(`${e.Deny} Time Over!`)
                                        .setDescription(`Tempo expirado.`)
                                    return msg.edit({ embeds: [FlorestaEmbed] }).catch(() => { })

                                })

                            })

                        } else {
                            return message.reply('🐾 Você encontrou pegadas do Brown.')
                        }
                    }

                    let remedio = db.get(`${message.author.id}.Slot.Remedio`)
                    if (randa >= 6 && randa <= 10) {
                        if (!remedio) {
                            db.set(`${message.author.id}.Slot.Remedio`, true)
                            const embed = new MessageEmbed()
                                .setColor('#246FE0')
                                .setTitle('💊 Remédio!!')
                                .setDescription('Você achou o Remédio do Velho Welter!')
                            return message.reply({ embeds: [embed] })

                        } else {
                            return message.reply('💊 Você encontrou pílulas quebradas.')
                        }
                    }

                    if (randa >= 11 && randa <= 15) {
                        const PegadasEmbed = new MessageEmbed()
                            .setColor('#246FE0')
                            .setTitle('🐾 Você encontrou pegadas do Brown.')
                        return message.reply({ embeds: [PegadasEmbed] })
                    }
                }

                function Lose() {
                    let apple = Math.floor(Math.random() * 2) + 1
                    db.add(`${message.author.id}.Slot.Apple`, apple)
                    return message.reply(`🍎 Você encontrou ${apple} maças!`)
                }
            } else {
                message.reply(`❌ | ${message.author}, você não possui comidas para buscar o Brown. Compre algumas na \`${prefix}loja\``)
            }
        }

    }
}