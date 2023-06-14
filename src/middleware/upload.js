const multer = require('multer')

const storage = multer.diskStorage({
    destination: 'public/upload',
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g,'-') + '_' + file.originalname)
    }
})

const filter = (req, file, cb) => {
    if (file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({
    storage: storage,
    fileFilter: filter
})