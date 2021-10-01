const { config } = require('../../../Routes/config.json')
const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'servers',
    aliases: ['servidres', 'package'],
    category: 'bot',
    UserPermissions: '',
    ClientPermissions: 'EMBED_LINKS',
    emoji: `${e.CatJump}`,
    usage: '<servers>',
    description: 'Meus servidores',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let Server = config.CloudInvite
        let Package = config.PackageInvite

        const Embed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(`${e.Info} | Servidores da ${client.user.username}`)
            .setDescription(`Eu possuo dois servidores principais. Um é o package e o outro é um servidor público que me tem de base, desde as brincadeiras até a administração pesada.`)
            .addField(`📦 Package da ${client.user.username}`, `Este é o [meu servidor onde tudo está guardado](${Package}). Figurinhas, gifs, fotos, tudo. Você pode ver como as coisas funcionam por trás das cortinas.`, true)
            .addField(`☁️ Cloud's Kingdom`, `Esse é um dos [melhores servidores do Discord](${Server}). Simples, fácil e seguro. Entre e divirta-se. (*Também é meu servidor de suporte.*)`)
            .addField(`${e.SaphireHi} Saphire Support Server`, `Você pode obter toda e qualquer ajuda entrando no meu [servidor de suporte](${config.ServerLink}).`)
        return message.reply({ embeds: [Embed] })
    }
}