const Discord = require("discord.js");
const bot = new Discord.Client();
module.exports.bot = bot
const fs = require(`fs`)
const chalk = require(`chalk`)

const settings = require("./config.json");
const config = settings
let prefix = settings.prefix

const modules = require(`./modules.js`)

const globalStats = require(`./JSON/Stats/globalStats.json`)
const serverStats = require(`./JSON/Stats/serverStats.json`)
const userStats = require(`./JSON/Stats/userStats.json`)

const userinfo = require(`./JSON/userinfo.json`)
const cooldowns = require(`./JSON/cooldowns.json`)

const jails = require(`./JSON/jails.json`)

let countingFrequency = 0

module.exports.run = async () => {
    let botCommands = new Discord.Collection();
    fs.readdir(`./Commands/`, async (err, files) => {
        let totalLines = new Number()
        for (file in files) {
            file = files[file]
            array = fs.readFileSync(`./Commands/${file}`).toString().split('\n');
            let lines = array.length-1;
            totalLines += lines
        }
        let KrystalLines = fs.readFileSync(`./Krystal.js`).toString().split('\n').length - 1
        let modulesLines = fs.readFileSync(`./modules.js`).toString().split('\n').length - 1

        globalStats[`lineCount`] = {
            commandFiles: totalLines,
            mainFiles: KrystalLines + modulesLines,
            total: totalLines + KrystalLines + modulesLines
        }
        await fs.writeFile(`./JSON/Stats/globalStats.json`, JSON.stringify(globalStats, null, 4), err => { if (err) throw err })

        let jsfiles = files.filter(f => f.split(".").pop() === `js`);
        if (jsfiles.length <= 0) return console.log(chalk.red(`No commands to load.`));

        console.log(chalk.magentaBright(`Loading ${jsfiles.length} commands. . .`))
        for (let file in jsfiles) {
            file = jsfiles[file]
            try {cmd = require(`./Commands/${file}`);}
            catch (e) {console.log(chalk.magenta(`${file} couldn't load properly....` + chalk.red(e))); continue}

            if (!cmd.info) {console.log(chalk.red(`No info for command ${file}!`)); continue}
            if (!cmd.run) {console.log(chalk.red(`No run function for command ${file}!`)); continue}
            let props = require(`./Commands/${file}`);
            botCommands.set(props.info.name, props);
        };
        console.log(chalk.green(`Commands loaded!`))

        module.exports.botCommands = botCommands
    });

    console.log(chalk.magentaBright('Attemping to login. . .'))
    bot.login(settings.token);

    module.exports.commands = new Object(botCommands)
    module.exports.bot = bot
}

