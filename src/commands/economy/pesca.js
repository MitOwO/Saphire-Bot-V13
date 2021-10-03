const { e } = require('../../../Routes/emojis.json')
const Moeda = require('../../../Routes/functions/moeda')
const { Permissions } = require('discord.js')
const Colors = require('../../../Routes/functions/colors')

module.exports = {
    name: 'pesca',
    aliases: ['pescar'],
    category: 'economy',
    emoji: '🎣',
    usage: '<pesca>',
    description: 'Pesca e farme sua coleção de itens',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
            return message.channel.send(`${e.Deny} | Eu preciso da permissão \`GERENCIAR CANAIS\` para executar este comando.`)

        let canal = message.guild.channels.cache.get(db.get(`Servers.${message.guild.id}.PescaChannel`))

        if (!canal)
            return message.reply(`${e.Deny} | Este comando requer um canal específico.\n${e.SaphireObs} | Você pode usar \`${prefix}channel farm pesca\` que eu faço tudo pra você!`)

        if (canal.id !== message.channel.id)
            return message.reply(`${e.SaphireObs} | Este não é o canal de pesca. Chega mais, é aqui: ${canal}`)

        if (canal.rateLimitPerUser < 1)
            canal.setRateLimitPerUser(1, ['Cooldown é necessário.']).catch(err => { return message.channel.send(`${e.Warn} | Falha ao configurar o cooldown em 1 segundos.\n\`\`\`${err}\`\`\``) })

        if (!db.get(`${message.author.id}.Slot.Vara`))
            return message.reply(`${e.Deny} | ${message.author}, você precisa de uma 🎣 \`Vara de Pesca\`. Compre uma na \`${prefix}loja\``)

        if ((db.get(`${message.author.id}.Slot.Iscas`) || 0) <= 0)
            return message.reply(`${e.Deny} | ${message.author}, você não possui iscas para pescar. Compre algumas na \`${prefix}loja\``)

        const Embed = new MessageEmbed().setColor(Colors(message.member))

        let dinh = Math.floor(Math.random() * 25) + 1
        let peixes = Math.floor(Math.random() * 4) + 1
        let Iscas = Math.floor(Math.random() * 3) + 1
        let camarao = Math.floor(Math.random() * 2) + 1

        db.subtract(`${message.author.id}.Slot.Iscas`, 1)
        let luck = Math.floor(Math.random() * 100)
        luck === 2 ? WinPrize() : NoPrize()

        function WinPrize() {

            let randa = Math.floor(Math.random() * 30)
            if (randa < 5) return GetKnife()
            if (randa > 5 || randa <= 10) return GetLoli()
            if (randa > 10) return NormalPrize()

            function GetKnife() {
                if (!db.get(`${message.author.id}.Slot.Faca`)) {
                    db.set(`${message.author.id}.Slot.Faca`, true)
                    Embed.setColor("GREEN").setTitle('⭐ Você adquiriu um item de Classe Especial').addField('Item', `🔪 Faca`)
                    return message.reply({ embeds: [Embed] })
                } else { NormalPrize() }
            }

            function GetLoli() {
                if (!db.get(`${message.author.id}.Slot.Loli`)) {
                    db.set(`${message.author.id}.Slot.Loli`, true)
                    Embed.setTitle('⭐ Você adquiriu um item de Clase Especial').setDescription(`**Loli:** ${e.Loli} Oooi ${message.author}, tudo bem com você? De agora em diante eu vou ser a sua parceira de pesca`)
                    return message.reply({ embeds: [Embed] })
                } else { FakeLoli() }
            }

            function FakeLoli() {
                let frase = ['Oii, sabia que eu gosto de passear enquanto vejo os passarinhos?', 'Sabia que um dia eu cai da cama e machuquei meu braço?', 'Ei, eu tenho medo de pessoas más.']
                let result = frase[Math.floor(Math.random() * frase.length)]
                Embed.setTitle('Uma garotinha atrapalhou sua pesca.')
                    .setDescription(`${e.Loli} ${result}`)
                return message.reply({ embeds: [Embed] })
            }

            function NormalPrize() {

                db.add(`${message.author.id}.Slot.Iscas`, Iscas)
                db.add(`${message.author.id}.Slot.Peixes`, peixes)
                db.add(`${message.author.id}.Slot.Camarao`, camarao)
                db.add(`Balance_${message.author.id}`, dinh)
                Embed.addField('🪙 🪙 Você achou um baú do tesouro! 🪙 🪙', `Você obteve: ${dinh} ${Moeda(message)}, ${peixes} 🐟 peixes, ${Iscas} 🪱 Iscas e ${camarao} 🍤 Camarões `)
                return message.reply({ embeds: [Embed] })
            }
        }

        function NoPrize() {
            db.add(`${message.author.id}.Slot.Peixes`, peixes)
            return message.reply(`🎣 Você obteve ${peixes} peixes.`)
        }
    }
}