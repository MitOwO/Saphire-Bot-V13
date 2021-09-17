const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const { MessageSelectMenu, MessageActionRow } = require("discord.js")
const BuyingAway = require('../../../Routes/functions/BuyingAway')

module.exports = {
    name: 'comprar',
    aliases: ['buy', 'loja', 'store', 'shop'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.Coin}`,
    usage: '<buy> [item/quantidade]',
    description: 'Compre itens da Loja Saphire',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let vip = db.get(`Vip_${message.author.id}`)
        let bank = db.get(`Bank_${message.author.id}`) || '0'

        let timeout1 = 9140000
        let author1 = await db.get(`User.${message.author.id}.Timeouts.PresoMax`)
        if (author1 !== null && timeout1 - (Date.now() - author1) > 0) {
            let time = ms(timeout1 - (Date.now() - author1))
            return message.reply(`${e.Sirene} | Você está sob detenção máxima por mais \`${time.hours}h ${time.minutes}m e ${time.seconds}s\` `)
        } else {

            if (args[0]) return message.reply(`${e.Loading} | Logo logo, as compras personalizadas estarão disponíveis. Só espera um pouquinho, ok?`) // return BuyingAway(message, args, db.get(`Balance_${message.author.id}`), bank, prefix)

            const LojaEmbed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle(`🏪 Lojinha ${client.user.username} 24h`)
                .setDescription(`Aqui na Lojinha ${client.user.username}, você pode comprar várias coisas para ter acesso a comandos e funções incriveis.\n\`${prefix}buy <item> [quantidade]\``)
                .addFields(
                    {
                        name: 'Disponiveis',
                        value: '🎣 `Vara de Pesca` 180 🪙Moedas\n🔫 `Arma` 4.700 🪙Moedas\n⛏️ `Picareta` 120 🪙Moedas\n🪓 `Machado` 120 🪙Moedas\n🎟️ `Fichas` 5 🪙Moedas\n💌 `Carta de Amor` 2 🪙Moedas\n🥘 `Comida` 2 🪙Moedas\n🪱 `Isca` 1 🪙Moedas\n🥤 `Água` 1 🪙Moedas'
                    },
                    {
                        name: 'Loteria',
                        value: '🎫 `Ticket Loteria` 10 🪙Moedas' + `\nPrêmio Atual: ${parseInt(db.get(`Loteria.Prize`)) || '0'} 🪙Moedas`
                    },
                    {
                        name: 'Perfil',
                        value: '⭐ `Estrela1` 500.000 🪙Moedas\n⭐⭐ `Estrela2` 1.000.000 🪙Moedas\n⭐⭐⭐ `Estrela3` 2.000.000 🪙Moedas\n⭐⭐⭐⭐ `Estrela4` 4.000.000 🪙Moedas\n🔰 `Título` 10.000🪙Moedas'
                    },
                    {
                        name: 'Cores',
                        value: '`Verde` 15000🪙Moedas\n`Amarelo` 15000 🪙Moedas\n`Azul` 15000 🪙Moedas'
                    }
                )
                .setFooter(`${prefix}buy | ${prefix}itens | ${prefix}vender | ${prefix}slot | ${prefix}loja vip`)

            const PainelLoja = new MessageActionRow()
                .addComponents(new MessageSelectMenu()
                    .setCustomId('menu')
                    .setPlaceholder('Compra rápida') // Mensagem estampada
                    .addOptions([
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
                            label: 'Picareta',
                            description: `Use para minerar > ${prefix}minerar`,
                            emoji: '⛏️',
                            value: 'Picareta',
                        },
                        {
                            label: 'Restaurar Picareta',
                            description: 'Restaura a picareta para 50 usos por 30 Moedas',
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
                            label: 'Estrelas',
                            description: `Estrelas para o perfil > ${prefix}perfil`,
                            emoji: '⭐',
                            value: 'Estrela',
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
                if (request) return message.reply(`${e.Deny} | ${f.Request}`)
                return message.reply({ content: '50% das moedas gastas na loja vão para a loteira, exceto os tickets (100%).', embeds: [LojaEmbed], components: [PainelLoja] }).then(msg => {
                    db.set(`User.Request.${message.author.id}`, 'ON')

                    const filtro = (interaction) => interaction.customId === 'menu' && interaction.user.id === message.author.id

                    const coletor = msg.createMessageComponentCollector({ filtro, time: 120000 });

                    coletor.on('end', async (collected) => {
                        LojaEmbed.setColor('RED').setFooter(`Sessão encerrada | ${message.author.id}`)
                        db.delete(`User.Request.${message.author.id}`)
                        msg.edit({ embeds: [LojaEmbed] }).catch(err => { return })
                    })

                    coletor.on('collect', async (collected) => {
                        if (collected.user.id !== message.author.id) return

                        let item = collected.values[0]
                        collected.deferUpdate()

                        msg.edit({ components: [PainelLoja] }).catch(err => { return })
                        switch (item) {
                            case 'VaraDePesca': VaraDePesca(); break;
                            case 'Arma': Arma(); break;
                            case 'Machado': Machado(); break;
                            case 'Picareta': Picareta(); break;
                            case 'Ticket': Ticket(); break;
                            case 'Roleta': Roleta(); break;
                            case 'Carta': Cartas(); break;
                            case 'Comida': Comidas(); break;
                            case 'Iscas': Iscas(); break;
                            case 'Copo': Copos(); break;
                            case 'Estrela': Estrelas(); break;
                            case 'Titulo': Titulo(); break;
                            case 'RestaurarPicareta': RestaurarPicareta(); break;
                            case 'Cores': Cores(); break;
                            case 'Close': db.delete(`User.Request.${message.author.id}`); msg.delete().catch(err => { return message.channel.send(`${e.Deny} | Não foi possível apagar a mensagem:\n\`${err}\``) }); break;
                            default: msg.edit({ components: [PainelLoja] }).catch(err => { return }); break;
                        }
                    })
                })

            }
        }

        function NoMoney() { message.channel.send(`${e.Deny} | ${message.author}, você não tem dinheiro suficiente para comprar este item.`) }
        function Estrelas() { return message.channel.send(`${e.Loading} | ${message.author}, o "Stars Package" será lançado junto com o comando \`${prefix}perfil\`.\nO motivo desta categoria estar disponível? Boa pergunta, eu também não sei.`) }
        function Cores() { return message.channel.send(`${e.Loading} | ${message.author}, o "Colors Package" será lançado junto com o comando \`${prefix}perfil\`.\nO motivo desta categoria estar disponível? Boa pergunta, eu também não sei.`) }

        function VaraDePesca() {
            db.get(`User.${message.author.id}.Slot.Vara`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) > 180 ? BuyVara() : NoMoney())

            function BuyVara() {
                db.subtract(`Balance_${message.author.id}`, 180); db.add(`Loteria.Prize`, 60)
                db.set(`User.${message.author.id}.Slot.Vara`, "Vara de pesca")
                return message.channel.send(`${e.Check} | ${message.author} comprou uma 🎣 \`Vara de Pesca\`.`)
            }
        }

        function RestaurarPicareta() {
            if (!db.get(`User.${message.author.id}.Slot.Picareta`)) return message.channel.send(`${e.Deny} | ${message.author}, você precisa ter uma picareta para restaurar a sua picareta.`)
            db.get(`User.${message.author.id}.Slot.PicaretaUso`) >= 50 ? message.channel.send(`${e.Deny} | A sua picareta não precisa ser restaurada.`) : Restaurar()
            if (db.get(`Balance_${message.author.id}`) < 30) return message.channel.send(`${e.Deny} | ${message.author}, você precisa ter pelo menos 30 ${e.Coin} Moedas na carteira para renovar a sua picareta.`)
            function Restaurar() {
                db.subtract(`Balance_${message.author.id}`, 30)
                db.set(`User.${message.author.id}.Slot.PicaretaUso`, 50)
                message.channel.send(`${e.Check} | ${message.author} renovou sua picareta para 50 usos.`)
            }
        }

        function Arma() {
            db.get(`User.${message.author.id}.Slot.Arma`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) >= 4800 ? BuyArma() : NoMoney())

            function BuyArma() {
                db.subtract(`Balance_${message.author.id}`, 4800); db.add(`Loteria.Prize`, 2400)
                db.set(`User.${message.author.id}.Slot.Arma`, "Arma")
                return message.channel.send(`${e.Check} | ${message.author} comprou uma 🔫 \`Arma\` e liberou o comando \`${prefix}assaltar\`.`)
            }
        }

        function Machado() {
            db.get(`User.${message.author.id}.Slot.Machado`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) >= 120 ? BuyMachado() : NoMoney())

            function BuyMachado() {
                db.subtract(`Balance_${message.author.id}`, 120); db.add(`Loteria.Prize`, 60)
                db.set(`User.${message.author.id}.Slot.Machado`, "Machado")
                return message.channel.send(`${e.Check} | ${message.author} comprou um 🪓 \`Machado\`.`)
            }
        }

        function Picareta() {
            db.get(`User.${message.author.id}.Slot.Picareta`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) >= 120 ? BuyPicareta() : NoMoney())

            function BuyPicareta() {
                db.subtract(`Balance_${message.author.id}`, 120); db.add(`Loteria.Prize`, 60)
                db.set(`User.${message.author.id}.Slot.Picareta`, "Picareta")
                db.set(`User.${message.author.id}.Slot.PicaretaUso`, 50)
                return message.channel.send(`${e.Check} | ${message.author} comprou uma ⛏️ \`Picareta\`.`)
            }
        }

        function Titulo() {
            db.get(`User.${message.author.id}.Slot.Titulo`) ? message.reply(`${e.Info} | Você já possui este item.`) : (db.get(`Balance_${message.author.id}`) >= 10000 ? BuyTitulo() : NoMoney())

            function BuyTitulo() {
                db.subtract(`Balance_${message.author.id}`, 10000); db.add(`Loteria.Prize`, 60)
                db.set(`User.${message.author.id}.Slot.Titulo`, 'ON')
                return message.channel.send(`${e.Check} | ${message.author} comprou a permissão 🔰 \`Título\`.`)
            }
        }

        function Ticket() {
            if (db.get('Lotery.Close')) return message.reply(`${e.Deny} | A loteria não está aberta.`)
            db.get(`Balance_${message.author.id}`) >= 500 ? BuyTicket() : NoMoney()
            function BuyTicket() {
                db.subtract(`Balance_${message.author.id}`, 500); db.add(`Loteria.Tickets_${message.author.id}`, 50); db.add('Loteria.Prize', 500); db.add('Loteria.TicketsCompradosAoTodo', 500);
                return message.channel.send(`${e.Loading} | Alocando tickets...`).then(msg => {
                    for (let i = 0; i === 50; i++) { db.push('Loteria.Users', `${message.author.id}`) }
                    msg.edit(`${e.Check} | ${message.author} comprou 50 🎫 \`Tickets da Loteria\` aumentando o prêmio para ${db.get('Loteria.Prize')} ${e.Coin}Moedas.`).catch(err => { return })
                }).catch(err => {
                    message.channel.send(`${e.Deny} | Ocorreu um erro ao alocar os Tickets.\n\`${err}\``)
                })
            }
        }

        function Roleta() {
            let x = db.get(`User.${message.author.id}.Slot.Fichas`) || 0
            x >= 50 ? message.reply(`${e.Deny} | Você já atingiu o limite de fichas.`) : db.get(`Balance_${message.author.id}`) >= (50 - x) * 5 ? BuyFichas() : message.channel.send(`${e.Deny} | ${message.author}, você precisa de ${(50 - x) * 5} ${e.Coin}Moedas para comprar mais ${50 - x} fichas.`)
            function BuyFichas() {
                db.subtract(`Balance_${message.author.id}`, (50 - x) * 5)
                db.add('Loteria.Prize', ((50 - x) * 5) / 2)
                db.add(`User.${message.author.id}.Slot.Fichas`, 50 - x)
                message.channel.send(`${e.Check} | ${message.author} completou o limite de \`Fichas da Roleta\` comprando +${50 - x} fichas.`)
            }
        }

        function Cartas() {
            let x = db.get(`User.${message.author.id}.Slot.Cartas`) || 0
            x >= 50 ? message.reply(`${e.Deny} | Você já atingiu o limite de cartas.`) : db.get(`Balance_${message.author.id}`) >= (50 - x) * 2 ? BuyCartas() : message.channel.send(`${e.Deny} | ${message.author}, você precisa de ${(50 - x) * 2} ${e.Coin}Moedas para comprar mais ${50 - x} cartas.`)
            function BuyCartas() {
                db.subtract(`Balance_${message.author.id}`, (50 - x) * 2)
                db.add('Loteria.Prize', ((50 - x) * 2) / 2)
                db.add(`User.${message.author.id}.Slot.Cartas`, 50 - x)
                message.channel.send(`${e.Check} | ${message.author} completou o limite de \`Cartas de Amor\` comprando +${50 - x} cartas.`)
            }
        }

        function Comidas() {
            let x = db.get(`User.${message.author.id}.Slot.Comidas`) || 0
            x >= 50 ? message.reply(`${e.Deny} | Você já atingiu o limite de comidas.`) : db.get(`Balance_${message.author.id}`) >= (50 - x) * 2 ? BuyComidas() : message.channel.send(`${e.Deny} | ${message.author}, você precisa de ${(50 - x) * 2} ${e.Coin}Moedas para comprar mais ${50 - x} comidas.`)
            function BuyComidas() {
                db.subtract(`Balance_${message.author.id}`, (50 - x) * 2)
                db.add('Loteria.Prize', ((50 - x) * 2) / 2)
                db.add(`User.${message.author.id}.Slot.Comidas`, 50 - x)
                message.channel.send(`${e.Check} | ${message.author} completou o limite de \`Comidas\` comprando +${50 - x} comidas.`)
            }
        }

        function Iscas() {
            let x = db.get(`User.${message.author.id}.Slot.Iscas`) || 0
            x >= 50 ? message.reply(`${e.Deny} | Você já atingiu o limite de iscas.`) : db.get(`Balance_${message.author.id}`) >= (50 - x) * 1 ? BuyIscas() : message.channel.send(`${e.Deny} | ${message.author}, você precisa de ${(50 - x) * 1} ${e.Coin}Moedas para comprar mais ${50 - x} iscas.`)
            function BuyIscas() {
                db.subtract(`Balance_${message.author.id}`, (50 - x) * 1)
                db.add('Loteria.Prize', ((50 - x) * 1) / 2)
                db.add(`User.${message.author.id}.Slot.Iscas`, 50 - x)
                message.channel.send(`${e.Check} | ${message.author} completou o limite de \`Iscas da Roleta\` comprando +${50 - x} iscas.`)
            }
        }

        function Copos() {
            let x = db.get(`User.${message.author.id}.Slot.Copos`) || 0
            x >= 50 ? message.reply(`${e.Deny} | Você já atingiu o limite de copos.`) : db.get(`Balance_${message.author.id}`) >= (50 - x) * 1 ? BuyCopos() : message.channel.send(`${e.Deny} | ${message.author}, você precisa de ${(50 - x) * 1} ${e.Coin}Moedas para comprar mais ${50 - x} copos.`)
            function BuyCopos() {
                db.subtract(`Balance_${message.author.id}`, (50 - x) * 1)
                db.add('Loteria.Prize', ((50 - x) * 1) / 2)
                db.add(`User.${message.author.id}.Slot.Copos`, 50 - x)
                message.channel.send(`${e.Check} | ${message.author} completou o limite de \`Copos d'água'\` comprando +${50 - x} copos.`)
            }
        }












    }
}