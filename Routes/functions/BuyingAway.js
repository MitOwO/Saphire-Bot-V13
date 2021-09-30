const { Message, MessageEmbed } = require('discord.js')
const db = require('quick.db')
const { e } = require('../emojis.json')
const Moeda = require('../../Routes/functions/moeda')

/** 
* @param {Message} message
*/

function BuyingAway(message, prefix, args, args1) {

    let vip = db.get(`Vip_${message.author.id}`)
    let money = db.get(`Balance_${message.author.id}`) || 0
    const BuyColorEmbed = new MessageEmbed()

    function NoMoney(x) { message.channel.send(`${e.Deny} | ${message.author}, você precisa de pelo menos ${x} ${Moeda(message)} na carteira para comprar este item.`) }
    function JaPossui() { message.reply(`${e.Info} | Você já possui este item.`) }
    function AddLoteria(x) { db.add(`Loteria.Prize`, x) }

    // Itens - BuyItem(NameDB, ItemName, Price)
    if (['vara de pesca', 'vara', 'pesca'].includes(args[0]?.toLowerCase())) return BuyItem('Vara', 'Vara de Pesca', 180) // VaraDePesca()
    if (['anel', 'ring'].includes(args[0]?.toLowerCase())) return BuyItem('Anel', 'Anel de Casamento', 350000) // VaraDePesca()
    if (['machado', 'axe'].includes(args[0]?.toLowerCase())) return BuyItem('Machado', 'Machado', 120) // Machado()
    if (['arma', 'gun'].includes(args[0]?.toLowerCase())) return BuyItem('Arma', 'Arma', 4700) // Arma()
    if (['picareta'].includes(args[0]?.toLowerCase())) return BuyItem('Picareta', 'Picareta', 120) // Picareta()
    if (['título', 'title', 'titulo'].includes(args[0]?.toLowerCase())) return BuyPerfil('TitlePerm', 'Título', 10000) // Titulo()
    if (['cor', 'cores', 'color', 'colors'].includes(args[0]?.toLowerCase())) return ColorPerm() // Color()

    // Consumiveis - Consumivel(NomeDB, NomeAwnsers, quantia, Limit, Price)
    if (['ficha', 'fichas'].includes(args[0]?.toLowerCase())) return Consumivel('Fichas', 'fichas', parseInt(args1), 50, 5) // FichasDaRoleta()
    if (['agua', 'água', 'water', 'águas', 'aguas', 'copo', 'd\'água'].includes(args[0]?.toLowerCase())) return Consumivel('Aguas', 'águas', parseInt(args1), 80, 2) // Aguas()
    if (['isca', 'minhoca', 'iscas', 'minhocas', 'Isca', 'Iscas'].includes(args[0]?.toLowerCase())) return Consumivel('Iscas', 'iscas', parseInt(args1), 70, 1)
    if (['comida', 'food', 'comidas'].includes(args[0]?.toLowerCase())) return Consumivel('Comidas', 'comidas', parseInt(args1), 70, 2)
    if (['Carta', 'carta', 'cartas', 'Cartas', 'letter', 'Letter'].includes(args[0]?.toLowerCase())) return Consumivel('Cartas', 'cartas', parseInt(args1), 20, 100)

    if (['estrela1'].includes(args[0]?.toLowerCase())) return Estrela1()
    if (['estrela2'].includes(args[0]?.toLowerCase())) return Estrela2()
    if (['estrela3'].includes(args[0]?.toLowerCase())) return Estrela3()
    if (['estrela4'].includes(args[0]?.toLowerCase())) return Estrela4()
    if (['estrela5'].includes(args[0]?.toLowerCase())) return Estrela5()

    return message.reply(`Eu não achei nenhum item com o nome **${args[0]?.toLowerCase()}** na minha loja, tente digitar um único nome, tipo "vara" ou "água".`)

    // Ok!
    function Estrela1() {
        if (db.get(`${message.author.id}.Perfil.Estrela.1`)) return JaPossui()
        if (db.get(`${message.author.id}.Perfil.Estrela.2`) || db.get(`${message.author.id}.Perfil.Estrela.3`) || db.get(`${message.author.id}.Perfil.Estrela.4`) || db.get(`${message.author.id}.Perfil.Estrela.5`)) return JaPossui()
        if (money >= 1000000) {
            db.subtract(`Balance_${message.author.id}`, 1000000)
            AddLoteria(500000)
            db.set(`${message.author.id}.Perfil.Estrela.1`, true)
            return message.reply(`${e.Check} | ${message.author} comprou a ⭐ \`Estrela 1\`\n${e.PandaProfit} | -1000000 ${Moeda(message)}`)
        } else { NoMoney(1000000) }
    }

    // Ok!
    function Estrela2() {
        if (db.get(`${message.author.id}.Perfil.Estrela.2`)) return JaPossui()
        if (!db.get(`${message.author.id}.Perfil.Estrela.1`)) return message.reply(`${e.Deny} | Você precisa da Estrela 1 para comprar a Estrela 2.`)
        if (db.get(`${message.author.id}.Perfil.Estrela.3`) || db.get(`${message.author.id}.Perfil.Estrela.4`) || db.get(`${message.author.id}.Perfil.Estrela.5`)) return JaPossui()

        if (money >= 2000000) {
            db.subtract(`Balance_${message.author.id}`, 2000000)
            AddLoteria(1000000)
            db.set(`${message.author.id}.Perfil.Estrela.2`, true)
            db.delete(`${message.author.id}.Perfil.Estrela.1`)
            return message.reply(`${e.Check} | ${message.author} comprou a ⭐⭐ \`Estrela 2\`\n${e.PandaProfit} | -2000000 ${Moeda(message)}`)
        } else { NoMoney(2000000) }
    }

    // Ok!
    function Estrela3() {
        if (db.get(`${message.author.id}.Perfil.Estrela.3`)) return JaPossui()
        if (!db.get(`${message.author.id}.Perfil.Estrela.2`)) return message.reply(`${e.Deny} | Você precisa da Estrela 2 para comprar a Estrela 3.`)
        if (db.get(`${message.author.id}.Perfil.Estrela.4`) || db.get(`${message.author.id}.Perfil.Estrela.5`)) return JaPossui()
        if (money >= 3000000) {
            db.subtract(`Balance_${message.author.id}`, 3000000)
            AddLoteria(1500000)
            db.set(`${message.author.id}.Perfil.Estrela.3`, true)
            db.delete(`${message.author.id}.Perfil.Estrela.2`)
            return message.reply(`${e.Check} | ${message.author} comprou a ⭐⭐⭐ \`Estrela 3\`\n${e.PandaProfit} | -3000000 ${Moeda(message)}`)
        } else { NoMoney(3000000) }
    }

    // Ok!
    function Estrela4() {
        if (db.get(`${message.author.id}.Perfil.Estrela.4`)) return JaPossui()
        if (!db.get(`${message.author.id}.Perfil.Estrela.3`)) return message.reply(`${e.Deny} | Você precisa da Estrela 3 para comprar a Estrela 4.`)
        if (db.get(`${message.author.id}.Perfil.Estrela.5`)) return JaPossui()
        if (money >= 4000000) {
            db.subtract(`Balance_${message.author.id}`, 4000000)
            AddLoteria(2000000)
            db.set(`${message.author.id}.Perfil.Estrela.4`, true)
            db.delete(`${message.author.id}.Perfil.Estrela.3`)
            return message.reply(`${e.Check} | ${message.author} comprou a ⭐⭐⭐⭐ \`Estrela 4\`\n${e.PandaProfit} | -4000000 ${Moeda(message)}`)
        } else { NoMoney(4000000) }
    }

    // Ok!
    function Estrela5() {
        if (!vip) return message.reply(`${e.Deny} | Apenas membros Vips podem comprar a ${e.Star} Estrela 5`)
        if (db.get(`${message.author.id}.Perfil.Estrela.5`)) return JaPossui()
        if (!db.get(`${message.author.id}.Perfil.Estrela.4`)) return message.reply(`${e.Deny} | Você precisa da Estrela 4 para comprar a Estrela 5.`)
        if (money >= 5000000) {
            db.subtract(`Balance_${message.author.id}`, 5000000)
            AddLoteria(2500000)
            db.set(`${message.author.id}.Perfil.Estrela.5`, true)
            db.delete(`${message.author.id}.Perfil.Estrela.4`)
            return message.reply(`${e.Check} | ${message.author} comprou a ⭐⭐⭐⭐⭐ \`Estrela 5\`\n${e.PandaProfit} | -5000000 ${Moeda(message)}`)
        } else { NoMoney(5000000) }
    }

    // 100% Funcional - Permite comprar todos itens de utilidade única
    function BuyItem(NameDB, ItemName, Price) {
        db.get(`${message.author.id}.Slot.${NameDB}`) ? JaPossui() : (money >= Price ? BuyItemFunction() : NoMoney(Price))

        function BuyItemFunction() {
            db.subtract(`Balance_${message.author.id}`, Price); AddLoteria(Price / 2)
            db.set(`${message.author.id}.Slot.${NameDB}`, true)
            return message.channel.send(`${e.Check} | ${message.author} comprou um item: \`${ItemName}\`\n${e.PandaProfit} | -${Price} ${Moeda(message)}`)
        }
    }

    function BuyPerfil(NameDB, ItemName, Price) {
        db.get(`${message.author.id}.Perfil.${NameDB}`) ? JaPossui() : (money >= Price ? BuyItemFunction() : NoMoney(Price))

        function BuyItemFunction() {
            db.subtract(`Balance_${message.author.id}`, Price); AddLoteria(Price / 2)
            db.set(`${message.author.id}.Perfil.${NameDB}`, true)
            return message.channel.send(`${e.Check} | ${message.author} comprou um item: \`${ItemName}\`\n${e.PandaProfit} | -${Price} ${Moeda(message)}`)
        }
    }

    function ColorPerm() {
        db.get(`${message.author.id}.Color.Perm`) ? JaPossui() : (money >= 2000000 ? BuyItemFunction() : NoMoney(2000000))

        function BuyItemFunction() {
            db.subtract(`Balance_${message.author.id}`, 2000000); AddLoteria(1000000)
            db.set(`${message.author.id}.Color.Perm`, true)
            return message.channel.send(`${e.Check} | ${message.author} comprou um item: \`Color\`\n${e.PandaProfit} | -2000000 ${Moeda(message)}`)
        }
    }

    // 100% Funcional - Checking e Complete limit
    function Consumivel(NomeTec, NomeUser, quantia, Limit, Price) {

        let Consumiveis = db.get(`${message.author.id}.Slot.${NomeTec}`) || 0

        if (Consumiveis >= Limit) return message.reply(`${e.Deny} | Você já atingiu o seu limite de ${NomeUser}.`)
        if (!quantia) { return message.reply(`${e.QuestionMark} | Quantas ${NomeUser} você quer comprar? \`${prefix}buy ${NomeUser} quantidade\``) }
        if (money <= 0) { return message.reply(`${e.Deny} | ${message.author}, você não possui dinheiro na carteira.`) }
        if (isNaN(quantia)) { return message.reply(`${e.Deny} | **${quantia}** | Não é um número.`) }
        let q = quantia * Price
        let check = quantia + Consumiveis

        if (q > money) { return message.reply(`${e.PandaProfit} | Você precisa ter pelo menos ${q} ${Moeda(message)} na carteira para comprar ${quantia} ${NomeUser}.`) }

        if (check >= Limit) { Complete() } else { BuyItens() }

        function BuyItens() {
            db.add(`${message.author.id}.Slot.${NomeTec}`, quantia)
            db.subtract(`Balance_${message.author.id}`, quantia * Price)
            AddLoteria((quantia * Price) / 2)
            message.channel.send(`${e.Check} | ${message.author} comprou ${quantia} ${NomeUser} ficando com um total de ${db.get(`${message.author.id}.Slot.${NomeTec}`)} ${NomeUser}.\n${e.PandaProfit} | -${q} ${Moeda(message)}`)
        }

        function Complete() {
            let i = 0
            do {
                db.add(`${message.author.id}.Slot.${NomeTec}`, 1)
                db.subtract(`Balance_${message.author.id}`, Price)
                AddLoteria(Price / 2)
                i++
            } while (db.get(`${message.author.id}.Slot.${NomeTec}`) <= Limit)
            message.channel.send(`${e.Check} | ${message.author} completou o limite de ${NomeUser} comprando +${i - 1} ${NomeUser}.\n${e.PandaProfit} | -${Price * i - 1} ${Moeda(message)}`)
        }
    }
}

module.exports = BuyingAway