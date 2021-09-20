
// const { e } = require('../../../Routes/emojis.json')

// module.exports = {
//     name: 'entrar',
//     aliases: ['selecionar', 'seletor', 'escolher', 'Team'],
//     category: 'servidor',
//     UserPermissions: '',
//     ClientPermissions: 'MANAGE_ROLES',
//     emoji: '@',
//     usage: '<entrar>',
//     description: 'Pegue um cargo aleatório',

//     run: async (client, message, args, prefix, db, MessageEmbed, request) => {

//         let Cargo1 = db.get(`Servers.${message.guild.id}.Roles.1`)
//         let Cargo2 = db.get(`Servers.${message.guild.id}.Roles.2`)
//         let Cargo3 = db.get(`Servers.${message.guild.id}.Roles.3`)
//         let Cargo4 = db.get(`Servers.${message.guild.id}.Roles.4`)
//         let Cargo5 = db.get(`Servers.${message.guild.id}.Roles.5`)
//         // let Check = message.guild.roles.cache.get('')

//         const Teams = new MessageEmbed()
//             .setColor('BLUE')
//             .setTitle('Receba um cargo aleatório')
//             .setDescription(`${e.Info} | Receba um cargo aleatório configurado pela Staff do servidor`)
//             .addField(`Comando`, `\`${prefix}entrar\``, true)
//             .addField(`${e.On} Configure`, `\`${prefix}escolher 1 @cargo\`\n\`${prefix}escolher 2 @cargo\`\n\`${prefix}escolher 3 @cargo\`\n\`${prefix}escolher 4 @cargo\`\n\`${prefix}escolher 5 @cargo\``, true)

//         function SetRole1() {

//         }
        
//         function SetRole2() {
            
//         }

        
//         function SetRole3() {
            
//         }

//     }
// }