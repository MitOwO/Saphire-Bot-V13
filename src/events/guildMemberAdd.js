const { e } = require('../../Routes/emojis.json')
const client = require('../../index')
const db = require('quick.db')
const { Permissions } = require('discord.js')
const { config } = require('../../Routes/config.json')

client.on('guildMemberAdd', async (member) => {

    if (!member.guild.available) return

    Welcome();

    const prefix = db.get(`Servers.${member.guild.id}.Prefix`) || config.prefix

    if (db.get(`Servers.${member.guild.id}.Autorole1`) && !member.guild.roles.cache.get(db.get(`Servers.${member.guild.id}.Autorole1`))) return DisableAutorole1()
    if (db.get(`Servers.${member.guild.id}.Autorole2`) && !member.guild.roles.cache.get(db.get(`Servers.${member.guild.id}.Autorole2`))) return DisableAutorole2()

    let role1 = member.guild.roles.cache.get(db.get(`Servers.${member.guild.id}.Autorole1`))
    let role2 = member.guild.roles.cache.get(db.get(`Servers.${member.guild.id}.Autorole2`))

    let Checking = ''; let Checking2 = ''

    if ((role1 || role2) && !member.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return Notify(`🛰️ | **Global System Notification** | Autorole System\n \nEu não tenho a permissão **GERENCIAR CARGOS**. Por favor, ative-a ou desative o Autorole System usando o comando \`${prefix}autorole off\``)

    role1 ? AutoroleSystem1() : ''
    role2 ? AutoroleSystem2() : ''

    async function AutoroleSystem1() {

        role1.permissions.has(Permissions.FLAGS.KICK_MEMBERS) ? Checking = 'KICK_MEMBERS' : ''
        role1.permissions.has(Permissions.FLAGS.BAN_MEMBERS) ? Checking = 'BAN_MEMBERS' : ''
        role1.permissions.has(Permissions.FLAGS.MANAGE_GUILD) ? Checking = 'MANAGE_GUILD' : ''
        role1.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS) ? Checking = 'MANAGE_CHANNELS' : ''
        role1.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) ? Checking = 'MANAGE_MESSAGES' : ''
        role1.permissions.has(Permissions.FLAGS.MUTE_MEMBERS) ? Checking = 'MUTE_MEMBERS' : ''
        role1.permissions.has(Permissions.FLAGS.DEAFEN_MEMBERS) ? Checking = 'DEAFEN_MEMBERS' : ''
        role1.permissions.has(Permissions.FLAGS.MOVE_MEMBERS) ? Checking = 'MOVE_MEMBERS' : ''
        role1.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES) ? Checking = 'MANAGE_NICKNAMES' : ''
        role1.permissions.has(Permissions.FLAGS.MANAGE_ROLES) ? Checking = 'MANAGE_ROLES' : ''
        role1.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ? Checking = 'ADMINISTRATOR' : ''

        switch (Checking) {
            case 'ADMINISTRATOR': DisableAutorole1(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role1}** possui a permissão **ADMINISTRADOR** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 1** foi desabilitado.`); break;
            case 'KICK_MEMBERS': DisableAutorole1(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role1}** possui a permissão **EXPULSAR MEMBROS** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 1** foi desabilitado.`); break;
            case 'BAN_MEMBERS': DisableAutorole1(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role1}** possui a permissão **BANIR MEMBROS** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 1** foi desabilitado.`); break;
            case 'MANAGE_GUILD': DisableAutorole1(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role1}** possui a permissão **GERENCIAR SERVIDOR** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 1** foi desabilitado.`); break;
            case 'MANAGE_CHANNELS': DisableAutorole1(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role1}** possui a permissão **GERENCIAR CANAIS** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 1** foi desabilitado.`); break;
            case 'MANAGE_MESSAGES': DisableAutorole1(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role1}** possui a permissão **GERENCIAR MENSAGENS** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 1** foi desabilitado.`); break;
            case 'MUTE_MEMBERS': DisableAutorole1(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role1}** possui a permissão **SILENCIAR MEMBROS** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 1** foi desabilitado.`); break;
            case 'DEAFEN_MEMBERS': DisableAutorole1(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role1}** possui a permissão **ENSURDECER MEMBROS** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 1** foi desabilitado.`); break;
            case 'MOVE_MEMBERS': DisableAutorole1(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role1}** possui a permissão **MOVER MEMBROS** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 1** foi desabilitado.`); break;
            case 'MANAGE_NICKNAMES': DisableAutorole1(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role1}** possui a permissão **GERENCIAR APELIDOS** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 1** foi desabilitado.`); break;
            case 'MANAGE_ROLES': DisableAutorole1(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role1}** possui a permissão **GERENCIAR CARGOS** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 1** foi desabilitado.`); break;

            default: member.roles.add(role1).catch(err => { return Notify(`🛰️ | **Global System Notification** | Autorole System\n \nHouve um erro na adição de cargo referente ao **Autorole 1**. Caso não saiba resolver o problema, utilize o comando \`${prefix}bug\` e relate o probrema.\n~~ \`${err}\` ~~`) }); break;
        }
    }

    async function AutoroleSystem2() {

        role2.permissions.has(Permissions.FLAGS.KICK_MEMBERS) ? Checking2 = 'KICK_MEMBERS' : ''
        role2.permissions.has(Permissions.FLAGS.BAN_MEMBERS) ? Checking2 = 'BAN_MEMBERS' : ''
        role2.permissions.has(Permissions.FLAGS.MANAGE_GUILD) ? Checking2 = 'MANAGE_GUILD' : ''
        role2.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS) ? Checking = 'MANAGE_CHANNELS' : ''
        role2.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) ? Checking2 = 'MANAGE_MESSAGES' : ''
        role2.permissions.has(Permissions.FLAGS.MUTE_MEMBERS) ? Checking2 = 'MUTE_MEMBERS' : ''
        role2.permissions.has(Permissions.FLAGS.DEAFEN_MEMBERS) ? Checking2 = 'DEAFEN_MEMBERS' : ''
        role2.permissions.has(Permissions.FLAGS.MOVE_MEMBERS) ? Checking2 = 'MOVE_MEMBERS' : ''
        role2.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES) ? Checking2 = 'MANAGE_NICKNAMES' : ''
        role2.permissions.has(Permissions.FLAGS.MANAGE_ROLES) ? Checking2 = 'MANAGE_ROLES' : ''
        role2.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ? Checking2 = 'ADMINISTRATOR' : ''

        switch (Checking2) {
            case 'ADMINISTRATOR': DisableAutorole2(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role2}** possui a permissão **ADMINISTRADOR** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 2** foi desabilitado.`); break;
            case 'KICK_MEMBERS': DisableAutorole2(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role2}** possui a permissão **EXPULSAR MEMBROS** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 2** foi desabilitado.`); break;
            case 'BAN_MEMBERS': DisableAutorole2(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role2}** possui a permissão **BANIR MEMBROS** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 2** foi desabilitado.`); break;
            case 'MANAGE_GUILD': DisableAutorole2(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role2}** possui a permissão **GERENCIAR SERVIDOR** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 2** foi desabilitado.`); break;
            case 'MANAGE_CHANNELS': DisableAutorole2(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role2}** possui a permissão **GERENCIAR CANAIS** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 2** foi desabilitado.`); break;
            case 'MANAGE_MESSAGES': DisableAutorole2(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role2}** possui a permissão **GERENCIAR MENSAGENS** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 2** foi desabilitado.`); break;
            case 'MUTE_MEMBERS': DisableAutorole2(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role2}** possui a permissão **SILENCIAR MEMBROS** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 2** foi desabilitado.`); break;
            case 'DEAFEN_MEMBERS': DisableAutorole2(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role2}** possui a permissão **ENSURDECER MEMBROS** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 2** foi desabilitado.`); break;
            case 'MOVE_MEMBERS': DisableAutorole2(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role2}** possui a permissão **MOVER MEMBROS** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 2** foi desabilitado.`); break;
            case 'MANAGE_NICKNAMES': DisableAutorole2(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role2}** possui a permissão **GERENCIAR APELIDOS** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 2** foi desabilitado.`); break;
            case 'MANAGE_ROLES': DisableAutorole2(); Notify(`🛰️ | **Global System Notification** | Autorole System\n \nO cargo **${role2}** possui a permissão **GERENCIAR CARGOS** ativada.\nVisando a segurança e o bem-estar do servidor, o **Autorole 2** foi desabilitado.`); break;

            default: member.roles.add(role2).catch(err => { return Notify(`🛰️ | **Global System Notification** | Autorole System\n \nHouve um erro na adição de cargo referente ao **Autorole 2**. Caso não saiba resolver o problema, utilize o comando \`${prefix}bug\` e relate o probrema.\n~~ \`${err}\` ~~`) }); break;
        }
    }

    function DisableAutorole1() { db.delete(`Servers.${member.guild.id}.Autorole1`) }
    function DisableAutorole2() { db.delete(`Servers.${member.guild.id}.Autorole2`) }

    async function Notify(Msg) {
        const canal = client.channels.cache.get(db.get(`Servers.${member.guild.id}.LogChannel`))
        canal ? canal.send(Msg).catch(() => { }) : ''
    }

    async function Welcome() {
        let WS = db.get(`Servers.${member.guild.id}.WelcomeChannel`)
        if (!WS) return
        let MessageMsg = WS.Mensagem || 'entrou no servidor.'
        let Emoji = WS.Emoji || `${e.Join}`
        let Canal = WS.Canal || false
        const canal = await member.guild.channels.cache.get(Canal)
        canal ? canal.send(`${Emoji} | ${member} ${MessageMsg}`).catch(err => { member.guild.channels.cache.get(config.ownerId).send(`${e.Warn} | Erro no evento "guildMemberAdd" (Linha Emit: 104)\n\`${err}\``) }) : ''
    }
})