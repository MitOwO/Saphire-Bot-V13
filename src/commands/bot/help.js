const { readdirSync } = require("fs")
const { MessageSelectMenu, MessageActionRow } = require("discord.js")
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const { config } = require('../../../Routes/config.json')
const Error = require('../../../Routes/functions/errors')

module.exports = {
    name: 'help',
    aliases: ['comandos', 'comando', 'commands', 'h', 'ajuda', 'socorro', 'info', 'comands'],
    usage: '<help> [NomeDoComando]',
    category: 'bot',
    UserPermissions: '',
    ClientPermissions: 'EMBED_LINKS',
    emoji: `${e.Info}`,
    description: 'Central de Ajuda',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let SaphireInviteLink = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`

        const PrincipalEmbed = new MessageEmbed()
            .setColor('#246FE0')
            .setTitle(`${e.BlueHeart} Centralzinha de Ajuda da ${client.user.username}`)
            .setURL(`${SaphireInviteLink}`)
            .setDescription(`${e.SaphireFeliz} Oi oooi! Como você já viu, eu sou a ${client.user.username}. Nos primórdios do mundo, eu era só uma botzinha de um servidor que não existe mais. Eu tinha uns 15 comandos simples e não passava disso. Então, eu fui mudando e mudando e ganhei mais de 400 comandos. Mas como a vida não são só rosas e lasanhas, aconteceu algo bem ruim, mas foi bom. A versão do meu código atualizou e eu parei de funcionar. Meu criador por sua vez, está reescrevendo todos os comandos do zero e atualmente estou com ${message.client.commands.size} comandos ativos.`)
            .addField(`${e.SaphireObs} Navegação entre categorias`, `Você pode navegar por todos os meus comandos usando essa barrinha aqui em baixo. Não é nada difícil, te garanto. É tudo dividido em categorias.`)
            .addField(`${e.Info} Perguntas frequentes`, `Comando: \`${prefix}faq\`\nEstá com alguma dúvida? Veja as perguntas mais feitas de uma forma simples e explicativa.`)
            .addField('🛰️ Global System Notification', `Ative o \`${prefix}logs\` no servidor e aproveite do meu sistema avançado de notificação. Eu vou te avisar desde os bans/kicks até Autoroles com permissões editadas.`)
            .addField(`${e.SaphireTimida} Saphire`, `Você pode [me adicionar](${SaphireInviteLink}) no seu servidor e também pode entrar no [meu servidor](${config.ServerLink}) pra interagir ou tirar algumas dúvida.`)
            .addField('🎃 Halloween Event Online', `Use o comando \`${prefix}halloween\` e divirta-se!`)
            .setFooter('Este painel se fechará após 1 minuto de inatividade')

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
                        label: 'Economia 1',
                        description: 'Economy Global System',
                        emoji: `${e.PandaProfit}`,
                        value: 'Economy',
                    },
                    {
                        label: 'Economia 2',
                        description: 'Economy Global System',
                        emoji: `${e.PandaProfit}`,
                        value: 'Economy2',
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
        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

        return message.reply({ embeds: [PrincipalEmbed], components: [painel] }).then(msg => {
            db.set(`Request.${message.author.id}`, `${msg.url}`)

            const filtro = (interaction) => interaction.customId === 'menu' && interaction.user.id === message.author.id
            const collector = msg.createMessageComponentCollector({ filtro, idle: 60000 });

            collector.on('end', async (collected) => {
                db.delete(`Request.${message.author.id}`)
                msg.edit({ components: [] }).catch(() => { })
            })

            collector.on('collect', async (collected) => {
                if (collected.user.id !== message.author.id) return

                let valor = collected.values[0]
                collected.deferUpdate().catch(() => { })

                switch (valor) {
                    case 'PainelPrincipal':
                        msg.edit({ embeds: [PrincipalEmbed], components: [painel] }).catch(() => { })
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
                    case 'Economy2':
                        HelpPainel('economy2')
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
                        collector.stop()
                        break;
                    default:
                        msg.edit({ embeds: [PrincipalEmbed], components: [painel] }).catch(() => { })
                        break;
                }

                function Afk() {
                    const AfkInfoEmbed = new MessageEmbed()
                        .setColor('#246FE0')
                        .setTitle(`${e.Planet} Afk Global System`)
                        .setDescription('Utilize este comando para avisar que você está offline.')
                        .addField(`${e.On} Comando`, `\`${prefix}afk Estou ocupado...\` Frase de sua escolha`)
                        .addField(`${e.Info} | Emojis de Ativação`, `✅ | Ative o AFK somente no servidor\n🌎 | Ative o AFK em todos os servidores\n❓ | Esta paginazinha de Ajuda\n❌ | Cancele o comando`)
                        .addField(`${e.Warn} | Atenção!`, `1. \`Modo Global\` Será desativado quando você mandar mensagem em qualquer servidor que eu esteja.\n2. \`Ativação sem mensagem\` Eu direi que você está offline, porém, sem recado algum.`)

                    msg.edit({ embeds: [AfkInfoEmbed], components: [painel] }).catch(() => { })
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
                            .setColor('#246FE0')
                            .setTitle(`Classe: ${x.charAt(0).toUpperCase() + x.slice(1)}`)
                            .setDescription(`Use \`${prefix}help [comando]\` para obter mais informações.`)
                            .addFields(catts)

                        return msg.edit({ embeds: [combed], components: [painel] }).catch(() => { })
                    }
                }

            })

        }).catch(err => {
            Error(message, err)
            return message.reply(`${e.SaphireQ} | COMO ASSIM O HELP BUGOU????\nUsa \`${prefix}bug\` e reporta isso pelo amor de Deus ${e.SaphireCry}`).catch(err => {
                message.author.send(`${e.SaphireCry} | Aparentemente eu não tenho permissão pra enviar o help no canal ou algo está me impedindo.`).catch(() => { })
            })
        })

        function HelpWithArgs(x) {
            const command = client.commands.get(x.toLowerCase()) || client.commands.find((c) => c.aliases && c.aliases.includes(x.toLowerCase()))
            if (!command) { return message.reply(`${e.Deny} | Comando inválido! Use \`${prefix}help\` para todos os comandos.`) }

            const embed = new MessageEmbed()
                .setColor('#246FE0')
                .setTitle(`Detalhes do Comando: ${command.name ? `${command.name}` : "Sem nome definido."}`)
                .addField("Comando:", command.name ? `\`${prefix}${command.name}\`` : "Sem nome definido.", true)
                .addField("Atalhos:", command.aliases ? `\`${prefix}${command.aliases?.join(`\` \`${prefix}`)}\`` : "Sem atalhos definido.", true)
                .addField("Uso:", command.usage ? `\`${command.usage}\`` : `\`${prefix}${command.name}\``)
                .addField("Descrição:", command.description ? command.description : "Sem descrição definida.")
            return message.reply({ embeds: [embed] })
        }
    }
}