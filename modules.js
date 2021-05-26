const Discord = require(`discord.js`)
const fs = require(`fs`)
const chalk = require(`chalk`)

const youtube = require(`./JSON/youtube.json`)
const youtubeStats = require(`./JSON/Stats/youtubeStats.json`)

const convertapi = require('convertapi')(`3i8aQCMSttGLReKN`)

const main = require(`./Krystal.js`)

const settings = require(`./config.json`)
const config = settings

const simpleYoutube = require(`simple-youtube-api`)
const Youtube = new simpleYoutube(settings.youtubeAPIKey)
module.exports.Youtube = Youtube

const counting = require(`./JSON/counting.json`)

const chartMaker = require('c3-chart-maker');

const globalStats = require(`./JSON/Stats/globalStats.json`)
const serverStats = require(`./JSON/Stats/serverStats.json`)
const userStats = require(`./JSON/Stats/userStats.json`)

const userinfo = require(`./JSON/userinfo.json`)
const cooldowns = require(`./JSON/cooldowns.json`)
const jails = require(`./JSON/jails.json`)

const date = new Date()
const time = new Date().toUTCString().split(" ")[4]

module.exports.inWords = (num) => {
    let a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen ']
    let b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety']

    return a[num]

    // if ((num = num.toString()).length > 9) return 'overflow';
    // n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    // if (!n) return; var str = '';
    // str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    // str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    // str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    // str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    // str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    // return str;
}

module.exports.vowels = new Array(`a`,`e`,`i`,`o`,`u`)

module.exports.numberToMonth = (number) => {
    months = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`]
    return months[number]
}

module.exports.Krystal = () => { return main.bot.guilds.cache.get("451799907817488406") }
module.exports.Rubix = () => { return main.bot.users.cache.get(`97238312355364864`) }
module.exports.Izzy = () => { return main.bot.users.cache.get(`466706137614647307`) }
module.exports.Hiraeth = () => {return main.bot.users.cache.get(`286756561848762378`)}

module.exports.GreggieMaN = () => {return main.bot.users.cache.get(`257482333278437377`)}

module.exports.statuses = [
    // [`Merry Christmas :)`, {type: `WATCHING`}],
    [`with Alinabooooo~`, {type: `PLAYING`}],
    [`with Rubix @Krystal help`, {type: `PLAYING`}],
    [`crystals form.. @Krystal help`, {type: `WATCHING`}],
    [`with time and space. @Krystal help`, {type: `PLAYING`}],
    [`with the unknown... @Krystal help`, {type: `PLAYING`}],
    [`Holly turn to madness`, {type: `WATCHING`}],
    [`ok boomer`, {type: `LISTENING`}]
]

module.exports.setGame = () => {
    let game = this.statuses[this.randomInt(0, this.statuses.length - 1)]
    main.bot.user.setActivity(game[0], game[1])

    return `Set status to ${game[1].type.toLowerCase()} ${main.bot.user.presence.game}`
}

module.exports.range = async (start, stop, step) => {
    var a=[start], b=start;
    while(b<stop){b+=step;a.push(b)}
    return a;
};

module.exports.randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.maxInArray = (array) => {
    return array.sort((a, b) => {return b-a})[0]
}

module.exports.capitalise = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports.longestStringInArray = (array) => {
    return new String(array.sort(function (a, b) { 
        return b.length - a.length; 
    })[0]);
}

module.exports.hasStringLongerThan2000 = async (array) => {
    for (x in array) {
        if (array[x].length > 2000) return true
    }
    return false 
}

module.exports.randomHex = () => {
    let hex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e"],
    hexString = "", i;
    for (i = 0; i < 6; i ++) {
        hexString += hex[this.randomInt(0, hex.length -1)]
    }
    return `#${hexString}`
}

module.exports.error = async (channel, description) => {
    let embed = new Discord.MessageEmbed()
        .setColor([221, 46, 68])
        .setTitle("🚫")
        .setDescription(description)
    return new Object(await channel.send({embed}))
}

module.exports.delay = async (seconds) => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

module.exports.calculateNumberSuffix = (number) => {
    if (String(number).endsWith("1")) numbersuffix = "st"
    else if (String(number).endsWith("2")) numbersuffix = "nd"
    else if (String(number).endsWith("3")) numbersuffix = "rd"
    else numbersuffix = "th"
    return numbersuffix
}

module.exports.registerUser = (user) => {
    userinfo[user.id] = {xpCap: 100, level: 1, xp: 0, credits: 0, monthlyXpCap: 100, monthlyLevel: 1, monthlyXp: 0, profile: {}}
    fs.writeFileSync(`./JSON/Stats/userinfo.json`, JSON.stringify(userinfo, null, 4))
}

module.exports.updateYoutubeStats = async (useCache, log) => {
    /*
    Updates the youtube statistics posted in Krystal. Automatically run every 60 minutes.
    */
    let channel = main.bot.channels.cache.get("770850454887989248"),
    message = await channel.messages.fetch("770851257710673951"),

    gameChannel = main.bot.channels.cache.get(`680550532653514892`),
    gameMessage = await gameChannel.messages.fetch(`680551303025393736`)

    stats = await this.createYoutubeStats(useCache, log)
    if (stats == 403) {
        return console.log(`403 error when updating Youtube Stats innit bruv`)
        // stats = await this.createYoutubeStats(true, log)
    }
    
    if (log) console.log(chalk.blue(`Editing message. . .`))
    await message.edit("", {embed: stats[0]}).catch(x => {console.log(chalk.red(`Couldn't edit message in Youtube Stats:\n`) + chalk.redBright(x))})
    await gameMessage.edit("", {embed: stats[1]}).catch(x => {console.log(chalk.red(`Couldn't edit message in game-stats:\n`) + chalk.redBright(x))})
    // await message.channel.send({files: ["./JSON/Graphs/PieChart/graph.png"]})

    if (log) console.log(chalk.green(`All Done!\n\n`) + chalk.magenta(`See you in another hour for the next update Rubix, lol`))
}

