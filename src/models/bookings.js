const db = require('../config/db')
const escape = require('pg-format')
const model = {}

model.getAllBook = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM public.booking ORDER BY booking_id DESC')
            .then((res) => {
                resolve(res.rows)
            })
            .catch((er) => {
                reject(er)
            })
    })
}

model.addBook = ({ film_id, schedule_id, genre_id, total_payment}) => {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO public.booking (film_id, schedule_id, genre_id, total_payment, created_at) VALUES($1, $2, $3, $4, now())`, 
        [film_id, schedule_id, genre_id, total_payment])
            .then((res) => {
                resolve(res.data)
            })
            .catch((er) => {
                reject(er)
            })
    })
}

model.deleteBook = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM public.booking WHERE booking_id = $1`, [id])
        .then(() => {
            resolve('data has been deleted')
        })
        .catch((err) => {
            reject(err)
        })
    })
}


model.UpdateBook = (id, data) => {
    const query = `UPDATE public.booking 
    SET 
        film_id = $1,
        schedule_id = $2,
        genre_id =$3,
        total_payment = $4,
        updated_at = now()
        WHERE booking_id = $5`

    return new Promise((resolve, reject) => {
        db.query(query, [
            data.film_id, 
            data.schedule_id, 
            data.genre_id, 
            data.total_payment, 
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
            filterQuery += escape('AND film_id = %L', search)
        }

        if (orderBy) {
            orderQuery += escape('ORDER BY %s DESC ', orderBy)
        }

        if (page && limit) {
            const offset = (page - 1) * limit
            metaQuery += escape('LIMIT %s OFFSET %s', limit, offset)
        }

        db.query(`SELECT COUNT(booking_id) as "count" FROM public.booking WHERE true ${filterQuery}`).then((v) => {
            count = v.rows[0].count
        })

        const data = await db.query(`
            SELECT 
                bk.booking_id,
                bk.film_id,
                bk.schedule_id,
                bk.genre_id,
                bk.total_payment,
                bk.created_at, 
                bk.updated_at
            FROM public.booking bk
            WHERE true ${filterQuery}
            GROUP BY bk.booking_id
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