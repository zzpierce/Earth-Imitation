/**
 * Created by ս on 2015/7/10.
 */
var fs = require("fs");

var SVGDecoder = function(){

};

SVGDecoder.prototype = {
    constructor:SVGDecoder,

    readFromFile : function( path, callback ) {

        var _this = this;
        fs.readFile( path, String, function( err, data ) {
            var _data = data;
            console.log( _data );
        })
    }

};

var svg = new SVGDecoder();
svg.readFromFile( "./data/testmap/worldLow.js", function(){

});