module.exports.createYoutubeStats = async (useCache, log, useFields = true) => {
    /*
    * Creates an embed of youtube stats neatly layed out. Returns 403 if Youtube denies the request.
    * Parameter 'useCache' -> When set to true, uses the last known data rather than pulling from Youtube. 
    * Paramter 'log' -> Log pretty much every event in the console because it looks nice
    */

    // Get all users in array
    let users = []
    for (let x in youtube) {
        for (let user in youtube[x].users) {
            user = youtube[x].users[user]
            if (!users.includes(user)) users.push(user)
        }
    }

    // Games array
    let games = globalStats.featuredGames,

    embedDescription = `Percentages are the portion of views a user has compared to the total.\n\nPercentages in **bold** are more of a "competitive" percentage, where instead of comparing the percentage of views to the total, it's the percentage of views to the total amount of views that everyone has (meaning that they add to 100%), you can use this to directly compare yourself with others, and is more suited to a pie chart.\n\n`

    embedDescription += `**Total videos featuring someone: __${Object.keys(youtube).filter(x => youtube[x].users && youtube[x].users.length > 0).length}__**\n`
    let data = [], tempBuffer = {}, totalViewCount = 0,

    gameEmbedDescription = `Percentages are the portion of views the game has compared to the total.\n\n`

    gameData = [], totalGameViewCount = 0

    if (log) {console.log(chalk.magenta(`<---> U P D A T I N G   Y O U T U B E   S T A T S <--->\n\n`));}

    // Loop through all users and collect data
    for (let user in users) {
        let userID = users[user],
        videos = Object.keys(youtube).filter(x => youtube[x].users.includes(userID)),
        totalViews = 0
        userObj = await main.bot.users.fetch(userID)

        if (log) {console.log(chalk.magenta(`<---> Creating data for ${userObj.tag}... <--->\n`));}

        // Loop through all videos they're in
        for (let i in videos) {
            let ID = videos[i], video // ID of video

            // If the cache is being used, then obviously use that for everything
            if (useCache) {
                video = youtubeStats[ID]
                tempBuffer = youtubeStats
            }
            else { // Or start looking videos up
                if (log) {
                    console.log(chalk.cyan(`Analysing video '${ID}'`))
                    if (!tempBuffer[ID]) console.log(chalk.yellow(`video not in temp buffer... lookup required..`))
                    else {console.log(chalk.green(`video already in buffer!`));}
                }

                video = tempBuffer[ID] || await Youtube.getVideoByID(ID).then(video => { return video.fetch({ part: 'statistics' }) }).catch(err => { return err.code })

                if (!tempBuffer[ID] && log) console.log(chalk.green(`Success -> Saved to temporary buffer!`))

                tempBuffer[ID] = video
                delete video.channel
                delete video.thumbnails
                delete video.duration

                // If the video was looked up successfully..
                if (isNaN(video)) {
                    youtubeStats[ID] = video // Save it to the cache
                    if (log) {
                        console.log(chalk.green(`Video data analysed!\nViews -> ${video.raw.statistics.viewCount}`))
                        console.log(chalk.blue(`${userObj.username}'s views are now ${totalViews} + ${video.raw.statistics.viewCount} = ${totalViews + Number(video.raw.statistics.viewCount)}!`))

                        console.log(chalk.magenta(`\n${Number(i) + 1}/${videos.length} videos analysed.\n`))
                    }
                }
                else {
                    if (video == 403) return 403
                    else console.log(chalk.red(`UpdateYoutubeStats -> `)+ chalk.redBright(`Video '${ID}' returned error code ${video}..`))
                }
            }
            if (video && isNaN(video)) totalViews += Number(video.raw.statistics.viewCount) // Add it to the user's views
            else {
                if (log) console.log(chalk.red(`Missing youtube video '${ID}' in temporary buffer! Ignoring..`))
            }
        }
        if (log) {console.log(chalk.cyan(`Data for ${userObj.tag} done!\n`));}

        // Organise user's data
        data.push([userID, totalViews, videos.length])
    } // End of user loop, data collected in "tempBuffer" and "data"
    if (log) {console.log(chalk.magenta(`<---> Calculating total user view count <--->`)); addNumbers = [];}

    // Calculate total view count by adding it all together
    for (let ID in tempBuffer) {
        let views = tempBuffer[ID].raw.statistics.viewCount
        totalViewCount += Number(views)
        if (log) addNumbers.push(views)
    }
    embedDescription += `**Total featured views: ${totalViewCount.toLocaleString()}**\n`
    if (log) {
        console.log(chalk.blue(`${addNumbers.join(' + ')}\n`) + chalk.green(`       = ${totalViewCount}. Quick maths :)`))
    }

    // Loop through all the games and collect their data
    for (let i in games) {
        let game = games[i],
        videos = Object.keys(youtube).filter(x => youtube[x].games && youtube[x].games.includes(game)),
        totalViews = 0

        if (log) {console.log(chalk.magenta(`<---> Creating data for Game "${game}"... <--->\n`));}

        for (let i in videos) {
            let ID = videos[i], video 

            if (useCache) { // Use cache 
                video = youtubeStats[ID]
                tempBuffer = youtubeStats
            }
            else { // Or look them up in the buffer of videos looked up previously or on youtube itself
                if (log) {
                    console.log(chalk.cyan(`Analysing video '${ID}'`))
                    if (!tempBuffer[ID]) console.log(chalk.yellow(`video not in temp buffer... lookup required..`))
                    else {console.log(chalk.green(`video already in buffer!`));}
                }

                video = tempBuffer[ID] || await Youtube.getVideoByID(ID).then(video => { return video.fetch({ part: 'statistics' }) }).catch(err => { return err.code })

                tempBuffer[ID] = video
                console.log(video)
                delete video.channel
                delete video.thumbnails
                delete video.duration

                // If the video was looked up successfully..
                if (isNaN(video)) {
                    youtubeStats[ID] = video // Save it to the cache
                    if (log) {
                        console.log(chalk.green(`Video data analysed!\nViews -> ${video.raw.statistics.viewCount}`))
                        console.log(chalk.blue(`${game}'s views are now ${totalViews} + ${video.raw.statistics.viewCount} = ${totalViews + Number(video.raw.statistics.viewCount)}!`))
                
                        console.log(chalk.magenta(`\n${Number(i) + 1}/${videos.length} videos analysed.\n`))
                    }
                }
                else {
                    if (video == 403) return 403
                    else console.log(chalk.red(`UpdateYoutubeStats -> `)+ chalk.redBright(`Video '${ID}' returned error code ${video}..`))
                }
            }
            if (video && isNaN(video)) totalViews += Number(video.raw.statistics.viewCount) // Add it to the game's views
            else {
                if (log) console.log(chalk.red(`Missing youtube video '${ID}' in temporary buffer! Ignoring..`))
            }
        }
        if (log) {console.log(chalk.cyan(`Data for Game '${game}' done!\n`));}

        // Organise game's data
        gameData.push([game, totalViews, videos.length])
    }
    if (log) {console.log(chalk.magenta(`<---> Calculating total game view count <--->`)); addNumbers = [];}

    // Calculate total view count by adding it all together
    for (let i in gameData) {
        let views = gameData[i][1]
        totalGameViewCount += Number(views)
        if (log) addNumbers.push(views)
    }
    gameEmbedDescription += `**Total game feature views: ${totalGameViewCount.toLocaleString()}**\n`
    if (log) {
        console.log(chalk.blue(`${addNumbers.join(' + ')}\n`) + chalk.green(`       = ${totalViewCount}. Quick maths :)`))
    }


    let RubixViews = 0, RubixVideos = 0
    if (useCache && globalStats.RubixViews) RubixViews = globalStats.RubixViews, RubixVideos = globalStats.RubixVideos // Use cache to get Rubix views/videos
    else {
        // or fetch Rubix's views/videos
        if (log) console.log(chalk.magenta(`<---> Calculating Rubix's Views <--->`))
        let Rubix = await Youtube.getChannelByID(`UCRQZwKyi86mO2PEgPiRHIrA`).then(channel => {return channel.fetch({part: 'statistics'})}).catch(err => {return undefined})
        RubixViews = Rubix.raw.statistics.viewCount,
        RubixVideos = Rubix.raw.statistics.videoCount

        if (log) {console.log(chalk.green(`Rubix channel views pulled from youtube -> `) + chalk.cyan(`${RubixViews} total views.`));}
        globalStats["RubixViews"] = RubixViews
        globalStats["RubixVideos"] = RubixVideos
    }
    if (!useCache) { // If not using the cache, we obviously need to save the time so that in the next 60 minutes we can do it again
        if (log) console.log(chalk.magenta(`<---> Updating time since last update <--->`))
        globalStats.lastYoutubeUpdate = Date.now()

        if (log) console.log(chalk.cyan(`Milliseconds since epoch = ${Date.now()} `) + chalk.green(`-> Data saved.`))
    }
    // Save everything
    fs.writeFileSync(`./JSON/Stats/userStats.json`, JSON.stringify(userStats, null, 4))
    fs.writeFileSync(`./JSON/Stats/youtubeStats.json`, JSON.stringify(youtubeStats, null, 4))
    fs.writeFileSync(`./JSON/Stats/globalStats.json`, JSON.stringify(globalStats, null, 4))

    // Create embeds
    let embed = new Discord.MessageEmbed()
    .setColor(`BLACK`)
    .setTitle(`Youtube Statistics - Users`)

    let gameEmbed = new Discord.MessageEmbed()
    .setColor(`BLACK`)
    .setTitle(`Youtube Statistics - Games`)

    // Data Processing
    if (log) {console.log(chalk.magenta(`\n\n<---> Sorting Data. . . <--->\n\n`))}

    // Add up all the views people have for the competitive views percentage
    let views = []
    data.forEach(x => {views.push(x[1])})
    let otherTotalViews = views.reduce((a,b) => {return a + b}),
    chartData = [] // Data for the pie chart

    if (RubixViews) data.push(["97238312355364864", Number(RubixViews), Number(RubixVideos)]) // Add Rubix to the data
    data.sort((a, b) => {return b[1] - a[1]}) // Sort data based on views
    gameData.sort((a, b) => {return b[1] - a[1]}) // Sort game data based on views

    // Loop through user's data, one user at a time, adding fields to the embed
    for (let x in data) {
        let user = main.bot.users.cache.get(data[x][0]) || await main.bot.users.fetch(data[x][0]), // Try and use bot's cache, or fetch the user through the API.
        viewCount = data[x][1], // Total views user has
        videoCount = data[x][2] // Total videos user has
        viewPercentages = [     // Percentage of views, and "competitive" percentage of views
            `(${Math.round(viewCount / totalViewCount * 100 * 100) / 100}%)`, 
            Math.round(viewCount / otherTotalViews * 100 * 100) / 100
        ],
        averageViews  = `\nAverage Views: **${(Math.round((viewCount / data[x][2]) * 100) / 100).toLocaleString()}**`,
        // videoPercentages = [   // Same for videos, but can only be bothered to add one
        //     `(${Math.round(videoCount / Object.keys(youtube).length * 100)}%)`
        // ],
        name = user.tag

        if (user.id == `344267511966990336`) name = `Mary` // Any nicknames that need to be added from ugly deleted users
        if (videoCount == 1) s = ""
        else s = "s"                // Gotta have good grammar for the video data

        if (user.id != `97238312355364864`) chartData.push([name, viewPercentages[1]])

        let inline = true

        // Remove percentages and number for Rubix, since he's totally special
        if (user.id == "97238312355364864") viewPercentages[0] = "", viewPercentages[1] = ``, number = ``, inline = false
        else number = `[${Number(x)}]`, viewPercentages[1] = `**(${viewPercentages[1]}%)**`

        let add = `**${videoCount.toLocaleString()}** Video${s}\n**${viewCount.toLocaleString()}** Views ${viewPercentages[0]} ${viewPercentages[1]}${averageViews}\n`
        embed.addField(`${number} ${name}`, add, inline) // Add field with all the necessary data
        if (Number(x) % 2 === 0 && user.id != `97238312355364864`) embed.addField("\u200B", "\u200B", true)
    }
    fs.writeFileSync(`./JSON/Graphs/PieChart/youtube.json`, JSON.stringify(chartData, null, 4))

    for (let x in gameData) {
        let name = gameData[x][0],
        viewCount = gameData[x][1],  // Total views game has
        videoCount = gameData[x][2], // Total videos game has
        viewPercentage = `(${Math.round(viewCount / totalGameViewCount * 100 * 100) / 100}%)`, // Percentage of views compared to total
        averageViews = `\nAverage Views: **${(Math.round((viewCount / gameData[x][2]) * 100) / 100).toLocaleString()}**`

        // Capitlise the name
        let capitalisedName = "";
        if (name == "koth") capitalisedName = "King of The Hat"
        else {
            name = name.split(" ")
            for (let i in name) {
                capitalisedName += this.capitalise(name[i]) + " "
            }
        }


        if (videoCount == 1) s = ""
        else s = "s"

        let add = `**${videoCount.toLocaleString()}** Video${s}.\n**__${viewCount.toLocaleString()}__** Views. ${viewPercentage}${averageViews}\n`
        gameEmbed.addField(`[${Number(x) + 1}] ${capitalisedName}`, add)
    }

    // Generate a couple of time strings and add it to the end of the embed
    let ms = Date.now() - globalStats.lastYoutubeUpdate,
    time = this.getTimeString(ms),
    timeString = ""
    if (time == "now") timeString += `Data last updated **now.**\n`
    else timeString += `Data last updated **${time}** ago.\n`

    if (3600000 - ms < 1) timeString += `Next update should've been a while ago. Something must be broken ¯\\\\_(ツ)\\_/¯`
    else timeString += `Next update in **${this.getTimeString(3600000 - ms)}.**`

    embed.setDescription(embedDescription)
    embed.addField(`▃▃▃▃▃▃▃▃▃▃`, timeString)
    embed.setFooter(`Scroll up for more information, boomer`)

    gameEmbed.setDescription(gameEmbedDescription)
    gameEmbed.addField(`▃▃▃▃▃▃▃▃▃▃`, timeString)
    gameEmbed.setFooter(`Scroll up for more information, no this definitely isn't just copied from the user stats`)

    return [embed, gameEmbed]
}

