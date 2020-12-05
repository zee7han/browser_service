const controllers = require('../controllers')

module.exports = (app) => {
    app.route("/start").get(controllers.start)
    app.route("/stop").get(controllers.stop)
    app.route("/geturl").get(controllers.geturl)
    app.route("/cleanup").get(controllers.cleanup)
}