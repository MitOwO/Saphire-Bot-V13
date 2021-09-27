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
            } else {
                money = '||Oculto||'
            }
        }

        let family = db.get(`${user.id}.Perfil.Family.1`)
        let family2 = db.get(`${user.id}.Perfil.Family.2`)
        let family3 = db.get(`${user.id}.Perfil.Family.3`)

        family ? family = `⠀\n1. <@${db.get(`${user.id}.Perfil.Family.1`)}>` : family = ''
        family2 ? family2 = `⠀\n2. <@${db.get(`${user.id}.Perfil.Family.2`)}>` : family2 = ''
        family3 ? family3 = `⠀\n3. <@${db.get(`${user.id}.Perfil.Family.3`)}>` : family3 = ''

        let marry = db.get(`${user.id}.Perfil.Marry`)
        marry ? marry = `💍 <@${db.get(`${user.id}.Perfil.Marry`)}>` : marry = "💍 Solteiro(a)"

        let level = db.get(`level_${user.id}`) + 1
        let likes = db.get(`Likes_${user.id}`) || '0'

        let Title = db.get(`${user.id}.Perfil.Titulo`) || `Sem título definido`
        let titleloja = db.get(`${user.id}.Perfil.TitlePerm`)
        titleloja ? titulo = `🔰 ${Title}` : titulo = `${e.Deny} Não possui título`

        let status = db.get(`${user.id}.Perfil.Status`)
        status ? status = db.get(`${user.id}.Perfil.Status`) : status = `${user.user.username} não conhece o comando \`${prefix}setstatus\``

        let signo = db.get(`${user.id}.Perfil.Signo`)
        signo ? signo = `⠀\n${db.get(`${user.id}.Perfil.Signo`)}` : signo = `⠀\n${e.Deny} Sem signo definido`

        let sexo = db.get(`${user.id}.Perfil.Sexo`)
        sexo ? sexo = `⠀\n${db.get(`${user.id}.Perfil.Sexo`)}` : sexo = `⠀\n${e.Deny} Sem sexo definido`

        let niver = `⠀\n🎉 ${db.get(`aniversario_${user.id}`)}`
        niver === `⠀\n🎉 null` ? niver = `⠀\n${e.Deny} Sem aniversário definido` : niver = `⠀\n🎉 ${db.get(`aniversario_${user.id}`)}`

        let estrela = `${e.Star}`
        let noestrela = `${e.GrayStar}`
        let vip = db.get(`Vip_${user.id}`)

        let star1 = db.get(`${user.id}.Perfil.Estrela.1`)
        let star2 = db.get(`${user.id}.Perfil.Estrela.2`)
        let star3 = db.get(`${user.id}.Perfil.Estrela.3`)
        let star4 = db.get(`${user.id}.Perfil.Estrela.4`)
        let star5 = db.get(`${user.id}.Perfil.Estrela.5`)

        if (user.id === client.user.id) {
            const perfil = new MessageEmbed()
                .setDescription(`${e.VipStar} **Perfil Pessoal de ${user.user.username}**\n${estrela}${estrela}${estrela}${estrela}${estrela}`)
                .setColor('#FDFF00')
                .addFields(
                    {
                        name: `👤 Pessoal`,
                        value: `🔰 Princesa do Discord\n${e.Deny} Não tenho signo\n:tada: 29/4/2021\n${e.CatJump} Gatinha`
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
            .addFields(
                {
                    name: '👤 Pessoal',
                    value: `${titulo}${signo}${niver}${sexo}`
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

        if (!vip) {
            if (!star1) { perfilembed.setDescription(`📃 **Perfil de ${user.user.username}**\n${noestrela}${noestrela}${noestrela}${noestrela}${noestrela}`) }
            if (star1) { perfilembed.setDescription(`📃 **Perfil de ${user.user.username}**\n${estrela}${noestrela}${noestrela}${noestrela}${noestrela}`) }
            if (star2) { perfilembed.setDescription(`📃 **Perfil de ${user.user.username}**\n${estrela}${estrela}${noestrela}${noestrela}${noestrela}`) }
            if (star3) { perfilembed.setDescription(`📃 **Perfil de ${user.user.username}**\n${estrela}${estrela}${estrela}${noestrela}${noestrela}`) }
            if (star4) { perfilembed.setDescription(`📃 **Perfil de ${user.user.username}**\n${estrela}${estrela}${estrela}${estrela}${noestrela}`) }
            if (star5) { perfilembed.setDescription(`📃 **Perfil de ${user.user.username}**\n${estrela}${estrela}${estrela}${estrela}${estrela}`) }
        }

        if (vip) {
            if (!star1) { perfilembed.setDescription(`${e.VipStar} **Perfil de ${user.user.username}**\n${noestrela}${noestrela}${noestrela}${noestrela}${noestrela}`) }
            if (star1) { perfilembed.setDescription(`${e.VipStar} **Perfil de ${user.user.username}**\n${estrela}${noestrela}${noestrela}${noestrela}${noestrela}`) }
            if (star2) { perfilembed.setDescription(`${e.VipStar} **Perfil de ${user.user.username}**\n${estrela}${estrela}${noestrela}${noestrela}${noestrela}`) }
            if (star3) { perfilembed.setDescription(`${e.VipStar} **Perfil de ${user.user.username}**\n${estrela}${estrela}${estrela}${noestrela}${noestrela}`) }
            if (star4) { perfilembed.setDescription(`${e.VipStar} **Perfil de ${user.user.username}**\n${estrela}${estrela}${estrela}${estrela}${noestrela}`) }
            if (star5) { perfilembed.setDescription(`${e.VipStar} **Perfil de ${user.user.username}**\n${estrela}${estrela}${estrela}${estrela}${estrela}`) }
            perfilembed.setFooter(`${prefix}vip`)
        }

        message.reply({ embeds: [perfilembed] })
    }
}