module.exports.updateCountingStats = (useCache, log) => {
    /*
    *  Creates embeds for counting statistics in Krystal
    *  "useCache" -> Use the cache instead of fetching messages in the counting channels again.
    *  "log" -> Log different events for debugging
    */

    let countingChannel = main.bot.channels.cache.get(`451840622593179660`)

    if (useCache) {
        // Use the cache
    }
    else {
        // Fetch all messages and collect data
        let currentNumber = countingChannel.messages.fetch({limit: 1}).first()
    }
}

// module.exports.createViewsGraph = async (viewData) => {
//     /*
//     *   Creates a graph based on the view count history in userstats.json
//     */
//     let columns = [globalStats.youtubeUpdateTimes]
//     for (let x in viewData) {
//         let user = main.bot.users.cache.get(viewData[x][0]) || await main.bot.users.fetch(viewData[x][0])
//         let column = [user.username]
//         for (let x in userStats[user.id]) {
//             column.push(userStats[user.id][x].viewCountHistory)
//         }
//         columns.push(column)
//     }

//     let chart = chartMaker.generate({
//         data: {
//             x: 'x',
//             columns: columns
//         },
//         axis: {
//             x: {
//                 type: 'timeseries'
//             }
//         }
//     })
// }

module.exports.log = (title, description, options) => {
    if (!title) throw Error(chalk.Red(`No title set for Omni logs. A title is required.`))
    if (!description) throw Error(chalk.Red(`No description set for Omni logs.. A description is required.`))
    if (!options) options = {}

    let time = new Date().toTimeString().split(" ")[0]

    if (!options.footer) footer = time
    else footer = `${time} | ${options.footer}`

    let embed = new Discord.MessageEmbed()
        .setColor(options.color || "5d10e9")
        .setTitle(title)
        .setDescription(description)
        .setAuthor(options.authorName || null, options.authorIcon || null)

        .setImage(options.img || null)
        .setThumbnail(options.thumbnail || null)
        .setFooter(footer)
    let channel = main.bot.channels.cache.get(settings.omniLogs)
    channel.send({embed})
}