bot.on(`ready`, async () => {
    const Krystal = bot.guilds.cache.get(`451799907817488406`)
    console.log(chalk.magentaBright(`Logged in as.....`) + chalk.magentaBright(`



    _   __               _        _ 
    | | / /              | |      | |
    | |/ / _ __ _   _ ___| |_ __ _| |
    |    \\| '__| | | / __| __/ _\` | |
    | |\\  \\ |  | |_| \\__ \\ || (_| | |
    \\_| \\_/_|   \\__, |___/\\__\\__,_|_|
                 __/ |               
                |___/                
    
    
    Discord.js Version 12

    `))
    modules.setGame()

    console.log(chalk.cyan(`Creating reaction collectors...`))
    Object.keys(config.reactionRoles).forEach(async x => {
        let msg = await bot.channels.cache.get(config.rolesChannelID).messages.fetch(x);
        msg.createReactionCollector((reaction, user) => {Object.keys(config.reactionRoles[x]).includes(reaction.emoji.name)})
    })
    console.log(chalk.green(`Done`))

    bot.setInterval(async () => {
        for (let x in jails) {
            let jail = jails[x]
            if (Date.now() >= jail.time && jail.minutes && Krystal.members.cache.has(jail.memberID)) {
                await modules.free(Krystal.members.cache.get(jail.memberID), Krystal.me, `${jail.minutes} minutes have passed.`)
            }
        }

        for (let x in cooldowns) {
            if (Date.now() > cooldowns[x].talkingMoney) delete cooldowns[x]
        }
        fs.writeFileSync(`./JSON/cooldowns.json`, JSON.stringify(cooldowns, null, 4))

        for (let id in userinfo) {
            let member = Krystal.members.cache.get(id)
            if (!member) continue;

            if (member.user.bot && member.roles.cache.has(settings.memberAutoroleID)) {
                console.log(chalk.yellow(`Removing member role from bot ${member.user.tag}`))
                await member.roles.remove(settings.memberAutoroleID)
            }

            for (let x in settings.categoryRoles) {
                role = Krystal.roles.cache.get(settings.categoryRoles[x])
                if (!member.roles.cache.has(role)) await member.roles.add(role)
            }
            if (!member.roles.cache.has(settings.memberAutoroleID) && !member.user.bot) await member.roles.add(settings.memberAutoroleID)

            Object.keys(settings.levelUpRoles).forEach(async (x) => {
                role = Krystal.roles.cache.get(settings.levelUpRoles[x])
                if (userinfo[id].level >= Number(x) && !member.roles.cache.has(role.id)) await member.roles.add(role, `They are above, or equal to the level required for this rank.`)
                else if (userinfo[id].level < Number(x)) await member.roles.remove(role, `They are no longer a high enough level to have this role.`)
            })
        }

        Krystal.members.forEach(member => {
            if (!userinfo[member.id]) modules.registerUser(member)
            if (!userinfo[member.id].profile) userinfo[member.id].profile = {}
        })

        fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))

        d = new Date()
        if (d.getDate() == 1 && d.getHours() >= 9 && !globalStats.sentResetMessage) modules.resetMonthlyLevels()
        if (d.getDate() != 1) {
            globalStats[`sentResetMessage`] = false
            fs.writeFileSync(`./JSON/Stats/globalStats.json`, JSON.stringify(globalStats, null, 4))
        }
    }, 5000)

    bot.setInterval(() => {
        modules.updateYoutubeStats(true)
    }, 120000 /* 2 Minutes */)

    bot.setInterval(() => {
        modules.setGame()
        modules.backupJSON()
    }, 900000 /* 15 minutes */)

    bot.setInterval(() => {
        modules.updateYoutubeStats()

        let rLevel = modules.randomInt(667, 100000),
        role = Krystal.roles.cache.get(`452154098502860820`)

        role.setName(`Apache War Cube [${rLevel}+]`)

        userinfo["97238312355364864"].level = rLevel
    }, 3600000 /* 1 hour */)
})

