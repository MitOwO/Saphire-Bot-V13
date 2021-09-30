const { e } = require('../../../Routes/emojis.json')
const Moeda = require('../../../Routes/functions/moeda')
const Colors = require('../../../Routes/functions/colors')

module.exports = {
    name: 'perfil',
    aliases: ['profile'],
    category: 'perfil',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: '👤',
    usage: '<perfil> [@user]',
    description: 'Veja o perfil, seu ou o de alguém',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let user = message.mentions.members.first() || message.member

        if (!isNaN(args[0])) {
            user = message.guild.members.cache.get(args[0])
            if (!user) return message.reply(`${e.Deny} | Não achei ninguém com esse ID.`)
        }

        let color = Colors(user)

        let money = (db.get(`Balance_${user.id}`) || 0) + (db.get(`Bank_${user.id}`) || 0)
        money ? money = money : money = '0'
        if (db.get(`${user.id}.BankOcult`)) {
            if (user.id === message.author.id) {
                money ? money = money : money = '0'
            } else { money = '||Oculto||' }
        }

        let family = db.get(`${user.id}.Perfil.Family.1`) || false
        let family2 = db.get(`${user.id}.Perfil.Family.2`) || false
        let family3 = db.get(`${user.id}.Perfil.Family.3`) || false

        family ? family = `⠀\n1. <@${db.get(`${user.id}.Perfil.Family.1`)}>` : family = ''
        family2 ? family2 = `⠀\n2. <@${db.get(`${user.id}.Perfil.Family.2`)}>` : family2 = ''
        family3 ? family3 = `⠀\n3. <@${db.get(`${user.id}.Perfil.Family.3`)}>` : family3 = ''

        let marry = client.users.cache.get(db.get(`${user.id}.Perfil.Marry`))
        marry ? marry = `💍 ${marry.tag}` : marry = "💍 Solteiro(a)"

        let level = db.get(`level_${user.id}`) + 1
        let likes = db.get(`Likes_${user.id}`) || '0'

        let Title = db.get(`${user.id}.Perfil.Titulo`) || `Sem título definido`
        let titleloja = db.get(`${user.id}.Perfil.TitlePerm`)
        titleloja ? titulo = `🔰 ${Title}` : titulo = `${e.Deny} Não possui título`

        let status = db.get(`${user.id}.Perfil.Status`) || false
        status ? status = db.get(`${user.id}.Perfil.Status`) : status = `${user.user.username} não conhece o comando \`${prefix}setstatus\``

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
        if (!star1 && !star2 && !star3 && !star4 && !star5) estrela = `${e.GrayStar}${e.GrayStar}${e.GrayStar}${e.GrayStar}${e.GrayStar}`

        let TopGlobalMoney = 0
        let TopGlobalLevel = 0
        let TopGlobalLikes = 0

        let LevelData = db.all().filter(i => i.ID.startsWith("Xp_")).sort((a, b) => b.data - a.data)
        if (LevelData.length < 1) {
            TopGlobalLevel = 0
        } else {
            TopGlobalLevel = LevelData.map(m => m.ID).indexOf(`Xp_${user.id}`) + 1 || 0
            TopGlobalLevel === 1 ? TopGlobalLevel = `\n${e.RedStar} **Top Global Level**` : TopGlobalLevel = ''
        }

        let LikesData = db.all().filter(i => i.ID.startsWith("Likes_")).sort((a, b) => b.data - a.data)
        if (LikesData.length < 1) {
            TopGlobalLikes = 0
        } else {
            TopGlobalLikes = LikesData.map(m => m.ID).indexOf(`Likes_${user.id}`) + 1 || 0
            TopGlobalLikes === 1 ? TopGlobalLikes = `\n${e.Like} **Top Global Likes**` : TopGlobalLikes = ''
        }

        let MoneyData = db.all().filter(i => i.ID.startsWith("Bank_")).sort((a, b) => b.data - a.data)
        if (MoneyData.length < 1) {
            TopGlobalMoney = 0
        } else {
            TopGlobalMoney = MoneyData.map(m => m.ID).indexOf(`Bank_${user.id}`) + 1 || 0
            TopGlobalMoney === 1 ? TopGlobalMoney = `\n${e.MoneyWings} **Top Global Money**` : TopGlobalMoney = ''
        }

        let OfficialTitle = db.get(`${user.id}.Perfil.OfficialTitles`) || false
        OfficialTitle ? OfficialTitle = `\n${db.get(`${user.id}.Perfil.OfficialTitles`)}` : OfficialTitle = ''

        if (user.id === client.user.id) {
            const perfil = new MessageEmbed()
                .setDescription(`${e.VipStar} **Perfil Pessoal de ${user.user.username}**\n${e.SaphireTimida} **Envergonhada**\n${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}`)
                .setColor('#FDFF00')
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
                    }
                )
                .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
            return message.reply({ embeds: [perfil] })
        }

        const perfilembed = new MessageEmbed()
            .setColor(color)
            .setDescription(`${vip} **Perfil de ${user.user.username}**${OfficialTitle}${TopGlobalLevel}${TopGlobalLikes}${TopGlobalMoney}\n${estrela}`)
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
                }
            )
            .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))

        // Makol
        if (user.id === '351903530161799178') { perfilembed.setDescription(`${vip} **Perfil de ${user.user.username}**\n${e.ModShield} **Moderator Official**\n${e.Gear} **Bug Hunter**${OfficialTitle}${TopGlobalLevel}${TopGlobalLikes}${TopGlobalMoney}\n${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}`) }
        // Felipe
        if (user.id === '830226550116057149') { perfilembed.setDescription(`${vip} **Perfil de ${user.user.username}**\n${e.SaphireFeliz} **Designer Official & Emojis Productor**${OfficialTitle}${TopGlobalLevel}${TopGlobalLikes}${TopGlobalMoney}\n${estrela}`) }
        // Rody
        if (user.id === '451619591320371213') { perfilembed.setDescription(`${e.VipStar} **Perfil de ${user.user.username}**\n${e.OwnerCrow} **Desenvolvedor**${OfficialTitle}${TopGlobalLevel}${TopGlobalLikes}${TopGlobalMoney}\n${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}`) }

        message.reply({ embeds: [perfilembed] })
    }
}