module.exports.getTime = (date) => {
    let seconds = Math.round(date / 1000),
    minutes = Math.floor(seconds / 60);
    seconds =  seconds % 60;

    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;

    return {
        hours: Math.round(hours),
        minutes: Math.round(minutes),
        seconds: Math.round(seconds)
    }
}

module.exports.getTimeString = (date) => {
    let times = this.getTime(date)

    if (times.hours == 0) times.hours = false
    if (times.minutes == 0) times.minutes = false
    if (times.seconds == 0) times.seconds = false

    if (times.hours > 1) { hourS = "s"; } else hourS = ""
    if (times.minutes > 1) minuteS = "s"; else minuteS = ""
    if (times.seconds > 1) secondS = "s"; else secondS = ""

    // if (!times.hours) hours = ``; else hours = `${times.hours} hour${hourS}`
    // if (!times.minutes) { minutes = ``; hours += "." } else minutes = `${times.minutes} minute${minuteS}`
    // if (!times.seconds) { seconds = ``; if (!times.hours) minutes += "." } else seconds = `and ${times.seconds} second${secondS}.`

    if (times.hours && !times.minutes && !times.seconds) return new String(`${times.hours} hour${hourS}`)
    if (!times.hours && times.minutes && !times.seconds) return new String(`${times.minutes} minute${minuteS}`)
    if (!times.hours && !times.minutes && times.seconds) return new String(`${times.seconds} second${secondS}`)

    if (times.hours && times.minutes && times.seconds) return new String(`${times.hours} hour${hourS}, ${times.minutes} minute${minuteS} and ${times.seconds} second${secondS}`)
    if (times.hours && times.minutes && !times.seconds) return new String(`${times.hours} hour${hourS} and ${times.minutes} minute${minuteS}`)
    if (times.hours && !times.minutes && times.seconds) return new String(`${times.hours} hour${hourS} and ${times.seconds} second${secondS}`)
    if (!times.hours && times.minutes && times.seconds) return new String(`${times.minutes} minute${minuteS} and ${times.seconds} second${secondS}`)
    if (!times.hours && !times.minutes && !times.seconds) return new String(`now`)

    return `Error :| Hours - ${times.hours} Minutes - ${times.minutes} Seconds - ${times.seconds}`
    // return new String(`${hours} ${minutes} ${seconds}`)
}

module.exports.getLastMessage = async (channel) => {
    messages = await channel.messages.fetch({limit: 1})
    if (messages.size == 0) return false
    else return messages.first()
}

module.exports.getSecondToLastMessage = async (channel) => {
    messages = await channel.messages.fetch({limit: 2})
    if (messages.size <= 1) return false
    else return messages.array()[1]
}

