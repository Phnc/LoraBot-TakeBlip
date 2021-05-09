const repositoriesRoutes = require('./repositories_routes');

module.exports = function(app){
    repositoriesRoutes(app);
}