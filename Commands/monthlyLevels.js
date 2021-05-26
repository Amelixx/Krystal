const Discord = require(`discord.js`)
const fs = require(`fs`);
const chalk = require(`chalk`)

const settings = require(`../config.json`)
const modules = require(settings.modulesPath)
const main = require(`../Krystal.js`)

const userinfo = require(`../JSON/userinfo.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let amount = args[1]
    if (isNaN(Number(amount)) || !args[1]) amount = 10

    let levels = [], xp = [], userIDs = []

    for (let x in userinfo) {
        levels.push(userinfo[x].monthlyLevel)
        userIDs.push(x)
        xp.push(userinfo[x].monthlyXp)
    }

    let entries = modules.createLevelsBoard(levels, userIDs, xp, amount, true)

    if (entries.join("\n\n").length > 2048) return message.channel.send(`That number is too high. I can't display that many entries.`)
    let embed = new Discord.MessageEmbed()
        .setColor(`5d10e9`)
        .setTitle(`Leaderboard - Monthly Krystal Levels - ${modules.numberToMonth(new Date().getMonth())}`)
        .setDescription(entries.join("\n\n"))
    if (!args[1]) embed.setFooter(`You can see more entries by specifying an amount of users to show with o!mlb (user count).`)
    message.channel.send({embed})
}

module.exports.info = {
    name: `monthlylevels`,
    type: `krystal`,
    aliases: [`monthly`, `monthlylb`, `monthlyleaderboard`, `mlb`],
    summary: `Shows a leaderboard of the monthly Krystal levels, as many entries as the parameter.`,
    usage: `[entries]`
}

onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
}