module.exports.welcome = (member, channel) => {
    let memberCount = this.Krystal().memberCount,
    postDescription = `**Read the FaQ in <#451800961988427779> for information on what you can do here.**\nYou are Krystal's **${memberCount}${this.calculateNumberSuffix(memberCount)}** member.`
    if (userinfo[member.id]) postDescription = `I see that you've been in this server before. I've added all the roles you had, and your level and xp have not changed since your leave. :)`

    loungeMessages = [
        `Hey, look! **%MEMBERNAME%** just joined us in %SERVERNAME%!`,
        `Watch out, **%MEMBERNAME%** just warped into %SERVERNAME%.`,
        `Challenger approaching; **%MEMBERNAME%** displaced themselves into %SERVERNAME%.`,
        `So I was just posting a welcome message in <#451800576548798466> and then- Woah, **%MEMBERNAME%** just joined!`,
        `Henlo, %MEMBERNAME%, welcome to %SERVERNAME%.`,
        `It's an honour to have you here in %SERVERNAME%,  **%MEMBERNAME%**.`,
        `%MEMBERNAME% has arrived. Party's over.`,
        `%MEMBERNAME% is here to talk to people in %SERVERNAME%! (Unless, you're just here for the emotes. Then I wouldn't blame you)`,
        `Woah, **%MEMBERNAME%** just joined us!`,
        `That's really interesting- Oh, I mean, welcome to the server, **%MEMBERNAME%**.`,
        `You know <@97238312355364864> only coded me because he was too lazy to welcome members like **%MEMBERNAME%** (welcome by the way). Shame on him.`,
        `**%MEMBERNAME%** just arrived. Stay a while and listen, won't you?`,
        `**%MEMBERNAME%** just joined %SERVERNAME%! It's ***SUPER*** effective!`,
        `**%MEMBERNAME%** just joined. Glhf.`,
        `**%MEMBERNAME%** just joined *%SERVERNAME%.* I hope you brought food, Welcoming people is hard.`,
        `**%MEMBERNAME%** just joined. Can I get a heal, or at least a break from constantly welcoming people? :weary:`,
        `Welcome **%MEMBERNAME%**. Leave your weapons/anything that might hurt me by the door, Where they will prompty be assimilated into the nether.`,
        `Hi **%MEMBERNAME%**! Welcome to <@97238312355364864>'s male teen dominated server! Have fun here I guess?`
    ]
    if (member.user.bot) {loungeMessage = `Welcome to Kryst- nevermind, it's a bot. False call, everyone. The bot that just joined is called %MEMBERTAG%, if you were wondering.`; postDescription = ``}
    else loungeMessage = loungeMessages[this.randomInt(0, loungeMessages.length - 1)]
    loungeMessage = editJoinMessage(loungeMessage, member, channel.guild)
    lounge = main.bot.channels.cache.get("451810413374603285")
    lounge.send(`${loungeMessage}\n\n${postDescription}`)

    if (member.user.bot) msg = new String(settings.botWelcomeMessage)
    else msg = new String(settings.welcomeMessage)
    msg = editJoinMessage(msg, member, channel.guild)
    channel.send(msg)
}

editJoinMessage = (msg, member, guild) => {
    while (msg.includes(`%MEMBER%`) || msg.includes(`%MEMBERNAME%`) || msg.includes("%MEMBERTAG%")|| msg.includes(`%SERVERNAME%`)) {
        msg = msg.replace(`%MEMBER%`, `<@${member.id}>`)
        msg = msg.replace(`%MEMBERNAME%`, member.displayName)
        msg = msg.replace(`%MEMBERTAG%`, member.user.tag)
        msg = msg.replace(`%SERVERNAME%`, guild.name)
    }
    return msg
}

module.exports.goodbye = (member, channel) => {
    if (member.user.bot) msg = new String(settings.botGoodbyeMessage)
    else msg = new String(settings.goodbyeMessage)
    msg = editJoinMessage(msg, member, channel.guild)

    channel.send(msg)

    let embed = new Discord.MessageEmbed()
    .setColor(`5d10e9`)
    .setDescription(`${member.user.tag} just left ${channel.guild.name}. Rip.`)


    lounge = main.bot.channels.cache.get("451810413374603285")
    lounge.send({embed})
}

module.exports.sendReactions = async () => {
    // Sends all the appropriate reactions in the roles channel.

    let rolesChannel = main.bot.channels.cache.get(config.rolesChannelID)

    // let genderMsg = await rolesChannel.messages.fetch("613373101954170933")
    // await genderMsg.react(`:male:452061696983433216`)
    // await genderMsg.react(`:female:452061730865020928`)

    await Object.keys(config.reactionRoles).forEach(async id => {
        let msg = await rolesChannel.messages.fetch(id)
        if (msg) {
            await Object.keys(config.reactionRoles[id]).forEach(async x => {await msg.react(x).catch(err => {})})
        }
    })
}

module.exports.updateStats = (cmd, message) => {
    if (message.guild) {
        if (!serverStats[message.guild.id]) serverStats[message.guild.id] = { "Command Usage": { "Total Commands": { "total": 1 } } }
        else serverStats[message.guild.id][`Command Usage`][`Total Commands`].total++

        if (!serverStats[message.guild.id][`Command Usage`][message.author.id]) serverStats[message.guild.id][`Command Usage`][message.author.id] = { "total": 1 }
        else serverStats[message.guild.id][`Command Usage`][message.author.id].total++

        if (!serverStats[message.guild.id][`Command Usage`][message.author.id][cmd.info.name]) serverStats[message.guild.id][`Command Usage`][message.author.id][cmd.info.name] = 1
        else serverStats[message.guild.id][`Command Usage`][message.author.id][cmd.info.name]++

        if (!serverStats[message.guild.id][`Command Usage`][`Total Commands`][cmd.info.name]) serverStats[message.guild.id][`Command Usage`][`Total Commands`][cmd.info.name] = 1
        else serverStats[message.guild.id][`Command Usage`][`Total Commands`][cmd.info.name]++

        fs.writeFile(`./JSON/Stats/serverStats.json`, JSON.stringify(serverStats, null, 4), err => { if (err) throw err })
    }

    if (!userStats[message.author.id]) userStats[message.author.id] = { "Command Usage": { "total": 1 } }
    else userStats[message.author.id][`Command Usage`].total++

    if (!userStats[message.author.id][`Command Usage`][cmd.info.name]) userStats[message.author.id]["Command Usage"][cmd.info.name] = 1
    else userStats[message.author.id][`Command Usage`][cmd.info.name]++
    fs.writeFile(`./JSON/Stats/userStats.json`, JSON.stringify(userStats, null, 4), err => { if (err) throw err })

    globalStats[`Command Usage`].total++
    if (!globalStats[`Command Usage`][cmd.info.name]) globalStats[`Command Usage`][cmd.info.name] = 1
    else globalStats[`Command Usage`][cmd.info.name]++
    fs.writeFile(`./JSON/Stats/globalStats.json`, JSON.stringify(globalStats, null, 4), err => { if (err) throw err })
}

module.exports.jail = async (member, moderator, ms, reason) => {
    member.roles.remove(settings.memberAutoroleID, `Jailing. ${reason} | Moderator: ${moderator.user.tag}`)
    member.roles.add(settings.jailRoleID, `Jailing. ${reason} | Moderator: ${moderator.user.tag}`)

    // Remove all assignable roles, but don't edit the databases
    member.roles.forEach(x => {
        if (Object.values(settings.assignableRolesEmotes).includes(x.id)) member.roles.remove(x)
    })

    if (ms) {
        if ((ms / 1000/ 60) > 1) s = `s`
        else s = ""
        logTime = `${ms / 1000 / 60} minute${s}.`; 
        jailTime = Date.now() + ms; 
        saidTime = `for **${ms / 1000 / 60} minute${s}**`
    }
    else {logTime = `Permanent.`; jailTime = null; saidTime = "**permanently**"}

    jails[member.id] = {
        jailedOn: Date.now(),
        time: jailTime,
        minutes: Number(minutes),
        reason: String(reason),
        memberID: member.id,
        moderatorID: moderator.id
    }
    await fs.writeFile(`./JSON/jails.json`, JSON.stringify(jails, null, 4), err => { if (err) throw err })
    let embed = new Discord.MessageEmbed()
        .setColor(`5d10e9`)
        .setTitle(`Banishment to The Nether`)
        .addField(`Member`, `${member} (${member.user.tag})`, true)
        .addField(`Moderator`, `${moderator} (${moderator.user.tag})`, true)
        .addField(`Reason`, reason)
        .addField(`Time`, logTime)
        .setFooter(`${time} | VictimID - ${member.id} | ModeratorID - ${moderator.id}`)
    main.bot.channels.cache.get(settings.jailsLogChannelID).send({embed})
    main.bot.channels.cache.get(settings.netherID).send(`${member}, you have been banished to the nether ${saidTime} by **${moderator.user.tag}**.\n**Reason:** ${reason}`)

    return new Object(jails[member.id])
}

