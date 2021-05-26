const Discord = require(`discord.js`);
const fs = require(`fs`)

const userinfo = require(`../JSON/userinfo.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!args[1]) return message.channel.send(`**Invalid usage.**\n${this.info.help}`)

    let x, i;

    switch(args[1].toLowerCase()) {
        case "xpbar":
            if (!args[2]) return message.channel.send(`Enter either \`filled\` or \`unfilled\` to select an ASCII character for each part of the xp bar.\nAlternatively, use \`reset\` to change the XP bar back to default.`)
            let info = userinfo[message.author.id]
            if (args[2].toLowerCase() == `filled`) {
                if (!args[3]) return message.channel.send(`Enter a character for the "filled" part of your xp bar.`)
                else if (args[3].length != 1) return message.channel.send(`Please only enter characters with only one letter.`)

                if (!info.xpBar) userinfo[message.author.id].xpBar = {filled: args[3]}
                else userinfo[message.author.id].xpBar.filled = args[3]
                fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })

                message.channel.send(`Your 'filled' XP bar character has been set to \`${args[3]}\`.`)
            }
            else if (args[2].toLowerCase() == `unfilled`) {
                if (!args[3]) return message.channel.send(`Enter a character for the "unfilled" part of your xp bar.`)
                else if (args[3].length != 1) return message.channel.send(`Please only enter characters with only one letter.`)

                if (!info.xpBar) userinfo[message.author.id].xpBar = {unfilled: args[3]}
                else userinfo[message.author.id].xpBar.unfilled = args[3]
                fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })

                message.channel.send(`Your 'unfilled' XP bar character has been set to \`${args[3]}\`.`)
            }
            else if (args[2].toLowerCase() == `reset`) {
                if (info.xpBar) delete userinfo[message.author.id].xpBar
                fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })
                message.channel.send(`Reset your XP bar to default.`)
            }
            break;

        case "levelupmessages": case "monthlylevelupmessages":
            if (!args[2]) return message.channel.send(`Enter either 'on' or 'off' to select whether you want level up messages to send or not.`)
            switch(args[2]) {
                case "on": 
                    if (args[1].toLowerCase() == "monthlylevelupmessages") {
                        userinfo[message.author.id].sendMonthlyLevelUp = true
                        message.channel.send(`I'll send you **monthly** level up messages from now on.`)
                    }
                    else {
                        userinfo[message.author.id].sendLevelUp = true
                        message.channel.send(`I'll send you level up messages from now on.`)
                    }
                    break;
                case "off": 
                    if (args[1].toLowerCase() == "monthlylevelupmessages") {
                        userinfo[message.author.id].sendMonthlyLevelUp = false
                        message.channel.send(`I'll stop sending you **monthly** level up messages.`)
                    }
                    else {
                        userinfo[message.author.id].sendLevelUp = false
                        message.channel.send(`I'll stop sending you level up messages.\n(You will still gain levels, I just won't DM you when it happens)`)
                        break;
                    }
            }
            fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })
            break;

        case "countingmessages": case "counting":
            let sendCounting = userinfo[message.author.id].noCountingErrors

            if (!sendCounting) {
                userinfo[message.author.id].noCountingErrors = true
                message.channel.send(`k, I'll stop sending you insults every time you mess up counting from now on. dipdab\nJust run the same command again to enable them again.`)
            }
            else {
                userinfo[message.author.id].noCountingErrors = false
                message.channel.send(`Ok, I'll send you more insults when you mess up counting.`)
            }

            fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })
            break;

        case "profiledescription":
            x = 0, i = 0
            while (x != 2 && message.content[i]) {
                if (message.content[i] == " ") x ++
                i ++
            }
            let description = message.content.slice(i)

            userinfo[message.author.id].profile.description = description
            fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })

            message.channel.send(`:white_check_mark: Changed your profile description!`)
            break;
        
        case "profilefooter":
            x = 0, i = 0
            while (x != 2 && message.content[i]) {
                if (message.content[i] == " ") x ++
                i ++
            }
            let footer = message.content.slice(i)

            userinfo[message.author.id].profile.footer = footer
            fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })

            message.channel.send(`:white_check_mark: Set your profile footer!`)
            break;
        default:
            message.channel.send(`Unknown customisation.\n${this.info.help}`)
    }
}

module.exports.info = {
    name: `customise`,
    aliases: [`custom`, `customize`],
    usage: `(customisation option) {extra args}`,
    inKrystal: true,
    help: `Usage: \`o!customise (customisation option) {extra args}\`\n\n**Customisation Options**\n\`xpbar\` - Customises the way your xp bar in \`o!rank\` looks! \`Extra args: ("filled" or "unfilled" or "reset") (ASCII character)\`\nUse 'reset' to go back to the default XP bar.\n\n` +
          `\`levelupmessages\` or \`monthlylevelupmessages\`\n- Customise whether you want level up messages or not.\n\n` +
          `\`counting\`\n - Toggles counting error messages from appearing in your DM.\n\n` +
          `\`profileDescription <description>\`\n - Change the description on your proifle!\n\n` +
          `\`profileFooter <footer>\`\n - Change the footer on your profile!`
}