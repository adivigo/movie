const bcr = require('bcrypt')

async function securePassword(password) {
    try {
        if (password) {
            const salt = await bcr.genSalt(10)
            const result = await bcr.hash(password, salt)
            return result
        } else {
            return null
        }
    } catch (error) {
        throw error  
    }
}

module.exports = securePassword