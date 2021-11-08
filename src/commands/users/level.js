const { BgLevel, DatabaseObj } = require('../../../Routes/functions/database')
const { e, config } = DatabaseObj
const simplydjs = require('simply-djs')
const Error = require('../../../Routes/functions/errors')
const color = require('../../../Routes/functions/colors')
const ms = require("parse-ms")

module.exports = {
    name: 'level',
    aliases: ['xp', 'nivel', 'lvl', 'l'],
    category: 'level',
    ClientPermissions: ['ATTACH_FILES'],
    emoji: `${e.Star}`,
    usage: '<level> [info]',
    description: 'Confira seu nível ou o de alguém',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let u = message.mentions.users.first() || await client.users.cache.get(args[0]) || message.mentions.repliedUser || message.author
        let user = await client.users.cache.get(u.id)

        const { level, exp, xpNeeded, rank, LevelWallpapers, TimeDB } = {
            level: db.get(`level_${user.id}`) || 0,
            exp: db.get(`Xp_${user.id}`) || 0,
            xpNeeded: db.get(`Xp_${user.id}`) || 0 * 550,
            rank: db.all().filter(i => i.ID.startsWith("level_")).sort((a, b) => b.data - a.data).map(x => x.ID).indexOf(`level_${user.id}`) + 1,
            LevelWallpapers: BgLevel.get('LevelWallpapers'),
            TimeDB: sdb.get(`Users.${message.author.id}.Timeouts.LevelImage`) || 0,
        }

        if (user.bot) return message.reply(`${e.Deny} | Bots não possuem experiência.`)

        if (['info', 'help', 'ajuda'].includes(args[0]?.toLowerCase())) return LevelInfo()
        
        let Timing = ms(30000 - (Date.now() - TimeDB))
        if (TimeDB !== null && 30000 - (Date.now() - TimeDB) > 0)
            return message.reply(`⏱️ | Calminha coisa linda! \`${Timing.seconds}s\``)

        if (['set', 'wall', 'wallpaper', 'fundo', 'bg', 'background', 'capa'].includes(args[0]?.toLowerCase())) {

            let Cooldown = sdb.get(`Users.${message.author.id}.Timeouts.LevelTrade`) || 0
            let Time = ms(1200000 - (Date.now() - Cooldown))
            if (Cooldown !== null && 1200000 - (Date.now() - Cooldown) > 0)
                return message.reply(`⏱️ | Espere um pouco para trocar de wallpaper. \`${Time.minutes} minutes ${Time.seconds} seconds\``)

            let option = args[1]?.toLowerCase()

            if (!option)
                return message.reply(`${e.Info} | Selecione o background dizendo o **código** dele. Você pode ver seus backgrounds usando \`${prefix}slot bg\``)

            try {
                if (!Object.keys(LevelWallpapers).includes(option))
                    return message.reply(`${e.Deny} | Esse background não existe.`)
            } catch (err) { Error(message, err) }

            if (option === 'bg0') {
                if (!sdb.get(`Users.${message.author.id}.Slot.Walls.Set`))
                    return message.reply(`${e.Info} | Este fundo já é o seu atual.`)

                sdb.delete(`Users.${message.author.id}.Slot.Walls.Set`)
                return SendLevel()
            }

            if (sdb.get(`Users.${message.author.id}.Slot.Walls.Set`) === BgLevel.get(`LevelWallpapers.${option}`))
                return message.reply(`${e.Info} | Este fundo já é o seu atual.`)

            if (!sdb.get(`Client.BackgroundAcess.${message.author.id}`))
                if (!sdb.get(`Users.${message.author.id}.Slot.Walls.Bg.${option}`))
                    return message.reply(`${e.Deny} | Você não tem esse background. Que tal comprar ele usando \`${prefix}buy bg ${option}\`?`)

            sdb.set(`Users.${message.author.id}.Slot.Walls.Set`, BgLevel.get(`LevelWallpapers.${option}.Image`))
            sdb.set(`Users.${user.id}.Timeouts.LevelTrade`, Date.now())
            return SendLevel()

        }

        if (['bgset', 'setbg'].includes(args[0]?.toLowerCase()) && sdb.get(`Client.BackgroundAcess.${message.author.id}`)) {
            if (!args[1])
                return message.reply(`${e.Deny} | Sem \`args[1]\``)
            sdb.set(`Users.${message.author.id}.Slot.Walls.Set`, args[1])
            return SendLevel()
        }

        if (['reset', 'excluir', 'off', 'tirar', 'delete', 'del', 'bg0'].includes(args[0]?.toLowerCase())) {
            if (!sdb.get(`Users.${user.id}.Slot.Walls.Set`))
                return message.reply(`${e.Info} | Seu background já é o padrão.`)

            sdb.delete(`Users.${message.author.id}.Slot.Walls.Set`)
            return message.reply(`${e.Check} | Background removido com sucesso!`)
        }

        if (!args[0] || user) return SendLevel()

        return message.reply(`${e.Deny} | Não sabe usar o level? Use \`${prefix}level info\``)

        async function SendLevel() {
            try {
                message.reply(`${e.Loading} | Carregando...`).then(async msg => {
                    sdb.set(`Users.${message.author.id}.Timeouts.LevelImage`, Date.now())

                    await simplydjs.rankCard(client, message, {
                        member: user,
                        level: level,
                        currentXP: exp,
                        neededXP: xpNeeded,
                        rank: rank,
                        background: sdb.get(`Users.${user.id}.Slot.Walls.Set`) || LevelWallpapers.bg0.Image || null
                    }).then(() => { msg.delete().catch(() => { }) })
                })
            } catch (err) { return Error(message, err) }
        }

        function LevelInfo() {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(color(message.member))
                        .setTitle(`${e.RedStar} Sistema de Level Personalizado`)
                        .setDescription('Você pode mudar o fundo do seu level.')
                        .addFields(
                            {
                                name: `${e.MoneyWings} Compre backgrounds`,
                                value: `\`${prefix}loja | ${prefix}buy bg <bgCode>\``
                            },
                            {
                                name: `${e.Gear} Configure seu backgrounds`,
                                value: `\`${prefix}level set <bgCode>\`\nAtalhos: \`wall, wallpaper, fundo, bg, background, capa\``
                            },
                            {
                                name: `${e.Deny} Delete o fundo`,
                                value: `\`${prefix}level off\` - Fundo Padrão: bg0\nAtalhos: \`reset, excluir, tirar, delete, del, bg0\``
                            },
                            {
                                name: `${e.BongoScript} Códigos de Fundo`,
                                value: `Cada fundo possui um código único no qual é usado para configura-lo. O padrão é \`bg0\`. Você pode ver os códigos das capas usando \`${prefix}lvlwall [bgCode]\` ou acessando o [servidor package](${config.PackageInvite}) onde todos os fundos estão guardados.`
                            }
                        )
                ]
            })
        }
    }
}