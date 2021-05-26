const Discord = require(`discord.js`);

const main = require(`../Krystal.js`)
const settings = require(`../config.json`)
const modules = require(settings.modulesPath),
globalStats = require(`../JSON/Stats/globalStats.json`),
fs = require(`fs`)


module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let turns = bot.channels.cache.get(`709535066308477018`),
    countries = {
        // Country Role        Country turn channel
        //"723493007445458944": "723502073886408744", // Britain
        "723493424342368257": "723502098926272552", // France
        "723495242463969344": "723502144669483083", // Germany
        "723495487549734984": "723502164382842880", // Italy
        "723495859613859840": "723502198654500884", // Turkey
        "723496260962877530": "723502216907849799", // USSR
    },
    s = "",
    diplomacyGuild = bot.guilds.cache.get(`709533787289026703`),
    submitted = 0,
    turnIDs = {}

    globalStats.countries = countries

    Object.keys(countries).forEach(x => {
        s += `<@&${x}> `
    })

    s += `\nA new turn is beginning! Countries may now send their turns into their relevant turns channel and once all countries have submitted, the orders will be shown here and publicly adjudicated.\n\n**Please plan and check your orders before submitting. You can edit the message once you submit it, however, once every country has sent their orders, there's not going back!**\nTurns may be written in plain English if you're not comfortable with the abbreviations - it's better to be clear than mess up with the abbreviation of something!\n\n`

    turnsMsg = await turns.send(s + `\`${submitted}/${Object.keys(countries).length} Countries have submitted orders.\``);
    globalStats.turnsMsg = turnsMsg.id;
    fs.writeFileSync(`./JSON/Stats/globalStats.json`, JSON.stringify(globalStats, null, 4))

    Object.values(countries).forEach(async x => {
        let c = bot.channels.cache.get(x),
        country = Object.keys(countries).find(y => countries[y] == x),
        role = diplomacyGuild.roles.get(country)
        await c.send(`${role}\nA turn has begun! Please read ${turns} and submit orders here once you're ready.`)
        console.log(`Making collector in #${c.name}. .`)
        try {
        collector = await c.createMessageCollector(m => m.author.id == role.members.first().id, {max: 1});
        collector.on('collect', async m => {
            turnIDs[m.channel.id] = m.id
            submitted ++
            globalStats.turnIDs = turnIDs;

            await turnsMsg.edit(s + `\`${submitted}/${Object.keys(countries).length} Countries have submitted orders.\``)
            bot.users.cache.get(`97238312355364864`).send(`${m.channel.parent.name} Submitted orders.`)
            if (submitted == Object.keys(countries).length) {
                await m.channel.send(`Congratulations, you were the last country to submit orders. They have been submitted.`)
            }
            else {
                await m.channel.send(`Epic - you can edit those orders by just editing the message you sent, but other than that your orders are submitted!\n**Please don't send anymore messages to this channel until the next turn.**`)
            }
        })
        } catch (e) {console.error(e)}
    })
}

module.exports.info = {
    name: `start`,
    developer: true,
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}