bot.on(`messageReactionAdd`, async (reaction, user) => {
    if (user.bot) return;

    // Check message is actually one of the reaction messages
    let messageID = config.reactionRoles[reaction.message.id], role;
    if (reaction.message.channel.id == config.rolesChannelID && messageID) {
        role = reaction.message.guild.roles.cache.get(config.reactionRoles[reaction.message.id][reaction.emoji.name])
        if (!role) return;
    }
    else return;
    let member = reaction.message.guild.member(user)
    if (member.roles.cache.has(role.id)) {return reaction.users.remove(user)}

    let ageRole = hasRoleInArray(member, settings.ageRoles, role),
    genderRole = hasRoleInArray(member, settings.genderRoles, role),
    relationshipRole = hasRoleInArray(member, settings.relationshipRoles, role),
    sexualityRole = hasRoleInArray(member, settings.sexualityRoles, role),
    type = ``

    if (settings.ageRoles.includes(role.id) && ageRole) type = "age role"
    if (settings.genderRoles.includes(role.id) && genderRole) type = "gender role"
    if (settings.relationshipRoles.includes(role.id) && relationshipRole) type = "relationship role"
    if (settings.sexualityRoles.includes(role.id) && sexualityRole) type = "sexuality role"
    
    let description = `:diamonds: **Added** the \`${role.name}\` role. :diamonds:`

    if (!Array.isArray(userinfo[member.id].roles)) userinfo[member.id].roles = []

    if (type) {
        let roleToRemove;
        switch(type) {
            case "age role": roleToRemove = ageRole; break;
            case "gender role": roleToRemove = genderRole; break;
            case "relationship role": roleToRemove = relationshipRole; break;
            case "sexuality role": roleToRemove = sexualityRole; break;
        }
        userinfo[member.id].roles.splice(userinfo[member.id].roles.indexOf(roleToRemove.id), 1)
        member.roles.remove(roleToRemove)

        let otherEmoji = Object.keys(config.reactionRoles[reaction.message.id]).find(x => config.reactionRoles[reaction.message.id][x] == roleToRemove.id)
        await reaction.message.reactions.find(x => x.emoji.name == otherEmoji).users.remove(user)

        let a = "a"; if (modules.vowels.includes(type[0])) a = "an"
        description = `:diamonds: You already have the \`${roleToRemove.name}\` role, which is ${a} ${type}. It has been replaced with \`${role.name}\`.`
    }

    userinfo[member.id].roles.push(role.id)
    fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4));

    member.roles.add(role, `Self assignable role request.`)
    let embed = new Discord.MessageEmbed()
        .setColor(`#5d10e9`)
        .setAuthor(member.displayName, member.user.displayAvatarURL)
        .setDescription(description)
    reaction.message.channel.send({embed}).then(x => x.delete({timout: 2000}))

    if (reaction.message.guild == modules.Krystal()) {
        modules.log(`Assignable Role Added`, `**${user.tag}** added the \`${role.name}\` role.`, {
            authorName: member.displayName,
            authorIcon: user.displayAvatarURL,
            footer: `ID - ${user.id}`
        })
    }
})
bot.on(`messageReactionRemove`, async (reaction, user) => {
    if (reaction.message.channel.id != config.rolesChannelID) return;

    let role = reaction.message.guild.roles.cache.get(config.reactionRoles[reaction.message.id][reaction.emoji.name])
    if (user.bot || !role) return;
    let member = reaction.message.guild.member(user)
    if (!member.roles.cache.has(role.id)) return;

    userinfo[member.id].roles.splice(userinfo[member.id].roles.indexOf(role.id), 1)
    fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4));

    member.roles.remove(role, `Self assignable role request.`)
    let embed = new Discord.MessageEmbed()
        .setColor(`#5d10e9`)
        .setAuthor(member.displayName, member.user.displayAvatarURL)
        .setDescription(`:diamonds: **Removed** the \`${role.name}\` role. :diamonds:`)
    reaction.message.channel.send({embed}).then(x => x.delete({timout: 2000}))

    if (reaction.message.guild == modules.Krystal()) {
        modules.log(`Assignable Role Removed`, `**${user.tag}** removed the \`${role.name}\` role.`, {
            authorName: member.displayName,
            authorIcon: user.displayAvatarURL,
            footer: `ID - ${user.id}`
        })
    }
})

hasRoleInArray = (member, array, role) => {
    for (x in array) {
        if (member.roles.cache.has(array[x]) && array[x] != role.id) return member.guild.roles.cache.get(array[x])
    }
    return false
}

