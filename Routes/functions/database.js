// simpl.db file: base.json
const { Database } = require("simpl.db")
const sdb = new Database()

// quick.db file: json.sqlite
const db = require('quick.db')

// ark.db file: ../file.json | Database Json
const Ark = require("ark.db")
const BgLevel = new Ark.Database("../../database/levelwallpapers.json")
const BgWall = new Ark.Database("../../database/wallpaperanime.json")
const lotery = new Ark.Database("../../database/loteria.json")
const conf = new Ark.Database("../../database/config.json")
const emojis = new Ark.Database("../../database/emojis.json")
const nomes = new Ark.Database("../../database/nomes.json")
const CommandsLog = new Ark.Database("../../database/logcommands.json")

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

module.exports = { sdb, db, BgLevel, BgWall, conf, emojis, nomes, lotery, CommandsLog, DatabaseObj }


