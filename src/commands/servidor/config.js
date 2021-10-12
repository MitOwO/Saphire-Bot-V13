const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'config',
    aliases: ['serverstatus', 'serverconfig', 'configserver', 'configstatus'],
    category: 'servidor',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.ModShield}`,
    usage: '<configstats>',
    description: 'Status da configuração do servidor',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        const ConfigEmbed = new MessageEmbed()
            .setColor('#246FE0')
            .setTitle(`${e.ModShield} Configurações ${message.guild.name}`)
            .setDescription(`Dica: Você pode ver todos os comandos de ativação no painel \`configuração\` no comando \`${prefix}help\``)
            .addFields(
                {
                    name: `${e.Verify} Autorole System`,
                    value: GetAutorole()
                },
                {
                    name: `🛰️ Global System Notification`,
                    value: GetChannel('LogChannel')
                },
                {
                    name: '💬 Canal de Ideias',
                    value: GetChannel('IdeiaChannel')
                },
                {
                    name: `${e.Leave} Canal de Saida`,
                    value: GetChannel('LeaveChannel')
                },
                {
                    name: `${e.Join} Canal de Boas-Vindas`,
                    value: GetChannel('WelcomeChannel.Canal')
                },
                {
                    name: `${e.RedStar} Canal de XP`,
                    value: GetChannel('XPChannel')
                },
                {
                    name: `${e.Report} Canal de Reports`,
                    value: GetChannel('ReportChannel')
                },
                {
                    name: '🔦 Canal de Busca',
                    value: GetChannel('BuscaChannel')
                },
                {
                    name: '🎣 Canal de Pesca',
                    value: GetChannel('PescaChannel')
                },
                {
                    name: '⛏️ Canal de Mineração',
                    value: GetChannel('MineChannel')
                }
            )

        message.channel.send({ embeds: [ConfigEmbed] }).catch(() => { })

        function GetAutorole() {
            let Autorole1 = db.get(`Servers.${message.guild.id}.Autorole1`)
            let Autorole2 = db.get(`Servers.${message.guild.id}.Autorole2`)

            Autorole1 ? Autorole1 = `Autorole 1: <@&${Autorole1}>` : Autorole1 = 'Autorole 1: Desativado'
            Autorole2 ? Autorole2 = `Autorole 2: <@&${Autorole2}>` : Autorole2 = 'Autorole 2: Desativado'
            return `${Autorole1}\n${Autorole2}`
        }
        
        function GetChannel(x) {
            let canal = db.get(`Servers.${message.guild.id}.${x}`)
            canal ? canal = `Ativado: <#${canal}>` : canal = 'Desativado'
            return `${canal}`
        }

    }
}