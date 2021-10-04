const { e } = require('../../../Routes/emojis.json')
const Moeda = require('../../../Routes/functions/moeda')
const Colors = require('../../../Routes/functions/colors')

module.exports = {
    name: 'perfil',
    aliases: ['profile', 'p'],
    category: 'perfil',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: '👤',
    usage: '<perfil> [@user]',
    description: 'Veja o perfil, seu ou o de alguém',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let u = message.mentions.members.first() || message.mentions.repliedUser || client.users.cache.get(args[0]) || message.author
        let user = client.users.cache.get(u.id) || message.author

        let color = Colors(user)

        let money = (db.get(`Balance_${user.id}`) || 0) + (db.get(`Bank_${user.id}`) || 0)
        money ? money = money : money = '0'
        if (db.get(`${user.id}.BankOcult`)) {
            if (user.id === message.author.id) {
                money ? money = money : money = '0'
            } else { money = '||Oculto||' }
        }

        let family, family2, family3

        if (db.get(`${user.id}.Perfil.Family.1`) && !client.users.cache.get(db.get(`${user.id}.Perfil.Family.1`))) {
            db.delete(`${user.id}.Perfil.Family.1`)
            db.delete(`${db.get(`${user.id}.Perfil.Family.1`)}.Perfil.Family.1`)
        }

        if (db.get(`${user.id}.Perfil.Family.2`) && !client.users.cache.get(db.get(`${user.id}.Perfil.Family.2`))) {
            db.delete(`${user.id}.Perfil.Family.2`)
            db.delete(`${db.get(`${user.id}.Perfil.Family.2`)}.Perfil.Family.2`)
        }

        if (db.get(`${user.id}.Perfil.Family.3`) && !client.users.cache.get(db.get(`${user.id}.Perfil.Family.3`))) {
            db.delete(`${user.id}.Perfil.Family.3`)
            db.delete(`${db.get(`${user.id}.Perfil.Family.3`)}.Perfil.Family.3`)
        }

        client.users.cache.get(db.get(`${user.id}.Perfil.Family.1`)) ? family = `⠀\n1. ${client.users.cache.get(db.get(`${user.id}.Perfil.Family.1`)).tag}` : family = ''
        client.users.cache.get(db.get(`${user.id}.Perfil.Family.2`)) ? family2 = `⠀\n2. ${client.users.cache.get(db.get(`${user.id}.Perfil.Family.2`)).tag}` : family2 = ''
        client.users.cache.get(db.get(`${user.id}.Perfil.Family.3`)) ? family3 = `⠀\n3. ${client.users.cache.get(db.get(`${user.id}.Perfil.Family.3`)).tag}` : family3 = ''

        let marry = client.users.cache.get(db.get(`${user.id}.Perfil.Marry`))
        if (db.get(`${user.id}.Perfil.Marry`) && !client.users.cache.get(db.get(`${user.id}.Perfil.Marry`))) {
            db.delete(`${user.id}.Perfil.Marry`)
            db.delete(`${db.get(`${user.id}.Perfil.Marry`)}.Perfil.Marry`)
            message.channel.send(`${e.Info} | Eu não achei o perceiro*(a)* deste perfil em nenhum dos meus servidores. Então, eu forcei o divórcio entre o casal.`)
        }
        marry ? marry = `💍 ${marry.tag}` : marry = "💍 Solteiro(a)"

        let level = db.get(`level_${user.id}`) + 1
        let likes = db.get(`Likes_${user.id}`) || '0'

        let Title = db.get(`${user.id}.Perfil.Titulo`) || `Sem título definido`
        let titleloja = db.get(`${user.id}.Perfil.TitlePerm`)
        titleloja ? titulo = `🔰 ${Title}` : titulo = `${e.Deny} Não possui título`

        let status = db.get(`${user.id}.Perfil.Status`) || false
        status ? status = db.get(`${user.id}.Perfil.Status`) : status = `${user.username} não conhece o comando \`${prefix}setstatus\``

        let signo = db.get(`${user.id}.Perfil.Signo`) || false
        signo ? signo = `⠀\n${db.get(`${user.id}.Perfil.Signo`)}` : signo = `⠀\n${e.Deny} Sem signo definido`

        let sexo = db.get(`${user.id}.Perfil.Sexo`) || false
        sexo ? sexo = `⠀\n${db.get(`${user.id}.Perfil.Sexo`)}` : sexo = `⠀\n${e.Deny} Sem sexo definido`

        let niver = db.get(`${user.id}.Perfil.Aniversario`) || false
        niver ? niver = `⠀\n🎉 ${db.get(`${user.id}.Perfil.Aniversario`)}` : niver = `⠀\n${e.Deny} Sem aniversário definido`

        let job = db.get(`${user.id}.Perfil.Trabalho`) || false
        job ? job = `⠀\n👷 ${db.get(`${user.id}.Perfil.Trabalho`)}` : job = `⠀\n${e.Deny} Sem profissão definida`

        let estrela = `${e.Star}`

        let vip = db.get(`Vip_${user.id}`) || false
        vip ? vip = `${e.VipStar}` : vip = '📃'

        let star1 = db.get(`${user.id}.Perfil.Estrela.1`) || false
        if (star1) estrela = `${e.Star}${e.GrayStar}${e.GrayStar}${e.GrayStar}${e.GrayStar}`
        let star2 = db.get(`${user.id}.Perfil.Estrela.2`) || false
        if (star2) estrela = `${e.Star}${e.Star}${e.GrayStar}${e.GrayStar}${e.GrayStar}`
        let star3 = db.get(`${user.id}.Perfil.Estrela.3`) || false
        if (star3) estrela = `${e.Star}${e.Star}${e.Star}${e.GrayStar}${e.GrayStar}`
        let star4 = db.get(`${user.id}.Perfil.Estrela.4`) || false
        if (star4) estrela = `${e.Star}${e.Star}${e.Star}${e.Star}${e.GrayStar}`
        let star5 = db.get(`${user.id}.Perfil.Estrela.5`) || false
        if (star5) estrela = `${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}`
        let star6 = db.get(`${user.id}.Perfil.Estrela.6`) || false
        if (star6) estrela = `${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}`
        if (!star1 && !star2 && !star3 && !star4 && !star5 && !star6) estrela = `${e.GrayStar}${e.GrayStar}${e.GrayStar}${e.GrayStar}${e.GrayStar}`

        let TopGlobalMoney, TopGlobalLevel, TopGlobalLikes

        let LevelData = db.all().filter(i => i.ID.startsWith("Xp_")).sort((a, b) => b.data - a.data)
        if (LevelData.length < 1) {
            TopGlobalLevel = ''
        } else {
            TopGlobalLevel = LevelData.map(m => m.ID).indexOf(`Xp_${user.id}`) + 1 || 0
            TopGlobalLevel === 1 ? TopGlobalLevel = `\n${e.RedStar} **Top Global Level**` : TopGlobalLevel = ''
        }

        let LikesData = db.all().filter(i => i.ID.startsWith("Likes_")).sort((a, b) => b.data - a.data)
        if (LikesData.length < 1) {
            TopGlobalLikes = ''
        } else {
            TopGlobalLikes = LikesData.map(m => m.ID).indexOf(`Likes_${user.id}`) + 1 || 0
            TopGlobalLikes === 1 ? TopGlobalLikes = `\n${e.Like} **Top Global Likes**` : TopGlobalLikes = ''
        }

        let MoneyData = db.all().filter(i => i.ID.startsWith("Bank_")).sort((a, b) => b.data - a.data)
        if (MoneyData.length < 1) {
            TopGlobalMoney = ''
        } else {
            TopGlobalMoney = MoneyData.map(m => m.ID).indexOf(`Bank_${user.id}`) + 1 || 0
            TopGlobalMoney === 1 ? TopGlobalMoney = `\n${e.MoneyWings} **Top Global Money**` : TopGlobalMoney = ''
        }

        let OfficialTitle = db.get(`${user.id}.Perfil.OfficialTitles`) || false
        OfficialTitle ? OfficialTitle = `\n${db.get(`${user.id}.Perfil.OfficialTitles`)}` : OfficialTitle = ''

        let Moderator = db.get(`Moderadores.${user.id}`) || false
        Moderator ? Moderator = `\n${e.ModShield} **Official Moderator**` : Moderator = ''

        let Developer = db.get(`Developer.${user.id}`) || false
        Developer ? Developer = `\n${e.OwnerCrow} **Official Developer**` : Developer = ''

        let BugHunter = db.get(`BugHunter.${user.id}`) || false
        BugHunter ? BugHunter = `\n${e.Gear} **Bug Hunter**` : BugHunter = ''

        let OfficialDesigner = db.get(`OfficialDesigner.${user.id}`) || false
        OfficialDesigner ? OfficialDesigner = `\n${e.SaphireFeliz} **Designer Official & Emojis Productor**` : OfficialDesigner = ''

        if (user.id === client.user.id) {
            const perfil = new MessageEmbed()
                .setDescription(`${e.VipStar} **Perfil Pessoal de ${client.user.username}**\n${e.SaphireTimida} **Envergonhada**\n${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}`)
                .setColor('#246FE0')
                .addFields(
                    {
                        name: `👤 Pessoal`,
                        value: `🔰 Princesa do Discord\n${e.Deny} Não tenho signo\n:tada: 29/4/2021\n${e.CatJump} Gatinha\n👷 Bot no Discord`
                    },
                    {
                        name: '❤️ Familia',
                        value: `💍 Itachi Uchira\nO Discord é minha familia`
                    },
                    {
                        name: '🌐 Global',
                        value: `∞ ${Moeda(message)}\n∞ ${e.RedStar} Level\n∞ ${e.Like} Likes`,
                    },
                    {
                        name: '📝 Status',
                        value: 'Um dia eu quero ir pra lua'
                    },
                    {
                        name: '🛡️ Clan',
                        value: 'Machine Saphire'
                    }
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            return message.reply({ embeds: [perfil] })
        }

        const perfilembed = new MessageEmbed()
            .setColor(color)
            .setDescription(`${vip} **Perfil de ${user.username}**${Developer}${OfficialDesigner}${Moderator}${BugHunter}${OfficialTitle}${TopGlobalLevel}${TopGlobalLikes}${TopGlobalMoney}\n${estrela}`)
            .addFields(
                {
                    name: '👤 Pessoal',
                    value: `${titulo}${signo}${niver}${sexo}${job}`
                },
                {
                    name: `❤️ Familia`,
                    value: `${marry}${family}${family2}${family3}`
                },
                {
                    name: '🌐 Global',
                    value: `${money} ${Moeda(message)}\n${level} ${e.RedStar} Level\n${likes} ${e.Like} Likes`,
                },
                {
                    name: '📝 Status',
                    value: status
                },
                {
                    name: '🛡️ Clan',
                    value: 'Sessão em produção'
                }
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))

        message.reply({ embeds: [perfilembed] })
    }
}