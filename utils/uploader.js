const multer = require("multer")
const { ObjectId} = require("mongodb")
const fs = require("fs")

const mediaStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads")
    },
    filename: (req, file, callback) => {
        callback(null, getNewFileName(file))
    }
})

function getNewFileName(file){
    let extension = file.originalname
    extension = extension.split(".")
    extension = extension[extension.length - 1]
    let fileName =  new ObjectId().toString() + "." + extension
    return fileName
}

let uploadMediaFile = multer({
    storage: mediaStorage})
    .fields([
    {name: "imageFile"},
    {name: "videoFile"}
])

const getFileNameForDB = (filesInfo, errors, maxSize, allowedType, isImageUpload) => {
    let fileNameForDB = null
    if(filesInfo !== undefined) {
        let fileInfo = filesInfo[0]
        fileNameForDB = fileInfo.filename
        if(fileInfo.size > maxSize) {
            try {
                deleteUploadedFile(fileInfo.destination, fileNameForDB)
            } catch(exception) {
                console.log(exception)
            }
            fileName = fileInfo.originalname
            if(isImageUpload) {
                errors.imageFile = "Image file size should not be increased by 3 MB."
            } else {
                errors.videoFile = "Video file size should not be increased by 50 MB."
            }
            
        }
        if(!allowedType.includes(fileInfo.mimetype)) {
            try {
                deleteUploadedFile(fileInfo.destination, fileNameForDB)
            } catch(exception) {
                console.log(exception)
            }
            fileName = fileInfo.originalname
            if(isImageUpload) {
                errors.imageFile = "Image file should be in png, jpg and jpeg."
            } else {
                errors.videoFile = "Video file should be in mp4, mkv and mpeg format."
            }
        }
    }
    return {fileNameForDB, errors}
}

function deleteUploadedFile(folderName, fileName) {
    fs.unlinkSync(`${folderName}/${fileName}`)
}

module.exports = {
    uploadMediaFile,
    getFileNameForDB
}