module.exports.free = async (member, moderator, freeReason) => {
    member.roles.add(settings.memberAutoroleID, `Freeing from the nether. \n${freeReason} | Moderator: ${moderator.user.tag}`)
    member.roles.remove(settings.jailRoleID, `Freeing from the nether. \n${freeReason} | Moderator: ${moderator.user.tag}`)

    for (x in userinfo[member.id].roles) {
        member.roles.add(userinfo[member.id].roles[x])
    }

    if (moderator.user == main.bot.user) {
        moderatorName = `Krystal`
        var embed = new Discord.MessageEmbed()
            .setColor(`5d10e9`)
            .setTitle(`Freeing from The Nether (automatic)`)
            .addField(`Member`, `${member} (${member.user.tag})`, true)
            .addField(`Moderator`, `**Krystal**`)
            .addField(`Original Reason`, jails[member.id].reason)
            .addField(`Freeing Reason`, `${jails[member.id].minutes} minutes have passed.`)
            .setFooter(`${time} | VictimID - ${member.id} | ModeratorID - ${moderator.id}`)
    }
    else {
        moderatorName = moderator.user.tag
        var embed = new Discord.MessageEmbed()
            .setColor(`5d10e9`)
            .setTitle(`Freeing from The Nether`)
            .addField(`Member`, `${member} (${member.user.tag})`, true)
            .addField(`Moderator`, `${moderator} (${moderator.user.tag})`, true)
            .addField(`Original Reason`, jails[member.id].reason)
            .addField(`Freeing Reason`, freeReason)
            .setFooter(`${time} | VictimID - ${member.id} | ModeratorID - ${moderator.id}`)
    }

    delete jails[member.id]
    await fs.writeFile(`./JSON/jails.json`, JSON.stringify(jails, null, 4), err => { if (err) throw err })

    main.bot.channels.cache.get(settings.jailsLogChannelID).send({embed})
    main.bot.channels.cache.get(settings.netherID).send(`${member.user.tag} has been freed from the Nether by ${moderator.displayName}`)
    member.send(`You have been freed from the Nether by **${moderatorName}**.\nReason - "${freeReason}"`)
}

module.exports.saveColours = (guild) => {
    let colorRoles = {},
    roles = guild.roles.filter(x => {return x.hexColor != `#000000`}), 
    i = 0
    
    roles.forEach((x) => {
        colorRoles[x.name] = {
            position: x.position,
            color: x.color,
            hexColor: x.hexColor
        }
        console.log(chalk.cyan(`Saved '${x.name}' with hex colour `) + chalk.green(x.hexColor) + chalk.cyan(` to colorRoles.json  ${i+1} / ${roles.size} roles.`))
        i++
    })
    console.log(chalk.green(`Roles basically stolen successfully.`))

    fs.writeFileSync(`./JSON/Storage/colorRoles.json`, JSON.stringify(colorRoles, null, 4))
}


module.exports.backupJSON = () => {
    let databases = [
        {path: `userinfo.json`, data: userinfo},
        {path: `jails.json`, data: jails},
        {path: `Stats/globalStats.json`, data: globalStats},
        {path: `Stats/serverStats.json`, data: serverStats},
        {path: `Stats/userStats.json`, data: userStats}
    ]

    databases.forEach(x => {
        fs.writeFile(`../Backup/Krystal/JSON/${x.path}`, JSON.stringify(x.data, null, 4), err => {if (err) throw err})
    })
    console.log(chalk.green(`Backed up JSON files.`))
    return "Backed up JSON files."
}

module.exports.fetchChannel = async (message, arg) => {
    let count = 0

    await message.guild.channels.forEach(async (channel) => {
        if (await channel.name.toLowerCase().startsWith(arg.toLowerCase())) {arg = channel; count ++; }
    });

    if (await count == 0 || await !message.guild.channels.get(arg.id)) return false
    else if (await count > 1) return false
    else return arg
}

module.exports.findInvite = async (guild) => {
    let invites = await guild.fetchInvites()
    let invite = invites.find(x => x.maxAge == 0) || invites.find(x => x.maxUses == 0)
    if (!invite) invite = invites.first()
    
    if (invite) return invite
    else return null
}

module.exports.searchInvite = async (string) => {
    try {
        code = string.slice(string.indexOf('discord.gg')).split(" ")[0].replace("discord.gg/", "");
        invite = await bot.fetchInvite(code)
        if (invite) return invite
        else return false
        }
    catch (e) {return false}
}

module.exports.findRole = (guild, search) => {
    let filter = x => x.name.toLowerCase().startsWith(search.toLowerCase()) || x.id == search

    let roleArray = guild.roles.filter(filter).array()
    if (roleArray.length == 1) return roleArray[0]
    else if (roleArray.length == 0) return false
    else return roleArray
}

module.exports.fetchGuild = (search) => {
    if (!search || search == "") throw Error(`Error in fetching guild: 'search' is undefined or null.`)
    let filter = x => x.name.toLowerCase().startsWith(search.toLowerCase()) || x.id == search
    let guild = main.bot.guilds.cache.filter(filter).array()

    if (guild.length == 0) return false
    if (guild.length == 1) return guild[0]
    else return guild
}

module.exports.fetchUser = async (arg) => {
    if (!arg) return false
    else if (arg.toLowerCase() == "greg") return main.bot.users.cache.get(`257482333278437377`)
    let users = main.bot.users.cache.filter(user => user.tag.toLowerCase().startsWith(arg.toLowerCase()) || arg == `<@!${user.id}>` || arg == user.id || user.discriminator.startsWith(arg)).array()
    if (users.length == 1) return new Object(users[0])
    else if (users.length == 0) return await main.bot.users.fetch(arg).catch(err => {return false})
    else return Array(users)
}

