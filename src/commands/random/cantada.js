const
  { Frases, DatabaseObj: { e, config, f } } = require('../../../Routes/functions/database'),
  PassCode = require('../../../Routes/functions/PassCode')

module.exports = {
  name: 'cantadas',
  aliases: ['cantada'],
  category: 'random',
  ClientPermissions: 'ADD_REACTIONS',
  emoji: '💌',
  usage: '<cantada>',
  description: 'Veja cantadas muito "boas"',

  run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

    if (['send', 'enviar'].includes(args[0]?.toLowerCase())) return SendNewCantada()
    if (['list', 'lista', 'all'].includes(args[0]?.toLowerCase())) return ListOfCantadas()
    if (['accept', 'aprovar', 'aceitar'].includes(args[0]?.toLowerCase())) return AcceptNewCantada()
    if (['deny', 'desaprovar', 'cancelar', 'excluir', 'delete', 'deletar'].includes(args[0]?.toLowerCase())) return DenyCantada()
    if (['info', 'help', 'ajuda'].includes(args[0]?.toLowerCase())) return CantadasInfo()
    return InitialEmbedCantadas()

    function DenyCantada() {

      if (['all', 'tudo'].includes(args[1]?.toLowerCase()))
        return DeleteAllCantadas()

      if (!IsMod(message.author.id))
        return message.reply(`${e.Deny} | Este sub-comando é exclusivo para os \`${prefix}mods\` da Saphire's Team.`)

      let CantadasDB = sdb.get('Client.Cantadas'),
        CantadasCodes = Object.keys(CantadasDB || {}),
        Code = args[1]

      if (!CantadasCodes.includes(Code))
        return message.reply(`${e.Deny} | Este Cantada-KeyCode não existe na lista de espera.`)

      let Cantada = {
        Cantada: `${CantadasDB[Code].Cantada}`,
        Author: `${CantadasDB[Code].Author}`
      }

      Frases.push('f.Cantadas', Cantada)
      sdb.delete(`Client.Cantadas.${Code}`)

      client.users.cache.get(Cantada.Author)?.send(`${e.Deny} | A sua cantada não foi aceita.\n${e.Info} | Conteúdo: ${Cantada.Cantada}`).catch(() => { })
      return message.reply(`${e.Check} | A cantada \`${Code}\` foi deletada com sucesso!`)

      function DeleteAllCantadas() {
        if (!sdb.get(`Client.Cantadas`))
          return message.reply(`${e.Deny} | Não há nenhuma cantada na lista`)

        sdb.delete(`Client.Cantadas`)
        return message.reply(`${e.Check} | Todas as cantadas da lista de espera foram deletadas com sucesso.`)
      }

    }

    function AcceptNewCantada() {

      if (!IsMod(message.author.id))
        return message.reply(`${e.Deny} | Este sub-comando é exclusivo para os \`${prefix}mods\` da Saphire's Team.`)

      let CantadasDB = sdb.get('Client.Cantadas'),
        CantadasCodes = Object.keys(CantadasDB || {}),
        Code = args[1]

      if (!CantadasCodes.includes(Code))
        return message.reply(`${e.Deny} | Este Cantada-KeyCode não existe na lista de espera.`)

      let Cantada = {
        Cantada: `${CantadasDB[Code].Cantada}`,
        Author: `${CantadasDB[Code].Author}`
      }

      Frases.push('f.Cantadas', Cantada)
      sdb.delete(`Client.Cantadas.${Code}`)

      client.users.cache.get(Cantada.Author)?.send(`${e.Check} | A sua cantada foi aceita.\n${e.Info} | Conteúdo: ${Cantada.Cantada}`).catch(() => { })
      return message.reply(`${e.Check} | A cantada \`${Code}\` foi aceita com sucesso!`)

    }

    async function ListOfCantadas() {

      if (!IsMod(message.author.id))
        return message.reply(`${e.Deny} | Este sub-comando é exclusivo apenas para moderadores da Saphire's Team.`)

      let CantadasDB = sdb.get('Client.Cantadas'),
        CantadasCodes = Object.keys(CantadasDB || {}),
        CantadasEmEspera = [],
        Control = 0,
        Emojis = ['⬅️', '➡️', '❌']

      if (!CantadasCodes.length) return message.reply(`${e.Info} | Não há nenhuma cantada na lista de espera.`)

      for (const code of CantadasCodes)
        if (CantadasDB[code])
          CantadasEmEspera.push({ Code: code, Author: CantadasDB[code].Author, Cantada: CantadasDB[code].Cantada })

      function EmbedGenerator() {

        let amount = 10,
          Page = 1,
          embeds = [],
          length = CantadasEmEspera.length / 10 <= 1 ? 1 : parseInt(CantadasEmEspera.length / 10) + 1

        for (let i = 0; i < CantadasEmEspera.length; i += 10) {

          const current = CantadasEmEspera.slice(i, amount)
          const description = current.map(Cantada => `**Enviada por**: ${client.users.cache.get(Cantada.Author)?.tag || 'Indefinido'} *\`${Cantada.Author}\`*\n**Cantada-KeyCode**: \`${Cantada.Code}\`\n**Cantada:** ${Cantada.Cantada}\n------------`).join('\n')

          embeds.push({
            color: client.blue,
            title: `🔄 Cantadas em espera | ${Page}/${length}`,
            description: `${description}`,
            footer: {
              text: `${CantadasEmEspera.length} Cantadas contabilizadas`
            },
          })

          Page++
          amount += 10

        }

        return embeds;
      }

      let Embeds = EmbedGenerator(),
        msg = await message.reply({ embeds: [Embeds[0]] }),
        collector = msg.createReactionCollector({
          filter: (reaction, user) => Emojis.includes(reaction.emoji.name) && user.id === message.author.id,
          idle: 30000
        });

      if (Embeds.length > 1)
        for (const e of Emojis)
          msg.react(e).catch(() => { })

      collector.on('collect', (reaction) => {

        if (reaction.emoji.name === '❌')
          return collector.stop()

        reaction.emoji.name === '⬅️'
          ? (() => {

            Control--
            return Embeds[Control] ? msg.edit({ embeds: [Embeds[Control]] }).catch(() => { }) : Control++

          })()
          : (() => {

            Control++
            return Embeds[Control] ? msg.edit({ embeds: [Embeds[Control]] }).catch(() => { }) : Control--

          })()

      })

      collector.on('end', () => {
        msg.reactions.removeAll().catch(() => { })
        return msg.edit(`${e.Deny} | Comando cancelado`).catch(() => { })
      })

    }

    function SendNewCantada() {

      let NewCantada = args.slice(1).join(' '),
        CantadaCode = PassCode(5)

      if (!NewCantada)
        return message.reply(`${e.Info} | Você pode enviar sua cantada para os \`${prefix}mods\` aprovarem.`)

      if (NewCantada.length > 300)
        return message.reply(`${e.Deny} | As cantadas não podem ultrapassar **300 caracteres**`)

      sdb.set(`Client.Cantadas.${CantadaCode}`, {
        Cantada: NewCantada,
        Author: message.author.id
      })

      return message.reply(`${e.Check} | A sua cantada foi enviada com sucesso e está a espera da aprovação dos moderadores.`)

    }

    function InitialEmbedCantadas() {

      if (!f.Cantadas || f.Cantadas?.length < 1)
        return message.reply(`${e.Info} | Não há nenhuma cantada no meu banco de dados neste momento.`)

      const CantadasEmbed = new MessageEmbed()
        .setColor('#246FE0')
        .setTitle(`❤️ Cantadas da Turma`)
        .addField('----------', `${Cantadas()}`)

      return message.reply({ embeds: [CantadasEmbed] }).then(msg => {

        for (const emoji of ['🔄', '❌'])
          msg.react(emoji).catch(() => { })

        const collector = msg.createReactionCollector({
          filter: (reaction, user) => ['🔄', '❌'].includes(reaction.emoji.name) && user.id === message.author.id,
          idle: 60000
        })

        collector.on('collect', (reaction, user) => {

          reaction.emoji.name === '🔄'
            ? (() => {
              return msg.edit({
                embeds: [
                  CantadasEmbed.addField('----------', `${Cantadas()}`)
                ]
              }).catch(() => { collector.stop() })
            })()
            : collector.stop()

        })

        collector.on('end', collected => {
          CantadasEmbed.setColor('RED').setFooter(`Tempo expirado | ${prefix}cantada send`)
          return msg.edit({ embeds: [CantadasEmbed] }).catch(() => { })
        })

      })

    }

    function Cantadas() {
      const Random = f.Cantadas[Math.floor(Math.random() * f.Cantadas.length)],
        Cantada = `${Random.Cantada}\n${client.users.cache.get(Random.Author)?.tag || 'Autor*(a)* não encontrado'}`

      return Cantada
    }

    function IsMod(id) {

      if (id === config.ownerId)
        return true

      return sdb.get(`Client.Moderadores.${id}`)
        ? true
        : false
    }

    function CantadasInfo() {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor(client.blue)
            .setTitle(`${e.Info} Cantada Info`)
            .setDescription('Todos os sub-comandos do comando cantada')
            .addFields(
              {
                name: `${e.Gear} Principal`,
                value: `\`${prefix}cantada\` - Cantadas aleatórias`
              },
              {
                name: `${e.Join} Envie suas cantadas`,
                value: `\`${prefix}cantada send <Sua cantada>\` - Envie sua cantada`
              },
              {
                name: `${e.ModShield} Moderadores Saphire's Team`,
                value: `\`${prefix}cantada list\` - Lista de cantadas enviadas pelos membros\n\`${prefix}cantada accept C-KeyCode\` - Aceita cantadas da lista\n\`${prefix}cantada delete C-KeyCode/all\` - Deleta cantadas da lista ou todas(all)`
              }
            )
        ]
      })
    }

  }
}