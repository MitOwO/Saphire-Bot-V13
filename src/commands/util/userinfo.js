const { e } = require('../../../database/emojis.json')
const moment = require('moment')
const { Permissions } = require('discord.js')

module.exports = {
    name: 'userinfo',
    aliases: ['ui'],
    category: 'util',
    
    ClientPermissions: 'EMBED_LINKS',
    emoji: `${e.Info}`,
    usage: '<userinfo> [@user]',
    description: 'Informações de usuários no Discord',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let user = message.mentions.members.first() || message.member

        let flags = { DISCORD_EMPLOYEE: 'Discord Employee', DISCORD_PARTNER: 'Discord Partner', BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)', BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)', HYPESQUAD_EVENTS: 'HypeSquad Events', HOUSE_BRAVERY: 'House of Bravery', HOUSE_BRILLIANCE: 'House of Brilliance', HOUSE_BALANCE: 'House of Balance', EARLY_SUPPORTER: 'Early Supporter', TEAM_USER: 'Team User', SYSTEM: 'System', VERIFIED_BOT: 'Verified Bot', VERIFIED_DEVELOPER: 'Verified Bot Developer' }
        let userFlags = user.user.flags.toArray()
        let Bandeiras = `${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'Nenhuma'}`

        let name = user.user.username
        let tag = user.user.tag
        let id = user.id
        let system = user.system ? "Sim" : "Não"
        let avatar = user.user.avatarURL({ dynamic: true, format: "png", size: 1024 })
        let bot = user.user.bot ? "Sim" : "Não"

        let data = user.user.createdAt
        let DataFormatada = data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear() + " ás " + data.getHours() + "h " + data.getMinutes() + 'm e ' + data.getSeconds() + 's'

        let Entrou = user.joinedAt
        let DataFormatadaGuild = Entrou.getDate() + "/" + (Entrou.getMonth() + 1) + "/" + Entrou.getFullYear() + " ás " + Entrou.getHours() + "h " + Entrou.getMinutes() + 'm e ' + Entrou.getSeconds() + 's'

        let dono = (message.guild.ownerId === user.id) ? "Sim" : "Não"
        let User = message.guild.members.cache.get(`${user.id}`)
        let adm = User.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ? "Sim" : "Não"
        let banivel = User.bannable ? "Sim" : "Não"
        let kick = User.kickable ? "Sim" : "Não"
        let color = User.displayHexColor
        let nick = User.displayName
        let associado = User.pending ? "Não" : "Sim"

        const UserEmbed = new MessageEmbed()
            .setColor(color || 'BLUE')
            .setTitle(`${e.Info} Informações de usuários`)
            .setDescription(`Usuário: ${user}`)
            .setThumbnail(avatar)
            .addField(`👤 Usuário`, `Nome: ${tag}\nID: \`${id}\`\nBot: ${bot}\nBandeiras: ${Bandeiras}\nSistema: ${system}\nCriou a conta em: ${DataFormatada}`)
            .addField(`${e.ModShield} Servidor`, `Dono: ${dono}\nAdministrador: ${adm}\nEntrou em: ${DataFormatadaGuild}\nPosso banir/expulsar: ${banivel}/${kick}\nCor: ${color}\nNickname: ${nick}\nAssociado: ${associado}`)

        message.reply({ embeds: [UserEmbed] })
    }
}