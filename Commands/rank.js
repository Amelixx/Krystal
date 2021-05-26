const Discord = require(`discord.js`)

const settings = require(`../config.json`)
const modules = require(`../modules.js`)

const userinfo = require(`../JSON/userinfo.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!bot.guilds.cache.get("451799907817488406").member(message.author)) return message.channel.send(`You aren't on **Krystal**, and I'm kiiinda made specifically for that server..\nYou can always join if you'd like.\nhttps://discord.gg/AFN56Cn`)
    else if (!coreMessage) member = bot.guilds.cache.get("451799907817488406").member(message.author)
    else member = await modules.fetchMember(bot.guilds.cache.get("451799907817488406"), coreMessage)
    if (Array.isArray(member)) {
        let embed = new Discord.MessageEmbed()
            .setColor([221, 46, 68])
            .setTitle(`Too many members found in that search.`)
            .setDescription(`Members found:\n${member}`)
        return message.channel.send({embed})
    }
    else if (coreMessage.toLowerCase() == "greg") member = message.guild.members.get(`257482333278437377`)
    else if (coreMessage.toLowerCase().includes("isabel")) member = message.guild.members.get(`466706137614647307`)
    else if (!member) return message.channel.send(`Couldn't find any members matching '${coreMessage}'`)
    
    if (member.user.bot) footer = `Do you own this bot and want to customise the XP bar? Ask Rubix!`
    else footer = `Want to customise the look of your XP bars? Check out ${prefix}customise xpbar!`

    let info = userinfo[member.id]

    if (info.fixedLevel) nextLevel = ""
    else nextLevel = `**Level ${info.level + 1}**`

    let percentage = info.xp / info.xpCap * 100
    let monthlyPercentage = info.monthlyXp / info.monthlyXpCap * 100

    if (info.rankPercentage) percentageDisplay = info.rankPercentage
    else percentageDisplay = Math.round(percentage)

    let monthlyPercentageDisplay = Math.round(monthlyPercentage)

    let progressBar = modules.createXPbar(member)
    let monthlyProgressBar = modules.createXPbar(member, true)
    newLine = ""
    if ([`233301442738257920`, `257482333278437377`].includes(member.id)) newLine = "\n"

    let embed = new Discord.MessageEmbed()
        .setColor(`#5d10e9`)
        .setAuthor(`Rank - ${member.displayName}`, member.user.displayAvatarURL)
        .setDescription(`**Level ${info.level}**\n${progressBar}\n**${info.xp} / ${info.xpCap} (${percentageDisplay}%)**\n\n` +
                        `__**Monthly Levels**__\n**Level ${info.monthlyLevel}**\n${monthlyProgressBar}\n**${info.monthlyXp} / ${info.monthlyXpCap} (${monthlyPercentageDisplay}%)**`)
        .setFooter(footer)
    message.channel.send({embed})
}

module.exports.info = {
    name: `rank`,
    type: `krystal`,
    summary: `Displays a member's level and progess to the next level.`,
    inKrystal: true
}