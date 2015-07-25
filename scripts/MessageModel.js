/**
 * Created by ս on 2015/7/24.
 */

var MessageModel = function ( r ) {

    this.r = r;
    this.vFrom = getSpherePoint( r );
    this.vTo = getSpherePoint( r );

    this.curveMesh = 0;
    this.pieceMesh = [];

    this.pts = [];
    this.time = 0;
    this.start = 0;

    //status = 0 means not ready
    //1 means display
    //2 means should be removed
    //3 removed from scene, need to be deleted
    this.status = 0;

    function getSpherePoint( r ) {

        var alpha = Math.random() * 2 * Math.PI;
        var theta = Math.random() * 2 * Math.PI;

        var v = new THREE.Vector3();
        v.x = r * Math.sin( alpha ) * Math.cos( theta );
        v.y = r * Math.cos( alpha );
        v.z = r * Math.sin( alpha ) * Math.sin( theta );

        return v;

    }

};

MessageModel.prototype = {

    constructor: MessageModel,

    init: function() {

        this.initCurve();
        this.initPiece();

        this.time = 0;
    },

    initCurve: function() {

        var s = this.vFrom.distanceTo( this.vTo ) / ( 2 * r );
        var scale = s / 6 + 1.05;
        var direction = new THREE.Vector3().subVectors( this.vTo, this.vFrom );

        var middle = new THREE.Vector3().lerpVectors( this.vTo, this.vFrom, 0.5).normalize();
        var curveMiddle = middle.multiplyScalar( r * scale );

        var vMiddle1 = new THREE.Vector3().lerpVectors( this.vFrom, this.vTo, 0.2)
            .normalize().multiplyScalar( r * scale * 0.95 );

        var vMiddle2 = new THREE.Vector3().copy( curveMiddle ).add(
            new THREE.Vector3().copy( direction).multiplyScalar( -0.2 )
        );


        var vMiddle3 = new THREE.Vector3().copy( curveMiddle ).add(
            new THREE.Vector3().copy( direction).multiplyScalar( 0.2 )
        );

        var vMiddle4 = new THREE.Vector3().lerpVectors( this.vFrom, this.vTo, 0.8)
            .normalize().multiplyScalar( r * scale * 0.95 );

        var curve1 = new THREE.CubicBezierCurve3(
            this.vFrom, vMiddle1, vMiddle2, curveMiddle
        );
        var curve2 = new THREE.CubicBezierCurve3(
            curveMiddle, vMiddle3, vMiddle4, this.vTo
        );

        var geometry = new THREE.Geometry();

        var density = 20 + s * 100;
        this.pts = curve1.getPoints( density / 2 ).concat( curve2.getPoints( density / 2 ) );
        geometry.vertices = this.pts.slice( 0 );

        this.curveMesh = new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial( { color: 0x333333 } )
        );

    },

    initPiece: function() {

        var pts = this.pts.slice( 0 );

        var colorList = [
            0xCCCC33, 0x33FF00, 0xCCCCCC
        ];

        var index = Math.floor( Math.random() * colorList.length );
        var colorChosen = colorList[ index ];

        var red = ( colorChosen & 0xFF0000 ) >> 16;
        var green = ( colorChosen & 0x00FF00 ) >> 8;
        var blue = ( colorChosen & 0x0000FF );

        var halfLen = Math.floor( pts.length / 2 );
        for( var i = 0; i < halfLen; i ++ ) {

            var mid = new THREE.Vector3().copy( pts[0] );
            var direction = new THREE.Vector3().subVectors( pts[ 0 ], pts[ 1 ] );

            var side = ( 0.5 - Math.abs( 2 * i / pts.length - 0.5 ) ) * 2;

            var colorScale = ( 0.5 + side / 2 );
            var color = ( red * colorScale << 16 ) + ( green * colorScale << 8 ) + blue * colorScale;

            this.pieceMesh.push( this.getTriangle( mid, direction, side * this.r / 20, color ) );

        }

        this.status = 1;

    },

    getTriangle: function( vMid, vDirection, side, color ) {

        var pieceGeometry = new THREE.Geometry();

        var normalDirection = new THREE.Vector3().crossVectors( vMid, vDirection ).normalize();

        var pt1 = new THREE.Vector3().copy( vMid );
        var pt2 = new THREE.Vector3().copy( vMid );
        var pt3 = new THREE.Vector3().copy( vMid );

        var sq3 = Math.sqrt( 3.0 );

        pt1.setLength( vMid.length() + side / ( 2 * sq3 ) )
            .add( new THREE.Vector3().copy( normalDirection ).multiplyScalar( side / 2 ) );
        pt2.setLength( vMid.length() + side / ( 2 * sq3 ) )
            .add( new THREE.Vector3().copy( normalDirection ).negate().multiplyScalar( side / 2 ) );
        pt3.setLength( vMid.length() - side / sq3 );

        pieceGeometry.vertices.push(
            pt1, pt2, pt3, pt1
        );

        return new THREE.Line(
            pieceGeometry,
            new THREE.LineBasicMaterial( {color: color } )
        );

    },

    //GO GO GO
    update: function() {

        var jump = 1;
        this.time += jump;

        if( this.start == Math.ceil( this.time ) ) {
            return;
        }

        this.start = Math.ceil( this.time );
        var halfLen = Math.floor( this.pts.length / 2 );

        if( this.start >= this.pts.length + halfLen ) {

            this.status = 2;
            return;

        }

        for( var i = this.start; i >= 0 && i > this.start - halfLen; i -- ) {

            if( i >= this.pts.length - 1 ) continue;
            var index = this.start - i;

            //if( i + jump > this.pts.length ) jump = this.pts.length - i - 1;
            var _d = new THREE.Vector3().subVectors( this.pts[ i + jump ], this.pts[ i ] );
            var _l = _d.length();
            this.pieceMesh[ index ].translateOnAxis(
                _d.normalize(), _l
            );

        }

    }

};


