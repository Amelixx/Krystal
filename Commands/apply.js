const Discord = require(`discord.js`);
const fs = require(`fs`)

const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

const userinfo = require(`../JSON/userinfo.json`)

const chalk = require(`chalk`)

const questions = new Array(
    `Why do you want to be Staff?`,
    `Are you willing to learn how to use basic functions within The Omniverse bot to handle rulebreakers effectively?`,
    `Are there any previous experiences of being a staff member on other servers? (Exclude servers you own)`,
    `What jobs/responsibilities did you have on any servers you mentioned in the last question? How did you help them?`,
    `How much leniency do you usually give to rule breakers?`,
    `How much leniency would you usually give to your friends?`,
    `What would you do if your friend was banned, and you think that it was unjust, but you had the ability to unban them?`,
    `Would you take the necessary action against a lower-down staff member should they break the rules the same way you'd deal with a member?`,
    `How often are you online Discord, and how much of that time can you devote to The Omniverse?`,
    `Will you be able to attend as many staff meetings as possible? (mainly text, though in important cases, voice)`,
    `What is your timezone?\n(This is just for staff organisation and won't normally affect your result, unless you leave it blank.)`,
    `Is English your native language? Can you speak any other languages?`,
    `Do you know any influential people in The Omniverse that could vouch for you to become staff? (Friends etc)`,
    `What is your greatest strength as a staff member in The Omniverse? What can you do that can benefit the server?`,
    `Is there something you'd like to improve about yourself as a staff member? If so, tell us.`,
    `If you would like to add any additional infomation, please do so now. This part of the application allows you to stand out from the other applications.`
)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    return message.channel.send(`We are not accepting staff applications at the moment.`)
    return message.channel.send(`This command has some **clear** issues that I did not forsee, which includes the lack of multi-user support. I'm working on fixing this, and I'll DM you when it is actually working again. ~Rubix`)

    if (message.channel.type != "dm") return message.channel.send(`Look, I'm gonna be honest; I have no idea why this command doesn't work outside of a DM, but.. it doensn't. Please DM me \`o!apply\` to apply. :neutral_face:`)
    if (userinfo[message.author.id].application) return message.channel.send(`We're still reviewing your current staff application. If you would like to terminate your current one, use -=- Yeah, not developed yet. -=-`)
    if (userinfo[message.author.id].applying) return message.channel.send(`:neutral_face: You're already applying for staff. You can't make two applications at the same time unless you're a robot like me :smirk:`)

    let questionString = new String(`\`\`\`css\n`)
    for (let x in questions) {
        questionString += `.${Number(x) + 1} ${questions[x]}\n\n`
    }
    questionString += "```"

    let embed = new Discord.MessageEmbed()
        .setColor(`5d10e9`)
        .setTitle(`Applying for Staff`)
        .setDescription(`This is where you can write your pitch to become staff in **The Omniverse**. There are **${questions.length}** questions. Listed below.\n\n${questionString}` +
                        `\nYou'll be expected to answer these questions by replying to the bot. You'll have as much typing time as you need.\n\n` + "")
        .addField(`\`Start the application by typing "start" now.\``, `This times out in 10 minutes.`)
        .setFooter(`You can type "cancel" at any time to cancel the staff application.`)
    message.author.send({embed})
    dm = new Object(await message.author.dmChannel)

    userinfo[message.author.id].applying = true
    fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })

    let commands = [`start`, `cancel`]
    let messages = await dm.awaitMessages(msg => commands.includes(msg.content.toLowerCase()), {maxMatches: 1, time: 600000})
    if (!messages.first()) {
        cancel(message.author.id)
        return message.channel.send(`Uh, you took too long to send either "start" or "cancel", so I cancelled it for you. Don't keep me waiting!`)
    }
    else {
        switch(messages.first().content.toLowerCase()) {
            case "start": await start(bot, message, args, coreMessage); break;
            case "cancel": cancel(message.author.id); break;
        }
    }
}

module.exports.info = {
    name: `apply`,
    type: `omniverse`,
    summary: `Allows you to apply for staff on The Omniverse.`,
    inOmniverse: true
}

