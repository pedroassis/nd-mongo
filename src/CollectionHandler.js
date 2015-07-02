'package nd-mongo'

function CollectionHandler(Model) {
    
    this.get = function(query) {
        var limit = query.limit || 30;
        var offset = query.offset || 0;
        return Model
                .find({})
                .skip(offset)
                .limit(limit)
                .exec()
    };
    
    this.find = function(body, query) {
        var limit = query.limit || 30;
        var offset = query.offset || 0;
        return Model
                .find(body)
                .skip(offset)
                .limit(limit)
                .exec()
    };
    
    this.remove = function($id) {
        return Model.remove({
            _id : $id
        });
    };
    
    this.getByID = function($id) {
        return Model
                .findOne({
                    _id : $id
                })
                .exec()
    };
    
    this.create = function(body) {
        return new Model(body).save();
    };
    
    this.update = function(body) {
        var $id = body._id;
        return Model
                .update({
                    _id : $id
                },
                body)
                .exec();
    };

}

module.exports = function() {
    return CollectionHandler;
};

module.exports.className = 'nd-mongo.CollectionHandler';
