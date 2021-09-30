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
    usage: '<crime> [... category]',
    description: 'A vida no crime não é um bom negócio',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (['info', 'help', 'ajuda', 'status'].includes(args[0])) return CrimeHelp()

        let timeout5 = 250000
        let crimetime = db.get(`${message.author.id}.Timeouts.Crime`)
        if (crimetime !== null && timeout5 - (Date.now() - crimetime) > 0) {
            let time = ms(timeout5 - (Date.now() - crimetime))
            return message.reply(`Calminha! O mundo do crime é perigoso, volte em \`${time.minutes}m e ${time.seconds}s\``)
        } else {

            return message.reply(`${e.QuestionMark} | Qual lugar você deseja roubar? *Você pode ser preso e perder dinheiro.*\n \n🏠 Casa\n🏦 Mansão\n🏛️ Prefeitura\n🏣 Cartório\n📨 Correios\n💍 joalheria\n🏢 Shopping\n🏭 Fábrica\n🏩 Motel\n🪙 Banco\n${e.Deny} Cancelar`).then(msg => {

                const filter = m => m.author.id === message.author.id
                const collector = message.channel.createMessageCollector({ filter, max: 1, time: 15000 });
                db.set('Edit', true)
                // 🏠 1  Casa - 🏦 2 Mansão - 🏛️ 3 Prefeitura - 🏣 4 Cartório - 📨 5 Correios - 💍 6 joalheria - 🏢 7 Shopping - 🏭 8 Fábrica - 🏩 9 Motel - 🪙 10 Banco
                collector.on('collect', m => {
                    db.delete('Edit')
                    let content = m.content.toLowerCase()
                    db.set(`${message.author.id}.Timeouts.Crime`, Date.now())

                    switch (content) {
                        case 'casa': Casa(); break;
                        case 'mansão': case 'mansao': Mansao(); break;
                        case 'prefeitura': Prefeitura(); break;
                        case 'cartorio': case 'cartório': Cartorio(); break;
                        case 'correios': Correios(); break;
                        case 'joalheria': joalheria(); break;
                        case 'shopping': Shopping(); break;
                        case 'fábrica': Fábrica(); break;
                        case 'motel': Motel(); break;
                        case 'banco': Banco(); break;
                        case 'cancelar': case 'cancel': msg.edit(`${e.Deny} | Comando cancelado.`).catch(() => { }); db.delete(`${message.author.id}.Timeouts.Crime`); break;
                        default: msg.edit(`${e.Deny} | Comando cancelado: Resposta invalida.`).catch(() => { }); db.delete(`${message.author.id}.Timeouts.Crime`); break;
                    }
                });

                setTimeout(() => {
                    if (db.get('Edit')) {
                        msg.edit(`${e.Deny} | Comando cancelado: Tempo expirado.`).catch(() => { });
                        db.delete(`${message.author.id}.Timeouts.Crime`);
                    }
                }, 15000)

                // FUNCTIONS
                function Preso() { db.set(`${message.author.id}.Timeouts.Preso`, Date.now()) }
                function Result() { return Math.floor(Math.random() * 101) }
                let multa = Math.floor(Math.random() * 4001)
                let amount = Math.floor(Math.random() * 6000)

                function Casa() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou uma casa.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 70 ? Win() : Lose()
                }

                function Mansao() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou uma mansão.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 50 ? Win() : Lose()
                }

                function Prefeitura() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou a prefeitura.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 40 ? Win() : Lose()
                }

                function Cartorio() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou o cartório.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 30 ? Win() : Lose()
                }

                function Correios() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou os correios.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 45 ? Win() : Lose()
                }

                function joalheria() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou uma joalheria.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 12 ? Win() : Lose()
                }

                function Shopping() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou um shopping.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 60 ? Win() : Lose()
                }

                function Fábrica() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou uma fábrica.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 49 ? Win() : Lose()
                }

                function Motel() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou um motel.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 80 ? Win() : Lose()
                }

                function Banco() {
                    function Win() { db.add(`Balance_${message.author.id}`, amount); return msg.edit(`${e.PandaBag} | ${message.author} roubou um banco.\n+ ${amount} ${Moeda(message)}`).catch(() => { }) }
                    function Lose() { db.subtract(`Balance_${message.author.id}`, multa); Preso(); return msg.edit(`${e.Sirene} | A polícia te prendeu!\n-${multa} ${Moeda(message)}`).catch(() => { }) }
                    Result() <= 5 ? Win() : Lose()
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
                .addField(`Chances e Porcentagens de Sucesso`, '🏠 Casa: 70%\n🏦 Mansão: 50%\n🏛️ Prefeitura: 40%\n🏣 Cartório: 30%\n📨 Correios: 45%\n💍 joalheria: 12%\n🏢 Shopping: 60%\n🏭 Fábrica: 49%\n🏩 Motel: 80%\n🪙 Banco: 5%')
            return message.reply({ embeds: [Info] })
        }
    }
}