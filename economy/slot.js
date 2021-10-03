const { e } = require('../../../Routes/emojis.json')
const Colors = require('../../../Routes/functions/colors')

module.exports = {
    name: 'slot',
    aliases: ['inventario', 'inve'],
    category: 'economy',
    UserPermissions: "",
    ClientPermissions: "",
    emoji: '📦',
    usage: '<slot> [user]',
    description: 'Confira todo o seu inventário',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let u = message.mentions.members.first() || client.users.cache.get(args[0]) || message.member || message.mentions.repliedUser
        let user = client.users.cache.get(u.id)
        if (!isNaN(args[0]) && !client.users.cache.get(args[0])) {
            if (!user) return message.reply(`${e.Deny} | Eu não encontrei ninguém com esse ID...`)
        }
        let avatar = user?.displayAvatarURL({ dynamic: true }) || user.user.displayAvatarURL({ dynamic: true })

        let color = Colors(user)

        let MedalhaAcess = db.get(`${user.id}.Slot.MedalhaAcess`) || false
        let title = db.get(`${user.id}.Perfil.TitlePerm`) || false
        title ? title = "\n🔰 Título" : title = ""
        let peixes = db.get(`${user.id}.Slot.Peixes`) || "0"
        let iscas = db.get(`${user.id}.Slot.Iscas`) || "0"
        let comida = db.get(`${user.id}.Slot.Comidas`) || "0"
        let cartas = db.get(`${user.id}.Slot.Cartas`) || false
        cartas ? cartas = `\n💌 Cartas: ${cartas}` : cartas = ""
        let agua = db.get(`${user.id}.Slot.Aguas`) || "0"
        let fichas = db.get(`${user.id}.Slot.Fichas`) || "0"
        let camarao = db.get(`${user.id}.Slot.Camarao`) || "0"
        let diamond = db.get(`${user.id}.Slot.Diamante`) || "0"
        let minerio = db.get(`${user.id}.Slot.Minerios`) || "0"
        let ossos = db.get(`${user.id}.Slot.Ossos`) || "0"
        let apple = db.get(`${user.id}.Slot.Apple`) || "0"
        let rosas = db.get(`${user.id}.Slot.Rosas`) || "0"
        let arma = db.get(`${user.id}.Slot.Arma`) || false
        arma ? arma = "\n🔫 Arma" : arma = ""
        let anel = db.get(`${user.id}.Slot.Anel`) || false
        anel ? anel = "\n💍 Anel de Casamento" : anel = ""
        let xusos = (db.get(`${user.id}.Slot.Picareta.Usos`)) || "0"
        let picareta = db.get(`${user.id}.Slot.Picareta`) || false
        picareta ? picareta = `\n⛏️ Picareta | ${xusos} usos restantes` : picareta = ""
        let musos = (db.get(`${user.id}.Slot.Machado.Usos`)) || "0"
        let machado = db.get(`${user.id}.Slot.Machado`) || false
        machado ? machado = `\n🪓 Machado | ${musos} usos restantes` : machado = ""
        let remedio = db.get(`${user.id}.Slot.Remedio`) || false
        remedio ? remedio = "\n💊 Remédio do Velho Welter" : remedio = ""
        let vara = db.get(`${user.id}.Slot.Vara`) || false
        vara ? vara = "\n🎣 Vara de pesca" : vara = ""
        let faca = db.get(`${user.id}.Slot.Faca`) || false
        faca ? faca = "\n🔪 Faca" : faca = ""
        let loli = db.get(`${user.id}.Slot.Loli`) || false
        loli ? loli = `\n${e.Loli} Loli` : loli = ""
        let cachorro = db.get(`${user.id}.Slot.Cachorro`) || false
        cachorro ? cachorro = "\n🐶 Cachorro Brown" : cachorro = ""
        let dogname = db.get(`${user.id}.Slot.Dogname`) || false
        dogname ? dogname = `\n${e.Doguinho} ${db.get(`${user.id}.Slot.Dogname`)}` : dogname = `\n${e.Doguinho} Doguinho sem nome`
        let medalha = db.get(`${user.id}.Perfil.Medalha`) || false
        medalha ? medalha = "\n🏅 Medalha Cammum" : medalha = ""
        let cores = db.get(`${user.id}.Color.Perm`) || false
        cores ? cores = '\n🎨 Cores' : cores = ''
        let bola = db.get(`${user.id}.Slot.Bola`) || false
        bola ? bola = "\n🥎 Bola" : bola = ""
        let fossil = db.get(`${user.id}.Slot.Fossil`) || false
        fossil ? fossil = `\n${e.Fossil} Fossil` : fossil = ""
        let diamante = db.get(`${user.id}.Slot.DiamanteNegro`) || false
        diamante ? diamante = `\n${e.DarkDiamond} Diamante Negro` : diamante = ""
        let mamute = db.get(`${user.id}.Slot.Mamute`) || false
        mamute ? mamute = "\n🦣 Mamute" : mamute = ""
        let nada = !arma && !picareta && !vara && !machado && !cartas
        nada ? nada = 'Não há nada aqui' : nada = ""
        let nada2 = !cores && !title && !faca && !loli && !fossil && !mamute && !diamante && !medalha && !bola && !cachorro && !remedio
        nada2 ? nada2 = 'Não há nada aqui' : nada2 = ""

        if (MedalhaAcess) { cachorro = "", bola = "", remedio = "" }

        var star = ''
        db.get(`${user.id}.Perfil.Estrela.1`) ? star = `${e.Star}${e.GrayStar}${e.GrayStar}${e.GrayStar}${e.GrayStar}` : star = `${e.GrayStar}${e.GrayStar}${e.GrayStar}${e.GrayStar}${e.GrayStar}`
        db.get(`${user.id}.Perfil.Estrela.2`) ? star = `${e.Star}${e.Star}${e.GrayStar}${e.GrayStar}${e.GrayStar}` : star = star
        db.get(`${user.id}.Perfil.Estrela.3`) ? star = `${e.Star}${e.Star}${e.Star}${e.GrayStar}${e.GrayStar}` : star = star
        db.get(`${user.id}.Perfil.Estrela.4`) ? star = `${e.Star}${e.Star}${e.Star}${e.Star}${e.GrayStar}` : star = star
        db.get(`${user.id}.Perfil.Estrela.5`) ? star = `${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}` : star = star
        if (user.id === '351903530161799178') star = `${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}`
        if (user.id === '451619591320371213') star = `${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}`

        const VipEmbed = new MessageEmbed()
        .setColor(color)
            .setAuthor(`Inventário VIP de ${user.username}`, avatar)
            .setDescription(`${e.SaphireEntaoKkk} Tudo vázio`)
            .setFooter(`${prefix}buy | ${prefix}vip`)

        if (message.content?.toLowerCase().includes('vip')) {
            return message.reply({ embeds: [VipEmbed] })
        } else {
            const NormalSlotEmbed = new MessageEmbed()
                .setColor(color)
                .setAuthor(`Inventário de ${user.username}`, avatar)
                .setDescription(`${star}`)
                .addField('Itens Comprados', `${nada}${arma}${anel}${picareta}${vara}${machado}${cartas}`)
                .setFooter(`${prefix}buy | ${prefix}vender | ${prefix}slot vip`)
            if (!medalha) { NormalSlotEmbed.addField('Itens Obtidos', `${nada2}${cores}${title}${faca}${loli}${fossil}${mamute}${diamante}${cachorro}${bola}${remedio}`) }
            // if (!medalha) { NormalSlotEmbed.addField('Itens Obtidos', `${e.Loading} Manutenção`) }
            if (medalha) { NormalSlotEmbed.addField('Itens Obtidos', `${nada2}${cores}${title}${faca}${loli}${fossil}${mamute}${diamante}${medalha}${dogname}`) }
            // if (medalha) { NormalSlotEmbed.addField('Itens Obtidos', `${e.Loading} Manutenção`) }
            NormalSlotEmbed.addField('Mantimentos', `🐟 ${peixes} Peixes\n🥘 ${comida} Comidas\n🪱 ${iscas} Iscas\n🥤 ${agua} Águas\n🎟️ ${fichas} Fichas\n🍤 ${camarao} Camarões\n🦴 ${ossos} Ossos\n🌹 ${rosas} Rosas\n🍎 ${apple} Maças\n🪨 ${minerio} Minérios\n💎 ${diamond} Diamantes`)
            return message.reply({ embeds: [NormalSlotEmbed] })
        }
    }
}