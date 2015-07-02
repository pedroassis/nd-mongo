'package nd-mongo';

'import nd-mongo.CollectionHandler'
'import nd-mongo.Metadata'
'import nd-mongo.Mongoose'
'import nd-express-plugin.ExpressPlugin';
'import nd.NodeDependencyConfig';

'@BeforeLoadContainer'
function MongoPlugin (MongoModels, ExpressPlugin, CollectionHandler, Metadata, Mongoose, NodeDependencyConfig) {

    var mongoose = Mongoose;
    
    "@InjectAnnotatedWith([])"
    this.configure = function() {
        MongoModels.forEach(buildModel);

        mongoose.connect(NodeDependencyConfig.mongo.host, function (error) {
            if (error) {
                console.log(error);
            }
        });
    };

    function buildModel (model) {
        var Schema = mongoose.Schema;
        var ModelSchema = new Schema(model.schema);

        var Model = mongoose.model(model.name, ModelSchema);

        var handler = new CollectionHandler(Model);

        buildHandler(handler, model);
    }

    function buildHandler(handler, model) {
        handler.constructor = function(){};

        var metadata = Metadata.build();

        metadata.name = model.name;

        metadata.annotations.RequestHandler.value = model.url;

        metadata.methods = Object.keys(handler).map(function(key) {
            var methodMetadata = methodLookup[key]();
            handler[key].annotations = methodMetadata.annotations;
            handler[key].$inject = methodMetadata.parameters;
            return methodMetadata;
        });

        handler.constructor.annotations = metadata.annotations;
        handler.constructor.methods = metadata.methods;

        ExpressPlugin.addHandler(handler);
    }

    var methodLookup = {};

    methodLookup.get = function() {
        var method = Metadata.buildMethod();
        method.name = 'get';
        method.parameters = ['query'];
        method.annotations.Get = {};
        method.annotations.Get.name = 'Get';
        method.annotations.Get.value = '/';
        return method;
    };

    methodLookup.find = function() {
        var method = Metadata.buildMethod();
        method.name = 'find';
        method.parameters = ['body', 'query'];
        method.annotations.Post = {};
        method.annotations.Post.name = 'Post';
        method.annotations.Post.value = '/find';
        return method;
    };

    methodLookup.remove = function() {
        var method = Metadata.buildMethod();
        method.name = 'remove';
        method.parameters = ['$id'];
        method.annotations.Delete = {};
        method.annotations.Delete.name = 'Delete';
        method.annotations.Delete.value = '/:id';
        return method;
    };

    methodLookup.getByID = function() {
        var method = Metadata.buildMethod();
        method.name = 'getByID';
        method.parameters = ['$id'];

        method.annotations.Get = {};
        method.annotations.Get.name = 'Get';
        method.annotations.Get.value = '/:id';
        return method;
    };

    methodLookup.create = function() {
        var method = Metadata.buildMethod();
        method.name = 'create';
        method.parameters = ['body'];
        method.annotations.Post = {};
        method.annotations.Post.name = 'Post';
        method.annotations.Post.value = '/';
        return method;
    };

    methodLookup.update = function() {
        var method = Metadata.buildMethod();
        method.name = 'update';
        method.parameters = ['body'];
        method.annotations.Put = {};
        method.annotations.Put.name = 'Put';
        method.annotations.Put.value = '/';
        return method;
    };

}

module.exports = MongoPlugin;