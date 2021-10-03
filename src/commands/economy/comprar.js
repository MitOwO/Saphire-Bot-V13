const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const ms = require('parse-ms')
const { MessageSelectMenu, MessageActionRow } = require("discord.js")
const BuyingAway = require('../../../Routes/functions/BuyingAway')
const Moeda = require('../../../Routes/functions/moeda')
const Colors = require('../../../Routes/functions/colors')
const Error = require('../../../Routes/functions/errors')

module.exports = {
    name: 'comprar',
    aliases: ['buy', 'loja', 'store', 'shop', 'itens', 'compra'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.Coin}`,
    usage: '<buy> [item/quantidade]',
    description: 'Compre itens da Loja Saphire',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let vip = db.get(`Vip_${message.author.id}`)
        let bank = db.get(`Bank_${message.author.id}`) || '0'
        let color = Colors(message.member)

        const LojaEmbed = new MessageEmbed()
            .setColor(color)
            .setTitle(`${e.PandaProfit} Lojinha ${client.user.username} 24h`)
            .setDescription(`Aqui na Lojinha ${client.user.username}, você pode comprar várias coisas para ter acesso a comandos e funções incriveis.\n\`${prefix}buy <item> [quantidade]\``)
            .addFields(
                {
                    name: 'Disponíveis',
                    value: `🎣 \`Vara de Pesca\` 180 ${Moeda(message)}\n🔫 \`Arma\` 4.800 ${Moeda(message)}\n⛏️ \`Picareta\` 120 ${Moeda(message)}\n🪓 \`Machado\` 120 ${Moeda(message)}\n🎟️ \`Fichas\` 5 ${Moeda(message)}\n💌 \`Carta de Amor\` 100 ${Moeda(message)}\n🥘 \`Comida\` 2 ${Moeda(message)}\n🪱 \`Isca\` 1 ${Moeda(message)}\n🥤 \`Água\` 1 ${Moeda(message)}`
                },
                {
                    name: 'Loteria',
                    value: `🎫 \`Ticket Loteria\` 10 ${Moeda(message)}\nPrêmio Atual: ${db.get(`Loteria.Prize`) ? parseInt(db.get(`Loteria.Prize`))?.toFixed(0) : '0'} ${Moeda(message)}`
                },
                {
                    name: 'Perfil',
                    value: `💍 \`Anel de Casamento\` 350.000 ${Moeda(message)}\n⭐ \`Estrela1\` 1.000.000 ${Moeda(message)}\n⭐⭐ \`Estrela2\` 2.000.000 ${Moeda(message)}\n⭐⭐⭐ \`Estrela3\` 3.000.000 ${Moeda(message)}\n⭐⭐⭐⭐ \`Estrela4\` 4.000.000 ${Moeda(message)}`
                },
                {
                    name: 'Permissões',
                    value: `🎨 \`Cores\` 2.000.000 ${Moeda(message)}\n🔰 \`Título\` 10.000 ${Moeda(message)}`
                }
            )
            .setFooter(`${prefix}buy | ${prefix}vender | ${prefix}slot | ${prefix}loja vip`)

        const itens = new MessageEmbed()
            .setColor(color)
            .setTitle('📋 Itens e suas funções')
            .setDescription('Todos os dados de todos os itens aqui em baixo')
            .addField('Itens Únicos', 'Itens únicos são aqueles que você consegue comprar apenas um.\n \n🎣 `Vara de Pesca` Use para pescar `' + prefix + 'pescar`\n🔫 `Arma` Use para assaltar e se proteger `' + prefix + 'assaltar @user`\n🪓 `Machado` Use na floresta `' + prefix + 'floresta`\n')
            .addField('Itens Consumiveis', 'Itens consumiveis são aqueles que são gastos a cada vez que é usado\n \n⛏️ `Picareta` Use para minerar `' + prefix + 'cavar`\n🎫 `Ticket` Aposte na loteria `' + prefix + 'buy ticket`\n🎟️ `Fichas` Use na roleta `' + prefix + 'roleta`\n💌 `Cartas` Use para conquistar alguém `' + prefix + 'carta`\n🥘 `Comida` Use na floresta`' + prefix + 'buscar`\n🪱 `Iscas` Use para pescar `' + prefix + 'pescar`\n🥤 `Água` Use para minerar `' + prefix + 'minerar`')
            .addField('Itens Especiais', `Itens especiais são aqueles que são pegos na sorte nos mini-games\n \n${e.Star} \`Vip\` Mais informações no comando \`${prefix}vip\`\n${e.Loli} \`Loli\` Adquira na pesca \`${prefix}pescar\`\n🔪 \`Faca\` Adquira na pesca \`${prefix}pescar\`\n${e.Fossil} \`Fossil\` Adquira na mineração \`${prefix}minerar\`\n🦣 \`Mamute\` Adquira na mineração \`${prefix}minerar\`\n🐶 \`Brown\` Adquira na Floresta Cammum \`${prefix}floresta\`\n🥎 \`Bola do Brown\` Adquira na Floresta Cammum \`${prefix}floresta\`\n💊 \`Remédio do Velho Welter\` Adquira na Floresta Cammum \`${prefix}floresta\`\n${e.Doguinho} \`Cachorrinho/a\` Adquira no Castelo Heslow \`${prefix}medalha\`\n🏅 \`Medalha\` Adquira no Castelo Heslow \`${prefix}medalha\``)
            .addField('Perfil', 'Itens de perfil são aqueles que melhora seu perfil\n \n⭐ `Estrela` Estrelas no perfil')
            .addField('Itens Coletaveis', 'Itens coletaveis são aqueles que você consegue nos mini-games, você pode vende-los para conseguir mais dinheiro.\n \n🍤 `Camarões` - Baú do Tesouro `' + prefix + 'pescar`\n🐟 `Peixes` - Baú do Tesouro `' + prefix + 'pescar`\n🌹 `Rosas` - Floresta Cammum `' + prefix + 'floresta`\n🍎 `Maças` - Floresta Cammum `' + prefix + 'floresta`\n🦴 `Ossos` - Mineração `' + prefix + 'minerar`\n🪨 `Minérios` - Mineração `' + prefix + 'minerar`\n💎 `Diamantes` - Mineração `' + prefix + 'minerar`')
            .addField('Permissões', `Permissões libera comandos bloqueados\n \n🔰 \`Título\` Mude o título no perfil \`${prefix}titulo <Novo Título>\`\n🎨 \`Cores\` Mude as cores das suas mensagens \`${prefix}setcolor <#CódigoHex>\``)

        let args1 = args[1]
        if (args[0]) return BuyingAway(message, prefix, args, args1)

        const PainelLoja = new MessageActionRow()
            .addComponents(new MessageSelectMenu()
                .setCustomId('menu')
                .setPlaceholder('Compra rápida') // Mensagem estampada
                .addOptions([
                    {
                        label: 'Lojinha Saphire',
                        description: 'Painel principal da lojinha',
                        emoji: `${e.BlueHeart}`,
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
                        emoji: `${e.MoneyWings}`,
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
                        description: `Comprar 50 tickets > ${prefix}loteria`,
                        emoji: '🎫',
                        value: 'Ticket',
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
                        emoji: `${e.Deny}`,
                        value: 'Close',
                    }
                ])
            )

        if (!args[0]) {
            if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

            return message.reply({ content: '50% do dinheiro gasto na loja vão para a loteira, exceto os tickets (100%).', embeds: [LojaEmbed], components: [PainelLoja] }).then(msg => {
                db.set(`Request.${message.author.id}`, `${msg.url}`)

                const filtro = (interaction) => interaction.customId === 'menu' && interaction.user.id === message.author.id

                const coletor = msg.createMessageComponentCollector({ filtro, idle: 60000 });

                coletor.on('end', async (collected) => {
                    LojaEmbed.setColor('RED').setFooter(`Sessão encerrada | ${message.author.id}`)
                    db.delete(`Request.${message.author.id}`)
                    msg.edit({ components: [] }).catch(err => { })
                })

                coletor.on('collect', async (collected) => {
                    if (collected.user.id !== message.author.id) return

                    let item = collected.values[0]
                    collected.deferUpdate().catch(err => { })

                    msg.edit({ components: [PainelLoja] }).catch(err => { })
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
                        case 'Ticket': db.get(`${message.author.id}.Tickets`) ? Return() : Ticket(); break;
                        case 'Roleta': Roleta(); break;
                        case 'Carta': Cartas(); break;
                        case 'Comida': Comidas(); break;
                        case 'Iscas': Iscas(); break;
                        case 'Copo': Copos(); break;
                        case 'Cores': NewColor(); break;
                        case 'Titulo': Titulo(); break;
                        case 'Close': db.delete(`Request.${message.author.id}`); msg.edit({ components: [] }).catch(err => { }); break;
                        default: msg.edit({ components: [PainelLoja] }).catch(err => { }); break;
                    }
                })
                function Itens() { msg.edit({ embeds: [itens] }).catch(err => { }) }
                function Embed() { msg.edit({ embeds: [LojaEmbed] }).catch(err => { }) }
                function Return() { return }
            })
        }

        function NoMoney(x) {
            db.delete(`${message.author.id}.Tickets`)
            message.channel.send(`${e.Deny} | ${message.author}, você precisa de pelo menos ${x} ${Moeda(message)} na carteira para comprar este item.`)
        }

        function NewColor() {
            db.get(`${message.author.id}.Color.Perm`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) > 2000000 ? BuyNewColor() : NoMoney(2000000))

            function BuyNewColor() {
                db.subtract(`Balance_${message.author.id}`, 2000000); AddLoteria(1000000)
                db.set(`${message.author.id}.Color.Perm`, true)
                return message.channel.send(`${e.Check} | ${message.author} comprou a permissão 🎨 \`Cores\`.\n${e.PandaProfit} | -2000000 ${Moeda(message)}`)
            }
        }

        function VaraDePesca() {
            db.get(`${message.author.id}.Slot.Vara`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) > 180 ? BuyVara() : NoMoney(180))

            function BuyVara() {
                db.subtract(`Balance_${message.author.id}`, 180); AddLoteria(60)
                db.set(`${message.author.id}.Slot.Vara`, true)
                return message.channel.send(`${e.Check} | ${message.author} comprou uma 🎣 \`Vara de Pesca\`.\n${e.PandaProfit} | -180 ${Moeda(message)}`)
            }
        }

        function RestaurarPicareta() {
            if (!db.get(`${message.author.id}.Slot.Picareta`)) return message.channel.send(`${e.Deny} | ${message.author}, você precisa ter uma picareta para restaurar a sua picareta.`)
            db.get(`${message.author.id}.Slot.Picareta.Usos`) >= 50 ? message.channel.send(`${e.Deny} | A sua picareta não precisa ser restaurada.`) : Restaurar()

            function Restaurar() {
                if (db.get(`Balance_${message.author.id}`) < 30) return message.channel.send(`${e.Deny} | ${message.author}, você precisa ter pelo menos 30 ${Moeda(message)} na carteira para renovar a sua picareta.`)
                db.subtract(`Balance_${message.author.id}`, 30)
                db.set(`${message.author.id}.Slot.Picareta.Usos`, 50)
                message.channel.send(`${e.Check} | ${message.author} renovou sua picareta para 50 usos.\n${e.PandaProfit} | -30 ${Moeda(message)}`)
            }
        }

        function Divida() {

            let time = ms(86400000 - (Date.now() - db.get(`Client.Timeouts.RestoreDividas`)))
            if (db.get(`Client.Timeouts.RestoreDividas`) !== null && 86400000 - (Date.now() - db.get(`Client.Timeouts.RestoreDividas`)) > 0) {
                return message.reply(`${e.MoneyWings} | Próxima restauração em: \`${time.hours}h, ${time.minutes}m, e ${time.seconds}s\`\n${e.PandaProfit} ~ Se você for o primeiro(a) a conseguir o claim logo após o tempo zerar, eu pagarei toda sua dívida.`)
            } else {
                db.get(`Balance_${message.author.id}`) >= 0 ? message.channel.send(`${e.Deny} | ${message.author}, você não possui dívida.`) : Restore()
            }

            function Restore() {
                db.set(`Client.Timeouts.RestoreDividas`, Date.now())
                let Divida = db.get(`Balance_${message.author.id}`)
                let profit = (Divida - Divida) - Divida
                message.channel.send(`${e.Check} | ${message.author} restaurou sua dívida com sucesso!\n${e.PandaProfit} | +${profit} ${Moeda(message)}`).catch(err => { })
                db.delete(`Balance_${message.author.id}`)
            }
        }

        function Arma() {
            db.get(`${message.author.id}.Slot.Arma`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) >= 4800 ? BuyArma() : NoMoney(4800))

            function BuyArma() {
                db.subtract(`Balance_${message.author.id}`, 4800); AddLoteria(2400)
                db.set(`${message.author.id}.Slot.Arma`, true)
                return message.channel.send(`${e.Check} | ${message.author} comprou uma 🔫 \`Arma\` e liberou o comando \`${prefix}assaltar\`.\n${e.PandaProfit} | -4800 ${Moeda(message)}`)
            }
        }

        function Machado() {
            db.get(`${message.author.id}.Slot.Machado`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) >= 120 ? BuyMachado() : NoMoney(120))


            function BuyMachado() {
                db.subtract(`Balance_${message.author.id}`, 120); AddLoteria(60)
                db.set(`${message.author.id}.Slot.Machado`, true)
                db.set(`${message.author.id}.Slot.Machado.Usos`, 50)
                return message.channel.send(`${e.Check} | ${message.author} comprou um 🪓 \`Machado\`.\n${e.PandaProfit} | -120 ${Moeda(message)}`)
            }
        }

        function RestaurarMachado() {
            if (!db.get(`${message.author.id}.Slot.Machado`)) return message.channel.send(`${e.Deny} | ${message.author}, você precisa ter um machado para restaurar o seu machado.`)
            db.get(`${message.author.id}.Slot.Machado.Usos`) >= 50 ? message.channel.send(`${e.Deny} | O seu machado não precisa ser restaurado.`) : RestaurarMachado()

            function RestaurarMachado() {
                if (db.get(`Balance_${message.author.id}`) < 30) return message.channel.send(`${e.Deny} | ${message.author}, você precisa ter pelo menos 30 ${Moeda(message)} na carteira para restaurar seu machado.`)
                db.subtract(`Balance_${message.author.id}`, 30)
                db.set(`${message.author.id}.Slot.Machado.Usos`, 50)
                message.channel.send(`${e.Check} | ${message.author} renovou seu machado para 50 usos.\n${e.PandaProfit} | -30 ${Moeda(message)}`)
            }
        }

        function Picareta() {
            db.get(`${message.author.id}.Slot.Picareta`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) >= 120 ? BuyPicareta() : NoMoney(120))

            function BuyPicareta() {
                db.subtract(`Balance_${message.author.id}`, 120); AddLoteria(60)
                db.set(`${message.author.id}.Slot.Picareta`, true)
                db.set(`${message.author.id}.Slot.Picareta.Usos`, 50)
                return message.channel.send(`${e.Check} | ${message.author} comprou uma ⛏️ \`Picareta\`.\n${e.PandaProfit} | -120 ${Moeda(message)}`)
            }
        }

        function Titulo() {
            db.get(`${message.author.id}.Perfil.TitlePerm`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) >= 10000 ? BuyTitulo() : NoMoney(10000))

            function BuyTitulo() {
                db.subtract(`Balance_${message.author.id}`, 10000); AddLoteria(60)
                db.set(`${message.author.id}.Perfil.TitlePerm`, true)
                return message.channel.send(`${e.Check} | ${message.author} comprou a permissão 🔰 \`Título\`.\n${e.PandaProfit} | -10000 ${Moeda(message)}`)
            }
        }

        function Ticket() {
            if (db.get(`${message.author.id}.Tickets`)) return

            if (db.get('Lotery.Close'))
                return message.reply(`${e.Deny} | A loteria não está aberta.`)

            db.get(`Balance_${message.author.id}`) >= 500 ? BuyTicket() : NoMoney(500)
        }

        async function BuyTicket() {
            if (db.get(`${message.author.id}.Tickets`)) return
            db.set(`${message.author.id}.Tickets`, true)
            db.subtract(`Balance_${message.author.id}`, 500); AddLoteria(500);
            await message.channel.send(`${e.Loading} | Alocando tickets...`).then(msg => {
                let Array = 'Loteria.Users' || []
                if (db.get('Loteria.Users').length >= 500) Array = 'Loteria.Users1'
                if (db.get('Loteria.Users1')?.length >= 500) Array = 'Loteria.Users2'
                if (db.get('Loteria.Users2')?.length >= 500) Array = 'Loteria.Users3'
                if (db.get('Loteria.Users3')?.length >= 500) Array = 'Loteria.Users4'
                if (db.get('Loteria.Users4')?.length >= 500) Array = 'Loteria.Users5'
                if (db.get('Loteria.Users5')?.length >= 500) Array = 'Loteria.Users6'
                if (db.get('Loteria.Users6')?.length >= 500) Array = 'Loteria.Users7'
                if (db.get('Loteria.Users7')?.length >= 500) Array = 'Loteria.Users8'
                if (db.get('Loteria.Users8')?.length >= 500) Array = 'Loteria.Users9'
                if (db.get('Loteria.Users9')?.length >= 500) Array = 'Loteria.Users10'
                if (db.get('Loteria.Users10')?.length >= 500) Array = 'Loteria.Users11'
                if (db.get('Loteria.Users11')?.length >= 500) Array = 'Loteria.Users12'
                if (db.get('Loteria.Users12')?.length >= 500) Array = 'Loteria.Users13'
                if (db.get('Loteria.Users13')?.length >= 500) Array = 'Loteria.Users14'
                if (db.get('Loteria.Users14')?.length >= 500) Array = 'Loteria.Users15'
                if (db.get('Loteria.Users15')?.length >= 500) Array = 'Loteria.Users16'
                if (db.get('Loteria.Users16')?.length >= 500) Array = 'Loteria.Users17'
                if (db.get('Loteria.Users17')?.length >= 500) Array = 'Loteria.Users18'
                if (db.get('Loteria.Users18')?.length >= 500) Array = 'Loteria.Users19'
                if (db.get('Loteria.Users19')?.length >= 500) Array = 'Loteria.Users20'
                let i = 0; do {
                    i++
                    db.push(`${Array}`, `${message.author.id}`)
                } while (i <= 49)
                msg.edit(`${e.Check} | ${message.author} comprou ${i} 🎫 \`Tickets da Loteria\` aumentando o prêmio para ${db.get('Loteria.Prize')} ${Moeda(message)}.\n${e.PandaProfit} | -500 ${Moeda(message)}`).catch(err => { })
                setTimeout(() => { db.delete(`${message.author.id}.Tickets`) }, 1000)
                let LoteriaUsers = db.get('Loteria.Users').concat(db.get('Loteria.Users1'), db.get('Loteria.Users2'), db.get('Loteria.Users3'), db.get('Loteria.Users4'), db.get('Loteria.Users5'))
                if (LoteriaUsers.length >= 10000) {
                    db.set('Lotery.Close', true)
                    return NewLoteryGiveaway(LoteriaUsers)
                }
            }).catch(err => {
                Error(message, err)
                db.delete(`${message.author.id}.Tickets`)
                message.channel.send(`${e.Deny} | Ocorreu um erro ao alocar os Tickets.\n\`${err}\``)
            })
        }

        // async function BuyTicket() {
        //     if (db.get(`${message.author.id}.Tickets`)) return
        //     db.set(`${message.author.id}.Tickets`, true)
        //     db.subtract(`Balance_${message.author.id}`, 500); AddLoteria(500);
        //     await message.channel.send(`${e.Loading} | Alocando tickets...`).then(msg => {
        //         let i = 0; do {
        //             i++
        //             db.push('Loteria.Users', `${message.author.id}`)
        //         } while (i <= 49)
        //         msg.edit(`${e.Check} | ${message.author} comprou ${i} 🎫 \`Tickets da Loteria\` aumentando o prêmio para ${db.get('Loteria.Prize')} ${Moeda(message)}.\n${e.PandaProfit} | -500 ${Moeda(message)}`).catch(err => { })
        //         setTimeout(() => { db.delete(`${message.author.id}.Tickets`) }, 1000)
        //         if (db.get('Loteria.Users').length >= 10000) {
        //             db.set('Lotery.Close', true)
        //             return NewLoteryGiveaway()
        //         }
        //     }).catch(err => {
        //         db.delete(`${message.author.id}.Tickets`)
        //         message.channel.send(`${e.Deny} | Ocorreu um erro ao alocar os Tickets.\n\`${err}\``)
        //     })
        // }

        function Roleta() {
            let x = db.get(`${message.author.id}.Slot.Fichas`) || 0
            x >= 50 ? message.reply(`${e.Deny} | Você já atingiu o limite de fichas.`) : db.get(`Balance_${message.author.id}`) >= (50 - x) * 5 ? BuyFichas() : message.channel.send(`${e.Deny} | ${message.author}, você precisa de ${(50 - x) * 5} ${Moeda(message)} para comprar mais ${50 - x} fichas.`)
            function BuyFichas() {
                db.subtract(`Balance_${message.author.id}`, (50 - x) * 5)
                AddLoteria(((50 - x) * 5) / 2)
                db.add(`${message.author.id}.Slot.Fichas`, 50 - x)
                message.channel.send(`${e.Check} | ${message.author} completou o limite de \`Fichas da Roleta\` comprando +${50 - x} fichas.\n${e.PandaProfit} | -${(50 - x) * 5} ${Moeda(message)}`)
            }
        }

        function Cartas() {
            let x = db.get(`${message.author.id}.Slot.Cartas`) || 0
            x >= 50 ? message.reply(`${e.Deny} | Você já atingiu o limite de cartas.`) : db.get(`Balance_${message.author.id}`) >= (50 - x) * 2 ? BuyCartas() : message.channel.send(`${e.Deny} | ${message.author}, você precisa de ${(50 - x) * 2} ${Moeda(message)} para comprar mais ${50 - x} cartas.`)
            function BuyCartas() {
                db.subtract(`Balance_${message.author.id}`, (50 - x) * 2)
                AddLoteria(((50 - x) * 2) / 2)
                db.add(`${message.author.id}.Slot.Cartas`, 50 - x)
                message.channel.send(`${e.Check} | ${message.author} completou o limite de \`Cartas de Amor\` comprando +${50 - x} cartas.\n${e.PandaProfit} | -${(50 - x) * 2} ${Moeda(message)}`)
            }
        }

        function Comidas() {
            let x = db.get(`${message.author.id}.Slot.Comidas`) || 0
            x >= 50 ? message.reply(`${e.Deny} | Você já atingiu o limite de comidas.`) : db.get(`Balance_${message.author.id}`) >= (50 - x) * 2 ? BuyComidas() : message.channel.send(`${e.Deny} | ${message.author}, você precisa de ${(50 - x) * 2} ${Moeda(message)} para comprar mais ${50 - x} comidas.`)
            function BuyComidas() {
                db.subtract(`Balance_${message.author.id}`, (50 - x) * 2)
                AddLoteria(((50 - x) * 2) / 2)
                db.add(`${message.author.id}.Slot.Comidas`, 50 - x)
                message.channel.send(`${e.Check} | ${message.author} completou o limite de \`Comidas\` comprando +${50 - x} comidas.\n${e.PandaProfit} | -${(50 - x) * 2} ${Moeda(message)}`)
            }
        }

        function Iscas() {
            let x = db.get(`${message.author.id}.Slot.Iscas`) || 0
            x >= 50 ? message.reply(`${e.Deny} | Você já atingiu o limite de iscas.`) : db.get(`Balance_${message.author.id}`) >= (50 - x) * 1 ? BuyIscas() : message.channel.send(`${e.Deny} | ${message.author}, você precisa de ${(50 - x) * 1} ${Moeda(message)} para comprar mais ${50 - x} iscas.`)
            function BuyIscas() {
                db.subtract(`Balance_${message.author.id}`, (50 - x) * 1)
                AddLoteria(((50 - x) * 1) / 2)
                db.add(`${message.author.id}.Slot.Iscas`, 50 - x)
                message.channel.send(`${e.Check} | ${message.author} completou o limite de \`Iscas\` comprando +${50 - x} iscas.\n${e.PandaProfit} | -${(50 - x) * 1} ${Moeda(message)}`)
            }
        }

        function Copos() {
            let x = db.get(`${message.author.id}.Slot.Aguas`) || 0
            x >= 50 ? message.reply(`${e.Deny} | Você já atingiu o limite de copos.`) : db.get(`Balance_${message.author.id}`) >= (50 - x) * 1 ? BuyCopos() : message.channel.send(`${e.Deny} | ${message.author}, você precisa de ${(50 - x) * 1} ${Moeda(message)} para comprar mais ${50 - x} copos.`)
            function BuyCopos() {
                db.subtract(`Balance_${message.author.id}`, (50 - x) * 1)
                AddLoteria(((50 - x) * 1) / 2)
                db.add(`${message.author.id}.Slot.Aguas`, 50 - x)
                message.channel.send(`${e.Check} | ${message.author} completou o limite de \`Copos d'água'\` comprando +${50 - x} copos.\n${e.PandaProfit} | -${(50 - x) * 1} ${Moeda(message)}`)
            }
        }

        function AddLoteria(value) { db.add('Loteria.Prize', value) }

        function NewLoteryGiveaway(LoteriaUsers) {

            let Tickets = LoteriaUsers || []
            let TicketsCompradosAoTodo = Tickets.length || 0
            let TicketPremiado = Tickets[Math.floor(Math.random() * Tickets.length)]

            let i = 0
            Tickets.forEach(TicketsComprados => {
                if (TicketsComprados === TicketPremiado)
                    i++
            });

            let TicketsComprados = i || '0'
            let Prize = db.get('Loteria.Prize') || '0'
            let tag = client.users.cache.get(TicketPremiado)

            const WinEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle(`💸 | Loteria ${client.user.username}`)
                .setDescription(`🎉 Vencedor*(a)*: ${tag.tag}\n:id: *\`${TicketPremiado}\`*\n💸 Prêmio: ${Prize} ${Moeda(message)}\n${tag.username} comprou 🎫 ${TicketsComprados} Tickets`)
                .setFooter(`${TicketsCompradosAoTodo} Tickets foram comprados nesta loteria.`)

            NewSorteio()

            function NewSorteio() {
                message.channel.send(`${e.Loading} | Iniciando sorteio...`).then(msg => {
                    setTimeout(() => { msg.edit(`${e.Check} | Sorteio iniciado!\n${e.Loading} | Contabilizando Tickets...`).catch(() => { }) }, 3000)
                    setTimeout(() => { msg.edit(`${e.Check} | Sorteio iniciado!\n${e.Check} | ${TicketsCompradosAoTodo} 🎫 Tickets contabilizados\n${e.Loading} | Sorteando um Ticket...`).catch(() => { }) }, 7000)
                    setTimeout(() => { Winner(msg) }, 12000)
                })
            }

            function Winner(msg) {
                setTimeout(() => { msg.edit(`${e.Check} | Sorteio iniciado!\n${e.Check} | ${TicketsCompradosAoTodo} 🎫 Tickets contabilizados\n${e.Check} | Ticket sorteado!\n${e.Loading} | Autenticando Ticket...`).catch(() => { }) }, 4500)
                let winner = client.users.cache.get(TicketPremiado)
                if (!winner) {
                    return msg.edit(`${e.Check} | Sorteio iniciado!\n
                ${e.Check} | ${TicketsCompradosAoTodo} 🎫 Tickets contabilizados\n
                ${e.Check} | Ticket sorteado!\n
                ${e.Deny} | O ticket prêmiado pertence a um usuário que não está em nenhum servidor em que eu estou.\n
                ${e.Loading} | Deletando todos os dados deste usuário...`).then(msg => {
                        db.delete(`${TicketPremiado}`); db.delete(`Bank_${TicketPremiado}`); db.delete(`Balance_${TicketPremiado}`); db.delete(`Xp_${TicketPremiado}`); db.delete(`level_${TicketPremiado}`); db.delete(`Vip_${TicketPremiado}`); db.delete(`Likes_${TicketPremiado}`); db.delete(`Bitcoin_${TicketPremiado}`);
                        setTimeout(() => {
                            msg.edit(`${e.Check} | Sorteio iniciado!\n
                ${e.Check} | ${TicketsCompradosAoTodo} 🎫 Tickets contabilizados\n
                ${e.Check} | Ticket sorteado!\n
                ${e.Deny} | O ticket prêmiado pertence a um usuário que não está em nenhum servidor em que eu estou.\n
                ${e.Check} | Todos os dados pertencentes a \`${TicketPremiado}\` foram deletados com sucesso!\n
                ${e.Loading} | Iniciando um novo sorteio...`).catch(() => { })
                        }, 4500)
                        setTimeout(() => { NewSorteio() }, 9500)
                    })
                } else {
                    setTimeout(() => { NewTicketAwarded(msg, winner) }, 4500)
                }
            }

            function NewTicketAwarded(msg, winner) {
                msg.delete().catch(() => { })
                message.channel.send({ embeds: [WinEmbed] })
                db.add(`${winner.id}.Cache.Resgate`, (db.get('Loteria.Prize') || 0))
                db.set('Loteria.LastWinner', `${winner.tag} *\`${winner.id}\`* | ${parseInt(db.get('Loteria.Prize'))?.toFixed(0) || 'Buguinho de Valores'}`)
                try {
                    winner.send(`${e.PandaProfit} | Oi oi, estou passando aqui para te falar que você foi o ganhador*(a)* da Loteria.\n${e.MoneyWings} | Você ganhou o prêmio de ${Prize} ${e.Coin} Moedas.\n${e.SaphireObs} | Você pode resgatar ele a qualquer momento usando \`-resgate\``)
                } catch (err) {
                    message.channel.send(`${e.Deny} | Não foi possível contactar o vencedor(a).`)
                }
                message.channel.send(`${e.Loading} | Alocando prêmio ao vencedor*(a)* e deletando todos os dados da Loteria...`).then(msg => {
                    setTimeout(() => {
                        msg.edit(`${e.Check} | Prêmio entregue com sucesso ao cache do vencedor*(a)* e todos os dados da Loteria foram apagados!`).catch(() => { });
                        NewLotery()
                    }, 3500)
                })
            }

            function NewLotery() {
                message.channel.send(`${e.Loading} | Iniciando uma nova loteria...`).then(msg => {
                    setTimeout(() => {
                        db.delete('Lotery.Close')
                        db.delete('Loteria.Prize')
                        db.set('Loteria.Users', [])
                        for (i = 0; i <= 19; i++) {
                            db.set(`Loteria.Users${i + 1}`, [])
                        }
                        msg.edit(`${e.Check} | Uma nova loteria foi iniciada com sucesso!`)
                    }, 4000)
                })
            }
        }
    }
}