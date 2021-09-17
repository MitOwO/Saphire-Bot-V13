const { Message, MessageEmbed } = require('discord.js')
const db = require('quick.db')
const { e } = require('../emojis.json')

/**
 * @param { Message } message
 */

function BuyingAway(message, args, money, bank, prefix) {

    if (['vara de pesca', 'vara', 'pesca', 'Vara de Pesca'].includes(args.join(" "))) {

        db.get(`User.${message.author.id}.Slot.Vara`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) > 180 ? BuyVara() : NoMoney())

        function BuyVara() {
            db.subtract(`Balance_${message.author.id}`, 180); db.add(`Loteria.Prize`, 60)
            db.set(`User.${message.author.id}.Slot.Vara`, "Vara de pesca")
            return message.reply(`${e.Check} | ${message.author} comprou uma 🎣 \`Vara de Pesca\`.`)
        }
    }

    if (['machado', 'Machado'].includes(args[0].toLowerCase())) {
        db.get(`User.${message.author.id}.Slot.Machado`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) >= 120 ? BuyMachado() : NoMoney())

        function BuyMachado() {
            db.subtract(`Balance_${message.author.id}`, 120); db.add(`Loteria.Prize`, 60)
            db.set(`User.${message.author.id}.Slot.Machado`, "Machado")
            return message.reply(`${e.Check} | ${message.author} comprou um 🪓 \`Machado\`.`)
        }
    }

    if (['arma', 'gun', 'Arma'].includes(args[0].toLowerCase())) {

        if (db.get(`User.${message.author.id}.Slot.Arma`)) { return message.reply(`❗ Você já possui este item.`) }
        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar este item.`) }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < 4000) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar este item.`) }

        if (money = 4000 || money > 4000) {
            db.subtract(`Balance_${message.author.id}`, 4000)
            db.set(`User.${message.author.id}.Slot.Arma`, "Arma")
            const buyarma = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Compra aprovada')
                .setDescription(`${message.author}, você comprou uma 🔫` + ' `Arma`')
            return message.reply(buyarma)
        }
    }

    if (['ticketloteria', 'ticket', 'Ticket', 'tickets', 'Tickets'].includes(args[0].toLowerCase())) {

        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar este item.`) }
        if (!args[1]) { return message.reply('Quantos tickets você quer comprar? `' + prefix + 'buy tickets quantidade`') }
        if (isNaN(args[1])) { return message.reply(`${args[1]} não é um número.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < args[1] * 10) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar este item.`) }

        let LoteryOpen = db.get('Loteria')
        if (LoteryOpen === null || !LoteryOpen || LoteryOpen === undefined) {
            return message.reply('A loteria não está aberta no momento.')
        }

        db.subtract(`Balance_${message.author.id}`, args[1] * 10)
        db.add(`Loteria.Tickets_${message.author.id}`, args[1])
        db.add('Loteria.Prize', args[1] * 10)
        db.push('Loteria.Users', `${message.author.id}`)
        db.add('Loteria.TicketsCompradosAoTodo', args[1])

        const buyarma = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('✅ Compra aprovada')
            .setDescription(`${message.author}, você comprou ${args[1]}` + ' 🎫 `Tickets da Loteria`')
            .setFooter(`Você possui: ${db.get(`Loteria.Tickets_${message.author.id}`)} Tickets`)

        return message.reply(buyarma)
    }

    if (['ficha', 'fichas'].includes(args[0].toLowerCase())) {

        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar este item.`) }
        if (!args[1]) { return message.reply('Quantas fichas você quer comprar? `' + prefix + 'buy fichas quantidade`') }
        if (isNaN(args[1])) { return message.reply(`${args[1]} não é um número.`) }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < args[1] * 2) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar este item.`) }

        db.add(`User.${message.author.id}.Slot.Fichas`, args[1])
        let acima = db.get(`User.${message.author.id}.Slot.Fichas`)
        if (acima > 50) {
            db.subtract(`User.${message.author.id}.Slot.Fichas`, args[1])

            const nota = new MessageEmbed()
                .setColor('#8B0000')
                .setTitle('LIMITE DE FICHAS ATINGIDO!')
                .setDescription(`${message.author}, você não pode passar de **50 fichas**.`)
            return message.reply(nota)
        }

        db.subtract(`Balance_${message.author.id}`, args[1] * 2)
        const buyarma = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('✅ Compra aprovada')
            .setDescription(`${message.author}, você comprou ${args[1]} ` + '🎟️ `Fichas`')
        return message.reply(buyarma)
    }

    if (['agua', 'Água', 'água', 'water', 'águas', 'aguas', 'copo', 'd\'água'].includes(args[0].toLowerCase())) {

        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar este item.`) }
        if (!args[1]) { return message.reply('Quantas águas você quer comprar? `' + prefix + 'buy águas quantidade`') }
        if (isNaN(args[1])) { return message.reply('`' + prefix + 'buy águas quantidade`') }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < args[1]) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar este item.`) }

        db.add(`User.${message.author.id}.Slot.Aguas`, args[1])
        let acima = db.get(`User.${message.author.id}.Slot.Aguas`)
        if (acima > 70) {
            db.subtract(`User.${message.author.id}.Slot.Aguas`, args[1])
            const nota = new MessageEmbed()
                .setColor('#8B0000')
                .setTitle('LIMITE DE ÁGUAS ATINGIDO!')
                .setDescription(`${message.author}, você não pode passar de **70 copos d'água**.`)
            return message.reply(nota)
        }

        if (money = 1 || money > 1) {
            db.subtract(`Balance_${message.author.id}`, args[1])
            const buyarma = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Compra aprovada')
                .setDescription(`${message.author}, você comprou ${args[1]} ` + '🥤 `Copos de água`')
            return message.reply(buyarma)
        }
    }

    if (['picareta', "Picareta"].includes(args[0].toLowerCase())) {

        if (db.get(`User.${message.author.id}.Slot.Picareta`)) { return message.reply(`❗ Você já possui este item.`) }
        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar este item.`) }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < 85) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar este item.`) }

        if (money = 85 || money > 85) {
            db.subtract(`Balance_${message.author.id}`, 85)
            db.set(`User.${message.author.id}.Slot.Picareta`, "Picareta")
            db.set(`User.${message.author.id}.Slot.PicaretaUso`, 50)
            const buyarma = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Compra aprovada')
                .setDescription(`${message.author}, você comprou uma ⛏️` + ' `Picareta`')
            return message.reply(buyarma)
        }
    }

    if (['ciano', 'ciane'].includes(args[0].toLowerCase())) {

        if (!vip) { return message.reply('❌ Esta é uma cor exclusiva para vips.\nSaiba mais em `' + prefix + 'vip`') }
        if (db.get(`User.${message.author.id}.Color.Ciane`)) { return message.reply(`❗ Você já possui este item.`) }
        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar esta cor.`) }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < 1000000) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar esta cor.`) }

        if (money = 1000000 || money > 1000000) {
            db.subtract(`Balance_${message.author.id}`, 1000000)
            db.set(`User.${message.author.id}.Color.Ciane`, "#00FFFF")
            const BuyColorEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Compra aprovada')
                .setDescription(`${message.author}, você comprou a cor Ciana.\n` + '`' + prefix + 'setcolor`')
            return message.reply(BuyColorEmbed)
        }
    }

    if (['vermelho', 'red'].includes(args[0].toLowerCase())) {

        if (!vip) { return message.reply('❌ Esta é uma cor exclusiva para vips.\nSaiba mais em `' + prefix + 'vip`') }
        if (db.get(`User.${message.author.id}.Color.Red`)) { return message.reply(`❗ Você já possui este item.`) }
        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar esta cor.`) }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < 10000) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar esta cor.`) }

        if (money = 10000 || money > 10000) {
            db.subtract(`Balance_${message.author.id}`, 10000)
            db.set(`User.${message.author.id}.Color.Red`, "#B62A2A")
            const BuyColorEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Compra aprovada')
                .setDescription(`${message.author}, você comprou a cor Vermelha.\n` + '`' + prefix + 'setcolor`')
            return message.reply(BuyColorEmbed)
        }
    }

    if (['branco', 'white'].includes(args[0].toLowerCase())) {

        if (!vip) { return message.reply('❌ Esta é uma cor exclusiva para vips.\nSaiba mais em `' + prefix + 'vip`') }
        if (db.get(`User.${message.author.id}.Color.White`)) { return message.reply(`❗ Você já possui este item.`) }
        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar esta cor.`) }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < 10000) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar esta cor.`) }

        if (money = 10000 || money > 10000) {
            db.subtract(`Balance_${message.author.id}`, 10000)
            db.set(`User.${message.author.id}.Color.White`, "#FFFFFF")
            const BuyColorEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Compra aprovada')
                .setDescription(`${message.author}, você comprou a cor Branca.\n` + '`' + prefix + 'setcolor`')
            return message.reply(BuyColorEmbed)
        }
    }

    if (['rosa', 'pink'].includes(args[0].toLowerCase())) {

        if (!vip) { return message.reply('❌ Esta é uma cor exclusiva para vips.\nSaiba mais em `' + prefix + 'vip`') }
        if (db.get(`User.${message.author.id}.Color.Pink`)) { return message.reply(`❗ Você já possui este item.`) }
        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar esta cor.`) }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < 10000) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar esta cor.`) }

        if (money = 10000 || money > 10000) {
            db.subtract(`Balance_${message.author.id}`, 10000)
            db.set(`User.${message.author.id}.Color.Pink`, "#D000FC")
            const BuyColorEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Compra aprovada')
                .setDescription(`${message.author}, você comprou a cor Rosa.\n` + '`' + prefix + 'setcolor`')
            return message.reply(BuyColorEmbed)
        }
    }

    if (['laranja', 'orange'].includes(args[0].toLowerCase())) {

        if (!vip) { return message.reply('❌ Esta é uma cor exclusiva para vips.\nSaiba mais em `' + prefix + 'vip`') }
        if (db.get(`User.${message.author.id}.Color.Orange`)) { return message.reply(`❗ Você já possui este item.`) }
        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar esta cor.`) }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < 10000) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar esta cor.`) }

        if (money = 10000 || money > 10000) {
            db.subtract(`Balance_${message.author.id}`, 10000)
            db.set(`User.${message.author.id}.Color.Orange`, "#FFFFFF")
            const BuyColorEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Compra aprovada')
                .setDescription(`${message.author}, você comprou a cor Laranja.\n` + '`' + prefix + 'setcolor`')
            return message.reply(BuyColorEmbed)
        }
    }

    if (['verde', 'green'].includes(args[0].toLowerCase())) {

        if (db.get(`User.${message.author.id}.Color.Green`)) { return message.reply(`❗ Você já possui este item.`) }
        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar esta cor.`) }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < 15000) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar esta cor.`) }

        if (money = 15000 || money > 15000) {
            db.subtract(`Balance_${message.author.id}`, 15000)
            db.set(`User.${message.author.id}.Color.Green`, "#00FC07")
            const BuyColorEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Compra aprovada')
                .setDescription(`${message.author}, você comprou a cor Verde.\n` + '`' + prefix + 'setcolor`')
            return message.reply(BuyColorEmbed)
        }
    }

    if (['amarelo', 'yellow'].includes(args[0].toLowerCase())) {

        if (db.get(`User.${message.author.id}.Color.Yellow`)) { return message.reply(`❗ Você já possui este item.`) }
        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar esta cor.`) }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < 15000) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar esta cor.`) }

        if (money = 15000 || money > 15000) {
            db.subtract(`Balance_${message.author.id}`, 15000)
            db.set(`User.${message.author.id}.Color.Yellow`, "#E5FC00")
            const BuyColorEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Compra aprovada')
                .setDescription(`${message.author}, você comprou a cor Amarelo.\n` + '`' + prefix + 'setcolor`')
            return message.reply(BuyColorEmbed)
        }
    }

    if (['azul', 'blue'].includes(args[0].toLowerCase())) {

        if (db.get(`User.${message.author.id}.Color.Blue`)) { return message.reply(`❗ Você já possui este item.`) }
        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar esta cor.`) }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < 15000) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar esta cor.`) }

        if (money = 15000 || money > 15000) {
            db.subtract(`Balance_${message.author.id}`, 15000)
            db.set(`User.${message.author.id}.Color.Blue`, "#0005FC")
            const BuyColorEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Compra aprovada')
                .setDescription(`${message.author}, você comprou a cor Azul.\n` + '`' + prefix + 'setcolor`')
            return message.reply(BuyColorEmbed)
        }
    }

    if (['título', 'title', 'titulo', 'Título', 'TITULO', 'TÍTULO'].includes(args[0].toLowerCase())) {

        if (db.get(`User.${message.author.id}.Perfil.TitlePerm`)) { return message.reply(`Você já possui a permissão de alterar seu título.`) }
        if (money === null) { return message.reply(`${message.author}, você não tem dinheiro para comprar esta permissão.`) }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < 10000) { return message.reply(`${message.author}, você não tem dinheiro suficiente para comprar esta permissão.`) }

        if (money = 10000 || money > 10000) {
            db.subtract(`Balance_${message.author.id}`, 10000)
            db.set(`User.${message.author.id}.Perfil.TitlePerm`, "ON")

            const buyTitle = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Compra aprovada')
                .setDescription(`${message.author}, você comprou a permissão 🔰` + '`Título`')
            message.reply(buyTitle)

            const premium = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Você liberou uma nova função')
                .setDescription(`${message.author}, você agora consegue escolher um Título que será mostrado no seu perfil.`)
                .addFields(
                    {
                        name: 'Comando',
                        value: '`' + prefix + 'settitulo Seu Novo Título`'
                    }
                )
                .setFooter('O título suporta até 3 palavras.')
            return message.reply(premium)
        }
    }

    if (['isca', 'minhoca', 'iscas', 'minhocas', 'Isca', 'Iscas'].includes(args[0].toLowerCase())) {

        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar este item.`) }
        if (!args[1]) { return message.reply('Quantas iscas você quer comprar? `' + prefix + 'buy iscas quantidade`') }
        if (isNaN(args[1])) { return message.reply(args[1] + ', não é um número, ok?`' + prefix + 'buy iscas quantidade`') }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < args[1]) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar este item.`) }

        db.add(`User.${message.author.id}.Slot.Iscas`, args[1])
        let acima = db.get(`User.${message.author.id}.Slot.Iscas`)
        if (acima > 50) {
            db.subtract(`User.${message.author.id}.Slot.Iscas`, args[1])
            const nota = new MessageEmbed()
                .setColor('#8B0000')
                .setTitle('LIMITE DE ISCAS ATINGIDO!')
                .setDescription(`${message.author}, você não pode passar de **50 iscas**.`)
            return message.reply(nota)
        }

        if (money > args[1]) {
            db.subtract(`Balance_${message.author.id}`, args[1])
            const buyarma = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Compra aprovada')
                .setDescription(`${message.author}` + ', ' + 'você comprou ' + `${args[1]}` + ' 🪱 `Iscas`')
            return message.reply(buyarma)
        }
    }

    if (['comida', 'food', 'comidas'].includes(args[0].toLowerCase())) {

        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar este item.`) }
        if (!args[1]) { return message.reply('Quantas comidas você quer comprar? `' + prefix + 'buy comida quantidade`') }
        if (isNaN(args[1])) { return message.reply(args[1] + ', não é um número, ok?`' + prefix + 'buy comida quantidade`') }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < args[1] * 2) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar este item.`) }

        db.add(`User.${message.author.id}.Slot.Comida`, args[1])
        let acima = db.get(`User.${message.author.id}.Slot.Comida`)
        if (acima > 80) {
            db.subtract(`User.${message.author.id}.Slot.Comida`, args[1])
            const nota = new MessageEmbed()
                .setColor('#8B0000')
                .setTitle('LIMITE DE COMIDA ATINGIDO!')
                .setDescription(`${message.author}, você não pode passar de **80 comidas**.`)
            return message.reply(nota)
        }

        db.subtract(`Balance_${message.author.id}`, args[1] * 2)
        const buycomida = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('✅ Compra aprovada')
            .setDescription(`${message.author} você comprou ${args[1]} 🥘 ` + '`Comidas`')
        return message.reply(buycomida)
    }

    if (['Carta', 'carta', 'cartas', 'Cartas', 'letter', 'Letter'].includes(args[0].toLowerCase())) {

        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar este item.`) }
        if (!args[1]) { return message.reply('Quantas cartas você quer comprar? `' + prefix + 'buy cartas quantidade`') }
        if (isNaN(args[1])) { return message.reply('A quantidade precisa ser um número. `' + prefix + 'buy cartas quantidade`') }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < args[1]) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar este item.`) }

        db.add(`User.${message.author.id}.Slot.Cartas`, args[1])
        let acima = db.get(`User.${message.author.id}.Slot.Cartas`)
        if (acima > 20) {
            db.subtract(`User.${message.author.id}.Slot.Cartas`, args[1])
            const limit = new MessageEmbed()
                .setColor('#8B0000')
                .setTitle('LIMITE DE CARTAS ATINGIDO!')
                .setDescription(`${message.author}, você não pode passar de **20 cartas**.`)
            return message.reply(limit)
        }

        db.subtract(`Balance_${message.author.id}`, args[1])
        const buycarta = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('✅ Compra aprovada')
            .setDescription(`${message.author}, você comprou ${args[1]}` + ' 💌 `Cartas de Amor`')
        return message.reply(buycarta)
    }

    if (['estrela1', 'Estrela1'].includes(args[0].toLowerCase())) {

        if (db.get(`User.${message.author.id}.Slot.Estrela.1`)) { return message.reply(`❌ Você já possui este item.`) }
        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar este item.`) }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < 500000) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar esta permissão.`) }

        if (money = 500000 || money > 500000) {
            db.subtract(`Balance_${message.author.id}`, 500000)
            db.set(`User.${message.author.id}.Slot.Estrela.1`, "ON")

            const buyStar1 = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Compra aprovada')
                .setDescription(`${message.author}, você comprou ⭐` + '`Estrela 1`')
            return message.reply(buyStar1)
        }
    }

    if (['estrela2', 'Estrela2'].includes(args[0].toLowerCase())) {

        if (!db.get(`User.${message.author.id}.Slot.Estrela.1`)) { return message.reply(`❌ Você precisa da Estrela 1 para comprar a Estrela 2.`) }
        if (db.get(`User.${message.author.id}.Slot.Estrela.2`)) { return message.reply(`❌ Você já possui este item.`) }
        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar este item.`) }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < 1000000) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar esta permissão.`) }

        if (money = 1000000 || money > 1000000) {
            db.subtract(`Balance_${message.author.id}`, 1000000)
            db.set(`User.${message.author.id}.Slot.Estrela.2`, "ON")

            const buyStar1 = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Compra aprovada')
                .setDescription(`${message.author}, você comprou ⭐⭐` + '`Estrela 2`')
            return message.reply(buyStar1)
        }
    }

    if (['estrela3', 'Estrela3'].includes(args[0].toLowerCase())) {

        if (!db.get(`User.${message.author.id}.Slot.Estrela.2`)) { return message.reply(`❌ Você precisa da Estrela 2 para comprar a Estrela 3.`) }
        if (db.get(`User.${message.author.id}.Slot.Estrela.3`)) { return message.reply(`❌ Você já possui este item.`) }
        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar este item.`) }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < 2000000) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar esta permissão.`) }

        if (money = 2000000 || money > 2000000) {
            db.subtract(`Balance_${message.author.id}`, 2000000)
            db.set(`User.${message.author.id}.Slot.Estrela.3`, "ON")

            const buyStar1 = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Compra aprovada')
                .setDescription(`${message.author}, você comprou ⭐⭐⭐` + '`Estrela 3`')
            return message.reply(buyStar1)
        }
    }

    if (['estrela4', 'Estrela4'].includes(args[0].toLowerCase())) {

        if (!db.get(`User.${message.author.id}.Slot.Estrela.3`)) { return message.reply(`❌ Você precisa da Estrela 3 para comprar a Estrela 4.`) }
        if (db.get(`User.${message.author.id}.Slot.Estrela.4`)) { return message.reply(`❌ Você já possui este item.`) }
        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar este item.`) }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < 4000000) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar esta permissão.`) }

        if (money = 4000000 || money > 4000000) {
            db.subtract(`Balance_${message.author.id}`, 4000000)
            db.set(`User.${message.author.id}.Slot.Estrela.4`, "ON")

            const buyStar1 = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Compra aprovada')
                .setDescription(`${message.author}, você comprou ⭐⭐⭐⭐` + '`Estrela 4`')
            return message.reply(buyStar1)
        }
    }

    if (['estrela5', 'Estrela5'].includes(args[0].toLowerCase())) {

        let vip = db.get(`Vip_${message.author.id}`)
        if (!vip) { return message.reply('❌ Este é um comando exclusivo para vips.\nSaiba mais em `' + prefix + 'vip`') }

        if (!db.get(`User.${message.author.id}.Slot.Estrela.4`)) { return message.reply(`❌ Você precisa da Estrela 4 para comprar a Estrela 5.`) }
        if (db.get(`User.${message.author.id}.Slot.Estrela.5`)) { return message.reply(`❌ Você já possui este item.`) }
        if (money === null) { return message.reply(`❌ ${message.author}, você não tem dinheiro para comprar este item.`) }
        if (money === 0) { return message.reply(`❌ ${message.author}, você não tem dinheiro.`) }
        if (money < 0) { return message.reply(`❌ ${message.author}, você está com divida.`) }
        if (money < 10000000) { return message.reply(`❌ ${message.author}, você não tem dinheiro suficiente para comprar esta permissão.`) }

        if (money = 10000000 || money > 10000000) {
            db.subtract(`Balance_${message.author.id}`, 10000000)
            db.set(`User.${message.author.id}.Slot.Estrela.5`, "ON")

            const buyStar1 = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Compra aprovada')
                .setDescription(`${message.author}, você comprou ⭐⭐⭐⭐⭐` + '`Estrela 5`')
            return message.reply(buyStar1)
        }
    } else {
        return message.reply(`Eu não achei nenhum item com o nome **${args.join(" ")}** na minha loja, tente digitar um único nome, tipo "vara" ou "água".`)
    }
}

module.exports = BuyingAway