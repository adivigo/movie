const ctrl = {}
const model = require('../models/bookings')
const respone = require('../helpers/response')

ctrl.getData = async (req, res) => {
    try {
        const result = await model.getAllBook()
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}

ctrl.saveData = async (req, res) => {
    try {
        const { film_id, schedule_id, genre_id, total_payment } = req.body
        const result = await model.addBook({ film_id, schedule_id, genre_id, total_payment })
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}

ctrl.deleteData = async (req, res) => {
    try {
        const id = req.params.id
        const result = await model.deleteBook(id)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}

ctrl.updateData = async (req, res) => {
    try { 
        const id = req.params.id
        const data = await model.UpdateBook(id, req.body)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
    }
}

ctrl.fetchBy = async (req, res) => {
    try {
        const params = {
            page: req.query.page || 1,
            limit: req.query.limit || 5,
            orderBy: req.query.orderBy || 'created_at',
            search: req.query.search
        }
        const result = await model.getBy(params)
        return respone(res, 200, result)
    } catch (error) {
        console.log(error)
        return respone(res, 500, error.message)
    }
}

module.exports = ctrl