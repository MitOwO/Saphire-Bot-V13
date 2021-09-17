const client = require('../../index')
const { e } = require('../../Routes/emojis.json')
const db = require('quick.db')
const { MessageEmbed } = require('discord.js')

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {

        await interaction.reply({ content: `⏱️ Latency Client: ${client.ws.ping}ms` });

    } else if (commandName === 'balance') {

        let bal = parseInt(db.get(`Balance_${interaction.member.id}`)) || '0'
        let bank = parseInt(db.get(`Bank_${interaction.member.id}`)) || '0'
        let vip = db.get(`Vip_${interaction.member.id}`)

        const embed = new MessageEmbed()
            .setColor('#2f3136')
            .setTitle('🕵️ Você está em modo secreto')
            .addField('👝 Carteira', `${e.Coin}${bal}`, true)
            .addField('🏦 Banco', `${e.Coin}${bank}`, true)
            .setFooter(`Request by: ${interaction.user.tag}`)

        if (vip) { embed.setDescription(`${e.Star} VIP`) }
        return interaction.reply({ embeds: [embed], ephemeral: true })
    }
})