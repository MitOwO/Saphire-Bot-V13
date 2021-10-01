const { e } = require('../../../Routes/emojis.json')
const Moeda = require('../../../Routes/functions/moeda')
const { Permissions } = require('discord.js')

module.exports = {
    name: 'minerar',
    aliases: ['mine'],
    category: 'economy',
    emoji: '⛏️',
    usage: '<minerar>',
    description: 'Minere e obtenha recursos',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        return message.channel.send(`${e.Loading} | Fica pronto hoje. ||Se nada der errado.||`)

        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
            return message.channel.send(`${e.Deny} | Eu preciso da permissão \`GERENCIAR CANAIS\` para executar este comando.`)

        let canal = db.get(`Servers.${message.author.id}.Confing.PescaChannel`)
        if (canal === null) {
            const nocanal = new MessageEmbed()
                .setColor('#8B0000')
                .setTitle('Canal de pesca não definido')
                .setDescription('Peça para algúm administrador digitar o comando para habilitar o Canal de Pesca')
                .addField('Comando de Ativação', '`' + prefix + 'setpescachannel #Canal`')
            return message.reply(nocanal)
        }

        if (!db.get(`Servers.${message.author.id}.Confing.PescaChannel`)) {
            const notcanal = new MessageEmbed()
                .setColor('#8B0000')
                .setTitle('Canal de pesca excluido.')
                .setDescription('Parece que o Canal de Pesca foi desativado ou excluido.')
                .addField('Comando de Ativação', '`' + prefix + 'setpescachannel #Canal`')
            return message.reply(notcanal)
        }

        let canaloficial = message.channel.id === db.get(`Servers.${message.author.id}.Confing.PescaChannel`)
        if (!canaloficial) {
            message.delete().catch(err => { })
            return message.reply(`Este não é o canal de pesca. Chega mais, é aqui: ${client.channels.cache.get(canal)}`).then(msg => msg.delete({ timeout: 7000 })).catch(err => { })
        }

        let vara = db.get(`${message.author.id}.Slot.Vara`)
        if (vara === null) { return message.reply(`❌ ${message.author}, você precisa de uma vara de pesca. Compre uma na ${prefix}loja`) }

        if (!db.get(`${message.author.id}.Slot.Vara`)) { return message.reply(`❌ ${message.author}, você precisa de uma vara de pesca. Compre uma na ${prefix}loja`) }

        let iscas = db.get(`${message.author.id}.Slot.Iscas`)
        if (!iscas) { iscas = 0 }
        if (iscas === null) { return message.reply(`❌ ${message.author}, você não possui iscas para pescar. Compre algumas na ${prefix}loja`) }
        if (iscas == 0) { return message.reply(`❌ ${message.author}, você não possui iscas para pescar. Compre algumas na ${prefix}loja`) }

        if (iscas > 0) {
            let num = ['win', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose', 'lose']
            let rand = num[Math.floor(Math.random() * num.length)]
            let din = Math.floor(Math.random() * 10) + 1

            let a = ['wiin', 'loose', 'loose', 'loose', 'loose', 'loose', 'loose', 'loose', 'loose', 'loose', 'loli', 'nololi', 'faca', 'nololi', 'nololi', 'nololi', 'nololi']
            let randa = a[Math.floor(Math.random() * a.length)]
            db.set(`${message.author.id}.Timeouts.Pesca`, Date.now())

            if (rand === 'win') {

                if (randa === 'faca') {
                    let faca = db.get(`${message.author.id}.Slot.Faca`)
                    if (faca === null) {
                        let dinh = Math.floor(Math.random() * 30) + 1
                        let peixes = Math.floor(Math.random() * 4) + 1
                        let iiscas = Math.floor(Math.random() * 3) + 1
                        let camarao = Math.floor(Math.random() * 2) + 1
                        db.subtract(`${message.author.id}.Slot.Iscas`, 1)
                        db.add(`${message.author.id}.Slot.Iscas`, iiscas)
                        db.add(`${message.author.id}.Slot.Peixes`, peixes)
                        db.add(`${message.author.id}.Slot.Camarao`, camarao)
                        db.add(`Balance_${message.author.id}`, dinh)
                        db.set(`${message.author.id}.Slot.Faca`, "Faca")
                        db.set(`pescatimeout_${message.author.id}`, Date.now())
                        const pescaembed = new MessageEmbed()
                            .setColor('GREEN')
                            .setTitle('⭐ Você adquiriu um item de Classe Especial')
                            .addField('Classe Especial: 🔪 Faca', `Você obteve: ${dinh}🪙Moedas, ${peixes} 🐟 peixes, ${iiscas} 🪱 Iscas e ${camarao} 🍤 Camarões`)
                        return message.reply(pescaembed)
                    } else if (!db.get(`${message.author.id}.Slot.Faca`)) {
                        let dinh = Math.floor(Math.random() * 30) + 1
                        let peixes = Math.floor(Math.random() * 4) + 1
                        let iiscas = Math.floor(Math.random() * 3) + 1
                        let camarao = Math.floor(Math.random() * 2) + 1
                        db.subtract(`${message.author.id}.Slot.Iscas`, 1)
                        db.add(`${message.author.id}.Slot.Iscas`, iiscas)
                        db.add(`${message.author.id}.Slot.Peixes`, peixes)
                        db.add(`${message.author.id}.Slot.Camarao`, camarao)
                        db.add(`Balance_${message.author.id}`, dinh)
                        db.set(`${message.author.id}.Slot.Faca`, "Faca")
                        db.set(`pescatimeout_${message.author.id}`, Date.now())
                        const pescaembed = new MessageEmbed()
                            .setColor('GREEN')
                            .setTitle('⭐ Você adquiriu um item de Classe Especial')
                            .addField('Classe Especial: 🔪 Faca', `Você obteve: ${dinh}🪙Moedas, ${peixes} 🐟 peixes, ${iiscas} 🪱 Iscas e ${camarao} 🍤 Camarões`)
                        return message.reply(pescaembed)
                    } else {

                        let dinh = Math.floor(Math.random() * 25) + 1
                        let peixes = Math.floor(Math.random() * 4) + 1
                        let iiscas = Math.floor(Math.random() * 3) + 1
                        let camarao = Math.floor(Math.random() * 2) + 1
                        db.subtract(`${message.author.id}.Slot.Iscas`, 1)
                        db.add(`${message.author.id}.Slot.Iscas`, iiscas)
                        db.add(`${message.author.id}.Slot.Peixes`, peixes)
                        db.add(`${message.author.id}.Slot.Camarao`, camarao)
                        db.add(`Balance_${message.author.id}`, dinh)
                        db.set(`pescatimeout_${message.author.id}`, Date.now())
                        const pescaembed = new MessageEmbed()
                            .setColor('GREEN')
                            .setTitle('🎣 Você pescou com sucesso!')
                            .addField('🪙 🪙 Você achou um baú do tesouro! 🪙 🪙', `Você obteve: ${dinh}🪙Moedas, ${peixes} 🐟 peixes, ${iiscas} 🪱 Iscas e ${camarao} 🍤 Camarões`)
                        return message.reply(pescaembed)
                    }
                }

                if (randa === "loose") {

                    let peixes = Math.floor(Math.random() * 4) + 1
                    let iiscas = Math.floor(Math.random() * 3) + 1
                    let camarao = Math.floor(Math.random() * 2) + 1
                    db.subtract(`${message.author.id}.Slot.Iscas`, 1)
                    db.add(`${message.author.id}.Slot.Iscas`, iiscas)
                    db.add(`${message.author.id}.Slot.Peixes`, peixes)
                    db.add(`${message.author.id}.Slot.Camarao`, camarao)
                    db.add(`Balance_${message.author.id}`, din)
                    db.set(`${message.author.id}.Timeouts.Pesca`, Date.now())
                    const pescaembed = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('🎣 Você pescou com sucesso')
                        .addField('🪙 🪙 Você achou um baú do tesouro! 🪙 🪙', `Você obteve: ${din}🪙Moedas, ${peixes} 🐟 peixes, ${iiscas} 🪱 Iscas e ${camarao} 🍤 Camarões `)
                    return message.reply(pescaembed)
                }

                let loli = db.get(`${message.author.id}.Slot.Loli`)
                if (randa === "loli") {
                    if (loli === null) {
                        db.set(`${message.author.id}.Slot.Loli`, "Loli")
                        const pescaembed = new MessageEmbed()
                            .setColor('GREEN')
                            .setTitle('⭐ Você adquiriu um item de Clase Especial')
                            .setDescription(`**Loli:** <:loli:878016386939629618> Oooi ${message.author}, tudo bem com você? De agora em diante eu vou ser a sua parceira :heart:`)
                        return message.reply(pescaembed)
                    } else if (!db.get(`${message.author.id}.Slot.Loli`)) {
                        db.set(`${message.author.id}.Slot.Loli`, "Loli")
                        const pescaembed = new MessageEmbed()
                            .setColor('GREEN')
                            .setTitle('⭐ Você adquiriu um item de Clase Especial')
                            .setDescription(`**Loli:** <:loli:878016386939629618> Oooi ${message.author}, tudo bem com você? De agora em diante eu vou ser a sua parceira :heart:`)
                        return message.reply(pescaembed)
                    } else {
                        let frase = ['Oii, sabia que eu gosto de passear enquanto vejo os passarinhos?', 'Sabia que um dia eu cai da cama e machuquei meu braço?', 'Ei, eu tenho medo de pessoas más.']
                        let result = frase[Math.floor(Math.random() * frase.length)]
                        const looli = new MessageEmbed()
                            .setColor('BLUE')
                            .setTitle('Uma garotinha atrapalhou sua pesca.')
                            .setDescription(`<:loli:878016386939629618> ${result}`)
                        return message.reply(looli)
                    }
                }

                if (randa === "nololi") {
                    let frase = ['Oii, sabia que eu gosto de passear enquanto vejo os passarinhos?', 'Sabia que um dia eu cai da cama e machuquei meu braço?', 'Ei, eu tenho medo de pessoas más.']
                    let result = frase[Math.floor(Math.random() * frase.length)]
                    const looli = new MessageEmbed()
                        .setColor('BLUE')
                        .setTitle('Uma garotinha atrapalhou sua pesca.')
                        .setDescription(`<:loli:878016386939629618> ${result}`)
                    return message.reply(looli)
                }
            }

            if (rand === 'lose') {
                let peixes = Math.floor(Math.random() * 2) + 1
                db.subtract(`${message.author.id}.Slot.Iscas`, 1)
                db.add(`${message.author.id}.Slot.Peixes`, peixes)
                db.set(`pescatimeout_${message.author.id}`, Date.now())
                return message.reply(`🎣 Com a pesca, você obteve ${peixes} peixes.`)
            }
        } else { return message.reply(`❌ | ${message.author}, você não tem iscas suficiente. Compre mais na **${prefix}loja**`) }
    }
}