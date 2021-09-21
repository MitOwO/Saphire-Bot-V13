const convert = require("parse-ms")
const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'spotify',
    aliases: ['spot'],
    category: 'util',
    UserPermissions: '',
    ClientPermissions: 'EMBED_LINKS',
    emoji: '💿',
    usage: '<spotify> [@user]',
    description: 'Veja o que os outros estão escutando',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        let avatar = user.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 })

        let fotospot = 'https://imgur.com/vw6z7v4.png'

        let status
        if (user.presence.activities.length === 1) status = user.presence.activities[0]
        else if (user.presence.activities.length > 1) status = user.presence.activities[1]

        if (user.presence.activities.length === 0 || status.name !== "Spotify" && status.type !== "LISTENING")
            return message.reply(`${e.Deny} | Essa pessoa não está ouvindo nada no Spotify ou não vinculou o Spotify com o Discord`)

        if (status !== null && status.type === "LISTENING" && status.name === "Spotify" && status.assets !== null) {
            let image = `https://i.scdn.co/image/${status.assets.largeImage.slice(8)}`
            url = `https:/open.spotify.com/track/${status.syncID}`,
                name = status.details,
                artist = status.state,
                album = status.assets.largeText,
                timeStart = status.timestamps.start,
                timeEnd = status.timestamps.end,
                timeConvert = convert(timeEnd - timeStart);

            let minutes = timeConvert.minutes < 10 ? `0${timeConvert.minutes}` : timeConvert.minutes
            let seconds = timeConvert.seconds < 10 ? `0${timeConvert.seconds}` : timeConvert.seconds
            let time = `${minutes}:${seconds}`

            const embed = new MessageEmbed()
                .setColor(0x1ED768)
                .setAuthor(`${user.user.username} está escutando...`, (avatar))
                .setDescription(`**Nome:**\n[${name}](${url})`)
                .setThumbnail(image)
                .addField("Duração", time, true)
                .addField("Artista", artist, false)
                .addField("Album", album, true)
                .addField("Resumo", `${artist} - ${name}\n📨 Receba a música no seu privado`, false)

            const embed2 = new MessageEmbed()
                .setColor(0x1ED768)
                .setAuthor(`${user.user.username} ouviu essa música`, (avatar))
                .setDescription(`**Nome:**\n[${name}](${url})`)
                .setThumbnail(image)
                .addField("Duração", time, true)
                .addField("Artista", artist, false)
                .addField("Album", album, true)
                .addField("Resumo", `${artist} - ${name}`, false)
                .setFooter('Spotify e Discord fazendo seu dia melhor', fotospot)

            await message.reply({ embeds: [embed] }).then(msg => {
                msg.react('📨').catch(err => { }) // Troca

                const SendDMFilter = (reaction, user) => { return reaction.emoji.name === '📨' && user.id === user.id }
                let Collector = msg.createReactionCollector({ filter: SendDMFilter, time: 40000, erros: ['time'] })

                Collector.on('collect', (reaction, user) => {
                    if (user.id === client.user.id) return
                    user.send({ embeds: [embed2] }).then(() => {
                        message.channel.send(`${e.Check} | Envio concluido, ${user}.`)
                    }).catch(() => {
                        message.channel.send(`${e.Deny} | Envio interrompido. ${user}, a sua DM está trancada. Verifique suas configurações de privacidade e tente novamente.`)
                    })
                })

                Collector.on('end', () => {
                    embed.setColor('RED').setFooter('Sessao expirada por: Tempo de interação execido')
                    msg.edit({ embeds: [embed] }).catch(err => { })
                })
            }).catch(err => {
                return message.reply(`${Attention} | Houve um erro ao executar este comando\n\`${err}\``)
            })
        }
    }
}