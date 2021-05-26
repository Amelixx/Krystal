const Discord = require(`discord.js`)
const fs = require(`fs`);
const chalk = require(`chalk`)

const modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, content, prefix) => {
    msg = await message.channel.send(`Processing Youtube Data.. Please wait..`)
    embed = await modules.createYoutubeStats(true)
    await msg.edit("", {embed: embed})
}

module.exports.info = {
    name: `youtubestats`,
    aliases: [`channelstats`],
    summary: `Posts the latest youtube statistics about people featuring on [my channel](https://www.youtube.com/channel/UCRQZwKyi86mO2PEgPiRHIrA).`,
    bypassRestrictions: true
}