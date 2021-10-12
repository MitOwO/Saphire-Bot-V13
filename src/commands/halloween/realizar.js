const { e } = require('../../../Routes/emojis.json')
const { config } = require('../../../Routes/config.json')
const Error = require('../../../Routes/functions/errors')
const colors = require('../../../Routes/functions/colors')

// #246FE0 - Azul Saphire
module.exports = {
    name: 'realizar',
    aliases: ['feitiço', 'feitico'],
    category: 'halloween',
    emoji: '🎃',
    usage: 'realizar',
    description: 'Halloween Event',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (message.guild.id !== config.guildId)
            return message.reply(`${e.Deny} | Para usar este comando, você tem que estar no meu servidor oficial.\n${config.ServerLink}`)
        
        let Sapos = db.get(`Halloween.${message.author.id}.Slot.Sapos`) || 0
        Sapos >= 30 ? Sapos = true : Sapos = false
        
        let Titulo = db.get(`Titulos.${message.author.id}.Halloween`)
        let DarkApple = db.get(`Halloween.${message.author.id}.Slot.DarkApple`) || false
        let PenaDeCorvo = db.get(`Halloween.${message.author.id}.Slot.Pena`) || false
        let AnelDeSauron = db.get(`Halloween.${message.author.id}.Slot.AnelDeSauro`) || false
        let LagrimasSaphire = db.get(`Halloween.${message.author.id}.Slot.Lagrima`) || false
        let PeixeMortal = db.get(`Halloween.${message.author.id}.Slot.PeixeMortal`) || false
        let OssoDourado = db.get(`Halloween.${message.author.id}.Slot.OssoDourado`) || false

        if (Titulo)
            return message.reply(`${e.Deny} | Você já possui o título deste evento.`)

        let Completed = Sapos && DarkApple && PenaDeCorvo && AnelDeSauron && LagrimasSaphire && PeixeMortal && OssoDourado

        if (!Completed)
            return message.reply(`${e.Deny} | Ainda falta itens para serem coletados. Você pode ver os itens que faltam usando \`${prefix}slot halloween\``)

        db.set(`Titulos.${message.author.id}.Halloween`, true)
        message.channel.send({
            embeds: [new MessageEmbed().setColor(colors(message.member)).setTitle(`🎃 ${client.user.username} Halloween Event`).setDescription(`Você obteve o Título **🎃 Halloween 2021** e concluiu com sucesso o evento!`)]
        })
        message.author.send(`Parabéns! Você adquiriu o título **🎃 Halloween 2021**!`).catch(err => {
            if (err.code === 50007)
                return 
            Error(message, err)
        })
    }
}


