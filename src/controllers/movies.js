const ctrl = {}
const model = require('../models/movies')
const respone = require('../helpers/response')
const fs = require("fs");

ctrl.getData = async (req, res) => {
    try {
        const result = await model.getAllMov()
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}

ctrl.saveData = async (req, res) => {
    try {
        if (req.file !== undefined) {
            req.body.image = req.file.path
        }
        const result = await model.addMov(req.body)
        return respone(res, 200, result)
    } catch (error) {
        console.log(error)
        return respone(res, 500, error.message)
    }
}

ctrl.deleteData = async (req, res) => {
    try {
        const id = req.params.id
        const result = await model.deleteMov(id)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}

ctrl.UpdateMovie = async (req, res) => {
    try { 
        if (req.file !== undefined) {
            req.body.image = req.file.path
        }
        const id = req.params.id
        const data = await model.UpdateMov(id, req.body)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
    }
}


ctrl.SearchMovie = async (req, res) => {
    try {
        const {judul_film} = req.query
        const toLower = judul_film.toLowerCase()
        const data = await model.SearchMovRelease(toLower)
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