const db = require('../config/db')
const escape = require('pg-format')
const model = {}

model.getAllMov = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM public.film ORDER BY film_id DESC')
            .then((res) => {
                resolve(res.rows)
            })
            .catch((er) => {
                reject(er)
            })
    })
}

model.addMov = ({ judul_film, genre, release_date, directed_by, duration, casts, image}) => {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO public.film (judul_film, genre, release_date, directed_by, duration, casts, image, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, now())`, 
        [judul_film, genre, release_date, directed_by, duration, casts, image])
            .then((res) => {
                resolve(res.data)
            })
            .catch((er) => {
                reject(er)
            })
    })
}

model.deleteMov = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM public.film WHERE film_id = $1`, [id])
        .then(() => {
            resolve('data has been deleted')
        })
        .catch((err) => {
            reject(err)
        })
    })
}


model.UpdateMov = (id, data) => {
    const query = `UPDATE public.film 
    SET 
        judul_film = $1,
        genre = $2,
        release_date =$3,
        directed_by = $4,
        duration = $5,
        casts = $6,
        image = $7,
        updated_at = now()
        WHERE film_id = $8`

    return new Promise((resolve, reject) => {
        db.query(query, [
            data.judul_film, 
            data.genre, 
            data.release_date, 
            data.directed_by, 
            data.duration, 
            data.casts,
            data.image,
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

model.SearchMovRelease = (data) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM public.film 
        WHERE LOWER(judul_film) LIKE '%' || $1 || '%' 
        ORDER BY judul_film ASC, release_date DESC`, [data])
        .then((data) => {
            resolve(data.rows)
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
            filterQuery += escape('AND judul_film = %L', search)
        }

        if (orderBy) {
            orderQuery += escape('ORDER BY %s DESC ', orderBy)
        }

        if (page && limit) {
            const offset = (page - 1) * limit
            metaQuery += escape('LIMIT %s OFFSET %s', limit, offset)
        }

        db.query(`SELECT COUNT(film_id) as "count" FROM public.film WHERE true ${filterQuery}`).then((v) => {
            count = v.rows[0].count
        })

        const data = await db.query(`
            SELECT 
                mv.film_id,
                mv.judul_film,
                mv.genre,
                mv.release_date,
                mv.directed_by,
                mv.duration,
                mv.casts,
                mv.created_at, 
                mv.updated_at
            FROM public.film mv
            WHERE true ${filterQuery}
            GROUP BY mv.film_id
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