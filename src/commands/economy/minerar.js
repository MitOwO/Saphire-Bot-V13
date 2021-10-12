const { e } = require('../../../Routes/emojis.json')
const Moeda = require('../../../Routes/functions/moeda')
const { Permissions } = require('discord.js')
const colors = require('../../../Routes/functions/colors')

module.exports = {
    name: 'minerar',
    aliases: ['mine'],
    category: 'economy',
    emoji: '⛏️',
    usage: '<minerar>',
    description: 'Minere e obtenha recursos',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
            return message.channel.send(`${e.Deny} | Eu preciso da permissão \`GERENCIAR CANAIS\` para executar este comando.`)

        let canal = message.guild.channels.cache.get(db.get(`Servers.${message.guild.id}.MineChannel`)) || false
        let xusos = (db.get(`${message.author.id}.Slot.Picareta.Usos`)) || 0
        let picareta = db.get(`${message.author.id}.Slot.Picareta`) || false
        let agua = db.get(`${message.author.id}.Slot.Aguas`) || 0
        let mamute = db.get(`${message.author.id}.Slot.Mamute`) || false

        let fossil = db.get(`${message.author.id}.Slot.Fossil`) || false
        let ossos = Math.floor(Math.random() * 2) + 1
        let minerios = Math.floor(Math.random() * 2) + 1
        let diamantes = Math.floor(Math.random() * 1) + 1
        let dinh = Math.floor(Math.random() * 40) + 1
        const Embed = new MessageEmbed()

        if (!canal)
            return message.reply(`${e.Deny} | Este comando requer um canal específico.\n${e.SaphireObs} | Você pode usar \`${prefix}channel farm minerar\` que eu faço tudo pra você!`)

        if (canal.id !== message.channel.id)
            return message.reply(`${e.SaphireObs} | Este não é o canal de busca. Chega mais, é aqui: ${canal}`)

        if (canal.rateLimitPerUser < 1)
            canal.setRateLimitPerUser(1, ['Cooldown é necessário.']).catch(err => { return message.channel.send(`${e.Warn} | Falha ao configurar o cooldown em 1 segundos.\n\`\`\`${err}\`\`\``) })

        if (!picareta)
            return message.reply(`${e.Deny} | Você precisa de uma ⛏️ \`Picareta\` pra minerar, compre uma na \`${prefix}loja\``)

        if (agua <= 0)
            return message.reply(`${e.Deny} | Você está sem água. Compre uns copos na \`${prefix}loja\``)

        if (xusos <= 0)
            return message.reply(`${e.Deny} | **Picareta Danificada!** | Restaure ela na \`${prefix}loja\``)

        db.subtract(`Xp_${message.author.id}`, 2)
        db.subtract(`${message.author.id}.Slot.Aguas`, 1)
        db.subtract(`${message.author.id}.Slot.Picareta.Usos`, 1)
        let rand = Math.floor(Math.random() * 15)
        rand === 1 ? SomePrizes() : NormalFarm(minerios)

        function SomePrizes() {
            let randa = Math.floor(Math.random() * 25)

            // TAG: HALLOWEEN EVENT
            if (!db.get(`Halloween.${message.author.id}.Slot.OssoDourado`) && randa === 1) return NewBoneSet()
            // ----------------------
            
            if (randa <= 18) return Loose(ossos, minerios, diamantes, dinh)
            if (randa === 19) return Mamute()
            if (randa === 20) return Fossil(ossos, minerios, diamantes, dinh, fossil)
            if (randa > 20) return Pegadas()
        }

        // TAG: HALLOWEEN EVENT
        function NewBoneSet() {
            db.set(`Halloween.${message.author.id}.Slot.OssoDourado`, true)
            return message.reply({ embeds: [new MessageEmbed().setColor(colors(message.member)).setTitle('🎃 Halloween Event').setDescription(`Você obteve o ${e.OssoDourado} Osso Dourado`)] })
        }
        // ----------------------

        function Loose(ossos, minerios, diamantes, dinh) {
            db.add(`${message.author.id}.Slot.Minerios`, minerios)
            db.add(`${message.author.id}.Slot.Ossos`, ossos)
            db.add(`${message.author.id}.Slot.Diamante`, diamantes)
            db.add(`Balance_${message.author.id}`, dinh)
            return message.reply({ embeds: [Embed.setColor('GREEN').setTitle('⛏️ Você cavou itens valiosos!').addField('🪙 🪙 Você achou novos itens! 🪙 🪙', `Você obteve: ${dinh} ${Moeda(message)}, ${minerios} 🪨 Minerios, ${ossos} 🦴 Ossos e ${diamantes} 💎 Diamantes`).setFooter(`R:${rand}`)] })
        }

        function Mamute() {
            if (!mamute) {
                db.set(`${message.author.id}.Slot.Mamute`, true)
                return message.reply({ embeds: [Embed.setColor('GREEN').setTitle('⭐ Você adquiriu um item de Clase Especial').setDescription(`Item: **Mamute Pré Histórico** | 🦣 *sons de mamute*`).setFooter(`R:${rand}`)] })
            } else {
                return Pegadas()
            }
        }

        function Pegadas() { return message.reply({ embeds: [Embed.setColor('#246FE0').setTitle('Há um mamute por perto').setDescription(`🦣 *Sons de mamute*`).setFooter(`R:${rand}`)] }) }


        function NormalFarm(minerios) {
            db.add(`${message.author.id}.Slot.Minerios`, minerios)
            return message.reply(`⛏️ | Você minerou 🪨 ${minerios} minérios. | R:${rand}`)
        }

        function Fossil(ossos, minerios, diamantes, dinh, fossil) {
            if (!fossil) {
                db.add(`${message.author.id}.Slot.Minerios`, minerios)
                db.add(`${message.author.id}.Slot.Ossos`, ossos)
                db.add(`${message.author.id}.Slot.Diamante`, diamantes)
                db.add(`Balance_${message.author.id}`, dinh)
                db.set(`${message.author.id}.Slot.Fossil`, true)
                return message.reply({ embeds: [Embed.setColor('GREEN').setTitle('⭐ Você adquiriu um item de Classe Especial').addField(`Item: ${e.Fossil} Fossil`, `Você obteve: ${dinh} ${Moeda(message)}, ${minerios} 🪨 Minerios, ${ossos} 🦴 Ossos e ${diamantes} 💎 Diamantes`).setFooter(`R:${rand}`)] })
            } else {
                db.add(`${message.author.id}.Slot.Minerios`, minerios)
                db.add(`${message.author.id}.Slot.Ossos`, ossos)
                db.add(`${message.author.id}.Slot.Diamante`, diamantes)
                db.add(`Balance_${message.author.id}`, dinh)
                return message.reply({ embeds: [Embed.setColor('GREEN').setTitle('⛏️ Você cavou itens valiosos!').setDescription(`Você obteve: ${dinh} ${Moeda(message)}, ${minerios} 🪨 Minerios, ${ossos} 🦴 Ossos e ${diamantes} 💎 Diamantes`).setFooter(`R:${rand}`)] })
            }
        }
    }
}