const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const ms = require('parse-ms')
const { MessageSelectMenu, MessageActionRow } = require("discord.js")
const BuyingAway = require('../../../Routes/functions/BuyingAway')
const TimeoutPrisionMax = require('../../../Routes/functions/TimeoutPrisionMax')
const Moeda = require('../../../Routes/functions/moeda')
const Colors = require('../../../Routes/functions/colors')

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
                    value: `🎫 \`Ticket Loteria\` 10 ${Moeda(message)}\nPrêmio Atual: ${parseInt(db.get(`Loteria.Prize`)) || '0'} ${Moeda(message)}`
                },
                {
                    name: 'Perfil',
                    value: `💍 \`Anel de Casamento\` 350.000 ${Moeda(message)}\n⭐ \`Estrela1\` 1.000.000 ${Moeda(message)}\n⭐⭐ \`Estrela2\` 2.000.000 ${Moeda(message)}\n⭐⭐⭐ \`Estrela3\` 3.000.000 ${Moeda(message)}\n⭐⭐⭐⭐ \`Estrela4\` 4.000.000 ${Moeda(message)}\n🔰 \`Título\` 10.000 ${Moeda(message)}`
                },
                {
                    name: 'Cores',
                    value: `\`Verde\` 15000 ${Moeda(message)}\n\`Amarelo\` 15000 ${Moeda(message)}\n\`Azul\` 15000 ${Moeda(message)}`
                }
            )
            .setFooter(`${prefix}buy | ${prefix}vender | ${prefix}slot | ${prefix}loja vip`)

        const ColorEmbed = new MessageEmbed()
            .setColor(color)
            .setTitle('🎨 Cores')
            .setDescription('As cores disponíveis customizam as embeds.')
            .addField(`${e.On} Compre`, `\`${prefix}buy NomeDaCor\``)
            .addField(`# Código Hex`, `\`${prefix}cor #34B946\` Verde\n\`${prefix}cor #3457B9\` Azul\n\`${prefix}cor #B9B334\` Amarelo`)
            .addField(`${e.Gear} Configure`, `\`${prefix}setcolor\``)

        const itens = new MessageEmbed()
            .setColor(color)
            .setTitle('📋 Itens e suas funções')
            .setDescription('Todos os dados de todos os itens aqui em baixo')
            .addField('Itens Únicos', 'Itens únicos são aqueles que você consegue comprar apenas um.\n \n🎣 `Vara de Pesca` Use para pescar `' + prefix + 'pescar`\n🔫 `Arma` Use para assaltar e se proteger `' + prefix + 'assaltar @user`\n🪓 `Machado` Use na floresta `' + prefix + 'floresta`\n')
            .addField('Itens Consumiveis', 'Itens consumiveis são aqueles que são gastos a cada vez que é usado\n \n⛏️ `Picareta` Use para minerar `' + prefix + 'cavar`\n🎫 `Ticket` Aposte na loteria `' + prefix + 'buy ticket`\n🎟️ `Fichas` Use na roleta `' + prefix + 'roleta`\n💌 `Cartas` Use para conquistar alguém `' + prefix + 'carta`\n🥘 `Comida` Use na floresta`' + prefix + 'buscar`\n🪱 `Iscas` Use para pescar `' + prefix + 'pescar`\n🥤 `Água` Use para minerar `' + prefix + 'minerar`')
            .addField('Itens Especiais', `Itens especiais são aqueles que são pegos na sorte nos mini-games\n \n${e.Star} \`Vip\` Mais informações no comando \`${prefix}vip\`\n${e.Loli} \`Loli\` Adquira na pesca \`${prefix}pescar\`\n🔪 \`Faca\` Adquira na pesca \`${prefix}pescar\`\n${e.Fossil} \`Fossil\` Adquira na mineração \`${prefix}minerar\`\n🦣 \`Mamute\` Adquira na mineração \`${prefix}minerar\`\n🐶 \`Brown\` Adquira na Floresta Cammum \`${prefix}floresta\`\n🥎 \`Bola do Brown\` Adquira na Floresta Cammum \`${prefix}floresta\`\n💊 \`Remédio do Velho Welter\` Adquira na Floresta Cammum \`${prefix}floresta\`\n${e.Doguinho} \`Cachorrinho/a\` Adquira no Castelo Heslow \`${prefix}medalha\`\n🏅 \`Medalha\` Adquira no Castelo Heslow \`${prefix}medalha\``)
            .addField('Perfil', 'Itens de perfil são aqueles que melhora seu perfil\n \n⭐ `Estrela` Estrelas no perfil\n🔰 `Título` Mude o título no perfil `' + prefix + 'help perfil`')
            .addField('Itens Coletaveis', 'Itens coletaveis são aqueles que você consegue nos mini-games, você pode vende-los para conseguir mais dinheiro.\n \n🍤 `Camarões` - Baú do Tesouro `' + prefix + 'pescar`\n🐟 `Peixes` - Baú do Tesouro `' + prefix + 'pescar`\n🌹 `Rosas` - Floresta Cammum `' + prefix + 'floresta`\n🍎 `Maças` - Floresta Cammum `' + prefix + 'floresta`\n🦴 `Ossos` - Mineração `' + prefix + 'minerar`\n🪨 `Minérios` - Mineração `' + prefix + 'minerar`\n💎 `Diamantes` - Mineração `' + prefix + 'minerar`')
            .addField('Cores', 'Cores são utilizadas para editar a cor de suas mensagens')

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
                        description: `Personalize sua cor > ${prefix}setcolor`,
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
                        case 'Ticket': Ticket(); break;
                        case 'Roleta': Roleta(); break;
                        case 'Carta': Cartas(); break;
                        case 'Comida': Comidas(); break;
                        case 'Iscas': Iscas(); break;
                        case 'Copo': Copos(); break;
                        case 'Titulo': Titulo(); break;
                        case 'Cores': Cores(); break;
                        case 'Close': db.delete(`Request.${message.author.id}`); msg.edit({ components: [] }).catch(err => { }); break;
                        default: msg.edit({ components: [PainelLoja] }).catch(err => { }); break;
                    }
                })
                function Itens() { msg.edit({ embeds: [itens] }).catch(err => { }) }
                function Embed() { msg.edit({ embeds: [LojaEmbed] }).catch(err => { }) }
                function Cores() { msg.edit({ embeds: [ColorEmbed] }).catch(err => { }) }
            })
        }

        function NoMoney(x) { message.channel.send(`${e.Deny} | ${message.author}, você precisa de pelo menos ${x} ${Moeda(message)} na carteira para comprar este item.`) }

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

            let timeout = 86400000 // 24hrs
            let Tempo = db.get(`Client.Timeouts.RestoreDividas`)
            if (Tempo !== null && timeout - (Date.now() - Tempo) > 0) {
                let time = ms(timeout - (Date.now() - Tempo))
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
            let time = ms(60000 - (Date.now() - db.get(`${message.author.id}.Timeouts.Tickets`)))
            if (db.get(`${message.author.id}.Timeouts.Tickets`) !== null && 60000 - (Date.now() - db.get(`${message.author.id}.Timeouts.Pix`)) > 0) {
                return message.reply(`${e.Deny} | Calminha aí: \`${time.seconds}s\``).catch(err => { })
            } else {

                if (db.get('Lotery.Close'))
                    return message.reply(`${e.Deny} | A loteria não está aberta.`)

                db.get(`Balance_${message.author.id}`) >= 500 ? BuyTicket() : NoMoney(500)
                async function BuyTicket() {
                    db.subtract(`Balance_${message.author.id}`, 500); AddLoteria(500);
                    db.set(`${message.author.id}.Timeouts.Tickets`, Date.now())
                    await message.channel.send(`${e.Loading} | Alocando tickets...`).then(msg => {
                        let i = 0; do {
                            db.push('Loteria.Users', `${message.author.id}`)
                            i++
                        } while (i <= 50)
                        msg.edit(`${e.Check} | ${message.author} comprou 50 🎫 \`Tickets da Loteria\` aumentando o prêmio para ${db.get('Loteria.Prize')} ${Moeda(message)}.\n${e.PandaProfit} | -500 ${Moeda(message)}`).catch(err => { })
                    }).catch(err => {
                        message.channel.send(`${e.Deny} | Ocorreu um erro ao alocar os Tickets.\n\`${err}\``)
                    })
                }
            }
        }

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

        function AddLoteria(x) { db.add('Loteria.Prize', x) }
    }
}