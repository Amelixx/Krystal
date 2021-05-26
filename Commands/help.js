const Discord = require(`discord.js`)
const modules = require(`../modules.js`)

const main = require(`../Krystal.js`)

const online = `<:greendot:473129691625029633>`
const members = `<:purpledot:473129722088390666>`

module.exports = {
    run: async (bot, message, args, content, prefix) => {
        let embed = new Discord.MessageEmbed(),

        // categories and stuff
        categories = {
            info: {
                displayName: "Information",
                emote: `ℹ️`,
                summary: `Links, stats`,
                desc: `Information commands provide general data about the bot, such as statistics, links, this help command as well as other useful stuff.`
            },
            money: {
                displayName: `Economy`,
                emote: `💰`,
                summary: `balance, leaderboards`,
                desc: "Economy in Krystal that I never finished"
            },
            krystal: {
                emote: `💠`,
                summary: `leaderboards, apply`,
                desc: "Commands custom made for [Krystal](https://discord.gg/AFN56Cn). Such as levels and things."
            },
            fun: {
                emote: `🕹️`,
                summary: `Games and fun`,
                desc: "There's not much to put here except from random redundant games and stuff - this isn't the main part of the bot, but some of these things can be fun anyway <a:thonkconga:452161390979842072>"
            },
            admin: {
                emote: `🔰`,
                summary: `Staff Commands`,
                desc: `Mainly for the mods and select people in Krystal.`
            }
        },
        msg = ``
        embed.setColor(`5d10e9`)
        embed.setFooter(`Colour used for this embed - 5d10e9`)
        
        // For each category, get all the commands in that category, get how many there are
        for (let category in categories) {
            categories[category].commands = main.commands.filter(x => x.info.type == category)
        }

        // Check if the user is asking for help on a particular category
        let validCategories = Object.keys(categories).filter(x => x.startsWith(args[1]))
        if (validCategories.length == 1) {
            let category = validCategories[0], x = categories[category], desc = `${x.desc}\n\n`
            x.commands.forEach(c => {
                let usage = ""
                if (c.info.usage) usage = `\`${prefix}${c.info.name} ${c.info.usage}\`` 
                desc += `**${prefix}${c.info.name}**\n${usage}\n${c.info.summary}\n\n`
            })
            embed.setTitle(`${bot.user.username} - Help For '${modules.capitalise(category)}' Category ${x.emote}`)
            embed.setDescription(desc)
            message.channel.send({embed})
        }
        else if (content) msg = `I didn't find a category matching '${content}'. Have the default help command instead.` 
        else {
            // define description - explain how the help command works
            description = ``

            for (let category in categories) {
                let x = categories[category], name = modules.capitalise(category)
                if (x.displayName) name = x.displayName
                embed.addField(`${x.emote}${name}`, `*${prefix}help ${category}*\n**${x.commands.size} commands**\n${x.summary}`, true)
            }

            embed.setTitle(`${bot.user.username} - Help Menu`)
            embed.setDescription(description)
            embed.addField("\u200B", "\u200B", true)
            // embed.setThumbnail("https://cdn.discordapp.com/attachments/462595212783648768/529696718497775617/iu.png")

            message.channel.send(msg, {embed})
        }
    },
    info: {
        name: `help`,
        type: `info`,
        usage: `(category OR command)`,
        summary: `Useful links such as our support server.`
    }
}