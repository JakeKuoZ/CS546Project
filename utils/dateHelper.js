const getTodaysDate = () => {

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const dateObj = new Date()
    const month = dateObj.getMonth()
    const year = dateObj.getFullYear()
    const day = ""+dateObj.getDate()

    return `${months[month]} ${day.padStart(2,"0")}, ${year}`
}

module.exports = {
    getTodaysDate
}