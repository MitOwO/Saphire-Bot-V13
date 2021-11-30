const { e } = require('../../../database/emojis.json')
const moment = require('moment')
const { Permissions } = require('discord.js')

module.exports = {
    name: 'userinfo',
    aliases: ['ui'],
    category: 'util',

    ClientPermissions: ['EMBED_LINKS'],
    emoji: `${e.Info}`,
    usage: '<userinfo> [@user]',
    description: 'Informações de usuários no Discord',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let user = message.mentions.members.first() || message.member,
            flags = { DISCORD_EMPLOYEE: 'Discord Employee', DISCORD_PARTNER: 'Discord Partner', BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)', BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)', HYPESQUAD_EVENTS: 'HypeSquad Events', HOUSE_BRAVERY: 'House of Bravery', HOUSE_BRILLIANCE: 'House of Brilliance', HOUSE_BALANCE: 'House of Balance', EARLY_SUPPORTER: 'Early Supporter', TEAM_USER: 'Team User', SYSTEM: 'System', VERIFIED_BOT: 'Verified Bot', VERIFIED_DEVELOPER: 'Verified Bot Developer' },
            userFlags = user.user.flags.toArray(),
            Bandeiras = `${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'Nenhuma'}`,
            name = user.user.username,
            tag = user.user.tag,
            id = user.id,
            system = user.system ? "Sim" : "Não",
            avatar = user.user.avatarURL({ dynamic: true, format: "png", size: 1024 }),
            bot = user.user.bot ? "Sim" : "Não",
            data = user.user.createdAt,
            DataFormatada = data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear() + " ás " + data.getHours() + "h " + data.getMinutes() + 'm e ' + data.getSeconds() + 's',
            Entrou = user.joinedAt,
            DataFormatadaGuild = Entrou.getDate() + "/" + (Entrou.getMonth() + 1) + "/" + Entrou.getFullYear() + " ás " + Entrou.getHours() + "h " + Entrou.getMinutes() + 'm e ' + Entrou.getSeconds() + 's',
            dono = (message.guild.ownerId === user.id) ? "Sim" : "Não",
            User = message.guild.members.cache.get(`${user.id}`),
            adm = User.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ? "Sim" : "Não",
            banivel = User.bannable ? "Sim" : "Não",
            kick = User.kickable ? "Sim" : "Não",
            color = User.displayHexColor,
            nick = User.displayName,
            associado = User.pending ? "Não" : "Sim",
            UserEmbed = new MessageEmbed()
                .setColor(color || 'BLUE')
                .setTitle(`${e.Info} Informações de usuários`)
                .setDescription(`Usuário: ${user}`)
                .setThumbnail(avatar)
                .addField(`👤 Usuário`, `Nome: ${tag}\nID: \`${id}\`\nBot: ${bot}\nBandeiras: ${Bandeiras}\nSistema: ${system}\nCriou a conta em: ${DataFormatada}`)
                .addField(`${e.ModShield} Servidor`, `Dono: ${dono}\nAdministrador: ${adm}\nEntrou em: ${DataFormatadaGuild}\nPosso banir/expulsar: ${banivel}/${kick}\nCor: ${color}\nNickname: ${nick}\nAssociado: ${associado}`)

        message.reply({ embeds: [UserEmbed] })
    }
}