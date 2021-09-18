const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const { config } = require('../../Routes/config.json')

module.exports = async (client) => {

    const slashCommands = await globPromise(`${process.cwd()}/SlashCommands/*/*.js`);
    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);
        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {
        try {
            await client.guilds.cache.get(config.guildId).commands.set(arrayOfSlashCommands);
            client.guilds.cache.get(config.guildId).commands.set(arrayOfSlashCommands);
        } catch (err) { return }
    });
    console.log('Slash Commands | OK!')
};