bot.on(`message`, async (message) => {
    const args = message.content.split(/\s+/);

    let x = 0, i = 0
    while (x != 1 && message.content[i]) {
        if (message.content[i] == " ") x ++
        i ++
    }
    let coreMessage = message.content.slice(i)

    if (message.channel.id == `432311072356302868` && message.mentions && message.mentions.everyone) message.channel.send(`Dude, I'm trying to manage a server here!`)

    if (message.guild && message.guild.id == `624735833207078965`) prefix = `-`
    else prefix = settings.prefix

    let logs = {
        // Target channel     Channel to copy to
        "642175137554366486": "615027166677041163",  // private-shiz
        "631454465882324995": "640656553472426072",  // epic photo moments
        "642179518018355211": "642117472761151519"   // bsdm thing
    }

    if (Object.keys(logs).includes(message.channel.id)) {
        let channel = bot.channels.cache.get(logs[message.channel.id])
        let attachments = ""
        if (message.attachments) message.attachments.forEach(x => {attachments += `${x.url}\n`})
        if (channel.guild.id != `609552032398835713`) channel.send(`**${message.author.tag}**\n${message.content}\n\n${attachments}`)
    }

    if (message.channel.type != "dm" && message.guild.id == `451799907817488406`) {
        let xp = await modules.randomInt(5, 20)
        let talkingMoney = await modules.randomInt(5, 20)

        if (message.author.id == `235114940871081985`) xp = xp * 10

        if (!cooldowns[message.author.id]) cooldowns[message.author.id] = {talkingMoney: Date.now() + 60 * 1000}
        else if (!cooldowns[message.author.id][`talkingMoney`]) cooldowns[message.author.id][`talkingMoney`] = Date.now() + 60 * 1000
        
        if (Date.now() > cooldowns[message.author.id][`talkingMoney`]) {
            modules.addCredits(message.author, talkingMoney)
            modules.addXp(message.author, xp)
            modules.addXp(message.author, 40, true)

            if (!userinfo[message.author.id].gainedFromTalking) userinfo[message.author.id].gainedFromTalking = talkingMoney
            else userinfo[message.author.id].gainedFromTalking += talkingMoney
        }
        await fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))
        await fs.writeFileSync(`./JSON/cooldowns.json`, JSON.stringify(cooldowns, null, 4))
    }
    if (message.author.bot) return;

    if (message.channel.id == `580895041032159242`) {
        let attachments = ""
        if (message.attachments) message.attachments.forEach(x => {attachments += `${x.url}\n`})
        bot.channels.cache.get(`615027166677041163`).send(`**${message.author.tag}** - ${message.content}\n\n${attachments}`)
    }

    if ([`451840622593179660`].includes(message.channel.id) && !message.author.bot) {
        if (message.system) return message.delete()
        if (message.author.bot) return;

        let sendMsg = !userinfo[message.author.id].noCountingErrors

        if (!message.content) return message.delete()

        // checc if its number
        let numbers = args.filter(x => {return !isNaN(x)}),
        userNumber = Number(numbers[0])
        if (numbers.length == 0) {
            return message.delete()
            // if (sendMsg) return message.channel.send(`There's no numbers in that messagr b r o :|`).then(x => {x.delete(1500)})
        }
        else if (numbers.length > 1) {
            return message.delete()
            // if (sendMsg) return message.channel.send(`There's two numbers in that message, dumbo`).then(x => {x.delete(1500)})
        }

        // Check that they aren't sending a message twice in a row
        let lastMessage = await modules.getSecondToLastMessage(message.channel)
        if (!lastMessage) return;
        else if (lastMessage.author == message.author) {
            return message.delete()
            // if (sendMsg) return message.channel.send(`One number at a time, kiddo.`).then(x => {x.delete(1500)})
        }

        // checc if user is counting correctly and isn't an idiot
        let number = lastMessage.content.split(" ").filter(x => {return !isNaN(x) && x.length > 0})[0]

        if (userNumber != Number(number) + 1) {
            return message.delete()
            // if (sendMsg) message.channel.send(`Bro, I'm only 2 years old and I can tell that your counting is wrong, smh`).then(x => {x.delete(1500)})
        }

        // Pin if multiple of 100
        if (userNumber % 100 == 0) await message.pin()

        // send another message with higher number IF frequency hits
        if (countingFrequency >= 4) {
            message.channel.send(String(userNumber + 1))
            countingFrequency = modules.randomInt(2, 3)
        }
        else countingFrequency ++
    }
    if (message.channel.id == `646084489621012500` && !message.author.bot) {
        if (message.system) return message.delete()
        if (message.author.id != `235114940871081985`) return message.delete()

        // checc if its number
        let numbers = args.filter(x => {return !isNaN(x)}),
        HollyNumber = Number(numbers[0])
        if (numbers.length == 0) {
            message.delete()
            return message.channel.send(`There's no numbers in that message Holly***Gay*** :|`).then(x => {x.delete({timout: 1500})})
        }
        else if (numbers.length > 1) {
            message.delete()
            return message.channel.send(`There's two numbers in that message, like which one am I supposed to count to ***Holly?***`).then(x => {x.delete({timout: 1500})})
        }

        // checc if she's counting correctly
        let lastMessage = await modules.getSecondToLastMessage(message.channel),
        number = lastMessage.content.split(" ").filter(x => {return !isNaN(x) && x.length > 0})[0]

        if (HollyNumber != Number(number) + 1) {
            message.delete()
            return message.channel.send(`H0lly br0, you're not counting correctly, try again.\n\ndipdab`).then(x => {x.delete({timout: 1500})})
        }

        // Pin if multiple of 500
        if (HollyNumber % 500 == 0) await message.pin().catch((e) => {})

        // send another message with higher number
        message.channel.send(String(HollyNumber + 1))
    }

    // DM Logger
    if (message.channel.type == "dm" && !message.content.startsWith(prefix)) {
        if (message.author == bot.user) return;
        globalStats.lastDM = message.author.id;
        fs.writeFileSync(`./JSON/Stats/globalStats.json`, JSON.stringify(globalStats, null, 4))

        let embed = new Discord.MessageEmbed()
        .setColor(`#5d10e9`)
        .setAuthor(`${message.author.tag} ${message.author.id}`, message.author.displayAvatarURL)
        .setDescription(message.content)
        .setTimestamp(Date.now())

        return bot.channels.cache.get(config.dmLogChannelID).send({embed})
    }

    if (!message.content.startsWith(prefix) && !message.mentions.users.has(bot.user.id) && !message.content.toLowerCase().startsWith(`krystal,`)) return;

    aliasCheck = `${prefix}%X%`

    // Command Handler
    if (args[0] == `<@${bot.user.id}>` || args[0] == `<@!${bot.user.id}>`) {
        args.splice(0, 1)
        coreMessage = args.slice(1).join(" ")
        cmd = this.botCommands.get(args[0])
        aliasCheck = `%X%`
        if (message.mentions.members) message.mentions.members = message.mentions.members.filter(x => {x != message.mentions.members.first()})
    }
    else if (message.content.toLowerCase().startsWith(`krystal,`)) cmd = this.botCommands.get(`8ball`)
    else if (message.content.startsWith(prefix)) cmd = this.botCommands.get(args[0].toLowerCase().slice(prefix.length));
    else return;
    if (!cmd) this.botCommands.forEach(command => {
        if (command.info.aliases) {
            command.info.aliases.forEach(x => {
                if (args[0] && args[0].toLowerCase() == aliasCheck.replace(`%X%`, x)) { return cmd = command }
            })
        }
    });
    if (cmd)  {
        if (message.channel.type != "dm") {
            if (message.channel.id == `451840622593179660` /*counting channel*/) return;
        }
        else {
            if (cmd.info.ignoreDM) return message.channel.send(`This command cannot be used in direct messages.`)
            if (cmd.info.ignoreDM && cmd.info.inKrystal) return message.channel.send(`This command cannot be used in direct messages, and only in The Krystal.\ndiscord.gg/AFN56Cn`)
        }

        if (cmd.info.inKrystal && !modules.Krystal().member(message.author)) return message.channel.send(`This command can only be used if you're in **${modules.Krystal().name}**.\nWant an invite? Check out \`${prefix}invite\`!`)

        if ((cmd.info.type == `admin` || cmd.info.admin) && !settings.adminIDs.includes(message.author.id) && !settings.developerIDs.includes(message.author.id)) return message.channel.send(`You don't have permission to use this command.`)
        if (cmd.info.developer && !settings.developerIDs.includes(message.author.id)) {
            if (!cmd.info.developerReason) return message.channel.send(`You don't have permission to use this command, and **never** will. :)`)
            else return message.channel.send(cmd.info.developerReason)
        }

        if (cmd.info.rolesRequired && !settings.developerIDs.includes(message.author.id)) {
            for (let x in cmd.info.rolesRequired) {
                x = cmd.info.rolesRequired[x]
                if (!message.member.roles.get(x)) return message.channel.send(`You don't have the required permissions to run this command.\nYou need the role: ${modules.Krystal().roles.get(x).name}`)
            }
        }

        if (message.channel.type != "dm") console.log(chalk.magentaBright(`${message.author.tag} executed "${message.content}" | ${message.channel.name} | ${message.guild.name}`))
        else console.log(chalk.magentaBright(`${message.author.tag} executed "${message.content}" | DM Channel`))

        try {
            await cmd.run(bot, message, args, coreMessage, prefix)
            modules.updateStats(cmd, message)
        } catch (error) {
            message.channel.send(`An error occured while running this command. The error has been logged.\n\`\`\`${error}\`\`\`\nContact ${bot.users.cache.get("97238312355364864").tag} if this happens frequently.`)
            console.error(`Error running ${cmd.info.name}:`)
            console.error(error)
        }
    }
})

