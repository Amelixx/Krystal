const Discord = require(`discord.js`)
const fs = require(`fs`);

const globalStats = require(`../JSON/Stats/globalStats.json`)

const modules = require(`../modules.js`)
const youtube = require(`../JSON/youtube.json`)

module.exports.run = async (bot, message, args, content, prefix) => {
    if (!content || !args[2]) return message.channel.send(`M8 you have to give me something :|`)
    let videos = await modules.Youtube.getVideo(args[1]).catch(err => {message.channel.send(`Couldn't find a youtube video.. Searching for a playlist..`); return false})
    if (!videos) videos = await modules.Youtube.getPlaylist(args[1]).catch(err => {message.channel.send(`Nope, can't find a playlist either.`); return false})
    else videos = [videos]

    // make true if you're getting videos from a playlist, can't be bothered to make it work any other way
    if (false) videos = await videos.getVideos().catch(err => {message.channel.send(`Failed to get videos from playlist.`); return false})
    if (!videos) return;

    let gameSearch = message.content.split(/\s+/).splice(2).join(" "),
    additionalDialog = "", game, msg = "";
    
    game = globalStats.featuredGames.filter(x => x.startsWith(gameSearch));
    if (game.length > 1) return message.channel.send(`Too many games found with that search.\n${game}`)
    
    if (game.length == 0) {
        game = gameSearch
        globalStats.featuredGames.push(game)
        additionalDialog = `\nI also added '${gameSearch}' to the database, as you've never told me about that very interesting game before.`}
    else game = game[0]

    for (let i in videos) {
        video = videos[i]

        if (youtube[video.id] && youtube[video.id].games) {
            if (youtube[video.id].games.includes(game)) {
                msg += `'${game}' is already considered one of the games in this video.`
                continue;
            }
            youtube[video.id].games.push(game)
        }
        else if (!youtube[video.id]) youtube[video.id] = {
            title: video.title,
            users: [],
            games: [game]
        }
        else youtube[video.id].games = [game]

        msg += `'${game}' is now considered a game in the video \`${video.title}\`.\n`
    }

    fs.writeFileSync(`./JSON/youtube.json`, JSON.stringify(youtube, null, 4))
    fs.writeFileSync(`./JSON/Stats/globalStats.json`, JSON.stringify(globalStats, null, 4))

    message.channel.send(`${msg}${additionalDialog}`)
}

module.exports.info = {
    name: `featuregame`,
    aliases: ["fg"],
    bypassRestrictions: true,
    developer: true
}