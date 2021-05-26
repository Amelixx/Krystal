const Discord = require(`discord.js`)
const fs = require(`fs`);
const chalk = require(`chalk`)

const settings = require(`../config.json`)

const modules = require(`../modules.js`)
const main = require(`../Krystal.js`)
const userinfo = require(`../JSON/userinfo.json`)

const globalStats = require(`../JSON/Stats/globalStats.json`)
const serverStats = require(`../JSON/Stats/serverStats.json`)
const userStats = require(`../JSON/Stats/userStats.json`)

const youtube = require(`../JSON/youtube.json`)
const youtubeStats = require(`../JSON/Stats/youtubeStats.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    try {
        evaluation = eval(coreMessage);
    }
    catch(err) {
        evaluation = err
    }

    return message.channel.send(`<a:loading:504323385824641045>Evaluating...<a:loading:504323385824641045>\n\n\`\`\`js\n${evaluation}\`\`\``)
}

module.exports.info = {
    name: `eval`,
    developer: true,
    bypassRestrictions: true
}