bot.on('typingStart', async (channel, user) => {
    let lastUser = bot.users.cache.get(globalStats.lastDM); dmLog = bot.channels.cache.get(config.dmLogChannelID)
    if (!lastUser) return;
    if (lastUser.dmChannel == channel && user == lastUser) {
        dmLog.startTyping()
    }

    if (channel == dmLog) {
        lastUser.dmChannel.startTyping()
    }
})

bot.on('typingStop', async (channel, user) => {
    let lastUser = bot.users.cache.get(globalStats.lastDM); dmLog = bot.channels.cache.get(config.dmLogChannelID)
    if (!lastUser) return;
    if (lastUser.dmChannel == channel && user == lastUser) {
        dmLog.stopTyping()
    }

    if (channel == dmLog) {
        lastUser.dmChannel.stopTyping()
    }
})

bot.on(`guildMemberAdd`, async (member) => {
    modules.setGame()

    if (member.guild.id == `446770975262900254`) {
        if (member.id == `491475303101628427`) member.kick(`fuck you`)
        if (member.id == `482301195843797024`) member.kick(`fuck you`)
    }

    if (member.guild.id == `366204534567075840`) {
        if (!member.user.bot) return bot.channels.cache.get(`391320355672948748`).send(`Welcome to **${member.guild.name}**, ${member.displayName}! Please read <#443472314403913729> and <#431577384052064287> (Unless you don't care what this server is about whatsoever)`)
        else return bot.channels.cache.get(`391320355672948748`).send(`Welcome ${member.displayName} to- wait, you're a bot. I guess you know everything about this server then. :triumph:`)
    }
    let Krystal = bot.guilds.cache.get(`451799907817488406`)

    if (Krystal && member.guild == Krystal) {
        bot.channels.cache.get("457939661071974439").setName(`Member Count - ${Krystal.memberCount}`)
        let channel = bot.channels.cache.get(settings.welcomeChannelID)
        if (channel) modules.welcome(member, channel)

        if (!userinfo[member.id]) modules.registerUser(member)
        else if (userinfo[member.id].roles) {
            for (x in userinfo[member.id].roles) {
                member.roles.add(userinfo[member.id].roles[x])
            }
        }

        if (member.user.bot) role = Krystal.roles.cache.get(settings.botAutoroleID)
        else {
            for (let x in settings.categoryRoles) {
                role = Krystal.roles.cache.get(settings.categoryRoles[x])
                await member.roles.add(role, `-=-=- Omniversal Autoroles -=-=-`)
            }

            if (jails[member.id]) {
                member.roles.add(Krystal.roles.cache.get(settings.jailRoleID), `Tried to evade jail by leaving.`)
                return member.send(`Did you seriously think that leaving and joining back again would get you out of the nether? Haha. Nice try boi.`)
            }
            else role = Krystal.roles.cache.get(settings.memberAutoroleID)
        }
        if (role) member.roles.add(role, `-=-=- Omniversal Autoroles -=-=-`)
    }
})

