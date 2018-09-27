const { raid } = require('./raid')
const { days } = require('../config.json')

module.exports = {
    name: 'annule',
    args: true,
    usage: "[groupe de jours]\nExemple : `!annule mardi vendredi`",
    guildOnly: true,
    raiderOnly: true,
    description: "Annule une dispo précédemment envoyée pour l'organisation du raid. " +
        "Même en cas d'échec, les jours écrits correctement seront traités par le bot.",
    execute(message, args) {
        let isDeleted = true
        for (day of args) {
            const index = days.indexOf(day)
            if (index >= 0) delete raid[index].players[message.author]
            else isDeleted = false
        }
        message.react(isDeleted ? '✅' : '🚫')
    },
}
