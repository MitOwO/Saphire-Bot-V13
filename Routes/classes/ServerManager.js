const { db, sdb } = require('../functions/database')
const { config } = require('../../database/config.json')
const { e } = require('../../database/emojis.json')
const Moeda = require('../functions/moeda')

class ServerManager {
    constructor(guild) {
        this.memberCount = guild.members.cache.size
        this.roleCount = guild.roles.cache.size
        this.prefix = sdb.get(`Servers.${guild.id}.Prefix`) || config.prefix
        this.tsundere = sdb.get(`Servers.${guild.id}.Tsundere`)
        this.Blacklisted = db.get(`BlacklistServers_${guild.id}`)
        this.BotRole = () => { return guild.me.roles.botRole || 'Indefinido' }
        this.Moeda = Moeda
        this.MuteSystem = {
            RoleDB: sdb.get(`Servers.${guild.id}.Roles.Muted`),
            DeleteRoleDb: sdb.delete(`Servers.${guild.id}.Roles.Muted`),
            Role: async () => { return await guild.roles.cache.get(this.RoleDB()) }
        }
        this.Autorole = {
            First: sdb.get(`Servers.${guild.id}.Autorole.First`),
            Second: sdb.get(`Servers.${guild.id}.Autorole.Second`),
            Role1: async () => { return await guild.roles.cache.get(guild.id) },
            Role2: async () => { return await guild.roles.cache.get(guild.id) },
            BlockPermissionsAutorole: ['KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'MANAGE_NICKNAMES', 'MANAGE_ROLES', 'ADMINISTRATOR']
        }
        this.WelcomeSystem = {
            CanalDB: sdb.get(`Servers.${guild.id}.WelcomeChannel.Canal`),
            Emoji: sdb.get(`Servers.${guild.id}.WelcomeChannel.Emoji`) || `${e.Join}`,
            Mensagem: sdb.get(`Servers.${guild.id}.WelcomeChannel.Mensagem`) || 'entrou no servidor.'
        }
        this.LogChannel = {
            Channel: async () => { await guild.channels.cache.get(this.ChannelDB) },
            ChannelDB: sdb.get(`Servers.${guild.id}.LogChannel`),
        }
        this.Delete = {
            Autorole: () => { return sdb.delete(`Servers.${guild.id}.Autorole`) },
            AutoroleFirst: () => { return sdb.delete(`Servers.${guild.id}.Autorole.First`) },
            AutoroleSecond: () => { return sdb.delete(`Servers.${guild.id}.Autorole.Second`) },
            WelcomeChannel: () => { return sdb.delete(`Servers.${guild.id}.WelcomeChannel`) }
        }

    }

    DeleteLogChannel(guild, message, ReturnAMessageTrueOrFalse) {
        sdb.delete(`Servers.${guild.id}.LogChannel`)

        if (ReturnAMessageTrueOrFalse) {
            return message.reply(`${e.Check} | Cargo deletado da minha database com sucesso.`)
        }
    }

}

module.exports = ServerManager