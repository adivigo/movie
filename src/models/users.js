const db = require('../config/db')
const model = {}

model.getData = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM public.users ORDER BY created_at DESC')
            .then((res) => {
                let result = res.rows
                if (res.rows <= 0) {
                    result = 'data not found'
                }

                resolve(result)
            })
            .catch((er) => {
                reject(er)
            })
    })
}

model.getByUser = (username) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM public.users WHERE username = $1', [username])
            .then((res) => {
                resolve(res.rows)
            })
            .catch((er) => {
                reject(er)
            })
    })
}

model.saveData = ({ username, password, email }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO public.users
            (username, "password", email)
            VALUES($1, $2, $3);            
        `,
            [username, password, email]
        )
            .then((res) => {
                resolve(`${res.rowCount} user created`)
            })
            .catch((er) => {
                reject(er)
            })
    })
}

model.updateData = ({ username, password, email, role, user_id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE public.users SET
                username = COALESCE(NULLIF($1, ''), username),
                password = COALESCE(NULLIF($2, ''), password),
                email = COALESCE(NULLIF($3, ''), email),
                role = COALESCE(NULLIF($4, ''), role),
                updated_at = now()
            WHERE user_id = $5           
        `,
            [username, password, email, role, user_id]
        )
            .then((res) => {
                resolve(`${res.rowCount} user updated`)
            })
            .catch((er) => {
                reject(er)
            })
    })
}

model.deleteData = (username) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM public.users WHERE username = $1`, [username])
            .then((res) => {
                resolve(`${res.rowCount} user deleted`)
            })
            .catch((er) => {
                reject(er)
            })
    })
}

module.exports = model