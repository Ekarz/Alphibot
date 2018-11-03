const { months, days } = require('../config.json')

module.exports = {
    name: 'raid',
    args: false,
    guildOnly: true,
    officerOnly: true,
    description: 'Lance un appel aux disponibilités de raid.',
    raid: [], // Array d'objets (raidDay). cf plus bas
    execute(message, args) {
        this.raid.length = 0
        const startOfWeek = findNextTuesday()
        const endOfWeek = new Date()
        endOfWeek.setDate(findNextTuesday().getDate() + 6)
        message.channel.send(`Préparation d'un raid pour la semaine du **${formatDate(startOfWeek)}** au **${formatDate(endOfWeek)}**...`)
        setupRaid(this, startOfWeek)
    },
}

const formatDate = date => `${days[(date.getDay() + 5) % 7]} ${date.getDate()} ${months[date.getMonth()]}`

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
