const { e } = require('../../../Routes/emojis.json')
const { config } = require('../../../Routes/config.json')
const colors = require('../../../Routes/functions/colors')

module.exports = {
    name: 'halloween',
    aliases: ['hl'],
    category: 'bot',
    emoji: '🎃',
    usage: 'halloween',
    description: 'Evento Halloween',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {
        message.channel.send({

            embeds: [
                new MessageEmbed()
                    .setColor(colors(message.member))
                    .setTitle(`🎃 ${client.user.username} Halloween 2021`)
                    .setDescription(`O Halloween acaba de chegar na Saphire! E com ele vem muitos doces e travessuras, mas o mais importante... O Evento do mês! Isso mesmo, teremos um evento especial do dias das bruxas, e a Saphire vai nos ajudar a conta uma incrível história, fique de olho em cada detalhe, pois ela dará dicas de como você poderá ser o grande ganhador do evento Halloween.\n 
                    \nO evento consiste em coletar todos os **7 ingredientes** do feitiço do Grande Feiticeiro, esses ingredientes você poderá coletar de varias formas. Mas fique calmo, a saphire vai te ajudar, ou não né... ${e.SaphireEntaoKkk}\n 
                    \nOs participantes que coletarem todos os 7 ingredientes e realizarem o feitiço *(\`${prefix}feitiço\`)*, ganharão o título de **🎃 Halloween 2021** lembrando que, para consegui realizar o feitiço e comprar os sapos você deve estar em nosso [servidor oficial](${config.ServerLink}).\n 
                    \nTemos um mural do evento em nosso [servidor oficial](${config.ServerLink}), onde a ${client.user.username}'s Team passarão algumas dicas, então é bom prestar muita atenção nas novidades que estão por vim, venha para o nosso servidor, chamem seus amigos e venham se divertir!\n 
                    \n${e.SaphireObs} **Quer uma dica inicial**\nOs itens estão espalhados pelos meus comandos e é seu trabalho procura-los, consegui-los e realizar o \`${prefix}feitiço\``)
                    .setFooter('Doces ou travessuras?')
            ]
        })
    }
}