const { e } = require('../../../Routes/emojis.json')
const { Permissions } = require('discord.js')

module.exports = {
  name: 'clear',
  aliases: ['limpar'],
  category: 'moderation',
  UserPermissions: 'MANAGE_MESSAGES',
  ClientPermissions: 'MANAGE_MESSAGES',
  emoji: '🧹',
  usage: '<clear> [@user/bots/images/all] [quantidade]',
  description: 'Comando em produção',

  run: async (client, message, args, prefix, db, MessageEmbed, request) => {

    const clearembed = new MessageEmbed()
      .setColor("BLUE")
      .setTitle("🧹 Comando Clear")
      .setDescription("Use o comando para fazer aquela limpa nas mensagens")
      .addField('Comandos do Clear', '`clear 1~99` Apague até 99 mensagens\n`clear images` Apague imagens\n`clear bots` Apague mensagens de bots\n`clear @user` Apague mensagens de alguém')

    if (!args[0]) { return message.reply({ embeds: [clearembed] }) }

    let user = message.mentions.members.first()
    if (user) {

      let MsgsPraDeletar = args[1]
      if (!MsgsPraDeletar) { return message.reply(`${e.Deny} | Tenta usar deste jeito: \`${prefix}clear @user 0~100\``) }
      if (isNaN(MsgsPraDeletar)) { return message.reply(`${e.Deny} | A quantidade precisa ser um número, sabia? \`${prefix}clear @user 0~100\``) }
      if (MsgsPraDeletar > 100 || MsgsPraDeletar < 1) { return message.reply(`${e.Deny} | Quantidade de 0 a 100, ok? \`${prefix}clear @user 0~100\``) }
      if (args[2]) return message.reply(`${e.Deny} | Nada além da quantidade, não me atrapalha poxa... \`${prefix}clear @user 0~100\``)

      await message.channel.messages.fetch({ limit: parseInt(MsgsPraDeletar) }).then(userMessages => {

        let userFilter = userMessages.filter(obj => obj.author.id === user.id)
        message.channel.bulkDelete(userFilter).then(Mensagens => {
          return message.channel.send(`${e.Check} | Nas últimas ${MsgsPraDeletar} mensagens, eu achei ${Mensagens.size} mensagens de ${user} e apaguei elas sob as ordens de ${message.author}`)
        }).catch(err => { return message.channel.send(`${e.Attention} | Aconteceu um erro ao executar este comando, caso não saiba resolver, reporte o problema com o comando \`${prefix}bug\` ou entre no meu servidor, link no perfil.\n\`${err}\``) })
      }).catch(err => { return message.reply(`${e.Attention} | Aconteceu um erro ao executar este comando, caso não saiba resolver, reporte o problema com o comando \`${prefix}bug\` ou entre no meu servidor, link no perfil.\n\`${err}\``) })

    } else if (['bot', "bots"].includes(args[0])) {

      let MsgsPraDeletar = args[1]
      if (!MsgsPraDeletar) { return message.reply(`${e.Deny} | Tenta usar deste jeito: \`${prefix}clear bots 0~100\``) }
      if (isNaN(MsgsPraDeletar)) { return message.reply(`${e.Deny} | A quantidade precisa ser um número, sabia? \`${prefix}clear bots 0~100\``) }
      if (MsgsPraDeletar > 100 || MsgsPraDeletar < 1) { return message.reply(`${e.Deny} | Quantidade de 0 a 100, ok? \`${prefix}clear bots 0~100\``) }

      await message.channel.messages.fetch({ limit: parseInt(MsgsPraDeletar) }).then(awaitBotMessages => {

        let botFilter = awaitBotMessages.filter(obj => obj.author.bot)

        message.channel.bulkDelete(botFilter).then(MsgApagada => {
          return message.channel.send(`${e.Check} | Eu apaguei ${MsgApagada.size} mensagens de Bots das últimas ${MsgsPraDeletar} mensagens do chat sob as ordens de ${message.author}`)
        }).catch(err => { return message.channel.send(`${e.Attention} | Houve algum tipo de "erro" na execução:\n\`${err}\``) })
      }).catch(err => { return message.reply(`${e.Deny} | Aconteceu um erro ao executar este comando, caso não saiba resolver, reporte o problema com o comando \`${prefix}bug\` ou entre no meu servidor, link no perfil.\n\`${err}\``) })

    } else if (['images', "imagens", "fotos", "foto", "imagem", "midia"].includes(args[0])) {

      let MsgsPraDeletar = args[1]
      if (!MsgsPraDeletar) { return message.reply(`${e.Deny} | Tenta usar deste jeito: \`${prefix}clear imagens 0~100\``) }
      if (isNaN(MsgsPraDeletar)) { return message.reply(`${e.Deny} | A quantidade precisa ser um número, sabia? \`${prefix}clear imagens 0~100\``) }
      if (MsgsPraDeletar > 100 || MsgsPraDeletar < 1) { return message.reply(`${e.Deny} | Quantidade de 0 a 100, ok? \`${prefix}clear imagens 0~100\``) }

      message.channel.messages.fetch({ limit: parseInt(MsgsPraDeletar) }).then(awaitImageMessages => {

        let imageFilter = awaitImageMessages.filter(obj => obj.attachments.size > 0)
        message.channel.bulkDelete(imageFilter).then(MsgApagada => {
          return message.channel.send(`${e.Check} | Encontrei ${MsgApagada.size} midias nas últimas ${MsgsPraDeletar} mensagens do chat e apaguei sob as ordens de ${message}`)
        }).catch(err => { return message.channel.send(`${e.Attention} | Houve algum tipo de "erro" na execução:\n\`${err}\``) })
      }).catch(err => { return message.reply(`${e.Deny} | Aconteceu um erro ao executar este comando, caso não saiba resolver, reporte o problema com o comando \`${prefix}bug\` ou entre no meu servidor, link no perfil.\n\`${err}\``) })

    } else if (typeof (parseInt(args[0])) == "number") {

      message.delete().then(() => {

        if (isNaN(args[0])) { return message.channel.send(`${e.Deny} | Hey! Me fala números para que eu possa contar, ok?`) }
        if (args[1]) { return message.reply(`${e.Deny} | Nada além do ${args[0]}! Use \`${prefix}clear\` para mais informações.`) }
        if (parseInt(args[0]) > 100 || parseInt(args[0]) < 1) return message.reply(`${e.Deny} | Me fala um número de 0 a 100, ok?`)

        message.channel.messages.fetch({ limit: parseInt(args[0]) }).then(messages => {
          message.channel.bulkDelete(messages).then(msg => {
            message.channel.send(`${e.Check} | Deletei um total ${msg.size} mensagens sob as ordens de ${message.author}`)
          }).catch(err => { return message.reply(`${e.Deny} | Aconteceu um erro ao executar este comando, caso não saiba resolver, reporte o problema com o comando \`${prefix}bug\` ou entre no meu servidor, link no perfil.\n\`${err}\``) })
        })
      }).catch(err => { return message.reply(`${e.Deny} | Estou sem a permissão "Gerenciar Mensagens".`) })
    } else {
      message.reply(`${e.Info} | O argumento X \`${prefix}clear "X"\` precisa ser um número para deletar as mensagens fora da clase \`mídas/bots/@users\`.`)
    }
  }
}