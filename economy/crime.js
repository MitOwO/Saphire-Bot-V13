const { e } = require('../../../Routes/emojis.json')
const ms = require("parse-ms")
const Moeda = require('../../../Routes/functions/moeda')
const Error = require('../../../Routes/functions/errors')

module.exports = {
    name: 'crime',
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: 'MANAGE_MESSAGES',
    emoji: `${e.PandaBag}`,
    usage: '<crime>',
    description: 'A vida no crime não é um bom negócio',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        return message.reply(`${e.Loading} | O crime está passando por uma nova reforma`)

        if (['info', 'help', 'ajuda', 'status'].includes(args[0])) return CrimeHelp()

        // 1200000 - 20 Minutos
        if (db.get(`${message.author.id}.Timeouts.Crime`) !== null && 1200000 - (Date.now() - db.get(`${message.author.id}.Timeouts.Crime`)) > 0) {
            let time = ms(1200000 - (Date.now() - db.get(`${message.author.id}.Timeouts.Crime`)))
            return message.reply(`Calminha! O mundo do crime é perigoso, volte em \`${time.minutes}m e ${time.seconds}s\``)
        } else {

            return message.reply(`${e.Loading} | Cometendo crime`).then(msg => {
                db.set(`${message.author.id}.Timeouts.Crime`, Date.now())

                // 🏠 1  Casa - 🏦 2 Mansão - 🏛️ 3 Prefeitura - 🏣 4 Cartório - 📨 5 Correios - 💍 6 joalheria - 🏢 7 Shopping - 🏭 8 Fábrica - 🏩 9 Motel - 🪙 10 Banco

                setTimeout(() => {
                    switch (Math.floor(Math.random() * 10)) {
                        case 1: Casa(); break;
                        case 2: Mansao(); break;
                        case 3: Prefeitura(); break;
                        case 4: Cartorio(); break;
                        case 5: Correios(); break;
                        case 6: joalheria(); break;
                        case 7: Shopping(); break;
                        case 8: Fábrica(); break;
                        case 9: Motel(); break;
                        case 10: Banco(); break;
                        default: msg.edit(`${e.Deny} | Eita, o que aconteceu? Tenta novamente.`).catch(() => { }); db.delete(`${message.author.id}.Timeouts.Crime`); break;
                    }
                }, 3500)

                // FUNCTIONS
                function Preso() { db.set(`${message.author.id}.Timeouts.Preso`, Date.now()) }
                function Result() { return Math.floor(Math.random() * 101) }
                let multa = Math.floor(Math.random() * 4001)
                let amount = Math.floor(Math.random() * 6000)

                function Casa() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou uma casa.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 50 ? Win() : Lose()
                }

                function Mansao() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou uma mansão.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 50 ? Win() : Lose()
                }

                function Prefeitura() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou a prefeitura.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 50 ? Win() : Lose()
                }

                function Cartorio() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou o cartório.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 50 ? Win() : Lose()
                }

                function Correios() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou os correios.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 50 ? Win() : Lose()
                }

                function joalheria() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou uma joalheria.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 50 ? Win() : Lose()
                }

                function Shopping() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou um shopping.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 50 ? Win() : Lose()
                }

                function Fábrica() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou uma fábrica.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 50 ? Win() : Lose()
                }

                function Motel() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou um motel.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 50 ? Win() : Lose()
                }

                function Banco() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou um banco.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 50 ? Win() : Lose()
                }

            }).catch(err => {
                Error(message, err)
                return message.reply(`${e.Deny} | Algo de errado não está certo.\n\`${err}\``)
            })
        }

        function CrimeHelp() {
            const Info = new MessageEmbed()
                .setColor('#2f3136')
                .setTitle(`${e.Info} | Detalhes do comando Crime`)
                .setDescription(`Com o comando Crime, você pode obter dinheiro de forma perigosa, porém, pode ser preso e perder dinheiro.`)
                .addField(`Comando`, `\`${prefix}crime\` - 50% de chance de sucesso`)
            return message.reply({ embeds: [Info] })
        }
    }
}