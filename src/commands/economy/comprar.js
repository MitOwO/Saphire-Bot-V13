const { f } = require('../../../database/frases.json')
const { MessageSelectMenu, MessageActionRow } = require("discord.js")
const { BgLevel, lotery, DatabaseObj } = require('../../../Routes/functions/database')
const { e } = DatabaseObj
const ms = require('parse-ms')
const BuyingAway = require('../../../Routes/functions/BuyingAway')
const Moeda = require('../../../Routes/functions/moeda')
const Colors = require('../../../Routes/functions/colors')
const Error = require('../../../Routes/functions/errors')
const NewLoteryGiveaway = require('../../../Routes/functions/newlotery')
const Vip = require('../../../Routes/functions/vip')

module.exports = {
    name: 'comprar',
    aliases: ['buy', 'loja', 'store', 'shop', 'itens', 'compra'],
    category: 'economy',
    emoji: `${e.Coin}`,
    usage: '<buy> [item/quantidade]',
    description: 'Compre itens da Loja Saphire',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let vip = Vip(`${message.author.id}`)
        let bank = db.get(`Bank_${message.author.id}`) || 0
        let color = Colors(message.member)

        const LojaEmbed = new MessageEmbed()
            .setColor(color)
            .setTitle(`${e.PandaProfit} Lojinha ${client.user.username} 24h`)
            .setDescription(`Aqui na Lojinha ${client.user.username}, você pode comprar várias coisas para ter acesso a comandos e funções incriveis.\n\`${prefix}buy <item> [quantidade]\``)
            .addFields(
                {
                    name: 'Disponíveis',
                    value: `🎣 \`Vara de Pesca\` 180 ${Moeda(message)}\n🔫 \`Arma\` 4.800 ${Moeda(message)}\n⛏️ \`Picareta\` 120 ${Moeda(message)}\n${e.Balaclava} \`Balaclava\` 60000 ${Moeda(message)}\n${e.Helpier} \`Ajudante\` 200000 ${Moeda(message)}\n🪓 \`Machado\` 120 ${Moeda(message)}\n🎟️ \`Fichas\` 5 ${Moeda(message)}\n💌 \`Carta de Amor\` 100 ${Moeda(message)}\n🥘 \`Comida\` 2 ${Moeda(message)}\n🪱 \`Isca\` 1 ${Moeda(message)}\n🥤 \`Água\` 1 ${Moeda(message)}`
                },
                {
                    name: 'Loteria',
                    value: `🎫 \`Ticket Loteria\` 10 ${Moeda(message)}\nPrêmio Atual: ${sdb.get(`Loteria.Prize`) ? parseInt(sdb.get(`Loteria.Prize`))?.toFixed(0) : 0} ${Moeda(message)}`
                },
                {
                    name: 'Perfil',
                    value: `💍 \`Anel de Casamento\` 350.000 ${Moeda(message)}\n⭐ \`Estrela1\` 1.000.000 ${Moeda(message)}\n⭐⭐ \`Estrela2\` 2.000.000 ${Moeda(message)}\n⭐⭐⭐ \`Estrela3\` 3.000.000 ${Moeda(message)}\n⭐⭐⭐⭐ \`Estrela4\` 4.000.000 ${Moeda(message)}`
                },
                {
                    name: 'Permissões',
                    value: `🎨 \`Cores\` 2.000.000 ${Moeda(message)}\n🔰 \`Título\` 10.000 ${Moeda(message)}`
                },
                {
                    name: 'Fundos/Wallpapers/Backgrounds',
                    value: `\`${prefix}comprar bg <code>\`\n\`${prefix}levelwallpapers\``
                }
            )
            .setFooter(`${prefix}buy | ${prefix}vender | ${prefix}slot | ${prefix}loja vip`)

        const itens = new MessageEmbed()
            .setColor(color)
            .setTitle('📋 Itens e suas funções')
            .setDescription('Todos os dados de todos os itens aqui em baixo')
            .addField('Itens Únicos', `Itens únicos são aqueles que você consegue comprar apenas um.\n \n🎣 \`Vara de Pesca\` Use para pescar \`${prefix}pescar\`\n🔫 \`Arma\` Use para assaltar e se proteger \`${prefix}assaltar @user\`\n${e.Balaclava} \`Balaclava\` Use no comando \`${prefix}crime\`\n${e.Helpier} \`Ajudante\` Te dá +5% de chance de sucesso no \`${prefix}crime\` por 7 dias.`)
            .addField('Itens Consumiveis', 'Itens consumiveis são aqueles que são gastos a cada vez que é usado\n \n⛏️ `Picareta` Use para minerar `' + prefix + 'cavar`\n🪓 \`Machado\` Use na floresta \`${prefix}floresta\`\n🎫 `Ticket` Aposte na loteria `' + prefix + 'buy ticket`\n🎟️ `Fichas` Use na roleta `' + prefix + 'roleta`\n💌 `Cartas` Use para conquistar alguém `' + prefix + 'carta`\n🥘 `Comida` Use na floresta`' + prefix + 'buscar`\n🪱 `Iscas` Use para pescar `' + prefix + 'pescar`\n🥤 `Água` Use para minerar `' + prefix + 'minerar`')
            .addField('Itens Especiais', `Itens especiais são aqueles que são pegos na sorte nos mini-games\n \n${e.Star} \`Vip\` Mais informações no comando \`${prefix}vip\`\n${e.Loli} \`Loli\` Adquira na pesca \`${prefix}pescar\`\n🔪 \`Faca\` Adquira na pesca \`${prefix}pescar\`\n${e.Fossil} \`Fossil\` Adquira na mineração \`${prefix}minerar\`\n🦣 \`Mamute\` Adquira na mineração \`${prefix}minerar\`\n🐶 \`Brown\` Adquira na Floresta Cammum \`${prefix}floresta\`\n🥎 \`Bola do Brown\` Adquira na Floresta Cammum \`${prefix}floresta\`\n💊 \`Remédio do Velho Welter\` Adquira na Floresta Cammum \`${prefix}floresta\`\n${e.Doguinho} \`Cachorrinho/a\` Adquira no Castelo Heslow \`${prefix}medalha\`\n🏅 \`Medalha\` Adquira no Castelo Heslow \`${prefix}medalha\``)
            .addField('Perfil', 'Itens de perfil são aqueles que melhora seu perfil\n \n⭐ `Estrela` Estrelas no perfil')
            .addField('Itens Coletaveis', 'Itens coletaveis são aqueles que você consegue nos mini-games, você pode vende-los para conseguir mais dinheiro.\n \n🍤 `Camarões` - Baú do Tesouro `' + prefix + 'pescar`\n🐟 `Peixes` - Baú do Tesouro `' + prefix + 'pescar`\n🌹 `Rosas` - Floresta Cammum `' + prefix + 'floresta`\n🍎 `Maças` - Floresta Cammum `' + prefix + 'floresta`\n🦴 `Ossos` - Mineração `' + prefix + 'minerar`\n🪨 `Minérios` - Mineração `' + prefix + 'minerar`\n💎 `Diamantes` - Mineração `' + prefix + 'minerar`')
            .addField('Permissões', `Permissões libera comandos bloqueados\n \n🔰 \`Título\` Mude o título no perfil \`${prefix}titulo <Novo Título>\`\n🎨 \`Cores\` Mude as cores das suas mensagens \`${prefix}setcolor <#CódigoHex>\``)

        let args1 = args[1]
        if (['bg', 'wall', 'wallpapers', 'fundo', 'capa'].includes(args[0]?.toLowerCase())) return BuyBackground()
        if (args[0]) return BuyingAway(message, prefix, args, args1)

        const PainelLoja = new MessageActionRow()
            .addComponents(new MessageSelectMenu()
                .setCustomId('menu')
                .setPlaceholder('Menu de compras') // Mensagem estampada
                .addOptions([
                    {
                        label: 'Lojinha Saphire',
                        description: 'Painel principal da lojinha',
                        emoji: `${e.BlueHeart || '💙'}`,
                        value: 'Embed',
                    },
                    {
                        label: 'Itens',
                        description: 'Todos os itens da Classe Economia',
                        emoji: '📝',
                        value: 'Itens',
                    },
                    {
                        label: 'Restaurar Dívida',
                        description: `Restaurar a dívida da carteira.`,
                        emoji: `${e.MoneyWings || '💸'}`,
                        value: 'Dívida',
                    },
                    {
                        label: 'Vara de Pesca',
                        description: `Use para pescar > ${prefix}pesca`,
                        emoji: '🎣',
                        value: 'VaraDePesca',
                    },
                    {
                        label: 'Arma',
                        description: `Use para assaltar os outros > ${prefix}assaltar`,
                        emoji: '🔫',
                        value: 'Arma',
                    },
                    {
                        label: 'Machado',
                        description: `Use na floresta > ${prefix}floresta`,
                        emoji: '🪓',
                        value: 'Machado',
                    },
                    {
                        label: 'Restaurar Machado',
                        description: `Restaura o machado para 50 usos por $30`,
                        emoji: '🪓',
                        value: 'RestaurarMachado',
                    },
                    {
                        label: 'Picareta',
                        description: `Use para minerar > ${prefix}minerar`,
                        emoji: '⛏️',
                        value: 'Picareta',
                    },
                    {
                        label: 'Restaurar Picareta',
                        description: `Restaura a picareta para 50 usos por $30`,
                        emoji: '⛏️',
                        value: 'RestaurarPicareta',
                    },
                    {
                        label: 'Tickets da Loteria',
                        description: `Comprar 100 tickets > ${prefix}loteria`,
                        emoji: '🎫',
                        value: 'Ticket',
                    },
                    {
                        label: 'Balaclava',
                        description: `Libere o comando > ${prefix}crime`,
                        emoji: `${e.Balaclava}`,
                        value: 'Balaclava',
                    },
                    {
                        label: 'Ajudante',
                        description: `Ganhe mais 5% de chances no > ${prefix}crime`,
                        emoji: `${e.Helpier || '🕵️'}`,
                        value: 'Helpier',
                    },
                    {
                        label: 'Fichas da Roleta Saphire',
                        description: `Completar limite de 50 Fichas > ${prefix}roleta`,
                        emoji: '🎟️',
                        value: 'Roleta',
                    },
                    {
                        label: 'Carta de Amor',
                        description: `Completar limite de 50 cartas > ${prefix}carta`,
                        emoji: '💌',
                        value: 'Carta',
                    },
                    {
                        label: 'Comida',
                        description: `Completar limite de 50 comidas > ${prefix}floresta`,
                        emoji: '🥘',
                        value: 'Comida',
                    },
                    {
                        label: 'Iscas/Minhocas',
                        description: `Completar limite de 50 iscas > ${prefix}pesca`,
                        emoji: '🪱',
                        value: 'Iscas',
                    },
                    {
                        label: 'Copo d\'agua',
                        description: `Completar limite de 50 copos > ${prefix}minerar`,
                        emoji: '🥤',
                        value: 'Copo',
                    },
                    {
                        label: 'Título',
                        description: `Personalize seu título > ${prefix}perfil > ${prefix}titulo`,
                        emoji: '🔰',
                        value: 'Titulo',
                    },
                    {
                        label: 'Cores',
                        description: `Personalize suas cores > ${prefix}setcolor`,
                        emoji: '🎨',
                        value: 'Cores',
                    },
                    {
                        label: 'Já terminei',
                        description: `Delete a mensagem e a request`,
                        emoji: `${e.Deny || '❌'}`,
                        value: 'Close',
                    }
                ])
            )

        if (!args[0]) {
            if (request) return message.reply(`${e.Deny} | ${f.Request}${sdb.get(`Request.${message.author.id}`)}`)

            return message.reply({ content: '50% do dinheiro gasto na loja vão para a loteria, exceto os tickets (100%).', embeds: [LojaEmbed], components: [PainelLoja] }).then(msg => {
                sdb.set(`Request.${message.author.id}`, `${msg.url}`)

                const filtro = (interaction) => interaction.customId === 'menu' && interaction.user.id === message.author.id

                const coletor = msg.createMessageComponentCollector({ filter: filtro, idle: 60000 });

                coletor.on('end', async () => {
                    LojaEmbed.setColor('RED').setFooter(`Sessão encerrada | ${message.author.id}`)
                    sdb.delete(`Request.${message.author.id}`)
                    msg.edit({ components: [] }).catch(() => { })
                })

                coletor.on('collect', async (collected) => {
                    if (collected.user.id !== message.author.id) return

                    let item = collected.values[0]
                    collected.deferUpdate().catch(() => { })

                    msg.edit({ components: [PainelLoja] }).catch(() => { })
                    switch (item) {
                        case 'Embed': Embed(); break;
                        case 'Itens': Itens(); break;
                        case 'Dívida': Divida(); break
                        case 'VaraDePesca': VaraDePesca(); break;
                        case 'Arma': Arma(); break;
                        case 'Machado': Machado(); break;
                        case 'RestaurarMachado': RestaurarMachado(); break;
                        case 'Picareta': Picareta(); break;
                        case 'RestaurarPicareta': RestaurarPicareta(); break;
                        case 'Ticket': sdb.get(`Users.${message.author.id}.Tickets`) ? Return() : Ticket(); break;
                        case 'Roleta': Roleta(); break;
                        case 'Carta': Cartas(); break;
                        case 'Comida': Comidas(); break;
                        case 'Iscas': Iscas(); break;
                        case 'Copo': Copos(); break;
                        case 'Cores': NewColor(); break;
                        case 'Titulo': Titulo(); break;
                        case 'Helpier': Helpier(); break;
                        case 'Balaclava': Balaclava(); break;
                        case 'Close': sdb.delete(`Request.${message.author.id}`); msg.edit({ components: [] }).catch(() => { }); break;
                        default: msg.edit({ components: [PainelLoja] }).catch(() => { }); break;
                    }
                    
                })
                function Itens() { msg.edit({ embeds: [itens] }).catch(() => { }) }
                function Embed() { msg.edit({ embeds: [LojaEmbed] }).catch(() => { }) }
                function Return() { return }
            })
        }

        function NoMoney(value) {
            sdb.set(`Users.${message.author.id}.Tickets`, false)
            message.channel.send(`${e.Deny} | ${message.author}, você precisa de pelo menos ${value} ${Moeda(message)} na carteira para comprar este item.`)
        }

        function NewColor() {
            sdb.get(`Users.${message.author.id}.Color.Perm`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) >= 2000000 ? BuyNewColor() : NoMoney(2000000))

            function BuyNewColor() {
                db.subtract(`Balance_${message.author.id}`, 2000000); AddLoteria(1000000)
                sdb.set(`Users.${message.author.id}.Color.Perm`, true)
                return message.channel.send(`${e.Check} | ${message.author} comprou a permissão 🎨 \`Cores\`.\n${e.PandaProfit} | -2000000 ${Moeda(message)}`)
            }
        }

        function Helpier() {
            sdb.get(`Users.${message.author.id}.Timeouts.Helpier`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) >= 50000 ? BuyHelpier() : NoMoney(50000))

            function BuyHelpier() {
                db.subtract(`Balance_${message.author.id}`, 50000); AddLoteria(25000)
                sdb.set(`Users.${message.author.id}.Timeouts.Helpier`, Date.now())
                return message.channel.send(`${e.Check} | ${message.author} contratou um ${e.Helpier} \`Ajudante\` e ganhou +5% de chance de sucesso no \`${prefix}crime\` por 7 dias.\n${e.PandaProfit} | -50000 ${Moeda(message)}`)
            }
        }

        function VaraDePesca() {
            sdb.get(`Users.${message.author.id}.Slot.Vara`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) >= 180 ? BuyVara() : NoMoney(180))

            function BuyVara() {
                db.subtract(`Balance_${message.author.id}`, 180); AddLoteria(60)
                sdb.set(`Users.${message.author.id}.Slot.Vara`, true)
                return message.channel.send(`${e.Check} | ${message.author} comprou uma 🎣 \`Vara de Pesca\`.\n${e.PandaProfit} | -180 ${Moeda(message)}`)
            }
        }

        function RestaurarPicareta() {
            if (!sdb.get(`Users.${message.author.id}.Slot.Picareta.Picareta`)) return message.channel.send(`${e.Deny} | ${message.author}, você precisa ter uma picareta para restaurar a sua picareta.`)
            sdb.get(`Users.${message.author.id}.Slot.Picareta.Usos`) >= 50 ? message.channel.send(`${e.Deny} | A sua picareta não precisa ser restaurada.`) : Restaurar()

            function Restaurar() {
                if (db.get(`Balance_${message.author.id}`) < 30) return message.channel.send(`${e.Deny} | ${message.author}, você precisa ter pelo menos 30 ${Moeda(message)} na carteira para renovar a sua picareta.`)
                db.subtract(`Balance_${message.author.id}`, 30)
                sdb.set(`Users.${message.author.id}.Slot.Picareta.Usos`, 50)
                message.channel.send(`${e.Check} | ${message.author} renovou sua picareta para 50 usos.\n${e.PandaProfit} | -30 ${Moeda(message)}`)
            }
        }

        function Divida() {

            let time = ms(86400000 - (Date.now() - sdb.get(`Client.Timeouts.RestoreDividas`)))
            if (sdb.get(`Client.Timeouts.RestoreDividas`) !== null && 86400000 - (Date.now() - sdb.get(`Client.Timeouts.RestoreDividas`)) > 0) {
                return message.reply(`${e.MoneyWings} | Próxima restauração em: \`${time.hours}h, ${time.minutes}m, e ${time.seconds}s\`\n${e.PandaProfit} ~ Se você for o primeiro(a) a conseguir o claim logo após o tempo zerar, eu pagarei toda sua dívida.`)
            } else {
                db.get(`Balance_${message.author.id}`) >= 0 ? message.channel.send(`${e.Deny} | ${message.author}, você não possui dívida.`) : Restore()
            }

            function Restore() {
                sdb.set(`Client.Timeouts.RestoreDividas`, Date.now())
                let Divida = db.get(`Balance_${message.author.id}`)
                let profit = (Divida - Divida) - Divida
                message.channel.send(`${e.Check} | ${message.author} restaurou sua dívida com sucesso!\n${e.PandaProfit} | +${profit} ${Moeda(message)}`).catch(() => { })
                db.delete(`Balance_${message.author.id}`)
            }
        }

        function Balaclava() {
            sdb.get(`Users.${message.author.id}.Slot.Balaclava`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) >= 60000 ? BuyBalaclava() : NoMoney(60000))

            function BuyBalaclava() {
                db.subtract(`Balance_${message.author.id}`, 60000); AddLoteria(30000)
                sdb.set(`Users.${message.author.id}.Slot.Balaclava`, true)
                return message.channel.send(`${e.Check} | ${message.author} comprou uma ${e.Balaclava} \`Balaclava\` e liberou o comando \`${prefix}assaltar\`.\n${e.PandaProfit} | -60000 ${Moeda(message)}`)
            }
        }

        function Arma() {
            sdb.get(`Users.${message.author.id}.Slot.Arma`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) >= 4800 ? BuyArma() : NoMoney(4800))

            function BuyArma() {
                db.subtract(`Balance_${message.author.id}`, 4800); AddLoteria(2400)
                sdb.set(`Users.${message.author.id}.Slot.Arma`, true)
                return message.channel.send(`${e.Check} | ${message.author} comprou uma 🔫 \`Arma\` e liberou o comando \`${prefix}assaltar\`.\n${e.PandaProfit} | -4800 ${Moeda(message)}`)
            }
        }

        function Machado() {
            sdb.get(`Users.${message.author.id}.Slot.Machado.Machado`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) >= 120 ? BuyMachado() : NoMoney(120))

            function BuyMachado() {
                db.subtract(`Balance_${message.author.id}`, 120); AddLoteria(60)
                sdb.set(`Users.${message.author.id}.Slot.Machado.Machado`, true)
                sdb.set(`Users.${message.author.id}.Slot.Machado.Usos`, 50)
                return message.channel.send(`${e.Check} | ${message.author} comprou um 🪓 \`Machado\`.\n${e.PandaProfit} | -120 ${Moeda(message)}`)
            }
        }

        function RestaurarMachado() {
            if (!sdb.get(`Users.${message.author.id}.Slot.Machado.Machado`)) return message.channel.send(`${e.Deny} | ${message.author}, você precisa ter um machado para restaurar o seu machado.`)
            sdb.get(`Users.${message.author.id}.Slot.Machado.Usos`) >= 50 ? message.channel.send(`${e.Deny} | O seu machado não precisa ser restaurado.`) : RestaurarMachado()

            function RestaurarMachado() {
                if (db.get(`Balance_${message.author.id}`) < 30) return message.channel.send(`${e.Deny} | ${message.author}, você precisa ter pelo menos 30 ${Moeda(message)} na carteira para restaurar seu machado.`)
                db.subtract(`Balance_${message.author.id}`, 30)
                sdb.set(`Users.${message.author.id}.Slot.Machado.Usos`, 50)
                message.channel.send(`${e.Check} | ${message.author} renovou seu machado para 50 usos.\n${e.PandaProfit} | -30 ${Moeda(message)}`)
            }
        }

        function Picareta() {
            sdb.get(`Users.${message.author.id}.Slot.Picareta.Picareta`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) >= 120 ? BuyPicareta() : NoMoney(120))

            function BuyPicareta() {
                db.subtract(`Balance_${message.author.id}`, 120); AddLoteria(60)
                sdb.set(`Users.${message.author.id}.Slot.Picareta`, { Picareta: true, Usos: 50 })
                return message.channel.send(`${e.Check} | ${message.author} comprou uma ⛏️ \`Picareta\`.\n${e.PandaProfit} | -120 ${Moeda(message)}`)
            }
        }

        function Titulo() {
            sdb.get(`Users.${message.author.id}.Perfil.TitlePerm`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) >= 10000 ? BuyTitulo() : NoMoney(10000))

            function BuyTitulo() {
                db.subtract(`Balance_${message.author.id}`, 10000); AddLoteria(60)
                sdb.set(`Users.${message.author.id}.Perfil.TitlePerm`, true)
                return message.channel.send(`${e.Check} | ${message.author} comprou a permissão 🔰 \`Título\`.\n${e.PandaProfit} | -10000 ${Moeda(message)}`)
            }
        }

        function Ticket() {
            if (sdb.get(`Users.${message.author.id}.Tickets`))
                return

            if (lotery.get('Loteria.Close'))
                return message.reply(`${e.Deny} | A loteria não está aberta.`)

            let count = 0
            for (const ticket of lotery.get('Loteria.Users') || []) {
                if (ticket === message.author.id)
                    count++
            }

            if (count >= 2000)
                return message.reply(`${e.Deny} | Você já atingiu o limite máximo de 2000 tickets comprados.`)


            db.get(`Balance_${message.author.id}`) >= 1000 ? AddNewTickets() : NoMoney(1000)
        }

        async function AddNewTickets() {
            if (db.get(`Users.${message.author.id}.Tickets`))
                return

            db.set(`Users.${message.author.id}.Tickets`, true)
            db.subtract(`Balance_${message.author.id}`, 1000); AddLoteria(1000);
            await message.channel.send(`${e.Loading} | Alocando tickets...`).then(msg => {
                let i = 0, TicketsArray = []
                do {
                    i++
                    TicketsArray.push(message.author.id)
                } while (i <= 100 - 1)
                if (lotery.get('Loteria.Users')?.length <= 0) { sdb.set('Loteria.Users', []) }

                lotery.set('Loteria.Users', [...lotery.get('Loteria.Users'), ...TicketsArray])
                db.delete(`Loteria.${message.author.id}`)

                msg.edit(`${e.Check} | ${message.author} comprou +${i} 🎫 \`Tickets da Loteria\` aumentando o prêmio para ${sdb.get('Loteria.Prize')?.toFixed(0)} ${Moeda(message)}.\n${e.PandaProfit} | -1000 ${Moeda(message)}`).catch(() => { })
                setTimeout(() => { sdb.set(`Users.${message.author.id}.Tickets`, false) }, 1500)
                if (lotery.get('Loteria.Users').length >= 15000) {
                    lotery.set('Loteria.Close', true)
                    return NewLoteryGiveaway(lotery.get('Loteria.Users'), message)
                }
            }).catch(err => {
                Error(message, err)
                db.set(`Users.${message.author.id}.Tickets`, false)
                message.channel.send(`${e.Deny} | Ocorreu um erro ao alocar os Tickets.\n\`${err}\``)
            })
        }

        function Roleta() {
            let x = sdb.get(`Users.${message.author.id}.Slot.Fichas`) || 0
            x >= 50 ? message.reply(`${e.Deny} | Você já atingiu o limite de fichas.`) : db.get(`Balance_${message.author.id}`) >= (50 - x) * 5 ? BuyFichas() : message.channel.send(`${e.Deny} | ${message.author}, você precisa de ${(50 - x) * 5} ${Moeda(message)} para comprar mais ${50 - x} fichas.`)
            function BuyFichas() {
                db.subtract(`Balance_${message.author.id}`, (50 - x) * 5)
                AddLoteria(((50 - x) * 5) / 2)
                sdb.add(`Users.${message.author.id}.Slot.Fichas`, 50 - x)
                message.channel.send(`${e.Check} | ${message.author} completou o limite de \`Fichas da Roleta\` comprando +${50 - x} fichas.\n${e.PandaProfit} | -${(50 - x) * 5} ${Moeda(message)}`)
            }
        }

        function Cartas() {
            let x = sdb.get(`Users.${message.author.id}.Slot.Cartas`) || 0
            x >= 50 ? message.reply(`${e.Deny} | Você já atingiu o limite de cartas.`) : db.get(`Balance_${message.author.id}`) >= (50 - x) * 2 ? BuyCartas() : message.channel.send(`${e.Deny} | ${message.author}, você precisa de ${(50 - x) * 2} ${Moeda(message)} para comprar mais ${50 - x} cartas.`)
            function BuyCartas() {
                db.subtract(`Balance_${message.author.id}`, (50 - x) * 2)
                AddLoteria(((50 - x) * 2) / 2)
                sdb.add(`Users.${message.author.id}.Slot.Cartas`, 50 - x)
                message.channel.send(`${e.Check} | ${message.author} completou o limite de \`Cartas de Amor\` comprando +${50 - x} cartas.\n${e.PandaProfit} | -${(50 - x) * 2} ${Moeda(message)}`)
            }
        }

        function Comidas() {
            let x = sdb.get(`Users.${message.author.id}.Slot.Comidas`) || 0
            x >= 50 ? message.reply(`${e.Deny} | Você já atingiu o limite de comidas.`) : db.get(`Balance_${message.author.id}`) >= (50 - x) * 2 ? BuyComidas() : message.channel.send(`${e.Deny} | ${message.author}, você precisa de ${(50 - x) * 2} ${Moeda(message)} para comprar mais ${50 - x} comidas.`)
            function BuyComidas() {
                db.subtract(`Balance_${message.author.id}`, (50 - x) * 2)
                AddLoteria(((50 - x) * 2) / 2)
                sdb.add(`Users.${message.author.id}.Slot.Comidas`, 50 - x)
                message.channel.send(`${e.Check} | ${message.author} completou o limite de \`Comidas\` comprando +${50 - x} comidas.\n${e.PandaProfit} | -${(50 - x) * 2} ${Moeda(message)}`)
            }
        }

        function Iscas() {
            let x = sdb.get(`Users.${message.author.id}.Slot.Iscas`) || 0
            x >= 50 ? message.reply(`${e.Deny} | Você já atingiu o limite de iscas.`) : db.get(`Balance_${message.author.id}`) >= (50 - x) * 1 ? BuyIscas() : message.channel.send(`${e.Deny} | ${message.author}, você precisa de ${(50 - x) * 1} ${Moeda(message)} para comprar mais ${50 - x} iscas.`)
            function BuyIscas() {
                db.subtract(`Balance_${message.author.id}`, (50 - x) * 1)
                AddLoteria(((50 - x) * 1) / 2)
                sdb.add(`Users.${message.author.id}.Slot.Iscas`, 50 - x)
                message.channel.send(`${e.Check} | ${message.author} completou o limite de \`Iscas\` comprando +${50 - x} iscas.\n${e.PandaProfit} | -${(50 - x) * 1} ${Moeda(message)}`)
            }
        }

        function Copos() {
            let x = sdb.get(`Users.${message.author.id}.Slot.Aguas`) || 0
            x >= 50 ? message.reply(`${e.Deny} | Você já atingiu o limite de copos.`) : db.get(`Balance_${message.author.id}`) >= (50 - x) * 1 ? BuyCopos() : message.channel.send(`${e.Deny} | ${message.author}, você precisa de ${(50 - x) * 1} ${Moeda(message)} para comprar mais ${50 - x} copos.`)
            function BuyCopos() {
                db.subtract(`Balance_${message.author.id}`, (50 - x) * 1)
                AddLoteria(((50 - x) * 1) / 2)
                sdb.add(`Users.${message.author.id}.Slot.Aguas`, 50 - x)
                message.channel.send(`${e.Check} | ${message.author} completou o limite de \`Copos d'água'\` comprando +${50 - x} copos.\n${e.PandaProfit} | -${(50 - x) * 1} ${Moeda(message)}`)
            }
        }

        function AddLoteria(value) { lotery.add('Loteria.Prize', value) }

        function BuyBackground() {

            if (sdb.get(`Client.BackgroundAcess.${message.author.id}`))
                return message.reply(`${e.Deny} | Você possui acesso a todos os wallpapers gratuitamente.`)

            let wallpaper = BgLevel.get('LevelWallpapers')
            let code = args[1]?.toLowerCase()
            let price = BgLevel.get(`LevelWallpapers.${code}.Price`)
            let name = BgLevel.get(`LevelWallpapers.${code}.Name`)
            let image = BgLevel.get(`LevelWallpapers.${code}.Image`)

            if (Vip(message.author.id))
                price = price - (price * 0.3)

            if (!code)
                return message.channel.send(`${e.Info} | Informe o código do wallpaper que você deseja. O código é seguido das letras **bg** mais um **número**. Exemplo: \`${prefix}buy wall bg1\`.\nNão sabe o código do seu wallpaper? Use o comando \`${prefix}levelwallpapers\``)

            try {
                if (!Object.keys(wallpaper).includes(args[1]))
                    return message.reply(`${e.Deny} | Esse background não existe. Verifique o código informado.`)
            } catch (err) { return Error(message, err) }

            if (sdb.get(`Users.${message.author.id}.Slot.Walls.Bg.${code}`))
                return message.channel.send(`${e.Info} | Você já possui este wallpaper.`)

            if (db.get(`Balance_${message.author.id}`) < price)
                return message.channel.send(`${e.Deny} | Você precisa de pelo menos **${price} ${Moeda(message)}** para comprar o fundo **${name}**`)

            const embed = new MessageEmbed()
                .setColor(color)
                .setTitle(`${e.Info} | Confirmação de compra`)
                .setDescription(`🖼️ Wallpaper: \`${name}\`\n📎 Código: \`${code}\`\n${e.PandaProfit} Preço: ${price} ${Moeda(message)}`)
                .setImage(image)

            return message.reply({ embeds: [embed] }).then(msg => {
                sdb.set(`Request.${message.author.id}`, `${msg.url}`)
                msg.react('✅').catch(() => { }) // Check
                msg.react('❌').catch(() => { }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {
                        sdb.delete(`Request.${message.author.id}`)

                        sdb.set(`Users.${message.author.id}.Slot.Walls.Bg.${code}`, true)
                        db.subtract(`Balance_${message.author.id}`, price)
                        return msg.edit({ content: `${e.Check} Compra confirmada!`, embeds: [embed.setColor('GREEN').setTitle(`${e.Check} Compra efetuada com sucesso!`).setDescription(`${e.SaphireObs} | ${message.author}, eu já adicionei o novo wallpaper no seu slot. Você pode usar \`${prefix}level set ${code}\` para usar o seu novo wallpaper.`)] }).catch(() => { })

                    } else {
                        sdb.delete(`Request.${message.author.id}`)
                        msg.edit({ content: `${e.Deny} | Comando cancelado.`, embeds: [embed.setColor('RED')] }).catch(() => { })
                    }
                }).catch(() => {
                    sdb.delete(`Request.${message.author.id}`)
                    msg.edit({ content: `${e.Deny} | Comando cancelado por tempo expirado.`, embeds: [embed.setColor('RED')] }).catch(() => { })
                })

            }).catch(err => {
                Error(message, err)
                message.channel.send(`${e.SaphireCry} | Ocorreu um erro durante o processo. Por favor, reporte o ocorrido usando \`${prefix}bug\`\n\`${err}\``)
            })
        }
    }
}