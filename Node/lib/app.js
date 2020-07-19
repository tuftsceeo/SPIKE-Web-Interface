var onshape = null;
var getParts = function (documentId, wvm, wvmId, elementId, cb) {
    var opts = {
        d: documentId,
        e: elementId,
        resource: 'parts'
    };
    opts[wvm] = wvmId;
    onshape.get(opts, cb);
}

var getMassProperties = function (documentId, wvm, wvmId, elementId, cb) {
    var opts = {
        d: documentId,
        e: elementId,
        resource: 'partstudios',
        subresource: 'massproperties',
        query: {
            massAsGroup: false
        }
    }
    opts[wvm] = wvmId;
    onshape.get(opts, cb);
}

var createPartStudio = function (documentId, workspaceId, name, cb) {
    var opts = {
        d: documentId,
        w: workspaceId,
        resource: 'partstudios'
    }
    if (typeof name === 'string') {
        opts.body = {name: name};
    }
    onshape.post(opts, cb);
}

var deleteElement = function (documentId, workspaceId, elementId, cb) {
    var opts = {
        d: documentId,
        w: workspaceId,
        e: elementId,
        resource: 'elements',
    }
    onshape.delete(opts, cb);
}

var uploadBlobElement = function (documentId, workspaceId, file, mimeType, cb) {
    var opts = {
        d: documentId,
        w: workspaceId,
        resource: 'blobelements',
        file: file,
        mimeType: mimeType
    }
    onshape.upload(opts, cb);
}

var getDocuments = function (queryObject, cb) {
    var opts = {
        path: '/api/documents',
        query: queryObject
    }
    onshape.get(opts, cb);
}

var getEndpoints = function (cb) {
    var opts = {
        path: '/api/endpoints'
    }
    onshape.get(opts, cb);
}

var partStudioStl = function (documentId, workspaceId, elementId, cb) {
    var opts = {
        d: documentId,
        w: workspaceId,
        e: elementId,
       
        resource: 'partstudios',
        subresource: 'stl',
        headers: {
            'Accept': 'application/vnd.onshape.v1+octet-stream'
        }
    };
    onshape.get(opts, cb);
}


/*
var occurrenceTransforms = function (documentId, workspaceId, elementId,Transform,pathname, cb) {
var opts={}

for (var i=0;i<Transform.length  ;i++){
     opts[i] = {
        d: documentId,
        w: workspaceId,
        e: elementId,
        resource: 'assemblies',
        body: {"occurrences":[{"path":[pathname],"transform" : [ 1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],

"fixed":true,"hidden":false}],"transform":[                             
        0.8047378541    ,   -0.3106172175   ,   0.5058793634    ,   0   ,
        0.5058793634    ,   0.8047378541    ,   -0.3106172175   ,   0   ,
        -0.3106172175   ,   0.5058793634    ,   0.8047378541    ,   0   ,
        0   ,   0   ,   0   ,   1   
] ,"isRelative":true},
        subresource:'occurrencetransforms',
        headers: {
            'Accept': 'application/vnd.onshape.v1+json'
        }
    }

onshape.post(opts[i], cb);

};

}

*/


var occurrenceTransforms = function (documentId, workspaceId, elementId,Transform,pathname,relative, cb) {
var opts={}
     opts= {
        d: documentId,
        w: workspaceId,
        e: elementId,
        resource: 'assemblies',
        body: {"occurrences":[{"path":[pathname],
        "transform" : [ 1,0,0,1,0,1,0,1,0,0,1,1,0,0,0,1],
        "fixed":false,
        "hidden":false
        }],
        "transform":Transform ,
        "isRelative":relative
    },
        subresource:'occurrencetransforms',
        headers: {
            'Accept': 'application/vnd.onshape.v1+json'
        }
    }

onshape.post(opts, cb);

};





var assemblyDefinition = function (documentId, workspaceId,  elementId, cb) {
    var opts = {
        d: documentId,
        w: workspaceId,
        e: elementId,
        resource: 'assemblies',

        query: {
            includeMateFeatures:true,
            includeNonSolids:false,
            includeMateConnectors:false
        }
    }
    onshape.get(opts, cb);

};


module.exports = function (creds) {
    onshape = require('./onshape.js')(creds);
    return {
        getParts: getParts,
        getMassProperties: getMassProperties,
        createPartStudio: createPartStudio,
        deleteElement: deleteElement,
        uploadBlobElement: uploadBlobElement,
        getDocuments: getDocuments,
        getEndpoints: getEndpoints,
        partStudioStl: partStudioStl,
        occurrenceTransforms: occurrenceTransforms,
        assemblyDefinition: assemblyDefinition
    };
};
