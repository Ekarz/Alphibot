const { raid } = require('./raid')
const raidSize = 8

module.exports = {
    name: 'recap',
    args: false,
    cooldown: 10,
    guildOnly: true,
    raiderOnly: true,
    description: 'Demande un récapitulatif de l\'organisation actuelle pour le raid.',
    execute(message, args) {
        if (raid.length) {
            const baseRecapMessage = []
            const raidPossibilitiesMessage = []
            for (raidDay of raid) {
                fillBaseRecapMessage(raidDay, baseRecapMessage)
                fillRaidPossibilitiesMessage(raidDay, raidPossibilitiesMessage)
            }
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

const fillBaseRecapMessage = (raidDay, data) => {
    const numberOfPlayers = Object.keys(raidDay.players).length
    if (numberOfPlayers) {
        let str = `**[${numberOfPlayers}] ${raidDay.date} :** `
        for (playerName of Object.keys(raidDay.players)) {
            str += `${playerName} (${raidDay.players[playerName]}), `
        }
        data.push(str.slice(0, -2))
    }
}

const findPossibleRaidHours = players => {
    const hours = Object.values(players).map(e => convertToMinutes(e))
    const playerNames = Object.keys(players)
    if (hours.length < raidSize) return null
    const possibleRaidHours = {}
    while (hours.length >= raidSize) {
        const hour = Math.max(...hours)
        if (possibleRaidHours[hour] === undefined) possibleRaidHours[hour] = playerNames.slice()
        playerNames.splice(hours.indexOf(hour), 1)
        hours.splice(hours.indexOf(hour), 1)
    }
    return possibleRaidHours
}

const fillRaidPossibilitiesMessage = (raidDay, data) => {
    const possibleRaidHours = findPossibleRaidHours(raidDay.players)
    if (possibleRaidHours !== null) {
        data.push(`Il est possible de partir le **${raidDay.date}** :`)
        for (const possibleRaidHour of Object.entries(possibleRaidHours)) {
            data.push(`- à ${convertToString(possibleRaidHour[0])} avec ${possibleRaidHour[1]}`)
        }
    }
}