bot.on(`guildMemberRemove`, async (member) => {
    modules.setGame()

    let Krystal = bot.guilds.cache.get(`451799907817488406`)

    if (Krystal && member.guild == Krystal) {
        if (userinfo[member.id].partner) {
            member.send(`Your partner(s) for **The Krystal** has been automatically redacted due to your leave. Yeah, I'm a bot. I remember everything :smirk:`)
            message = await bot.channels.cache.get(settings.partnerChannelID).messages.fetch(userinfo[member.id].partnerMessageID)
            message.delete()
        }

        let advertising = bot.channels.cache.get(`453255119803514900`)
        advertising.messages.fetchs({limit: 100})
        .then(messages => {
            messages = messages.filter(msg => msg.member == member && msg.content.includes(`discord.gg/`))
            if (messages.size != 0) {
                member.send(`You posted **${messages.size}** messages in #advertising with discord server links attached. They're... uh... gone now due to your leave.. :smile:`)

                for (let x in messages) {
                    x.delete()
                }
            }
        })


        bot.channels.cache.get("457939661071974439").setName(`Member Count - ${Krystal.memberCount}`)
        let channel = bot.channels.cache.get(settings.goodbyeChannelID)
        if (channel) modules.goodbye(member, channel)
    }
})

bot.on(`error`, async (err) => {
    console.log(chalk.red(`Unexpected error...\n`) + chalk.redBright(`${err.message}\nIn file ${err.fileName}, line ${err.lineNumber}`))
})

bot.on(`disconnect`, (event) => {
    console.log(`${bot.user.username} has disconnected. Attempting to reconnect...`)
    return this.run()
})

this.run()