module.exports.getUser = async (search, errorChannel) => {
    let user = await this.fetchUser(search)
    if (Array.isArray(user)) {
        let embed = new Discord.MessageEmbed()
        .setTitle(`More than one match.`)
        .setDescription(`More than user found, did you mean one of the following?\n${user.join("  ")}`)
        errorChannel.send({embed})
        return undefined
    }
    if (!user) {
        errorChannel.send(`I couldn't find a user matching \`${search}\`.`)
        return undefined
    }
    else return user
}

module.exports.fetchMember = (guild, search) => {
    if (!search) return false
    search = search.toLowerCase()

    filter = member => member.user.tag.toLowerCase().startsWith(search) || member.user.id == search || search.includes(`<@!${member.id}>`) || search.includes(`<@${member.id}>`)
            || member.user.discriminator.startsWith(search) || member.displayName.toLowerCase().startsWith(search)
    member = guild.members.filter(filter).array()

    if (member.length == 1) return member[0]
    else if (member.length == 0) return false
    else return member
}

module.exports.getMember = (guild, search, errorChannel) => {
    let member = this.fetchMember(guild, search)
    if (Array.isArray(member)) {
        let embed = new Discord.MessageEmbed()
        .setTitle(`More than one match.`)
        .setDescription(`More than user found, did you mean one of the following?\n${member.join("  ")}`)
        errorChannel.send({embed})
        return undefined
    }
    if (!member) {
        errorChannel.send(`I couldn't find a user matching \`${search}\`.`)
        return undefined
    }
    else return member
}

module.exports.addCredits = (user, amount) => {
    if (!userinfo[user.id]) userinfo[user.id] = {credits: Number(amount)}
    else userinfo[user.id].credits = Number(Number(userinfo[user.id].credits) + Number(amount))
    fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })
}

module.exports.removeCredits = (user, amount) => {
    if (!userinfo[user.id] || !userinfo[user.id].credits) return;
    else userinfo[user.id].credits = Number(Number(userinfo[user.id].credits) - Number(amount))

    if (userinfo[user.id].credits < 1) userinfo[user.id].credits = 0
    fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })
}

module.exports.addXp = (user, xp, monthly) => {
    if (!monthly) monthly = false
    if (!isNaN(Number(user))) user = main.bot.users.cache.get(user)

    let xpType = `xp`
    info = userinfo[user.id]
    xp = Number(xp)

    if (monthly) {
        info = {
            xp: userinfo[user.id].monthlyXp,
            xpCap: userinfo[user.id].monthlyXpCap
        }
        xpType = `monthlyXp`
    }

    if ((!info.xp && xp > info.xpCap) || info.xp >= info.xpCap || info.xp + xp > info.xpCap) return this.levelUp(user, xp - (info.xpCap - info.xp), monthly)
    else if (!Object.keys(userinfo[user.id]).includes("xp")) userinfo[user.id][xpType] = xp
    else if (info.xp == info.xpCap) return;
    else userinfo[user.id][xpType] += xp
    fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })
    return `Added ${xp} xp to ${user.tag}`
}

module.exports.removeXp = (user, xp, monthly) => {
    let xpType = `xp`
    info = userinfo[user.id]
    xp = Number(xp)

    if (monthly) {
        info = {
            xp: userinfo[user.id].monthlyXp,
            xpCap: userinfo[user.id].monthlyXpCap
        }
        xpType = `monthlyXp`
    }

    if (!info || !info.xp) return;
    else if (info.xp - xp < 0) userinfo[user.id][xpType] = 0
    else userinfo[user.id][xpType] = Number(userinfo[user.id][xpType] - xp)

    fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })
    return `Removed ${xp} xp from ${user.tag}`
}

module.exports.createXPbar = (user, monthly) => {
    if (monthly) {
        info = {
            xp: userinfo[user.id].monthlyXp,
            xpCap: userinfo[user.id].monthlyXpCap,

            xpBar: userinfo[user.id].xpBar
        }
    }
    else info = userinfo[user.id]

    if (!info.xp) xp = 0
    else xp = info.xp

    if (!info) return `Failed to create XP bar. If you're seeing this, please contact my developer D:\nAlso send him this so he knows exactly what went wrong: \`Error: missing USERINFO['${user.id}\`']`
    let percentage = xp / info.xpCap * 100

    let bars = Math.floor(percentage / 5)

    // ⧱ ⧰ █ ░

    try {
        let filled = "█"
        let unfilled = "░"
        if (info.xpBar) {
            if (info.xpBar.filled) {filled = info.xpBar.filled}
            if (info.xpBar.unfilled) {unfilled = info.xpBar.unfilled}
        }

        progressBar = filled.repeat(bars)
        progressBar += unfilled.repeat(20 - bars)
    } catch (e) {
        progressBar = `Something went wrong generating a progress bar... Please contact my developer, and send him this so he knows exactly what went wrong: \`${e}\``
    }
    return progressBar
}

module.exports.progressBar = (progress, goal, barCount) => {
    let percentage = progress / goal * 100,
    bars = Math.floor(percentage / (100 / barCount))

    try {
        let filled = "█",
        unfilled = "░"

        progressBar = filled.repeat(bars)
        progressBar += unfilled.repeat(barCount - bars)
    } catch (e) {
        progressBar = `Something went wrong generating a progress bar... Please contact my developer, and send him this so he knows exactly what went wrong: \`${e}\``
    }
    return progressBar
}
module.exports.levelUp = (user, xp, monthly) => {
    if (!isNaN(Number(user))) user = main.bot.users.cache.get(user)
    info = userinfo[user.id]

    var message = `Congratulations, ${user.username}, you just advanced to level ${info.level}!`
    var xpType = `xp`, levelType = `level`, xpCapType = `xpCap`

    if (monthly) {
        xpType = `monthlyXp`
        levelType = `monthlyLevel`
        xpCapType = `monthlyXpCap`

        message = `Congratulations, ${user.username}, you just advanced to **monthly** level ${userinfo[user.id].monthlyLevel + 1}!`
    }
    else if (userinfo[user.id].fixedLevel) {
        userinfo[user.id].xp = userinfo[user.id].xpCap
        fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })
        return `Leveled up ${user.tag}.`
    }
    else {
        let level = String(userinfo[user.id][levelType] + 1)
        if (Object.keys(settings.levelUpRoles).includes(level)) {
            let role = this.Krystal().roles.get(settings.levelUpRoles[userinfo[user.id][levelType] + 1])
            this.Krystal().member(user).addRole(role, `They are above, or equal to the level required for this rank.`)
            message += `\n\nDue to reaching level ${level}, you also gained **${role.name}**.`
        }
    }
    userinfo[user.id][xpType] = xp
    userinfo[user.id][levelType] ++
    userinfo[user.id][xpCapType] += 105

    if (userinfo[user.id].sendLevelUp && !monthly && !user.bot) {
        user.send(`${message}\nWant to turn these level up messages off? Just send \`${settings.prefix}customise levelUpMessages off\`!`)
    }
    if (userinfo[user.id].sendMonthlyLevelUp && monthly && !user.bot) {
        user.send(`${message}\nWant to turn these monthly level up messages off? Just send \`${settings.prefix}customise monthlyLevelUpMessages off\`!`)
    }
    if (!monthly) main.bot.channels.cache.get(`475773211972337666`).send(`**${user.tag}** leveled up to **level ${userinfo[user.id][levelType]}.**`)
    fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })

    return `Leveled up ${user.tag}.`
}

