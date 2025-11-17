const validarCamposActualizar = (req, res, next) => {
    const { lessonNumber, code } = req.body

    if((!code || !lessonNumber)) return res.status(400).json({
        error: 'All fields are required',
        status: 400
    })
    
    req.fields = { lessonNumber, code }

    next()
}

module.exports = { validarCamposActualizar }