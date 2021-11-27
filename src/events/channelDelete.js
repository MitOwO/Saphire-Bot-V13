const { sdb, DatabaseObj: { config }, ServerDb } = require('../../Routes/functions/database')
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
        case ServerDb.get(`Servers.${channel.guild.id}.IdeiaChannel`): DeletedChannel('IdeiaChannel', 'Canal de Ideias/Sugestões'); break;
        case ServerDb.get(`Servers.${channel.guild.id}.LeaveChannel`): DeletedChannel('LeaveChannel', 'Canal de Saída'); break;
        case ServerDb.get(`Servers.${channel.guild.id}.XPChannel`): DeletedChannel('XPChannel', 'Canal de Level Up'); break;
        case ServerDb.get(`Servers.${channel.guild.id}.ReportChannel`): DeletedChannel('ReportChannel', 'Canal de Reportes'); break;
        case ServerDb.get(`Servers.${channel.guild.id}.LogChannel`): sdb.delete(`Servers.${channel.guild.id}.LogChannel`); break;
        case ServerDb.get(`Servers.${channel.guild.id}.WelcomeChannel.Canal`): DeletedChannel('WelcomeChannel', 'Canal de Boas-Vindas'); break;
        case ServerDb.get(`Servers.${channel.guild.id}.Farm.BuscaChannel`): DeletedChannel('Farm.BuscaChannel', 'Farming Floresta Cammum'); break;
        case ServerDb.get(`Servers.${channel.guild.id}.Farm.PescaChannel`): DeletedChannel('Farm.PescaChannel', 'Farming Pesca'); break;
        case ServerDb.get(`Servers.${channel.guild.id}.Farm.MineChannel`): DeletedChannel('Farm.MineChannel', 'Farming Mineração'); break;
        case ServerDb.get(`Servers.${channel.guild.id}.Blockchannels.Bots.${channel.id}`): DeletedChannel(`Blockchannels.Bots.${channel.id}`, 'Bloqueio de Comandos'); break;
        case ServerDb.get(`Servers.${channel.guild.id}.Blockchannels.${channel.id}`): DeletedChannel(`Blockchannels.${channel.id}`, 'Bloqueio de Comandos'); break;
        case ServerDb.get(`Servers.${channel.guild.id}.ConfessChannel`): DeletedChannel('ConfessChannel', 'Canal de Confissão'); break;
        default: break;
    }

    function DeletedChannel(ChannelDB, CanalFunction) {
        ServerDb.delete(`Servers.${channel.guild.id}.${ChannelDB}`)
        return Notify(channel.guild.id, 'Recurso Desabilitado', `O canal **${channel.name}** configurado como **${CanalFunction}** foi deletado.`)
    }
})