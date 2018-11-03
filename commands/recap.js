const { raid } = require('./raid')
const { unavailablePlayers } = require('./pasdispo')

const raidSize = 8
const nbOfTanksAndHealers = 2
const healerRoles = /^(WHM|SCH|AST)$/
const tankRoles = /^(PLD|WAR|DRK)$/

module.exports = {
    name: 'recap',
    args: false,
    cooldown: 10,
    guildOnly: true,
    raiderOnly: true,
    description: 'Demande un récapitulatif de l\'organisation actuelle pour le raid.',
    execute(message, args) {
        if (raid.length) {
            const members = message.guild.members
            const baseRecapMessage = [], raidPossibilitiesMessage = []
            for (raidDay of raid) {
                addAvailablePlayers(raidDay, baseRecapMessage)
                addPossibleRaidHoursWithPlayers(raidDay, members, raidPossibilitiesMessage)
            }
            addUnavailablePlayers(baseRecapMessage)
            message.author.send(baseRecapMessage.length ? baseRecapMessage : "Personne ne s'est inscrit-e pour l'instant...")
            if (raidPossibilitiesMessage.length) message.channel.send(raidPossibilitiesMessage)
        } else return message.channel.send("Aucun raid n'a été préparé pour le moment !")
    },
}

const convertToMinutes = hour => {
    const tab = hour.split(/[Hh:]/).map(e => Number(e))
    return tab[0] * 60 + tab[1]
}

const convertToString = minutes => `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, '0')}`

const addAvailablePlayers = (raidDay, data) => {
    const numberOfPlayers = Object.keys(raidDay.players).length
    if (numberOfPlayers) {
        let str = `**[${numberOfPlayers}] ${raidDay.date} :** `
        for (playerName of Object.keys(raidDay.players)) {
            str += `${playerName} (${raidDay.players[playerName]}), `
        }
        data.push(str.slice(0, -2))
    }
}

const addUnavailablePlayers = data => {
    if (unavailablePlayers.length) {
        data.push(`**Sont indisponibles :** ${unavailablePlayers}`)
    }
}

const findPossibleRaidHours = (players, members) => {
    const hours = Object.values(players).map(e => convertToMinutes(e))
    const playerNames = Object.keys(players)
    const possibleRaidHours = {} // hour: playerNames
    while (hours.length >= raidSize) {
        const hour = Math.max(...hours)
        if (possibleRaidHours[hour] === undefined) possibleRaidHours[hour] = playerNames.slice()
        playerNames.splice(hours.indexOf(hour), 1)
        hours.splice(hours.indexOf(hour), 1)
    }
    handleHealersAndTanks(possibleRaidHours, members)
    return possibleRaidHours
}

const addPossibleRaidHoursWithPlayers = (raidDay, members, data) => {
    const possibleRaidHours = findPossibleRaidHours(raidDay.players, members)
    if (Object.keys(possibleRaidHours).length) {
        data.push(`Il est possible de partir le **${raidDay.date}** :`)
        for (const possibleRaidHour of Object.entries(possibleRaidHours)) {
            data.push(`- à ${convertToString(possibleRaidHour[0])} avec ${possibleRaidHour[1]}`)
        }
    }
}

const handleNotEnoughHealersOrTanks = (healers, tanks, possibleRaidHours, hour) => {
    if (healers.length < nbOfTanksAndHealers
        || tanks.length < nbOfTanksAndHealers
        || (tanks.filter(e => !healers.includes(e)).length
            + healers.filter(e => !tanks.includes(e)).length
            + tanks.filter(e => healers.includes(e)).length) < 2 * nbOfTanksAndHealers) {
        delete possibleRaidHours[hour]
    }
}

const handleHealersAndTanks = (possibleRaidHours, members) => {
    const playerNamesForEachHour = Object.values(possibleRaidHours)
    const hours = Object.keys(possibleRaidHours)
    for (const playerNames of playerNamesForEachHour) {
        const hour = hours[playerNamesForEachHour.indexOf(playerNames)]
        let healers = [], tanks = []
        for (const playerName of playerNames) {
            const index = playerNames.indexOf(playerName)
            const member = members.get(playerName.slice(2, -1))
            if (member.roles.some(role => role.name.match(healerRoles))) {
                healers.push(playerName)
                possibleRaidHours[hour][index] += ' 🚑'
            }
            if (member.roles.some(role => role.name.match(tankRoles))) {
                tanks.push(playerName)
                possibleRaidHours[hour][index] += ' 🛡'
            }
        }
        handleNotEnoughHealersOrTanks(healers, tanks, possibleRaidHours, hour)
    }
}
