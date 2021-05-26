const Discord = require(`discord.js`);

const main = require(`../Krystal.js`)
const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

const globalStats = require(`../JSON/Stats/globalStats.json`)


module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let commandUsageArray = new Array(); let commandArray = new Array()
    for (x in globalStats[`Command Usage`]) {
        try {
        if (x == `total`) continue; 
        if (main.botCommands.get(x).info.developer) continue;
        commandUsageArray.push(globalStats[`Command Usage`][x])
        commandArray.push(x)
        } catch (e) {}
    }
    favouriteCommandUsage = await modules.maxInArray(commandUsageArray)
    favouriteCommand = commandArray[commandUsageArray.indexOf(favouriteCommandUsage)]

    let embed = new Discord.MessageEmbed()
        .setColor(`BLACK`)
        .setTitle(`Global Statistics`)
        .addField(`Creator`, `${modules.Rubix()} (${modules.Rubix().tag})`, true)
        .addField(`Servers`, bot.guilds.size, true)
        .addField(`Users`, bot.users.size, true)
        .addField(`Channels`, bot.channels.size, true)
        .addField(`Commands Used`, globalStats[`Command Usage`].total, true)
        .addField(`Most Used Command`, `${favouriteCommand.capitalize()} (${favouriteCommandUsage} uses)`, true)

        .addField("\u200B", "\u200B", true)
        .addField("\u200B", "\u200B", true)
        .addField("\u200B", "\u200B", true)

        .addField(`Lines of Code (Commands)`, globalStats.lineCount.commandFiles, true)
        .addField(`Lines of Code (Main bot)`, globalStats.lineCount.mainFiles, true)
        .addField(`Total Lines of Code`, globalStats.lineCount.total, true)
        .addField("\u200B", "\u200B", true)

    message.channel.send({embed})
}

module.exports.info = {
    name: `stats`,
    type: `info`,
    summary: `Displays global statistics for Krystal.`
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}