const { raid } = require('./raid')
const { days } = require('../config.json')

const hourRegex = /^([01]?[0-9]|2[0-3])[Hh:]([0-5][0-9])?$/
const shortcuts = /^(week|all|weekend|we)$/
const week = days.slice(0, 4).concat(days.slice(-1).pop())
const weekend = days.slice().splice(4, 2)

module.exports = {
    name: 'dispo',
    args: true,
    usage: "[groupe de jours] [heure unique]\nCet usage peut être utilisé plusieurs fois dans une seule commande.\n" +
        "Exemple : `!dispo lundi jeudi 21h mardi 20h`\nIl est possible d'utiliser week, weekend ou all comme raccourci pour les jours.",
    guildOnly: true,
    raiderOnly: true,
    description: "Envoie une dispo pour l'organisation du raid. En cas d'échec, il est possible qu'une partie des " +
        "paramètres aient été traités quand même ; à vérifier avec un `!recap`.",
    execute(message, args) {
        const playerAdded = addPlayer(message.author, args)
        message.react(playerAdded ? '✅' : '🚫')
    },
}

const addPlayer = (playerName, args) => {
    let groupOfDays = []
    for (arg of args) {
        const index = days.indexOf(arg.toLowerCase())
        if (index >= 0) groupOfDays.push(arg.toLowerCase())
        else if (arg.toLowerCase().match(shortcuts)) {
            const restOfArgs = args.slice(args.indexOf(arg) + 1)
            switch (arg.toLowerCase()) {
                case 'week':
                    return addPlayer(playerName, groupOfDays.concat(week.concat(restOfArgs)))
                case 'all':
                    return addPlayer(playerName, groupOfDays.concat(days.concat(restOfArgs)))
                case 'weekend':
                case 'we':
                    return addPlayer(playerName, groupOfDays.concat(weekend.concat(restOfArgs)))
            }
        }
        else if (arg.match(hourRegex)) {
            if (!groupOfDays.length) return false
            for (day of groupOfDays) {
                raid[days.indexOf(day)].players[playerName] = arg.toLowerCase().replace(':', 'h')
            }
            groupOfDays.length = 0
        }
        else return false
    }
    return (args.length >= 2 && !!args[args.length - 1].match(hourRegex))
}
