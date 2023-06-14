const db = require('../config/db')
const escape = require('pg-format')
const model = {}

model.getAllSche = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM public.schedule ORDER BY schedule_id DESC')
            .then((res) => {
                resolve(res.rows)
            })
            .catch((er) => {
                reject(er)
            })
    })
}

model.addSche = ({ film, location, price, date_start, date_end, time}) => {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO public.schedule (film, location, price, date_start, date_end, time, created_at) VALUES($1, $2, $3, $4, $5, $6, now())`, 
        [film, location, price, date_start, date_end, time])
            .then((res) => {
                resolve(res.data)
            })
            .catch((er) => {
                reject(er)
            })
    })
}

model.deleteSche = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM public.schedule WHERE schedule_id = $1`, [id])
        .then(() => {
            resolve('data has been deleted')
        })
        .catch((err) => {
            reject(err)
        })
    })
}


model.UpdateSche = (id, data) => {
    const query = `UPDATE public.schedule 
    SET 
        film = $1,
        location = $2,
        price =$3,
        date_start = $4,
        date_end = $5,
        time = $6,
        updated_at = now()
        WHERE schedule_id = $7`

    return new Promise((resolve, reject) => {
        db.query(query, [
            data.film, 
            data.location, 
            data.price, 
            data.date_start, 
            data.date_end, 
            data.time,
            id
        ])
        .then(() => {
            resolve('data has been updated')
        })
        .catch((err) => {
            reject(err)
        })
    })
}

model.getBy = async ({ page, limit, orderBy, search }) => {
    try {
        let filterQuery = ''
        let orderQuery = ''
        let metaQuery = ''
        let count = 0

        if (search) {
            filterQuery += escape('AND film = %L', search)
        }

        if (orderBy) {
            orderQuery += escape('ORDER BY %s DESC ', orderBy)
        }

        if (page && limit) {
            const offset = (page - 1) * limit
            metaQuery += escape('LIMIT %s OFFSET %s', limit, offset)
        }

        db.query(`SELECT COUNT(schedule_id) as "count" FROM public.schedule WHERE true ${filterQuery}`).then((v) => {
            count = v.rows[0].count
        })

        const data = await db.query(`
            SELECT 
                sc.schedule_id,
                sc.film,
                sc.location,
                sc.price,
                sc.date_start,
                sc.date_end,
                sc.time,
                sc.created_at, 
                sc.updated_at
            FROM public.schedule sc
            WHERE true ${filterQuery}
            GROUP BY sc.schedule_id
            ${orderQuery} ${metaQuery}
        `)

        const meta = {
            next: count <= 0 ? null : page == Math.ceil(count / limit) ? null : Number(page) + 1,
            prev: page == 1 ? null : Number(page) - 1,
            total: count
        }

        if (data.rows <= 0) {
            return 'data not found'
        } else {
            return { data: data.rows, meta }
        }
    } catch (error) {
        throw error
    }
}

module.exports = model