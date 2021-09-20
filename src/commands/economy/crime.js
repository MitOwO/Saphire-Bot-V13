const { e } = require('../../../Routes/emojis.json')
const ms = require("parse-ms")
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'crime',
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: 'ADD_REACTIONS',
    emoji: `${e.PandaBag}`,
    usage: '<crime> [... category]',
    description: 'A vida no crime não é um bom negócio',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (['info', 'help', 'ajuda', 'status'].includes(args[0])) {
            const Info = new MessageEmbed()
                .setColor('#2f3136')
                .setTitle(`${e.Info} | Detalhes do comando Crime`)
                .setDescription(`Com o comando Crime, você pode obter dinheiro de forma perigosa, porém, pode ser preso e perder dinheiro.`)
                .addField(`Chances e Porcentagens de Sucesso`, '🏠 Casa: 70%\n🏦 Mansão: 50%\n🏛️ Prefeitura: 40%\n🏣 Cartório: 30%\n📨 Correios: 45%\n💍 Joaleria: 25%\n🏢 Shopping: 60%\n🏭 Fabrica: 49%\n🏩 Motel: 80%\n🪙 Banco: 5%')
                .addField(`Observação`, 'Quanto menor a chance, maior é a recompensa.\nCasa: 400 Moedas ~~~~ Banco: 18050000\n~O valor obtido é aleatório.')
            return message.reply({ embeds: [Info] })
        }

        if (request) return message.reply(`${e.Deny} | ${f.Request}`)

        let timeout2 = 7200000
        let author2 = db.get(`User.${message.author.id}.Timeouts.Preso`)
        if (author2 !== null && timeout2 - (Date.now() - author2) > 0) {
            let time = ms(timeout2 - (Date.now() - author2))
            return message.reply(`Você está preso! Liberdade em: \`${time.minutes}m e ${time.seconds}s\``)
        } else {

            let timeout5 = 180000
            let crimetime = db.get(`User.${message.author.id}.Timeouts.Crime`)
            if (crimetime !== null && timeout5 - (Date.now() - crimetime) > 0) {
                let time = ms(timeout5 - (Date.now() - crimetime))
                return message.reply(`Calminha! O mundo do crime é perigoso, volte em \`${time.minutes}m e ${time.seconds}s\``)
            } else {

                db.set(`User.${message.author.id}.Timeouts.Crime`, Date.now())

                return message.reply(`${e.QuestionMark} | Qual lugar você deseja roubar? *Você pode ser preso e perder dinheiro.*\n \n🏠 Casa\n🏦 Mansão\n🏛️ Prefeitura\n🏣 Cartório\n📨 Correios\n💍 Joaleria\n🏢 Shopping\n🏭 Fabrica\n🏩 Motel\n🪙 Banco`).then(msg => {
                    db.set(`User.${message.author.id}.Timeouts.Procurado`, Date.now())
                    db.set(`User.Request.${message.author.id}`, 'ON')
                    msg.react('❌').catch(err => { }) // X
                    msg.react('🏠').catch(err => { }) // 1
                    msg.react('🏦').catch(err => { }) // 2
                    msg.react('🏛️').catch(err => { }) // 3
                    msg.react('🏣').catch(err => { }) // 4
                    msg.react('📨').catch(err => { }) // 5
                    msg.react('💍').catch(err => { }) // 6
                    msg.react('🏢').catch(err => { }) // 7
                    msg.react('🏭').catch(err => { }) // 8
                    msg.react('🏩').catch(err => { }) // 9
                    msg.react('🪙').catch(err => { }) // 10
                    // 🏠 1  Casa - 🏦 2 Mansão - 🏛️ 3 Prefeitura - 🏣 4 Cartório - 📨 5 Correios - 💍 6 Joaleria - 🏢 7 Shopping - 🏭 8 Fabrica - 🏩 9 Motel - 🪙 10 Banco

                    const filter = (reaction, user) => { return ['🏠', '🏦', '🏛️', '🏣', '📨', '💍', '🏢', '🏭', '🏩', '🪙'].includes(reaction.emoji.name) && user.id === message.author.id }
                    msg.awaitReactions({ filter, max: 1, time: 20000, errors: ['time'] }).then(collected => {
                        const reaction = collected.first()

                        switch (reaction.emoji.name) {
                            case '❌': MsgDelete(); break;
                            case '🏠': MsgDelete(); Casa(); break;
                            case '🏦': MsgDelete(); Mansao(); break;
                            case '🏛️': MsgDelete(); Prefeitura(); break;
                            case '🏣': MsgDelete(); Cartorio(); break;
                            case '📨': MsgDelete(); Correios(); break;
                            case '💍': MsgDelete(); Joaleria(); break;
                            case '🏢': MsgDelete(); Shopping(); break;
                            case '🏭': MsgDelete(); Fabrica(); break;
                            case '🏩': MsgDelete(); Motel(); break;
                            case '🪙': MsgDelete(); Banco(); break;
                            default: message.channel.send(`${e.Deny} | Aconteceu algo que não era para acontecer. Use o comando novamente.`); break;
                        }

                    }).catch(() => {
                        db.delete(`User.Request.${message.author.id}`); db.delete(`User.${message.author.id}.Timeouts.Procurado`)
                        msg.edit(`${e.Deny} | Request cancelada: Tempo esgotado.`); db.delete(`User.${message.author.id}.Timeouts.Procurado`)
                    })

                    // FUNCTIONS
                    function MsgDelete() { db.delete(`User.Request.${message.author.id}`); msg.delete().catch(err => { db.delete(`User.${message.author.id}.Timeouts.Procurado`); return message.channel.send(`${e.Deny} | Error Class: Interferência | Não apague minhas mensagens para não haver interferências e interrupções nos meus comandos.`) }) }
                    function Preso() { db.set(`User.${message.author.id}.Timeouts.Preso`, Date.now()) }
                    function Result() { return Math.floor(Math.random() * 101) }
                    let multa = Math.floor(Math.random() * 4001)

                    function Casa() {
                        let amount = Math.floor(Math.random() * 400) + 1
                        function Win() { db.add(`Balance_${message.author.id}`, amount); return message.reply(`${e.PandaBag} | ${message.author.id} roubou uma casa.\n+ ${amount} ${e.Coin}Moedas`) }
                        function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return message.reply(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${e.Coin}Moedas`) }
                        Result() <= 70 ? Win() : Lose()
                    }

                    function Mansao() {
                        let amount = Math.floor(Math.random() * 2000) + 1
                        function Win() { db.add(`Balance_${message.author.id}`, amount); return message.reply(`${e.PandaBag} | ${message.author.id} roubou uma mansão.\n+ ${amount} ${e.Coin}Moedas`) }
                        function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return message.reply(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${e.Coin}Moedas`) }
                        Result() <= 50 ? Win() : Lose()
                    }

                    function Prefeitura() {
                        let amount = Math.floor(Math.random() * 300) + 1
                        function Win() { db.add(`Balance_${message.author.id}`, amount); return message.reply(`${e.PandaBag} | ${message.author.id} roubou a prefeitura.\n+ ${amount} ${e.Coin}Moedas`) }
                        function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return message.reply(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${e.Coin}Moedas`) }
                        Result() <= 40 ? Win() : Lose()
                    }

                    function Cartorio() {
                        let amount = Math.floor(Math.random() * 23000) + 1
                        function Win() { db.add(`Balance_${message.author.id}`, amount); return message.reply(`${e.PandaBag} | ${message.author.id} roubou o cartório.\n+ ${amount} ${e.Coin}Moedas`) }
                        function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return message.reply(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${e.Coin}Moedas`) }
                        Result() <= 30 ? Win() : Lose()
                    }

                    function Correios() {
                        let amount = Math.floor(Math.random() * 15000) + 1
                        function Win() { db.add(`Balance_${message.author.id}`, amount); return message.reply(`${e.PandaBag} | ${message.author.id} roubou os correios.\n+ ${amount} ${e.Coin}Moedas`) }
                        function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return message.reply(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${e.Coin}Moedas`) }
                        Result() <= 45 ? Win() : Lose()
                    }

                    function Joaleria() {
                        let amount = Math.floor(Math.random() * 240000) + 1
                        function Win() { db.add(`Balance_${message.author.id}`, amount); return message.reply(`${e.PandaBag} | ${message.author.id} roubou uma joaleria.\n+ ${amount} ${e.Coin}Moedas`) }
                        function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return message.reply(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${e.Coin}Moedas`) }
                        Result() <= 25 ? Win() : Lose()
                    }

                    function Shopping() {
                        let amount = Math.floor(Math.random() * 9000) + 1
                        function Win() { db.add(`Balance_${message.author.id}`, amount); return message.reply(`${e.PandaBag} | ${message.author.id} roubou um shopping.\n+ ${amount} ${e.Coin}Moedas`) }
                        function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return message.reply(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${e.Coin}Moedas`) }
                        Result() <= 60 ? Win() : Lose()
                    }

                    function Fabrica() {
                        let amount = Math.floor(Math.random() * 10000) + 1
                        function Win() { db.add(`Balance_${message.author.id}`, amount); return message.reply(`${e.PandaBag} | ${message.author.id} roubou uma fabrica.\n+ ${amount} ${e.Coin}Moedas`) }
                        function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return message.reply(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${e.Coin}Moedas`) }
                        Result() <= 49 ? Win() : Lose()
                    }

                    function Motel() {
                        let amount = Math.floor(Math.random() * 1000) + 1
                        function Win() { db.add(`Balance_${message.author.id}`, amount); return message.reply(`${e.PandaBag} | ${message.author.id} roubou um motel.\n+ ${amount} ${e.Coin}Moedas`) }
                        function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return message.reply(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${e.Coin}Moedas`) }
                        Result() <= 80 ? Win() : Lose()
                    }

                    function Banco() {
                        let amount = Math.floor(Math.random() * 1805000) + 1
                        function Win() { db.add(`Balance_${message.author.id}`, amount); return message.reply(`${e.PandaBag} | ${message.author.id} roubou um motel.\n+ ${amount} ${e.Coin}Moedas`) }
                        function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return message.reply(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${e.Coin}Moedas`) }
                        Result() <= 5 ? Win() : Lose()
                    }
                })
            }
        }
    }
}