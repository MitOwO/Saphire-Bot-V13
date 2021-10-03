const moment = require('moment')
const { mem, cpu, os } = require('node-os-utils')
const { stripIndent } = require('common-tags')
const { e } = require('../../../Routes/emojis.json')

module.exports = {
  name: "botinfo",
  aliases: ['stats', 'botstats', 'bi'],
  category: 'bot',
  UserPermissions: '',
  ClientPermissions: 'EMBED_LINKS',
  emoji: `${e.Info}`,
  description: "Estatisticas do bot",
  run: async (client, message, args, prefix, db, MessageEmbed, request) => {

      let ComandosUsados = `${db.get('ComandosUsados') || '0'}`

      const d = moment.duration(message.client.uptime)
      const days = (d.days() == 1) ? `${d.days()}d` : `${d.days()}d`
      const hours = (d.hours() == 1) ? `${d.hours()}h` : `${d.hours()}h`
      const minutes = (d.minutes() == 1) ? `${d.minutes()}m` : `${d.minutes()}m`

      let data = client.user.createdAt
      let DataFormatada = ((data.getDate())) + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear()

      const clientStats = stripIndent`
          Nome           : ${message.client.user.tag}
          Servidores     : ${message.client.guilds.cache.size}
          Usuários       : ${message.client.users.cache.size}
          Canais         : ${message.client.channels.cache.size}
          Ping           : ${Math.round(message.client.ws.ping)}ms
          Online         : ${days}, ${hours}, ${minutes}
          Criada em      : ${DataFormatada}
          Prefixo Server : ${prefix}
       `
      const { totalMemMb, usedMemMb } = await mem.info()
      const serverStats = stripIndent`
          OS             : ${await os.oos()}
          Cores          : ${cpu.count()}
          CPU Usage      : ${await cpu.usage()} %
          RAM            : ${totalMemMb} MB
          RAM Usage      : ${usedMemMb} MB
        `
      const CommandStats = stripIndent`
          Comandos       :  ${message.client.commands.size}/412
          Atalhos        :  ${message.client.aliases.size}
          Comandos Usados:  ${ComandosUsados}
        `

      const embed = new MessageEmbed()
        .setColor('#2f3136')
        .addField('Comandos', `\`\`\`asciidoc\n${CommandStats}\`\`\``)
        .addField(`Status ${client.user.username}`, `\`\`\`asciidoc\n${clientStats}\`\`\``)
        .addField('Host', `\`\`\`asciidoc\n${serverStats}\`\`\``)
      message.reply({ embeds: [embed] })
  }
}