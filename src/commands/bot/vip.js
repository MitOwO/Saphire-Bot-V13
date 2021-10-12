const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const { config } = require('../../../Routes/config.json')
const { N } = require('../../../Routes/nomes.json')

module.exports = {
    name: 'vip',
    category: 'bot',
    ClientPermissions: 'EMBED_LINKS',
    emoji: `${e.VipStar}`,
    usage: '<vip>',
    description: 'Informações sobre o vip',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {
        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

        const link1Real = 'https://mpago.la/2YbvxZd'
        const LinkServidor = `${config.ServerLink}`

        if (['vantagens'].includes(args[0])) return VantageFunction()

        const VipEmbed = new MessageEmbed()
            .setColor('#FDFF00')
            .setTitle(`${e.VipStar} VIP System ${client.user.username}`)
            .setDescription(`*Antes de tudo, fique ciente de que o VIP System não dá previlégios ou vantagens a ninguém. O VIP System é uma forma de agradecimento e libera funções que não dão vantagens, apenas é legal tê-las, como bônus em alguns comandos.*`)
            .addField(`${e.QuestionMark} O que eu ganho com o VIP?`, 'Acesso a comandos restritos para vips, que por sua vez, não dão vantagens em nenhum sistema.')
            .addField(`${e.QuestionMark} Como obter o VIP?`, `Simples! Você pode fazer uma doação de [R$1,00](${link1Real}) no Mercado Pago ou fazer um PIX para o meu criador, basta digitar \`${prefix}donate\` para mais informações`)
            .addField(`${e.QuestionMark} Como comprovar o pagamento?`, `Simples! Entre no [meu servidor](${LinkServidor}) e fale com o **${N.Rody}**, enviando um print do **comprovante** e pronto, você tem seu VIP.`)
            .addField(`${e.QuestionMark} Tem mais perguntas?`, `Entre no [meu servidor](${LinkServidor}) e tire suas dúvidas`)
        return message.reply({ embeds: [VipEmbed] })

        function VantageFunction() {

            const Embed = new MessageEmbed()
                .setColor('#FDFF00')
                .setTitle(`${e.VipStar} VIP System Saphire | Vantagens`)
                .setDescription(`As vantagens do vip incluem: Maior recompensa no \`${prefix}daily\`, \`${prefix}work\` e alguns comandos que ainda estão em produção.`)
            return message.reply({ embeds: [Embed] })
        }
    }
}