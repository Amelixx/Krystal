const Discord = require(`discord.js`);

const main = require(`../Krystal.js`)
const settings = require(`../config.json`)
const modules = require(settings.modulesPath),
globalStats = require(`../JSON/Stats/globalStats.json`)


module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let s = "",
    turnIDs = globalStats.turnIDs,
    countries = globalStats.countries,
    diplomacyGuild = bot.guilds.cache.get(`709533787289026703`),
    turns = bot.channels.cache.get(`709535066308477018`),
    turnsMsg = await turns.messages.fetch(globalStats.turnsMsg);
    for (let id in countries) {
        let role = diplomacyGuild.roles.get(id),
        c = bot.channels.cache.get(countries[id])
        try {
        turn = await c.messages.fetch(turnIDs[c.id])
        } catch (e) { turn = {content: "(No moves submitted)"}}

        s += `${role}\n${turn.content}\n\n`
    }
    turnsMsg.edit(`**All orders have been submitted.**\n\n${s}`)
    turns.send(`<@!97238312355364864>`)
}

module.exports.info = {
    name: `finish`,
    developer: true,
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}