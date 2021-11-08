const { e } = require('../../../database/emojis.json')
const Colors = require('../../../Routes/functions/colors')
const Error = require('../../../Routes/functions/errors')
const { BgLevel } = require('../../../Routes/functions/database')

module.exports = {
    name: 'slot',
    aliases: ['inventario', 'inve'],
    category: 'economy2',
    emoji: '📦',
    usage: '<slot> [user]',
    description: 'Confira todo o seu inventário',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let u = message.mentions.users.first() || await client.users.cache.get(args[0]) || message.member || message.mentions.repliedUser
        if (!u.id) return message.reply(`${e.Deny} | Eu não encontrei ninguém com esse ID...`)
        let user = await client.users.cache.get(u.id)
        avatar = user?.displayAvatarURL({ dynamic: true })
        color = Colors(user)

        let { Cores, Um, Dois, Tres, Quatro, Cinco, Seis, Helpier, TitlePerm, Peixes, Iscas, Comidas, Cartas, Aguas, Fichas, Camarao, Diamante, Minerios, Ossos, Apple, Rosas, Arma, Anel, Picareta, Machado, Balaclava, Remedio, Vara, Faca, Loli, Cachorro, Dogname, Medalha, Bola, Fossil, DiamanteNegro, Mamute } = {
            TitlePerm: sdb.get(`Users.${user.id}.Perfil.TitlePerm`),
            Peixes: sdb.get(`Users.${user.id}.Slot.Peixes`),
            Helpier: sdb.get(`Users.${user.id}.Timeouts.Helpier`),
            Um: sdb.get(`Users.${user.id}.Perfil.Estrela.Um`),
            Dois: sdb.get(`Users.${user.id}.Perfil.Estrela.Dois`),
            Tres: sdb.get(`Users.${user.id}.Perfil.Estrela.Tres`),
            Quatro: sdb.get(`Users.${user.id}.Perfil.Estrela.Quatro`),
            Cinco: sdb.get(`Users.${user.id}.Perfil.Estrela.Cinco`),
            Seis: sdb.get(`Users.${user.id}.Perfil.Estrela.Seis`),
            Iscas: sdb.get(`Users.${user.id}.Slot.Iscas`),
            Comidas: sdb.get(`Users.${user.id}.Slot.Comidas`),
            Cartas: sdb.get(`Users.${user.id}.Slot.Cartas`),
            Aguas: sdb.get(`Users.${user.id}.Slot.Aguas`),
            Fichas: sdb.get(`Users.${user.id}.Slot.Fichas`),
            Camarao: sdb.get(`Users.${user.id}.Slot.Camarao`),
            Diamante: sdb.get(`Users.${user.id}.Slot.Diamante`),
            Minerios: sdb.get(`Users.${user.id}.Slot.Minerios`),
            Ossos: sdb.get(`Users.${user.id}.Slot.Ossos`),
            Apple: sdb.get(`Users.${user.id}.Slot.Apple`),
            Rosas: sdb.get(`Users.${user.id}.Slot.Rosas`),
            Arma: sdb.get(`Users.${user.id}.Slot.Arma`),
            Anel: sdb.get(`Users.${user.id}.Slot.Anel`),
            Picareta: {
                Picareta: sdb.get(`Users.${user.id}.Slot.Picareta.Picareta`),
                Usos: sdb.get(`Users.${user.id}.Slot.Picareta.Usos`),
            },
            Machado: {
                Machado: sdb.get(`Users.${user.id}.Slot.Machado.Machado`),
                Usos: sdb.get(`Users.${user.id}.Slot.Machado.Usos`),
            },
            Balaclava: sdb.get(`Users.${user.id}.Slot.Balaclava`),
            Remedio: sdb.get(`Users.${user.id}.Slot.Remedio`),
            Vara: sdb.get(`Users.${user.id}.Slot.Vara`),
            Faca: sdb.get(`Users.${user.id}.Slot.Faca`),
            Loli: sdb.get(`Users.${user.id}.Slot.Loli`),
            Cachorro: sdb.get(`Users.${user.id}.Slot.Cachorro`),
            Dogname: sdb.get(`Users.${user.id}.Slot.Dogname`),
            Medalha: {
                Medalha: sdb.get(`Users.${user.id}.Slot.Medalha.Medalha`),
                Acess: sdb.get(`Users.${user.id}.Slot.Medalha.Acess`),
            },
            Bola: sdb.get(`Users.${user.id}.Slot.Bola`),
            Fossil: sdb.get(`Users.${user.id}.Slot.Fossil`),
            DiamanteNegro: sdb.get(`Users.${user.id}.Slot.DiamanteNegro`),
            Mamute: sdb.get(`Users.${user.id}.Slot.Mamute`),
            Cores: sdb.get(`Users.${user.id}.Color.Perm`)
        }

        let cartas, picareta, arma, anel, machado, title, balaclava, remedio, vara, faca, loli, cachorro, dogname, medalha, cores, bola, fossil, diamante, mamute, nada, nada2, star

        Helpier = Helpier !== null && 604800000 - (Date.now() - Helpier) > 0 ? `\n${e.Helpier} Ajudante` : null
        title = TitlePerm ? "\n🔰 Título" : null
        cartas = Cartas ? `\n💌 Cartas: ${Cartas}` : null
        picareta = Picareta.Picareta ? `\n⛏️ Picareta | ${Picareta.Usos || 0} usos restantes` : null
        arma = Arma ? "\n🔫 Arma" : null
        anel = Anel ? "\n💍 Anel de Casamento" : null
        machado = Machado.Machado ? `\n🪓 Machado | ${Machado.Usos || 0} usos restantes` : null
        balaclava = Balaclava ? `\n${e.Balaclava} Balaclava` : null
        remedio = Remedio ? "\n💊 Remédio do Velho Welter" : null
        vara = Vara ? "\n🎣 Vara de pesca" : null
        faca = Faca ? "\n🔪 Faca" : null
        loli = Loli ? `\n${e.Loli} Loli` : null
        cachorro = Cachorro ? "\n🐶 Cachorro Brown" : null
        dogname = Dogname ? `\n${e.Doguinho} ${sdb.get(`Users.${user.id}.Slot.Dogname`)}` : `\n${e.Doguinho} Doguinho sem nome`
        medalha = Medalha.Medalha ? "\n🏅 Medalha Cammum" : null
        cores = Cores ? '\n🎨 Cores' : null
        bola = Bola ? "\n🥎 Bola" : null
        fossil = Fossil ? `\n${e.Fossil} Fossil` : null
        diamante = DiamanteNegro ? `\n${e.DarkDiamond} Diamante Negro` : null
        mamute = Mamute ? "\n🦣 Mamute" : null
        if (Medalha.Acess) cachorro = null, bola = null, remedio = null
        nada = !Helpier && !balaclava && !arma && !picareta && !vara && !machado && cartas <= 0 ? 'Não há nada aqui' : null
        nada2 = !sdb.get(`Users.${user.id}.Color.Perm`) && !title && !faca && !loli && !fossil && !mamute && !diamante && !Medalha.Medalha && !bola && !cachorro && !remedio ? 'Não há nada aqui' : null
        
        LevelBgAtual = !sdb.get(`Users.${user.id}.Slot.Walls.Set`) ? 'Padrão: bg0' : 'Indefinido'

        Um ? star = `${e.Star}${e.GrayStar}${e.GrayStar}${e.GrayStar}${e.GrayStar}` : star = `${e.GrayStar}${e.GrayStar}${e.GrayStar}${e.GrayStar}${e.GrayStar}`
        Dois ? star = `${e.Star}${e.Star}${e.GrayStar}${e.GrayStar}${e.GrayStar}` : star = star
        Tres ? star = `${e.Star}${e.Star}${e.Star}${e.GrayStar}${e.GrayStar}` : star = star
        Quatro ? star = `${e.Star}${e.Star}${e.Star}${e.Star}${e.GrayStar}` : star = star
        Cinco ? star = `${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}` : star = star
        Seis ? star = `${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}` : star = star

        if (['safari', 'zoo', 'pet', 'pets'].includes(args[0]?.toLowerCase()))
            return SlotZoo()

        if (['bg', 'wallpaper', 'w', 'fundo', 'level'].includes(args[0]?.toLowerCase()))
            return SlotBackgrouds()

        if (['vip', 'premium'].includes(args[0]?.toLowerCase()))
            return SlotVip()

        if (['info', 'help', 'ajuda'].includes(args[0]?.toLowerCase())) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(Colors(message.member))
                        .setTitle(`${e.SaphireHi} Slot Saphire Info`)
                        .setDescription(`Aqui está todas *(ou quase todas)* as informações do slot.`)
                        .addFields([
                            {
                                name: 'Itens',
                                value: `Você pode conferir todos os itens usando \`${prefix}itens\``
                            },
                            {
                                name: 'Comandos do Slot',
                                value: `\`${prefix}slot\` - Padrão\n\`${prefix}slot zoo\` - Safari\n\`${prefix}slot bg\` - Levels Wallpapers\n\`${prefix}slot vip\` - Vip`
                            }
                        ])
                ]
            })
        }

        return NormalSlot()

        function SlotZoo() {
            return message.reply({ embeds: [new MessageEmbed().setColor(color).setAuthor(`Inventário de ${user.username}`, avatar).setDescription('🦁 Edition: Zoo').addField('Itens Comprados', `Nenhum item foi comprado`).addField('Animais Adotados', `Nenhum animal foi adotado ainda`)] })
        }

        function SlotVip() {
            return message.reply({ embeds: [new MessageEmbed().setColor(color).setAuthor(`Inventário VIP de ${user.username}`, avatar).setDescription(`${e.SaphireEntaoKkk} Tudo vázio`).setFooter(`${prefix}buy | ${prefix}vip`)] })
        }

        function SlotBackgrouds() {

            if (sdb.get(`Client.BackgroundAcess.${user.id}`))
                return message.reply({ embeds: [new MessageEmbed().setTitle(`🖼️ ${user.username} Level's Backgrounds`).setColor(color).setDescription(`Este usuário possui todos os wallpapers.`)] })

            let keys, Walls, Page1, Page2, Page3

            try {
                keys = Object.keys(sdb.get(`Users.${user.id}.Slot.Walls.Bg`))
            } catch (err) {
                return message.reply(`${e.Info} | Nenhum wallpaper por aqui.`)
            }

            // Walls = keys.sort((a, b) => Number(a.match(/(\d+)/g)[0]) - Number((b.match(/(\d+)/g)[0])))

            try {

                Walls = Object.entries(sdb.get(`Users.${user.id}.Slot.Walls.Bg`))

                Page1 = Walls?.slice(0, 50)?.map(([a, b]) => `\`${a}\`: ${BgLevel.get(`LevelWallpapers.${a}.Name`)}`).join('\n') || false
                Page2 = Walls?.slice(50, 100)?.map(([a, b]) => `\`${a}\`: ${BgLevel.get(`LevelWallpapers.${a}.Name`)}`).join('\n') || false
                Page3 = Walls?.slice(100, 150)?.map(([a, b]) => `\`${a}\`: ${BgLevel.get(`LevelWallpapers.${a}.Name`)}`).join('\n') || false

                function Fil() {
                    if (Page3 && Page2 && Page1) return 1
                    if (Page2 && Page1) return 2
                    if (Page1) return 3
                    return 0
                }

                const embed1 = new MessageEmbed().setTitle(`🖼️ ${user.username} Level's Backgrounds`).setColor(color).setDescription(`${Page1}`)
                const embed2 = new MessageEmbed().setColor(color).setDescription(`${Page2}`)
                const embed3 = new MessageEmbed().setColor(color).setDescription(`${Page3}`)

                switch (Fil()) {
                    case 1:
                        message.reply({ content: `${e.SaphireObs} Use \`${prefix}level set <bgCode>\` para definir seu wallpaper. Deseja vê-los? Sem problemas! Use o comando \`${prefix}lvlwall <bgCode>\``, embeds: [embed1, embed2, embed3] })
                        break;
                    case 2:
                        message.reply({ content: `${e.SaphireObs} Use \`${prefix}level set <bgCode>\` para definir seu wallpaper. Deseja vê-los? Sem problemas! Use o comando \`${prefix}lvlwall <bgCode>\``, embeds: [embed1, embed2] })
                        break;
                    case 3:
                        message.reply({ content: `${e.SaphireObs} Use \`${prefix}level set <bgCode>\` para definir seu wallpaper. Deseja vê-los? Sem problemas! Use o comando \`${prefix}lvlwall <bgCode>\``, embeds: [embed1] })
                        break;
                    default:
                        message.reply(`${e.Info} | Não há backgrounds no banco de dados.`)
                        break;
                }

                return

            } catch (err) {
                Error(message, err)
                return message.reply(`${e.Warn} | Falha ao enviar os nomes dos backgrounds.\n\`${err}\``)
            }
        }

        function NormalSlot() {

            const NormalSlotEmbed = new MessageEmbed()
                .setColor(color)
                .setAuthor(`Inventário de ${user.username}`, avatar)
                .setDescription(`${star}`)
                .addField('Itens Comprados', `${nada}${arma}${anel}${balaclava}${Helpier}${picareta}${machado}${vara}${cartas}`)
                .setFooter(`${prefix}buy | ${prefix}vender | ${prefix}slot vip | ${prefix}slot pet`)
            if (!medalha) { NormalSlotEmbed.addField('Itens Obtidos', `${nada2}${cores}${title}${faca}${loli}${fossil}${mamute}${diamante}${cachorro}${bola}${remedio}`) }
            if (medalha) { NormalSlotEmbed.addField('Itens Obtidos', `${nada2}${cores}${title}${faca}${loli}${fossil}${mamute}${diamante}${medalha}${dogname}`) }
            NormalSlotEmbed.addField('Mantimentos', `🐟 ${Peixes || 0} Peixes\n🥘 ${Comidas || 0} Comidas\n🪱 ${Iscas || 0} Iscas\n🥤 ${Aguas || 0} Águas\n🎟️ ${Fichas || 0} Fichas\n🍤 ${Camarao || 0} Camarões\n🦴 ${Ossos || 0} Ossos\n🌹 ${Rosas || 0} Rosas\n🍎 ${Apple || 0} Maças\n🪨 ${Minerios || 0} Minérios\n💎 ${Diamante || 0} Diamantes`)
            return message.reply({ embeds: [NormalSlotEmbed] })
        }
    }
}