start = async (bot, message, args, coreMessage) => {
    var answers = []
    for (let x in questions) {
        console.log(chalk.green(`${message.author.tag} is answering question ${Number(x) + 1}.`))
        let question = questions[x]
        let embed = new Discord.MessageEmbed()
            .setColor("5d10e9")
            .setTitle(`Question ${modules.inWords(Number(x) + 1).capitalize()}`)
            .setDescription(question)
            .setFooter(`Answer by sending a message now.`)
        dm.send({embed})

        var confirmed = false
        var resendQuestion = false
        while (!confirmed) {
            if (resendQuestion) dm.send({embed})
            let messages = await dm.awaitMessages(msg => msg.author.id == dm.recipient.id || msg.content.toLowerCase() == "cancel", {maxMatches: 1})
            var answer = new String(messages.first().content)

            if (answer.toLowerCase() == "cancel") {
                cancel(message.author.id)
                return message.channel.send(`Application cancelled.`)
            }

            if (x == 0) dm.send(`Are you sure you want to keep this answer to send? reply 'no' to change it, or 'yes' to move onto the next question.\n*'y' and 'n' work too.*`)
            else dm.send(`Please confirm whether you are happy with your answer again.`)
            messages = await dm.awaitMessages(msg => [`yes`, "ye","y", "n", `no`].includes(msg.content.toLowerCase() || msg.content.toLowerCase() == "cancel"), {maxMatches: 1})
            let msg = messages.first()
            msg = msg.content.toLowerCase()
            switch(msg) {
                case "yes":
                case "ye":
                case "y":
                    confirmed = true
                    break;
                case "no":
                case "n":
                    dm.send(`I'll send the question again, please edit your answer as you wish.`)
                    resendQuestion = true
                    continue
                case "cancel": 
                    cancel(message.author.id)
                    return message.channel.send(`Application cancelled.`)
                default:
                    continue
            }
        }
        answers.push(answer)
    }
    userinfo[message.author.id].application = answers
    delete userinfo[message.author.id].applying
    fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })

    message.channel.send(`Attemping to submit application...`)
    member = bot.guilds.cache.get("451799907817488406").member(message.author)
    await sendApplication(member)

    message.channel.send(`Staff Application complete. The data will be sent to our Head Staff and I will get back to you on your result as soon as possible.\n**Thank you for applying on The Omniverse!**`)
}

sendApplication = async (member) => {
    let channel = member.guild.channels.get("457995186782601216")
    var string = createApplicationString(member, null)
    if (string.length > 2000) {
        var array = createApplicationString(member, 2)
    }
    else {
        return channel.send(string)
    }
    if (await modules.hasStringLongerThan2000(array)) {
        array = createApplicationString(member, 4)
    }
    else {
        array.forEach(x => {channel.send(x)})
        return;
    }
    if (await modules.hasStringLongerThan2000(array)) return member.send(`Some parts of your staff application are too long. We try to split applications so that you can put in as much detail as possible, but if you're seeing this, you're being way too verbose (unless you're just a 5 year old spammer, in which case you'll be prompty banned from using this command).\n**Run this command again and make it a little shorter :)**\nAlteratively, if you think you are one of the best, we'd love to hear from you; despite seeing this your answers can still be read by us if necessary.`)
    else array.forEach(x => {channel.send(x)})
}

cancel = async (id) => {
    delete userinfo[id].applying
    fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })
}

createApplicationString = (member, split) => {
    let string = new String()
    string += `\`\`\`css\nNew Application - By #${member.user.tag} [ID - ${member.user.id}]\n\n\`\`\`\n`

    if (!split) {
        for (let x in questions) {
            string += `__**${questions[x]}**__\n${userinfo[member.id].application[x]}\n\n`
        }
    }
    else {
        let string2 = new String(); let string3 = new String(); let string4 = new String()
        
        switch(String(split)) {
            case "2":
                for (let x in questions) {
                    if (x + 1 < 8) string += `__**${questions[x]}**__\n${userinfo[member.id].application[x]}\n\n`
                    else string2 += `__**${questions[x]}**__\n${userinfo[member.id].application[x]}\n\n`
                }
                var messages = [string, string2]
                break;
            case "4":
                for (let x in questions) {
                    x = Number(x)
                    if (x + 1 < 4) string += `**${questions[x]}**\n${userinfo[member.id].application[x]}\n\n`
                    else if (x + 1 < 8) string2 += `**${questions[x]}**\n${userinfo[member.id].application[x]}\n\n`
                    else if (x + 1 < 12) string3 += `**${questions[x]}**\n${userinfo[member.id].application[x]}\n\n`
                    else string4 += `**${questions[x]}**\n${userinfo[member.id].application[x]}\n\n`
                }
                messages = [string, string2, string3, string4]
                break;
            default: console.log("¯\\\_(ツ)\_/¯")
        }
        return messages
    }
    return string
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}