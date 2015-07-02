
function MongoModels () {
    return [{
        schema : {
            name : String
        },
        name : "User",
        url : "/user"
    }];
}

module.exports = MongoModels