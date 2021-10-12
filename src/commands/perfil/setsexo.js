const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const Colors = require('../../../Routes/functions/colors')

module.exports = {
    name: 'setsexo',
    aliases: ['sexo', 'gênero',  'genero', 'setgenero', 'setgênero'],
    category: 'perfil',
    ClientPermissions: 'ADD_REACTIONS',
    emoji: '🌛',
    usage: '<setsexo>',
    description: 'Defina seu sexo no perfil',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {
        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

        let sexo = db.get(`${message.author.id}.Perfil.Sexo`)

        const embed = new MessageEmbed()
            .setColor(Colors(message.member))
            .setTitle('Escolha seu sexo')
            .setDescription('♂️ Homem\n♀️ Mulher\n🏳️‍🌈 LGBTQIA+\n*️⃣ Indefinido\n🚁 Helicóptero de Guerra')

        return message.reply({ embeds: [embed] }).then(msg => {
            db.set(`Request.${message.author.id}`, `${msg.url}`)
            msg.react('❌').catch(() => { }) // Cancel
            if (sexo == "♂️ Homem") {
                msg.react('♀️').catch(() => { }) // Mulher
                msg.react('🏳️‍🌈').catch(() => { }) // LGBTQIA+
                msg.react('*️⃣').catch(() => { }) // Indefinido
                msg.react('🚁').catch(() => { }) // Helicóptero
            } else if (sexo == "♀️ Mulher") {
                msg.react('♂️').catch(() => { }) // Homem
                msg.react('🏳️‍🌈').catch(() => { }) // LGBTQIA+
                msg.react('*️⃣').catch(() => { }) // Indefinido
                msg.react('🚁').catch(() => { }) // Helicóptero
            } else if (sexo == "🏳️‍🌈 LGBTQIA+") {
                msg.react('♂️').catch(() => { }) // Homem
                msg.react('♀️').catch(() => { }) // Mulher
                msg.react('*️⃣').catch(() => { }) // Indefinido
                msg.react('🚁').catch(() => { }) // Helicóptero
            } else if (sexo == "*️⃣ Indefinido") {
                msg.react('♂️').catch(() => { }) // Homem
                msg.react('♀️').catch(() => { }) // Mulher
                msg.react('🏳️‍🌈').catch(() => { }) // LGBTQIA+
                msg.react('🚁').catch(() => { }) // Helicóptero
            } else if (sexo == "🚁 Helicóptero de Guerra") {
                msg.react('♂️').catch(() => { }) // Homem
                msg.react('♀️').catch(() => { }) // Mulher
                msg.react('🏳️‍🌈').catch(() => { }) // LGBTQIA+
                msg.react('*️⃣').catch(() => { }) // Indefinido
            } else if (sexo == null) {
                msg.react('♂️').catch(() => { }) // Homem
                msg.react('♀️').catch(() => { }) // Mulher
                msg.react('🏳️‍🌈').catch(() => { }) // LGBTQIA+
                msg.react('*️⃣').catch(() => { }) // Indefinido
                msg.react('🚁').catch(() => { }) // Helicóptero
            }

            const filter = (reaction, user) => { return ['❌', '♂️', '♀️', '🏳️‍🌈', '*️⃣', '🚁'].includes(reaction.emoji.name) && user.id === message.author.id }
            msg.awaitReactions({ filter, max: 1, time: 20000, errors: ['time'] }).then(collected => {
                const reaction = collected.first()

                switch (reaction.emoji.name) {
                    case '♂️': Homem(); break;
                    case '♀️': Mulher(); break;
                    case '🏳️‍🌈': LGBT(); break;
                    case '*️⃣': Indefinido(); break;
                    case '🚁': Helicoptero(); break;
                    case '❌': Cancel(); break;
                    default: message.channel.send(`${e.Deny} | Aconteceu algo que não era para acontecer. Use o comando novamente.`); break;
                }

            }).catch(() => {
                db.delete(`Request.${message.author.id}`);
                msg.edit({ embeds: [embed.setColor('RED').setDescription(`${e.Deny} | Tempo expirado`)] }).catch(() => { })
            })

            function Homem() {
                db.delete(`Request.${message.author.id}`)
                embed.setColor('GREEN').setTitle(`${e.Check} Sexo definido com sucesso!`).setDescription('♂️ Homem')
                db.set(`${message.author.id}.Perfil.Sexo`, "♂️ Homem")
                msg.edit({ embeds: [embed] }).catch(() => { })
            }

            function Mulher() {
                db.delete(`Request.${message.author.id}`)
                embed.setColor('GREEN').setTitle(`${e.Check} Sexo definido com sucesso!`).setDescription('♀️ Mulher')
                db.set(`${message.author.id}.Perfil.Sexo`, "♀️ Mulher")
                msg.edit({ embeds: [embed] }).catch(() => { })
            }

            function LGBT() {
                db.delete(`Request.${message.author.id}`)
                embed.setColor('GREEN').setColor('GREEN').setTitle(`${e.Check} Sexo definido com sucesso!`).setDescription('🏳️‍🌈 LGBTQIA+')
                db.set(`${message.author.id}.Perfil.Sexo`, "🏳️‍🌈 LGBTQIA+")
                msg.edit({ embeds: [embed] }).catch(() => { })
            }

            function Indefinido() {
                db.delete(`Request.${message.author.id}`)
                embed.setColor('GREEN').setTitle(`${e.Check} Sexo definido com sucesso!`).setDescription('*️⃣ Indefinido')
                db.set(`${message.author.id}.Perfil.Sexo`, "*️⃣ Indefinido")
                msg.edit({ embeds: [embed] }).catch(() => { })
            }

            function Helicoptero() {
                db.delete(`Request.${message.author.id}`)
                embed.setColor('GREEN').setTitle(`${e.Check} Sexo definido com sucesso!`).setDescription('🚁 Helicóptero de Guerra')
                db.set(`${message.author.id}.Perfil.Sexo`, "🚁 Helicóptero de Guerra")
                msg.edit({ embeds: [embed] }).catch(() => { })
            }

            function Cancel() {
                db.delete(`Request.${message.author.id}`)
                embed.setColor('RED').setTitle(`${e.Deny} Request Cancelada!`).setDescription('O sexo não foi alterado')
                msg.edit({ embeds: [embed] }).catch(() => { })
            }
        })
    }
}