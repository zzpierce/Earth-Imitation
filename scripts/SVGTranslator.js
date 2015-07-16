/**
 * Created by ս on 2015/7/17.
 *
 * input: SVG map
 * format: JSON
 *
 * output: vertices vector
 */


var SVGTranslator = function() {

    this.vertices = []

};


SVGTranslator.prototype = {
    constructor: SVGTranslator,

    translate: function( path ) {

        var _path = path;
        var pathLen = _path.length;
        
        for( var i = 0; i < pathLen; i ++ ) {
            var d = _path[ i ].d;
            var _d = d.split(/([^\d\.-]+)/);
            path.push( _d );

//            for( var j=0;j<_d.length;j++){
//                if(_d[j] == "zm" || _d[j] == "zM" || _d[j] == 'm' )console.log(_d[j]);
//            }
        }
        
        var nowX, nowY;
        for( i = 0; i < path.length; i ++ ) {
            this.vertices[ i ] = [];
            var k = -1;
            for( var j = 0; j < path[ i ].length; j++ ) {
                switch( path[ i ][ j ] ){
                    case 'M':
                    case 'zM':
                        k ++;
                        this.vertices[i][k] = [];
                        nowX = parseFloat( path[i][j+1] );
                        nowY = parseFloat( path[i][j+3] );
                        this.vertices[ i][k].push( new THREE.Vector3( nowX, nowY, 0) );
                        j += 3;
                        break;
                    case 'L':
                        nowX = parseFloat( path[i][j+1] );
                        nowY = parseFloat( path[i][j+3] );
                        this.vertices[ i][k].push( new THREE.Vector3( nowX, nowY, 0) );
                        j += 3;
                        break;
                    case 'H':
                        nowX = parseFloat( path[i][j+1] );
                        this.vertices[i][k].push( new THREE.Vector3( nowX, nowY, 0));
                        j += 1;
                        break;
                    case 'V':
                        nowY = parseFloat( path[i][j+1] );
                        this.vertices[i][k].push( new THREE.Vector3( nowX, nowY, 0));
                        j += 1;
                        break;
                    case 'l':
                        nowX = parseFloat( nowX ) + parseFloat( path[i][j+1] );
                        nowY = parseFloat( nowY ) + parseFloat( path[i][j+3] );
                        this.vertices[ i][k].push( new THREE.Vector3( nowX, nowY, 0) );
                        j += 3;
                        break;
                    case 'h':
                        nowX = parseFloat( nowX ) + parseFloat( path[i][j+1] );
                        this.vertices[ i][k].push( new THREE.Vector3( nowX, nowY, 0) );
                        j += 1;
                        break;
                    case 'v':
                        nowY = parseFloat( nowY ) + parseFloat( path[i][j+1] );
                        this.vertices[i][k].push( new THREE.Vector3( nowX, nowY, 0));
                        j += 1;
                        break;
                    default: break;
                }
                if( nowX > xMax ) xMax = nowX;
                if( nowY > yMax ) yMax = nowY;
            }

        }


        for( i = 0; i < this.vertices.length; i ++ ) {
            for( j = 0; j < this.vertices[i].length; j ++ ) {
                for( k = 0; k < this.vertices[i][j].length; k ++ ) {
                    this.vertices[i][j][k] = this.mapping( this.vertices[i][j][k] );
                }
            }
        }
    },

    mapping: function( v3 ) {

        var xe = v3.x * ( mapRegion.rightLongitude - mapRegion.leftLongitude ) / xMax + 190.5;
        //var ye = v3.y * ( mapRegion.topLatitude - mapRegion.bottomLatitude ) / yMax + 90 - mapRegion.topLatitude;

        var yt = ( 462.5 - v3.y ) / 500 * 180;

        var alpha = - 2 * Math.atan( Math.exp( yt * Math.PI / 180 ) );
        var theta = xe * toAngle;

        var xTmp = r * Math.sin( alpha );
        var y = - r * Math.cos( alpha );
        var x = - xTmp * Math.cos( theta );
        var z = xTmp * Math.sin( theta );

        return new THREE.Vector3( x, y, z );

    }
};

