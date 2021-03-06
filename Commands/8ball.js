const Discord = require(`discord.js`);
const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

module.exports.run = async (bot, message, args, coreMessage) => {
    phrases = [
        `It is certain.`,
        `It is decidedly so.`,
        `Without a doubt.`,
        `Yes, definitely.`,
        `You may rely on it.`,
        `Signs point to yes.`,
        `As I see it, yes.`,
        `Most likely.`,
        `Outlook good.`,
        `Yes.`,
        `Ask again later.`,
        `Better not tell you now.`,
        `Cannot predict now.`,
        `Concentrate and ask again.`,
        `Don't count on it.`,
        `My reply is no.`,
        `My sources say no.`,
        `Outlook not so good.`,
        `Very doubtful.`,
    ]
    let msg = phrases[modules.randomInt(0,phrases.length - 1)]

    message.channel.send(msg);
}

module.exports.info = {
    name: `8ball`,
    type: `fun`,
    summary: `Get a random 8ball response!`
}