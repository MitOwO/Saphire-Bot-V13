const { sdb, DatabaseObj } = require('../../Routes/functions/database')
const { config } = DatabaseObj
const client = require('../../index')
const Notify = require('../../Routes/functions/notify')

client.on('channelDelete', async (channel) => {

    if (await client.users.cache.get(channel.topic))
        sdb.delete(`Users.${channel.topic}.Cache.ComprovanteOpen`)

    if (await client.channels.cache.get(channel.topc))
        sdb.delete(`Users.${channel.topic}.PrivateChannel`)

    if (channel.id === config.LoteriaChannel)
        Notify(config.guildId, 'Recurso Desabilitado', `O canal **${channel.name}** configurado como **Lotery Result At Principal Server** foi deletado.`)

    switch (channel.id) {
        case sdb.get(`Servers.${channel.guild.id}.IdeiaChannel`): DeletedChannel('IdeiaChannel', 'Canal de Ideias/Sugestões'); break;
        case sdb.get(`Servers.${channel.guild.id}.LeaveChannel`): DeletedChannel('LeaveChannel', 'Canal de Saída'); break;
        case sdb.get(`Servers.${channel.guild.id}.XPChannel`): DeletedChannel('XPChannel', 'Canal de Level Up'); break;
        case sdb.get(`Servers.${channel.guild.id}.ReportChannel`): DeletedChannel('ReportChannel', 'Canal de Reportes'); break;
        case sdb.get(`Servers.${channel.guild.id}.LogChannel`): sdb.set(`Servers.${channel.guild.id}.LogChannel`, null); break;
        case sdb.get(`Servers.${channel.guild.id}.WelcomeChannel.Canal`): DeletedChannel('WelcomeChannel', 'Canal de Boas-Vindas'); break;
        case sdb.get(`Servers.${channel.guild.id}.Farm.BuscaChannel`): DeletedChannel('Farm.BuscaChannel', 'Farming Floresta Cammum'); break;
        case sdb.get(`Servers.${channel.guild.id}.Farm.PescaChannel`): DeletedChannel('Farm.PescaChannel', 'Farming Pesca'); break;
        case sdb.get(`Servers.${channel.guild.id}.Farm.MineChannel`): DeletedChannel('Farm.MineChannel', 'Farming Mineração'); break;
        case sdb.get(`Servers.${channel.guild.id}.Blockchannels.Bots.${channel.id}`): DeletedChannel(`Blockchannels.Bots.${channel.id}`, 'Bloqueio de Comandos'); break;
        case sdb.get(`Servers.${channel.guild.id}.Blockchannels.${channel.id}`): DeletedChannel(`Blockchannels.${channel.id}`, 'Bloqueio de Comandos'); break;
        case sdb.get(`Servers.${channel.guild.id}.ConfessChannel`): DeletedChannel('ConfessChannel', 'Canal de Confissão'); break;
        default: break;
    }

    function DeletedChannel(ChannelDB, CanalFunction) {
        sdb.delete(`Servers.${channel.guild.id}.${ChannelDB}`)
        Notify(channel.guild.id, 'Recurso Desabilitado', `O canal **${channel.name}** configurado como **${CanalFunction}** foi deletado.`)
    }
})