module.exports.levelDown = (user, xp, monthly) => {
    if (!isNaN(Number(user))) user = main.bot.users.cache.get(user)
    info = userinfo[user.id]
    var xpType = `xp`, levelType = `level`, xpCapType = `xpCap`

    if (monthly) {
        xpType = `monthlyXp`
        levelType = `monthlyLevel`
        xpCapType = `monthlyXpCap`

        message = `Congratulations, ${user.username}, you just advanced to **monthly** level ${userinfo[user.id].monthlyLevel + 1}!`
    }
    else if (userinfo[user.id].fixedLevel) {
        userinfo[user.id].xp = userinfo[user.id].xpCap
        fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })
        return `Leveled up ${user.tag}.`
    }
    else {
        let level = String(userinfo[user.id][levelType] + 1)
        if (Object.keys(settings.levelUpRoles).includes(level)) {
            let role = this.Krystal().roles.get(settings.levelUpRoles[userinfo[user.id][levelType] + 1])
            this.Krystal().member(user).addRole(role, `They are above, or equal to the level required for this rank.`)
        }
    }
    userinfo[user.id][xpType] = xp
    userinfo[user.id][levelType] --
    userinfo[user.id][xpCapType] -= 105
    
    if (!monthly) main.bot.channels.cache.get(`475773211972337666`).send(`**${user.tag}** leveled down to **level ${userinfo[user.id][levelType]}.**`)
    fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })

    return `Leveled down ${user.tag}.`
}

module.exports.createLevelsBoard = (levels, userIDs, xp, amount, monthly, bots) => {
    levelType = `level`
    xpType = `xp`,
    xpCapType = `xpCap`
    if (monthly) {
        levelType = `monthlyLevel`
        xpType = `monthlyXp`
        xpCapType = `monthlyXpCap`
    }

    stop = false
    let entries = []
    sortedLevels = levels.sort(function(a, b){return b-a}).filter(onlyUnique)

    for (let x in sortedLevels) {
        if (entries.length >= amount || stop) break;

        let sameLevelXP = []
        for (let user in userinfo) {
            if (userinfo[user][levelType] == sortedLevels[x]) sameLevelXP.push(userinfo[user][xpType])
        }
        sameLevelXP = sameLevelXP.sort(function(a, b){return b-a}) 
        for (let y in sameLevelXP) {
            y = sameLevelXP[y]
            if (entries.length >= amount) return;

            let user = main.bot.users.cache.get(userIDs[xp.indexOf(y)])
            if (user) {
                if (!bots && user.bot) continue;
                if (bots && !user.bot) continue;

                entries.push(`[${entries.length + 1}] **${user.tag}** - Level **${userinfo[user.id][levelType]} | ${userinfo[user.id][xpType]}/${userinfo[user.id][xpCapType]}**`)
                userIDs.splice(userIDs.indexOf(user.id), 1)
                xp.splice(xp.indexOf(y), 1)
                if (sortedLevels[x] == 1 && y == 0) {
                    entries.push(`Yes...Yes... There **would** be way more people here at level one...but I can't be bothered to show them.`)
                    stop = true
                }
            }
        }
    }
    return entries
}

module.exports.resetMonthlyLevels = () => {
    if (globalStats[`sentResetMessage`]) return;

    globalStats[`sentResetMessage`] = true
    fs.writeFile(`./JSON/Stats/globalStats.json`, JSON.stringify(globalStats, null, 4), err => { if (err) throw err; })
    this.backupJSON()
    console.log(`resetting monthly levels..`)
    for (let x in userinfo) {
        userinfo[x].monthlyXp = 0
        userinfo[x].monthlyLevel = 1
        userinfo[x].monthlyXpCap = 100
    }
    fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err; })

    // if (msg.length > 2000) return this.Rubix().send(`The message is too long for me to send!!! >:(`)

    // main.bot.channels.cache.get(`452216780421726238`).send(msg)
}

/**
 * Like sendMenu(), but sends a single question wherein the filter can be customised as it isn't restricted to numbers.
 * Returns a Discord Message instead of a string for the answer. The Message being the user's reply.
 * @param {Discord.User} user 
 * @param {Discord.Channel} channel 
 * @param {String} question 
 * @param {Function} filter 
 * @param {Number} time 
 */
module.exports.sendQuestion = async function (user, channel, question, filter, time=30000) {
    if (!channel || !question || !filter) throw Error(`sendQuestion -> No channel, question, or filter provided.`)

    botMsg = await channel.send(question + `\n\`\`\`http\nType 'exit' or 'quit' to cancel.\nThis message times out in ${time / 1000} seconds.\`\`\``)

    answer = await channel.awaitMessages(async m => {return (await filter(m) || m.content.toLowerCase() == 'exit' || m.content.toLowerCase() == 'quit') && m.author == user}, {max: 1, time: time, errors: ['time']})
    .catch(c => {botMsg.delete(); channel.send(`⏰ Timed out due to inactivity.`)})
    if (!botMsg || !answer || answer.length == 0) return false

    answer = answer.first()
    if (['exit', 'quit'].includes(String(answer.content).toLowerCase())) {botMsg.delete(); return false}
    else {botMsg.delete(); return Object(answer)}
}

// Functions I didn't write but useful

module.exports.fetchMessages = async (channel, limit = 500) => {
    let sum_messages = [],
    last_id;

    while (true) {
        const options = {limit: 100};
        if (last_id) {
            options.before = last_id;
        }

        const messages = await channel.messages.fetch(options).catch(e => {console.log(chalk.red(`Couldn't fetch messages from #${channel.name}:\n${e}`))});
        sum_messages = sum_messages.concat(messages.array());
        lastMsg = messages.last()
        if (lastMsg) last_id = lastMsg.id

        console.log(`#${channel.name} -> ${sum_messages.length} messages fetched`)

        if (messages.size != 100 || (limit && sum_messages >= limit)) {
            break;
        }
    }

    return sum_messages;
}