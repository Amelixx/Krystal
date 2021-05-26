const Discord = require(`discord.js`)

const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

const userinfo = require(`../JSON/userinfo.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let amount = args[1]
    if (isNaN(Number(amount)) || !args[1]) amount = 10

    let levels = [], xp = [], userIDs = []

    for (let x in userinfo) {
        levels.push(userinfo[x].level)
        userIDs.push(x)
        xp.push(userinfo[x].xp)
    }

    let entries = modules.createLevelsBoard(levels, userIDs, xp, amount, false, true)

    if (entries.join("\n\n").length > 2048) return message.channel.send(`That number is too high. I can't display that many entries.`)
    let embed = new Discord.MessageEmbed()
        .setColor(`5d10e9`)
        .setTitle(`Bot Leaderboard - Krystal Levels`)
        .setDescription(entries.join("\n\n"))
    if (!args[1]) embed.setFooter(`You can see more entries by specifying an amount of bots to show with o!levels (bot count).`)
    message.channel.send({embed})
}

module.exports.info = {
    name: `botlevels`,
    type: `krystal`,
    aliases: [`botlb`, `botleaderboard`, `blevels`],
    summary: `Shows a leaderboard of Krystal levels, as many entries as the parameter.`,
    usage: `[entries]`,
    bypassRestrictions: true
}

onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
}