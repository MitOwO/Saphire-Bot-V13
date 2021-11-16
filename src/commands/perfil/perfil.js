const { DatabaseObj } = require('../../../Routes/functions/database')
const { e, config, N } = DatabaseObj
const Moeda = require('../../../Routes/functions/moeda')
const Colors = require('../../../Routes/functions/colors')
const Vip = require('../../../Routes/functions/vip')

module.exports = {
    name: 'perfil',
    aliases: ['profile', 'p'],
    category: 'perfil',
    emoji: '👤',
    usage: '<perfil> [@user]',
    description: 'Veja o perfil, seu ou o de alguém',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let u = message.mentions.members.first() || message.mentions.repliedUser || await client.users.cache.get(args[0]) || message.author
        if (!u.id) return message.reply(`${e.Deny} | Eu não achei ninguém com esse ID.`)
        let user = await client.users.cache.get(u.id)

        let color, money, marry, level, likes, titulo, status, signo, sexo, niver, job, vip, estrela = 'Indefinido', TopGlobalMoney, TopGlobalLevel, TopGlobalLikes, LevelData, LikesData, MoneyData, OfficialTitle, Moderator, Developer, BugHunter, OfficialDesigner, Mage, parca1, parca2, parca3, parca4, parca5, NoParcas, family1, family2, family3, NoFamily

        color = Colors(user)
        money = (db.get(`Balance_${user.id}`) || 0) + (db.get(`Bank_${user.id}`) || 0) + (sdb.get(`Users.${user.id}.Cache.Resgate`) || 0)
        level = db.get(`level_${user.id}`) || 0
        likes = db.get(`Likes_${user.id}`) || 0

        if (sdb.get(`Users.${user.id}.Perfil.BankOcult`) && message.author.id !== (user.id || config.ownerId))
            money = '||Oculto||'

        const PerfilObj = {
            Marry: sdb.get(`Users.${user.id}.Perfil.Marry`),
            Titulo: sdb.get(`Users.${user.id}.Perfil.Titulo`),
            TitlePerm: sdb.get(`Users.${user.id}.Perfil.TitlePerm`),
            Status: sdb.get(`Users.${user.id}.Perfil.Status`),
            Signo: sdb.get(`Users.${user.id}.Perfil.Signo`),
            Sexo: sdb.get(`Users.${user.id}.Perfil.Sexo`),
            Aniversario: sdb.get(`Users.${user.id}.Perfil.Aniversario`),
            Trabalho: sdb.get(`Users.${user.id}.Perfil.Trabalho`),
            Clan: sdb.get(`Users.${user.id}.Clan`) || 'Não possui',
            Estrela: {
                Um: sdb.get(`Users.${user.id}.Perfil.Estrela.Um`),
                Dois: sdb.get(`Users.${user.id}.Perfil.Estrela.Dois`),
                Tres: sdb.get(`Users.${user.id}.Perfil.Estrela.Tres`),
                Quatro: sdb.get(`Users.${user.id}.Perfil.Estrela.Quatro`),
                Cinco: sdb.get(`Users.${user.id}.Perfil.Estrela.Cinco`),
                Seis: sdb.get(`Users.${user.id}.Perfil.Estrela.Seis`),
            },
            Parcas: {
                Um: sdb.get(`Users.${user.id}.Perfil.Parcas.Um`),
                Dois: sdb.get(`Users.${user.id}.Perfil.Parcas.Dois`),
                Tres: sdb.get(`Users.${user.id}.Perfil.Parcas.Tres`),
                Quatro: sdb.get(`Users.${user.id}.Perfil.Parcas.Quatro`),
                Cinco: sdb.get(`Users.${user.id}.Perfil.Parcas.Cinco`),
            },
            Family: {
                Um: sdb.get(`Users.${user.id}.Perfil.Family.Um`),
                Dois: sdb.get(`Users.${user.id}.Perfil.Family.Dois`),
                Tres: sdb.get(`Users.${user.id}.Perfil.Family.Tres`),
            },
        }

        let { Marry, Titulo, TitlePerm, Estrela, Parcas, Family, Status, Signo, Sexo, Aniversario, Trabalho, Clan } = PerfilObj

        if (Marry && !await client.users.cache.get(Marry)) {
            sdb.delete(`Users.${Marry}`)
            sdb.set(`Users.${user.id}.Perfil.Marry`, false)
            message.channel.send(`${e.Info} | Eu não achei o perceiro*(a)* deste perfil em nenhum dos meus servidores. Então, eu forcei o divórcio entre o casal.`)
        }
        marry = await client.users.cache.get(sdb.get(`Users.${user.id}.Perfil.Marry`))
        marry = marry ? marry.tag : "Solteiro(a)"

        family1 = await client.users.cache.get(Family.Um)
        family2 = await client.users.cache.get(Family.Dois)
        family3 = await client.users.cache.get(Family.Tres)

        if (Family.Um && !family1) {
            sdb.delete(`Users.${Family.Um}`)
            sdb.set(`Users.${user.id}.Perfil.Family.Um`, false)
        }

        if (Family.Dois && !family2) {
            sdb.delete(`Users.${Family.Dois}`)
            sdb.set(`Users.${user.id}.Perfil.Family.Dois`, false)
        }

        if (Family.Tres && !family3) {
            sdb.delete(`Users.${Family.Tres}`)
            sdb.set(`Users.${user.id}.Perfil.Family.Tres`, false)
        }

        family1 ? family1 = `\n1. ${family1.tag}` : family1 = ''
        family2 ? family2 = `\n2. ${family2.tag}` : family2 = ''
        family3 ? family3 = `\n3. ${family3.tag}` : family3 = ''

        if (!Family.Um && !Family.Dois && !Family.Tres) {
            NoFamily = 'Nenhum membro na família'
        } else { NoFamily = '' }

        parca1 = await client.users.cache.get(Parcas.Um)
        parca2 = await client.users.cache.get(Parcas.Dois)
        parca3 = await client.users.cache.get(Parcas.Tres)
        parca4 = await client.users.cache.get(Parcas.Quatro)
        parca5 = await client.users.cache.get(Parcas.Cinco)

        if (!Parcas.Um && !Parcas.Dois && !Parcas.Tres && !Parcas.Quatro && !Parcas.Cinco) {
            NoParcas = 'Nenhum parça ainda'
        } else { NoParcas = '' }

        if (Parcas.Um && !parca1) {
            sdb.delete(`Users.${Parcas.Um}`)
            sdb.set(`Users.${user.id}.Perfil.Parcas.Um`, false)
        }

        if (Parcas.Dois && !parca2) {
            sdb.delete(`Users.${Parcas.Dois}`)
            sdb.set(`Users.${user.id}.Perfil.Parcas.Dois`, false)
        }

        if (Parcas.Tres && !parca3) {
            sdb.delete(`Users.${Parcas.Tres}`)
            sdb.set(`Users.${user.id}.Perfil.Parcas.Tres`, false)
        }

        if (Parcas.Quatro && !parca4) {
            sdb.delete(`Users.${Parcas.Quatro}`)
            sdb.set(`Users.${user.id}.Perfil.Parcas.Quatro`, false)
        }

        if (Parcas.Cinco && !parca5) {
            sdb.delete(`Users.${Parcas.Cinco}`)
            sdb.set(`Users.${user.id}.Perfil.Parcas.Cinco`, false)
        }

        parca1 = parca1 ? `\n1. ${parca1.tag}` : ''
        parca2 = parca2 ? `\n2. ${parca2.tag}` : ''
        parca3 = parca3 ? `\n3. ${parca3.tag}` : ''
        parca4 = parca4 ? `\n4. ${parca4.tag}` : ''
        parca5 = parca5 ? `\n5. ${parca5.tag}` : ''

        titulo = TitlePerm ? `🔰 ${Titulo || 'Sem título definido'}` : `${e.Deny} Não possui título`

        status = Status ? Status : `${user.username} não conhece o comando \`${prefix}setstatus\``
        signo = Signo ? `⠀\n${Signo}` : `⠀\n${e.Deny} Sem signo definido`
        sexo = Sexo ? `⠀\n${Sexo}` : `⠀\n${e.Deny} Sem sexo definido`
        niver = Aniversario ? `⠀\n🎉 ${Aniversario}` : `⠀\n${e.Deny} Sem aniversário definido`
        job = Trabalho ? `⠀\n👷 ${Trabalho}` : `⠀\n${e.Deny} Sem profissão definida`
        vip = Vip(`${user.id}`) ? `${e.VipStar}` : '📃'

        if (Estrela.Um) estrela = `${e.Star}${e.GrayStar}${e.GrayStar}${e.GrayStar}${e.GrayStar}`
        if (Estrela.Dois) estrela = `${e.Star}${e.Star}${e.GrayStar}${e.GrayStar}${e.GrayStar}`
        if (Estrela.Tres) estrela = `${e.Star}${e.Star}${e.Star}${e.GrayStar}${e.GrayStar}`
        if (Estrela.Quatro) estrela = `${e.Star}${e.Star}${e.Star}${e.Star}${e.GrayStar}`
        if (Estrela.Cinco) estrela = `${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}`
        if (Estrela.Seis) estrela = `${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}`
        if (!Estrela.um && !Estrela.Dois && !Estrela.Tres && !Estrela.Quatro && !Estrela.Cinco && !Estrela.Seis) estrela = `${e.GrayStar}${e.GrayStar}${e.GrayStar}${e.GrayStar}${e.GrayStar}`

        LevelData = db.all().filter(i => i.ID.startsWith("level_")).sort((a, b) => b.data - a.data)
        if (LevelData.length < 1) {
            TopGlobalLevel = ''
        } else {
            let Ranking = LevelData.map(m => m.ID).indexOf(`level_${user.id}`) + 1 || 0
            TopGlobalLevel = Ranking === 1 ? `\n${e.RedStar} **Top Global Level**` : ''
        }

        LikesData = db.all().filter(i => i.ID.startsWith("Likes_")).sort((a, b) => b.data - a.data)
        if (LikesData.length < 1) {
            TopGlobalLikes = ''
        } else {
            let Ranking = LikesData.map(m => m.ID).indexOf(`Likes_${user.id}`) + 1 || 0
            TopGlobalLikes = Ranking === 1 ? `\n${e.Like} **Top Global Likes**` : ''
        }

        MoneyData = db.all().filter(i => i.ID.startsWith("Bank_")).sort((a, b) => b.data - a.data)
        if (MoneyData.length < 1) {
            TopGlobalMoney = ''
        } else {
            let Ranking = MoneyData.map(m => m.ID).indexOf(`Bank_${user.id}`) + 1 || 0
            TopGlobalMoney = Ranking === 1 ? `\n${e.MoneyWings} **Top Global Money**` : ''
        }

        OfficialTitle = sdb.get(`Users.${user.id}.Perfil.OfficialTitles`) || false
        OfficialTitle ? OfficialTitle = `\n${sdb.get(`Users.${user.id}.Perfil.OfficialTitles`)}` : OfficialTitle = ''

        Moderator = sdb.get(`Client.Moderadores.${user.id}`) ? `\n${e.ModShield} **Official Moderator**` : ''
        Developer = sdb.get(`Client.Developer.${user.id}`) ? `\n${e.OwnerCrow} **Official Developer**` : ''
        BugHunter = sdb.get(`Client.BugHunter.${user.id}`) ? `\n${e.Gear} **Bug Hunter**` : ''
        OfficialDesigner = sdb.get(`Client.OfficialDesigner.${user.id}`) ? `\n${e.SaphireFeliz} **Designer Official**` : ''
        Mage = sdb.get(`Titulos.${user.id}.Halloween`) ? `\n🎃 **Halloween 2021**` : ''

        if (user.id === client.user.id) {
            const perfil = new MessageEmbed()
                .setDescription(`${e.VipStar} **Perfil Pessoal de ${client.user.username}**\n${e.SaphireTimida} **Envergonhada**\n🎃 **Halloween 2021**\n${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}${e.Star}`)
                .setColor('#246FE0')
                .addFields(
                    {
                        name: `👤 Pessoal`,
                        value: `🔰 Princesa do Discord\n${e.Deny} Não tenho signo\n:tada: 29/4/2021\n${e.CatJump} Gatinha\n👷 Bot no Discord`
                    },
                    {
                        name: '💍 Cônjuge',
                        value: `💍 Itachi Uchiha`
                    },
                    {
                        name: '❤️ Família',
                        value: `${N.Rody}`
                    },
                    {
                        name: '🤝 Parças',
                        value: 'Galera do Discord'
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
            .setDescription(`${vip} **Perfil de ${user.username}**${Developer}${OfficialDesigner}${Moderator}${Mage}${BugHunter}${OfficialTitle}${TopGlobalLevel}${TopGlobalLikes}${TopGlobalMoney}\n${estrela}`)
            .addFields(
                {
                    name: '👤 Pessoal',
                    value: `${titulo}${signo}${niver}${sexo}${job}`
                },
                {
                    name: '💍 Cônjuge',
                    value: `${marry}`
                },
                {
                    name: '❤️ Família',
                    value: `${family1}${family2}${family3}${NoFamily}`
                },
                {
                    name: '🤝 Parças',
                    value: `${parca1}${parca2}${parca3}${parca4}${parca5}${NoParcas}`
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
                    value: Clan
                }
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))

        message.reply({ embeds: [perfilembed] })
    }
}