const generateOTP = () => {
    const length = 4
    const characters = '0123456789'

    let otp = ''
    for (let o = 0; o < length; o++) {
        const getRandomIndex = Math.floor(Math.random() * characters.length)
        otp += characters[getRandomIndex]
    }

    return otp
}

module.exports = generateOTP