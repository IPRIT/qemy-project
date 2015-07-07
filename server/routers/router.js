module.exports = {
    partials: templateCompiler,
    index: require('./index'),
    test: require('./test')
};

function templateCompiler(req, res) {
    var filename = req.params.filename;
    if (!filename) return;
    res.render('../../app/partials/' + filename.replace(/(\.htm|\.html)$/i, ''));
}