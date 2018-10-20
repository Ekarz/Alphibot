const { months, days } = require('../config.json')

module.exports = {
    name: 'raid',
    args: false,
    usage: '', //TODO
    guildOnly: true,
    officerOnly: true,
    description: 'Lance un appel aux disponibilités de raid.',
    raid: [], // Array 2 dimensions. dans raid => chaque jour de la semaine / dans chaque jour => les joueurs
    execute(message, args) {
        this.raid.length = 0
        const startOfWeek = findNextTuesday()
        const endOfWeek = new Date()
        endOfWeek.setDate(findNextTuesday().getDate() + 6)
        message.channel.send(`Préparation d'un raid pour la semaine du **mardi ${startOfWeek.getDate()} ${months[startOfWeek.getMonth()]}** ` +
            `au **lundi ${endOfWeek.getDate()} ${months[startOfWeek.getMonth()]}**...`)
        setupRaid(this, startOfWeek)
    },
}

const findNextTuesday = () => {
    const now = new Date()
    const nextTuesday = new Date()
    nextTuesday.setDate(now.getDate() + 7 - (now.getDay() + 5) % 7)
    return nextTuesday
}

const setupRaid = (context, startOfWeek) => {
    for (const day of days) {
        const weekDay = findNextTuesday()
        weekDay.setDate(startOfWeek.getDate() + days.indexOf(day))
        const raidDay = {
            date: `${day} ${weekDay.getDate()} ${months[weekDay.getMonth()]}`,
            players: {}, // one player = { playerName: hour }
        }
        context.raid.push(raidDay)
    }
}
