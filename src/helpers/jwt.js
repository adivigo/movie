const jwt = require('jsonwebtoken')
const db = require('../config/db')
require('dotenv').config()

const genToken = async (username) => {
    try{
        const query = 'SELECT role FROM public.users WHERE username = $1';
        const values = [username]
        const result = await db.query(query, values)

        if(result.rows.length > 0){
            const role = result.rows[0].role

            const payload = {
                username: username,
                role: role
            }

            const token = jwt.sign(payload, process.env.SECRET_KEYS, {expiresIn: '10m'})
            return token
        } else {
            throw new Error('User not found')
        }
    } catch (error) {
        throw new Error('Failed to generate token')
    }
}

module.exports = {
    genToken
}