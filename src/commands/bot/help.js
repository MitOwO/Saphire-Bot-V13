const { readdirSync } = require("fs")
const { MessageSelectMenu, MessageActionRow } = require("discord.js")
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const ms = require('parse-ms')
const Error = require('../../../Routes/functions/errors')

module.exports = {
    name: 'help',
    aliases: ['comandos', 'comando', 'commands', 'h', 'ajuda', 'socorro'],
    usage: '<help> [NomeDoComando]',
    category: 'bot',
    UserPermissions: '',
    ClientPermissions: 'EMBED_LINKS',
    emoji: `${e.Info}`,
    description: 'Central de Ajuda',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let CloudKingdomInvite = 'https://discord.gg/J6Rr4CepDt'
        const PrincipalEmbed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(`${e.BlueHeart} Centralzinha de Ajuda da ${client.user.username}`)
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`)
            .setDescription(`${e.HiNagatoro} Oi oooi, este é o meu painel de ajuda, seja bem-vindo(a)!`)
            .addField(`${e.Obs} Painelzinho diferenciado`, `Você pode navegar por todos os meus comandos usando essa barrinha aqui em baixo. Não é nada difícil, te garanto. É tudo dividido em categorias.`)
            .addField(`${e.Commands} Categorias`, `As categorias representam as classes de cada comando. Logo, o comando que procura está em sua própria categoria. Quer algum comando referente a economia? Só ir na categoria economia, óras bolas.`)
            .addField(`${e.Info} Comandos de Suporte`, `${e.Report} \`${prefix}bug\` Reporte bugs/erros diretamente ao meu criador.\n${e.Trig} \`${prefix}gif\` Envie gifs para serem adicionados ao package.\n${e.Stonks} \`${prefix}sugest\` Tem alguma ideia/sugestão pra mim?\n${e.NezukoDance} \`${prefix}servers\` Meu servidor e a Super ☁️[Cloud's Kingdom](${CloudKingdomInvite}).`)
            .addField(`🛰️ Global System Notification`, `Ative o \`${prefix}logs\` e deixa que eu aviso tudo sobre tudo, pode ficar despreocupado(a)!`)
            .setFooter(`O ${prefix}help fechará por inatividade em 1 minuto.`)

        const painel = new MessageActionRow()
            .addComponents(new MessageSelectMenu()
                .setCustomId('menu')
                .setPlaceholder('Escolher uma categoria') // Mensagem estampada
                .addOptions([
                    {
                        label: 'Painel Inicial',
                        description: 'Painel Principal',
                        emoji: `${e.BlueHeart}`,
                        value: 'PainelPrincipal',
                    },
                    {
                        label: 'AFK',
                        description: 'Afk Global System',
                        emoji: `${e.Afk}`,
                        value: 'Afk',
                    },
                    {
                        label: 'Animes',
                        description: 'Todo mundo gosta de animes, não é?',
                        emoji: `${e.NezukoDance}`,
                        value: 'Animes',
                    },
                    {
                        label: 'Bot, vulgo Eu',
                        description: 'Todos os comandos ligados a euzinha aqui',
                        emoji: `${e.Gear}`,
                        value: 'Bot',
                    },
                    {
                        label: 'Configurações',
                        description: 'Comandos de configurações do servidor/usuário',
                        emoji: `${e.On}`,
                        value: 'Config',
                    },
                    {
                        label: 'Economia',
                        description: 'Economy Global System',
                        emoji: `${e.PandaProfit}`,
                        value: 'Economy',
                    },
                    {
                        label: 'Games/Jogos',
                        description: 'Links que te levam direto ao jogo',
                        emoji: '🎮',
                        value: 'Games',
                    },
                    {
                        label: 'Interação',
                        description: 'Interagir com os outros é muito legal',
                        emoji: '🫂',
                        value: 'Interaction',
                    },
                    {
                        label: 'Level/Ranks',
                        description: 'Level Global System',
                        emoji: `${e.RedStar}`,
                        value: 'Level',
                    },
                    {
                        label: 'Moderação/Administração',
                        description: 'Comandos só pros Mod/Adm de plantão',
                        emoji: `${e.ModShield}`,
                        value: 'Moderation',
                    },
                    {
                        label: 'Owner',
                        description: 'Comandos exclusivos do meu criador/desenvolvedor',
                        emoji: `${e.OwnerCrow}`,
                        value: 'Owner',
                    },
                    {
                        label: 'Perfil',
                        description: 'Comandos do perfil pessoal de cada um',
                        emoji: '👤',
                        value: 'Perfil',
                    },
                    {
                        label: 'Random',
                        description: 'Pensa numas coisas aleatórias',
                        emoji: `${e.CoolDoge}`,
                        value: 'Random',
                    },
                    {
                        label: 'Reações/Emoções',
                        description: 'Mostre ao mundo como se sente',
                        emoji: '😁',
                        value: 'Reactions',
                    },
                    {
                        label: 'Servidor',
                        description: 'Comandos fechados só para o servidor',
                        emoji: `${e.BrilanceBlob}`,
                        value: 'Server',
                    },
                    {
                        label: 'Utilidades',
                        description: 'Comandos uteis para qualquer um, garanto',
                        emoji: `${e.QuestionMark}`,
                        value: 'Util',
                    },
                    {
                        label: 'Fechar o painel de ajuda',
                        description: 'Deleta a mensagem e remove a request',
                        emoji: `${e.Deny}`,
                        value: 'Close',
                    },
                ])
            );

        if (args[0]) return HelpWithArgs(args[0])

        if (request) return message.reply(`${e.Deny} | ${f.Request}`)
        message.reply({ embeds: [PrincipalEmbed], components: [painel] }).then(msg => {
            db.set(`User.Request.${message.author.id}`, 'ON')

            const filtro = (interaction) => interaction.customId === 'menu' && interaction.user.id === message.author.id

            const coletor = msg.createMessageComponentCollector({ filtro, idle: 60000 });

            coletor.on('end', async (collected) => {
                db.delete(`User.Request.${message.author.id}`)
                PrincipalEmbed.setColor('RED').setFooter('Request cancelada ' + message.author.id)
                msg.edit({ embeds: [PrincipalEmbed] }).catch(err => { })
            })

            coletor.on('collect', async (collected) => {
                if (collected.user.id !== message.author.id) return

                let valor = collected.values[0]
                collected.deferUpdate()

                switch (valor) {
                    case 'PainelPrincipal':
                        msg.edit({ embeds: [PrincipalEmbed], components: [painel] })
                        break;
                    case 'Afk':
                        Afk();
                        break;
                    case 'Animes':
                        HelpPainel('animes')
                        break;
                    case 'Bot':
                        HelpPainel('bot')
                        break;
                    case 'Config':
                        HelpPainel('config')
                        break;
                    case 'Economy':
                        HelpPainel('economy')
                        break;
                    case 'Games':
                        HelpPainel('games')
                        break;
                    case 'Interaction':
                        HelpPainel('interactions')
                        break;
                    case 'Level':
                        HelpPainel('level')
                        break;
                    case 'Moderation':
                        HelpPainel('moderation')
                        break;
                    case 'Owner':
                        HelpPainel('owner')
                        break;
                    case 'Perfil':
                        HelpPainel('perfil')
                        break;
                    case 'Random':
                        HelpPainel('random')
                        break;
                    case 'Reactions':
                        HelpPainel('reactions')
                        break;
                    case 'Server':
                        HelpPainel('servidor')
                        break;
                    case 'Util':
                        HelpPainel('util')
                        break;
                    case 'Close':
                        db.delete(`User.Request.${message.author.id}`)
                        msg.edit({ embeds: [PrincipalEmbed.setColor('RED').setFooter('Request cancelada ' + message.author.id)] })
                        break;
                    default:
                        msg.edit({ embeds: [PrincipalEmbed], components: [painel] })
                        break;
                }

                function Afk() {
                    const AfkInfoEmbed = new MessageEmbed()
                        .setColor('BLUE')
                        .setTitle(`${e.Planet} Afk Global System`)
                        .setDescription('Utilize este comando para avisar que você está offline.')
                        .addField(`${e.On} Comando`, `\`${prefix}afk Estou ocupado...\` Frase de sua escolha`)
                        .addField(`${e.Info} | Emojis de Ativação`, `✅ | Ative o AFK somente no servidor\n🌎 | Ative o AFK em todos os servidores\n❓ | Esta paginazinha de Ajuda\n❌ | Cancele o comando`)
                        .addField(`${e.Warn} | Atenção!`, `1. \`Modo Global\` Será desativado quando você mandar mensagem em qualquer servidor que eu esteja.\n2. \`Ativação sem mensagem\` Eu direi que você está offline, porém, sem recado algum.`)

                    msg.edit({ embeds: [AfkInfoEmbed], components: [painel] });
                }

                function HelpPainel(x) {
                    let cots = []
                    let catts = []

                    readdirSync("./src/commands/").forEach((dir) => {
                        if (dir.toLowerCase() !== x.toLowerCase()) return
                        const commands = readdirSync(`./src/commands/${dir}/`).filter((file) => file.endsWith(".js"))

                        const cmds = commands.map((command) => {
                            let file = require(`../../commands/${dir}/${command}`)

                            if (!file.name) return "Sem nome do comando."

                            let name = file.name.replace(".js", "")

                            let des = `${client.commands.get(name).description}`
                            let emo = `${client.commands.get(name).emoji}`
                            if (emo === undefined) emo = ''

                            let obj = { cname: `${emo} \`${prefix}${name}\``, des, }

                            return obj
                        })

                        let dota = new Object()

                        cmds.map((co) => {
                            dota = { name: `${cmds.length === 0 ? "Em andamento." : co.cname}`, value: co.des ? co.des : "Sem descrição", }
                            catts.push(dota)
                        })

                        cots.push(dir.toLowerCase())
                    })

                    if (cots.includes(x.toLowerCase())) {
                        const combed = new MessageEmbed()
                            .setColor('BLUE')
                            .setTitle(`Classe: ${x.charAt(0).toUpperCase() + x.slice(1)}`)
                            .setDescription(`Use \`${prefix}help [comando]\` para obter mais informações.`)
                            .addFields(catts)

                        return msg.edit({ embeds: [combed], components: [painel] });
                    }
                }

            })

        })

        function HelpWithArgs(x) {
            const command = client.commands.get(x.toLowerCase()) || client.commands.find((c) => c.aliases && c.aliases.includes(x.toLowerCase()))
            if (!command) { return message.reply(`${e.Deny} | Comando inválido! Use \`${prefix}help\` para todos os comandos.`) }

            const embed = new MessageEmbed()
                .setColor('BLUE')
                .setTitle(`Detalhes do Comando: ${command.name ? `${command.name}` : "Sem nome definido."}`)
                .addField("Comando:", command.name ? `\`${prefix}${command.name}\`` : "Sem nome definido.", true)
                .addField("Atalhos:", command.aliases ? `\`${prefix}${command.aliases.join(`\` \`${prefix}`)}\`` : "Sem atalhos definido.", true)
                .addField("Uso:", command.usage ? `\`${command.usage}\`` : `\`${prefix}${command.name}\``)
                .addField("Descrição:", command.description ? command.description : "Sem descrição definida.")
            return message.reply({ embeds: [embed] })
        }
    }
}