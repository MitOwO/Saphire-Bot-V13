const { e } = require('../../../database/emojis.json')

module.exports = {
    name: 'floresta',
    category: 'economy',
    emoji: '馃尣',
    usage: '<floresta>',
    description: 'Come莽o da Hist贸ria',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        const args0 = new MessageEmbed()
            .setColor('#3B692D') //verde
            .setTitle('馃尣 A Floresta Cammum 茅 um lugar misterioso!')
            .addField('Comandos da Floresta', '`' + prefix + 'floresta Cammum` Hist贸ria onde tudo come莽ou\n`' + prefix + 'buscar` Procure o Brown *(Leia a hist贸ria para entender)*\n`' + prefix + 'floresta continue` S贸 depois de pegar o Brown\n`' + prefix + 'floresta final` Parte final da hist贸ria')

        if (!args[0]) return message.reply({ embeds: [args0] })

        const FlorestaObj = {
            Cachorro: sdb.get(`Users.${message.author.id}.Slot.Cachorro`),
            Bola: sdb.get(`Users.${message.author.id}.Slot.Bola`),
            Remedio: sdb.get(`Users.${message.author.id}.Slot.Remedio`),
        }

        const { Cachorro, Bola, Remedio } = FlorestaObj

        const Cammum1 = new MessageEmbed()
            .setColor('#3B692D')
            .setTitle('馃尣 Floresta Cammum #1')
            .setDescription('A Floresta Cammum 茅 famosa no Reino Heslow, como um ponto turisco famoso, muitas pessoas viajam de muito longe, apenas para visita-la e isto tr谩s grandes riquezas para o Reino.\n \n     Em um certo dia ap贸s uma grande chuva, a Princesa Kaya estava brincando com seu cachorro Brown *(Ele recebeu este nome por causa da sua cor marrom.)* pr贸ximo a Floresta, quando ouviu um grito. Algu茅m gritou;\n \n- *Soccoro, algu茅m me ajude!!*\n \n     A Princesa para de correr imediatamente e olha para dentro da Floresta Cammum. A princ铆pio, Kaya pensou ter escutado algu茅m gritando aleat贸riamente, pois isso era comum no Reino ap贸s um dia de grande chuva. Ela d谩 de ombros e volta a correr atr谩s de Brown tentando pegar uma bolinha de sua boca. Novamente, ela ouve o mesmo grito;\n \n- *Soccoro, algu茅m me ajude!!*\n \n     Ela tem certeza do grito, n茫o 茅 algo de sua cabe莽a. Pensa Kaya; \n \n- *脡 um homem gritando, a voz 茅 rouca e grave, n茫o 茅 a voz do Papai...*\n \n     ')

        const Cammum2 = new MessageEmbed()
            .setColor('#3B692D')
            .setDescription('Kaya anda lentamente para a beira da floresta, com cuidado, pois seu pai, o Rei Vouwer Heslow havia ordenado a ela para n茫o entrar na Floresta, porque no centro dela, rege uma criatura hist贸rica, imortal, em sono eterno, capaz de destruir tudo o que ela ver.\n     Kaya pensava que era bobagem, coisa de pais colocando medo em seus filhos para protege-los, igual a hist贸ria do bicho-pap茫o. O homem grita novamente; \n \n - *Soccoro, algu茅m me ajude!!*\n \n     Kaya para, com medo. Ela estava pensando que era algum bandido tentando sequestra-la, como j谩 havia ocorrido 3 vezes. Mas ela se assusta, Brown, o cachorro dela sai correndo adentro da Floresta e se perde de vista. Kaya grita o nome do Brown em desespero. No sal茫o real, Kaya entra correndo esbarrando em um guarda na frente da porta principal atrapalhando os preparativos de sua festa de anivers谩rio de 10 anos. Kaya com lagrimas nos olhos pede ao Rei para enviar algu茅m em busca de Brown, o Rei sem hesitar, ordena para que enviem 2 tropas adentrar a Floresta em busca de Brown. Kaya j谩 n茫o ouve mais o homem gritando, muito menos os latidos de Brown. Voc锚 como um soldado do ex茅rcito do Rei, entra na floresta e acaba em problemas, se perdendo de sua tropa. Seu dever como soldado do Rei, 茅 achar Brown e traz锚-lo de volta para a Princesa Kaya.\n \nContinua...')
            .addField('Comando', '`' + prefix + 'buscar`')
            .setFooter(`Boa sorte Soldado ${message.author.username}!`)

        const Cammum3 = new MessageEmbed()
            .setColor('#3B692D')
            .setTitle('馃尣 Floresta Cammum #2')
            .setDescription('Ap贸s andar v谩rios dias dentro da Floresta Cammum, voc锚 finalmente encontrou o Cachorro Brown, da Princesa Kaya. A princ铆pio, ele quase fugiu, pois estava muito assustado. Mas depois de 5 ossos, ele ficou calmo e te seguiu obedientemente. Depois de quase 2 horas andando, voc锚 encontra um homem velho, sentado no p茅 de uma 谩rvore ofegante, voc锚 se aproxima calmamente e pergunta quem 茅 ele. Ele responde cansado e ofegante;\n \n*- Todos me conhecem como o Velho Welter, mas por favor... Encontre meus rem茅dios... Eu os perdi... Enquanto eu fugia...*\n \n Ache os rem茅dios do Velho Welter, para continuar a hist贸ria...')

        const CammumComRemediosDoVelhoWelter = new MessageEmbed()
            .setColor('#3B692D')
            .setTitle('馃尣 Floresta Cammum #3')
            .setDescription('Ap贸s andar v谩rios dias dentro da Floresta Cammum, voc锚 finalmente encontrou o Cachorro Brown, da Princesa Kaya. A princ铆pio, ele quase fugiu, pois estava muito assustado. Mas depois de 5 ossos, ele ficou calmo e te seguiu obedientemente. Depois de quase 2 horas andando, voc锚 encontra um homem velho, sentado no p茅 de uma 谩rvore ofegante, voc锚 se aproxima calmamente e pergunta quem 茅 ele. Ele responde cansado e ofegante;\n \n*- Todos me conhecem como o Velho Welter, mas por favor... Encontre meus rem茅dios... Eu os perdi... Enquanto eu fugia...*\n \n Ap贸s uma busca aos arredores, voc锚 encontra os rem茅dios do Velho Welter. Mas durante a busca, uma coisa n茫o saia da sua cabe莽a... *Do que ele fugia? De quem?*\n \nDe volta a 谩rvore, onde Welter estava sentado, voc锚 entrega os rem茅dios a ele, o Velho o toma sem pressa. Engole a seco, como se precisa-se daquilo para viver... Ele ainda cansado, se levante, coloca as m茫os tremulas em seus ombros, olha nos seus olhos e diz ofegante;\n \n*- O que espera? Vamos fugir deste lugar! N茫o quero passar mais nenhum segundo aqui, n茫o me resta muito tempo mes...*\n \nEle trava. O cachorro Brown est谩 latindo descontroladamente. Welter est谩 olhando fixamente para cima de voc锚, im贸vel.\n \nQuando voc锚 se vira, voc锚 n茫o acredita em seus olhos... 脡 um le茫o branco, n茫o um le茫o branco que todos conhecem, mas um de 6 metros de altura, um humano caberia dentro de sua juba sem esfor莽o algum.')

        const CammumFinal = new MessageEmbed()
            .setColor('#3B692D')
            .setTitle('馃尣 Floresta Cammum #4 Final')
            .setDescription('Em um ataque de medo e adrenalina, voc锚 se vira para correr, mas Velho Welter te segura pelo cotovelo. Impedindo sua fuga. Ele fala baixo;\n \n*- O que pensa que est谩s a fazer? Fique quieto!*\n \nVoc锚 se vira novamente para o le茫o e fica im贸vel, com medo. O le茫o anda lentamente em sua dire莽茫o e fixa o olhar no seu. Seu cora莽茫o bate acelerado como se estive prestes a explodir. O le茫o ruge. Seu corpo inteiro estremece e Brown para de latir imediatamente e se encolhe atr谩s de uma 谩rvore. O velho fala baixo novamente;\n \n*Irei correr em dire莽茫o contr谩ria do Reino, voc锚 pega o cachorro e parta em retirada.*\n \nAntes que voc锚 pudesse dizer algo, ele corre entre as pernas do le茫o, gritando para chamar sua aten莽茫o e como planejado, o le茫o o segue em sua ca莽a.\n \nVoc锚 j谩 est谩 calmo. Aterrorizado, mas calmo. Voc锚 faz uma contin锚ncia do ex茅rcito do Reino, em forma de respeito pelo seu sacrif铆cio, apara o cachorro em uma corda para evitar sua fuga e parte em retirada ao Reino, seguindo o plano do Velho Welter.\nEm sua chegada, 2 equipes estava adentrando a floresta em sua busca, pois voc锚 passou 12 dias e 11 noites sem enviar um sinal de vida, sozinho. A Princesa Kaya vem correndo em dire莽茫o de Brown, chorando de felicidade, Kaya o abra莽a e Brown solta um ganido de dor, sua pata traseira estava quebrada e voc锚 n茫o tinha percebido.')

        const CammumFinal2 = new MessageEmbed()
            .setColor('#3B692D')
            .setDescription('A Rainha, Elena Heslow, ordena a 2 guardas levar Brown para o centro veterin谩rio imediatamente. A Princesa Kaya te abra莽a e diz obrigada chorando em seu ouvido e parte em retirada, correndo em dire莽茫o aos 2 soldados que carregara Brown seguindo as ordens da Rainha. Voc锚 cai de joelhos e se v锚 no ch茫o. Voc锚 est谩 exausto e tamb茅m n茫o tinha percebido. O pico de adrenalina e o pavor do le茫o branco te fez esquecer de tudo e o extinto de sobreviv锚ncia prevaleceu em seu corpo. O Rei se abaixa sobre um joelho com uma m茫o no seu ombro direito e diz;\n \n*Parab茅ns por teus feitos soldado! Voc锚 mostrou bravura, coragem e lealdade para teus colegas e para mim. Como forma de recompensa, lhe darei a Medalha Cammum, a medalha mais valiosa do Reino Heslow. Por ser um item m谩gico, voc锚 deve dizer os quatros n煤meros que rege teu nome e teu c贸digo que te torna 煤nico no mundo e a Medalha Cammum 谩 de aparecer para ti.*\n \nA Princesa Kaya chega correndo com um filhote de cachorro em seus bra莽os e diz;\n \n*Soldado, muito obrigada por salvar o Brown, a parceira dele, a Mira, deu luz a 5 lindos filhotes, por favor, fique com este, 茅 tudo o que posso lhe dar.*\n \nVoc锚 levanta se curvando a fam铆lia real presente em sua frente. Cansado, agradece as recompensas e pega o filhote em seus bra莽os. Tr锚s dias depois, voc锚 se lembra do Velho Welter ao ver a lua cheia no c茅u e pergunta a ele dando um riso, como se estivesse lembrando de algo feliz;\n \n*Por que voc锚 estava com tanta pressa Velho?*')
            .addField('Comandos Desbloqueados', '`' + prefix + 'medalha` | `' + prefix + 'dogname`')

        if (['cammum', 'hist贸ria'].includes(args[0]?.toLowerCase())) return message.reply({ embeds: [Cammum1, Cammum2] })

        if (['continue', 'continua'].includes(args[0]?.toLowerCase())) {
            if (!Cachorro) { return message.reply(`${e.Deny} | Voc锚 ainda n茫o achou o Brown! \`${prefix}floresta cammum\``) }
            if (Cachorro && !Remedio) return message.reply({ embeds: [Cammum3] })
            if (Cachorro && Remedio && !Bola) return message.reply({ content: `${e.Deny} | Voc锚 ainda n茫o achou a bolinha do Brown.`, embeds: [CammumComRemediosDoVelhoWelter] })
            if (Cachorro && Bola && Remedio) return message.reply({ content: `${e.Check} | Voc锚 j谩 completou est谩 miss茫o! Use \`${prefix}floresta final\``, embeds: [CammumComRemediosDoVelhoWelter] })
        }

        if (['final'].includes(args[0]?.toLowerCase())) {
            const Medalha = sdb.get(`Users.${message.author.id}.Slot.Medalha.Medalha`) || undefined
            Medalha?.Acess ? '' : sdb.set(`Users.${message.author.id}.Slot.Medalha.Acess`, true)
            Medalha?.Medalha ? sdb.set(`Users.${message.author.id}.Slot.Medalha.Acess`, false) : ''
            let FinalPart = Cachorro && Bola && Remedio
            if (!FinalPart) return message.reply(`${e.Deny} | Voc锚 precisa resgatar o Cachorro Brown, achar a bolinha dele e ajudar o Velho Welter! \`${prefix}floresta continue\``)
            if (FinalPart) return message.reply({ embeds: [CammumFinal, CammumFinal2] })

        } else {
            return message.reply(`${e.Info} | Hey, usa \`${prefix}floresta\` pra voc锚 ver os comandos.`)
        }
    }
}