const { Wallpapers } = require('../../../Routes/Images/wallpaperanime.json')
const { e } = require('../../../Routes/emojis.json')
const { N } = require('../../../Routes/nomes.json')
const { f } = require('../../../Routes/frases.json')
const { stripIndent } = require('common-tags')
const Error = require('../../../Routes/functions/errors')

module.exports = {
    name: 'wallpaper',
    aliases: ['wpp', 'pdp', 'wall', 'w'],
    category: 'animes',
    UserPermissions: '',
    ClientPermissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES', 'EMBED_LINKS'],
    emoji: '🖥️',
    usage: '<wallpaper>',
    description: `Wallpaper de Animes | Imagens por: ${N.Gowther}`,

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

        const WallPapersIndents = stripIndent`
          ${prefix}w Charlotte         ${prefix}w Kanojo
          ${prefix}w SwordArtOnline    ${prefix}w BokuNoHero
          ${prefix}w KonoSuba          ${prefix}w SatsurikunoTenshi
          ${prefix}w YoujoSenki        ${prefix}w HajimetenoGal
          ${prefix}w Takagi-san        ${prefix}w IsekaiQuartet
          ${prefix}w Naruto            ${prefix}w Given
          ${prefix}w ZeroTwo           ${prefix}w Yakusoku
          ${prefix}w HighSchoolDxD     ${prefix}w Nagatoro
          ${prefix}w Kimetsu           ${prefix}w Ishuzoku
          ${prefix}w Overlord          ${prefix}w Hanako
          ${prefix}w ReZero            ${prefix}w UrasekaiPicnic
          ${prefix}w Chuunibyou        ${prefix}w SoloLeveling
          ${prefix}w Umaru             ${prefix}w OnePiece
          ${prefix}w JujutsuKaisen     ${prefix}w Horimiya
          ${prefix}w Bleach            ${prefix}w AkameGaKill
          ${prefix}w Berserk           ${prefix}w Blend-s
          ${prefix}w EroManga          ${prefix}w FairyTail 
          ${prefix}w GoblinSlayer      ${prefix}w Haikyuu 
          ${prefix}w Hyouka            ${prefix}w ImoutoSaeIreba
          ${prefix}w InfiniteStratos   ${prefix}w Inuyasha
          ${prefix}w Kakegurui         ${prefix}w MaidDragon
          ${prefix}w Kuroko            ${prefix}w NoGameNoLife
          ${prefix}w GoToubun          ${prefix}w ReCreators
          ${prefix}w RWBY              ${prefix}w ShingekiNoKyojin
          ${prefix}w ShokugekiNoSouma  ${prefix}w HunterxHunter
       `

        const categorias = new MessageEmbed()
            .setColor('#246FE0')
            .addField(`${e.Warn} | Atenção!`, `\`\`\`txt\n1. Alguns wallpapers contém spoilers, tome cuidado!\n2. Não use espaços no nome do anime\`\`\``)
            .addField(`${e.Download} | Quer algum anime na lista?`, `\`\`\`${prefix}sugest Coloca wallpaper do anime XXX\`\`\``)
            .addField(`${e.Check} | Animes Disponíveis`, `\`\`\`txt\n${WallPapersIndents}\`\`\``)
            .setFooter(`Package: 2875 Wallpapers | ${prefix}wallpaper credits | ${prefix}servers`)

        if (['créditos', 'credits', 'creditos'].includes(args[0])) {
            const CreditsEmbed = new MessageEmbed()
                .setColor('#246FE0')
                .setDescription(`${e.Info} | Abaixo, estão os créditos de todas as pessoas e o que elas fizeram na construção do comando \`${prefix}wallpaper\``)
                .addField('🤝 Créditos', `\`${N.Rody}\` - Idealizador, implementação dos Wallpapers ao banco de dados e código fonte da ${client.user.username}\n \n\`${N.Gowther}\` - Fornecedor de 100% dos Wallpapers, Organização de Links, dados e review técnico\n \n\`${N.Makol}\` - Review adição de Links e sequência de ordem`)
            return message.reply({ embeds: [CreditsEmbed] })
        }

        if (!args[0]) return message.reply({ embeds: [categorias] })
        if (args[1]) return message.reply(`${e.Deny} | Mencione o anime exatamente como está escrito no comando \`${prefix}wallpaper\``)

        function WallPapers(Category) {

            let wallpaper = Category[Math.floor(Math.random() * Category.length)]
            const WallPaperEmbed = new MessageEmbed()
                .setColor('#246FE0')
                .setDescription(`${e.Download} | [Baixar](${wallpaper}) wallpaper em qualidade original`)
                .setImage(wallpaper)

            return message.reply({ embeds: [WallPaperEmbed] }).then(msg => {
                db.set(`Request.${message.author.id}`, `${msg.url}`)
                msg.react('🔄').catch(() => { }) // 1º Embed
                msg.react('❌').catch(() => { })

                let TradeFilter = (reaction, user) => { return reaction.emoji.name === '🔄' && user.id === message.author.id }; let TradeWallpaper = msg.createReactionCollector({ filter: TradeFilter, time: 30000, errors: ['time'] })

                TradeWallpaper.on('collect', (reaction, user) => {

                    reaction.users.remove(message.author.id)
                    let WallTrade = Category[Math.floor(Math.random() * Category.length)]
                    WallPaperEmbed.setDescription(`${e.Download} | [Baixar](${WallTrade}) wallpaper em qualidade original`).setImage(WallTrade)
                    msg.edit({ embeds: [WallPaperEmbed] }).catch(() => { })

                })
                TradeWallpaper.on('end', (reaction, user) => { db.delete(`Request.${message.author.id}`); msg.reactions.removeAll().catch(() => { }); WallPaperEmbed.setColor('RED').setFooter(`Sessão expirada | Wallpapers por: ${N.Gowther}`); msg.edit({ embeds: [WallPaperEmbed] }).catch(() => { }) })

                let CancelFilter = (reaction, user) => { return reaction.emoji.name === '❌' && user.id === message.author.id }; let CancelSession = msg.createReactionCollector({ filter: CancelFilter, max: 1, time: 30000, errors: ['time', 'max'] })
                CancelSession.on('collect', (reaction, user) => { msg.reactions.removeAll().catch(() => { }); WallPaperEmbed.setColor('RED').setFooter(`Sessão expirada | Wallpapers por: ${N.Gowther}`); msg.edit({ embeds: [WallPaperEmbed] }).catch(() => { }) })
                CancelSession.on('end', (reaction, user) => { db.delete(`Request.${message.author.id}`); msg.reactions.removeAll().catch(() => { }); WallPaperEmbed.setColor('RED').setFooter(`Sessão expirada | Wallpapers por: ${N.Gowther}`); msg.edit({ embeds: [WallPaperEmbed] }).catch(() => { }) })

            }).catch(err => {
                Error(message, err)
                db.delete(`Request.${message.author.id}`)
                return message.reply(`${e.Warn} | Houve um erro ao executar este comando\n\`${err}\``)
            })
        }

        let pedido = args[0]?.toLowerCase()
        switch (pedido) {
            case 'shokugekinosouma':
                WallPapers(Wallpapers.ShokugekiNoSouma);
                break;
            case 'shingekinokyojin':
                WallPapers(Wallpapers.ShingekiNoKyojin);
                break;
            case 'rwby':
                WallPapers(Wallpapers.RWBY);
                break;
            case 'recreators':
                WallPapers(Wallpapers.ReCreators);
                break;
            case 'kuroko':
                WallPapers(Wallpapers.Kuroko);
                break;
            case 'gotoubun':
                WallPapers(Wallpapers.GoToubun);
                break;
            case 'nogamenolife':
                WallPapers(Wallpapers.NoGameNoLife);
                break;
            case 'maiddragon':
                WallPapers(Wallpapers.MaidDragon);
                break;
            case 'kakegurui':
                WallPapers(Wallpapers.Kakegurui);
                break;
            case 'inuyasha':
                WallPapers(Wallpapers.Inuyasha);
                break;
            case 'infinitestratos':
                WallPapers(Wallpapers.InfiniteStratos);
                break;
            case "konosuba":
                WallPapers(Wallpapers.Konosuba);
                break;
            case 'sword':
            case 'swordartonline':
            case 'sao':
                WallPapers(Wallpapers.SwordArtOnline);
                break;
            case 'youjosenki':
            case 'youjo':
                WallPapers(Wallpapers.YoujoSenki);
                break;
            case 'takagi-san':
            case 'takagi':
                WallPapers(Wallpapers.Takagi);
                break;
            case 'naruto':
            case 'shipudden':
                WallPapers(Wallpapers.Naruto);
                break;
            case 'zerotwo':
            case 'darling':
            case 'zt':
            case 'zerotwo':
            case 'darlinginthefranxxx':
                WallPapers(Wallpapers.ZeroTwo);
                break;
            case 'highschooldxd':
            case 'high school':
            case 'hs':
            case 'dxd':
                WallPapers(Wallpapers.HighSchoolDxD);
                break;
            case 'kimetsunoyaiba':
            case 'kimetsu':
            case 'demonslayer':
                WallPapers(Wallpapers.Kimetsu);
                break;
            case 'overlord':
                WallPapers(Wallpapers.Overlord);
                break;
            case 'rezero':
                WallPapers(Wallpapers.ReZero);
                break;
            case 'chuunibyou':
                WallPapers(Wallpapers.Chuunibyou);
                break;
            case 'umaru':
                WallPapers(Wallpapers.Umaru);
                break;
            case 'kanojo':
                WallPapers(Wallpapers.Kanojo);
                break;
            case 'onepiece':
            case 'op':
                WallPapers(Wallpapers.OnePiece);
                break;
            case 'jujutsukaisen':
            case 'jujutsu':
            case 'jk':
            case 'kaisen':
                WallPapers(Wallpapers.JujutsuKaisen);
                break;
            case 'charlotte':
            case 'charlote':
                WallPapers(Wallpapers.Charlotte);
                break;
            case 'bokunohero':
            case 'bkh':
                WallPapers(Wallpapers.BokuNoHero);
                break;
            case 'satsurikunotenshi':
            case 'st':
                WallPapers(Wallpapers.SatsurikunoTenshi);
                break;
            case 'hajimetenogal':
                WallPapers(Wallpapers.HajimetenoGal)
                break;
            case 'isekaiquartet':
                WallPapers(Wallpapers.IsekaiQuartet);
                break;
            case 'given':
                WallPapers(Wallpapers.Given);
                break;
            case 'hunterxhunter':
            case 'hxh':
                WallPapers(Wallpapers.HunterxHunter);
                break;
            case 'yakusoku':
            case 'thepromisedneverland':
            case 'promised':
            case 'neverland':
                WallPapers(Wallpapers.Yakusoku);
                break;
            case 'nagatoro':
                WallPapers(Wallpapers.Nagatoro);
                break;
            case 'ishuzoku':
                if (!message.channel.nsfw) {
                    return message.reply(`${e.Deny} | O canal não é de categoria NSFW. Para fechar o canal para maiores de 18 anos, use o comando \`${prefix}nsfw\``)
                } else {
                    WallPapers(Wallpapers.Ishuzoku);
                }
                break;
            case 'hanako':
                WallPapers(Wallpapers.Hanako);
                break;
            case 'urasekaipicnic':
                WallPapers(Wallpapers.UrasekaiPicnic);
                break;
            case 'sololeveling':
                WallPapers(Wallpapers.SoloLeveling);
                break;
            case 'horimiya':
                WallPapers(Wallpapers.Horimiya);
                break;
            case 'bleach':
                WallPapers(Wallpapers.Bleach);
                break;
            case 'akamegakill':
            case 'akame':
                WallPapers(Wallpapers.AkameGaKill);
                break;
            case 'berserk':
                WallPapers(Wallpapers.Berserk);
                break;
            case 'blend':
            case 'blend-s':
                WallPapers(Wallpapers['Blend-s']);
                break;
            case 'eromanga':
            case 'eromanga-sensei':
                WallPapers(Wallpapers.EroManga);
                break;
            case 'fairytail':
                WallPapers(Wallpapers.FairyTail);
                break;
            case 'goblinslayer':
                WallPapers(Wallpapers.GoblinSlayer);
                break;
            case 'haikyuu':
                WallPapers(Wallpapers.Haikyuu);
                break;
            case 'hyouka':
                WallPapers(Wallpapers.Hyouka);
                break;
            case 'imoutosaeireba':
                WallPapers(Wallpapers.ImoutoSaeIreba);
                break;
            default:
                message.reply(`${e.Deny} | Escreva o nome de acordo a tabela do comando \`${prefix}wallpaper\``)
        }
    }
}