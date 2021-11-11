// simpl.db file: base.json
const Simpl = require("simpl.db")
const sdb = new Simpl.Database()

// quick.db file: json.sqlite
const db = require('quick.db')

// ark.db file: ../file.json | Database Json
const { Database } = require("ark.db")
const BgLevel = new Database("../../database/levelwallpapers.json")
const BgWall = new Database("../../database/wallpaperanime.json")
const lotery = new Database("../../database/loteria.json")
const conf = new Database("../../database/config.json")
const emojis = new Database("../../database/emojis.json")
const nomes = new Database("../../database/nomes.json")
const CommandsLog = new Database("../../database/logcommands.json")
const ServerDb = new Database("../../ServerDatabase.json")

const DatabaseObj = {
    LevelWallpapers: BgLevel.get('LevelWallpapers'),
    Wallpapers: BgWall.get('Wallpapers'),
    Loteria: lotery.get('Loteria'),
    config: conf.get('config'),
    e: emojis.get('e'),
    N: nomes.get('N'),
    db: db,
    sdb: sdb,
}

module.exports = { sdb, db, BgLevel, BgWall, conf, emojis, nomes, lotery, CommandsLog, DatabaseObj, ServerDb }