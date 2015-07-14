/**
 * Created by zzpierce on 2015/7/15.
 * Import after THREE.js
 */


var EarthModel = {};

EarthModel = function( r, l ) {

    this.r = r;     //radius
    this.lineLatitude = ( l !== undefined ) ? l : 20;
    this.lineLongitude = ( l !== undefined ) ? l : 20;
    this.pts = [];

};

EarthModel.prototype = {

    constructor: EarthModel,

    createMesh : function() {

        var earthMesh = {};     //Object contains all meshes of earth model

        var vNow;
        var alpha, theta;
        var xi, yi;
        var xij, yij, zij;

        for( var i = 0; i <= this.lineLatitude; i ++ ) {

            alpha = i / this.lineLatitude * Math.PI;
            xi = r * Math.sin( alpha );
            yi = r * Math.cos( alpha );
            this.pts[ i ] = [];


            for( var j = 0; j <= this.lineLongitude; j ++ ) {

                theta = j / this.lineLongitude * 2 * Math.PI;
                zij = xi * Math.sin( theta );
                xij = xi * Math.cos( theta );
                yij = yi;
                vNow = new THREE.Vector3( xij, yij, zij );
                this.pts[ i ].push( vNow );

            }

        }

        var geometry;
        //line mesh
        earthMesh.lineMesh = this.createLineMesh();
        earthMesh.faceMesh = this.createFaceMesh();

        return earthMesh;

    },

    //create line of longitude and latitude
    createLineMesh : function() {

        var lineMesh = [];

        var vertices = [];
        var vertices2 = [];
        for( i = 0; i < this.pts.length - 1; i ++ ) {

            vertices[ i ] = [];
            vertices2[ i ] = [];
            for( j = 0; j < this.pts[ i ].length - 1; j ++ ) {

                vertices[ i ].push(
                    this.pts[ i ][ j ],
                    this.pts[ i ][ ( j + 1 ) % this.pts[ i ].length ]
                );
                vertices2[ i ].push(
                    this.pts[ j ][ i ],
                    this.pts[ ( j + 1 ) % this.pts.length ][ i ]
                );

            }
            geometry = new THREE.Geometry();
            geometry.vertices = vertices[ i ];
            lineMesh.push( new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial( { color : 0xFF0000, size:0.3 } )
            ) );
            geometry = new THREE.Geometry();
            geometry.vertices = vertices2[ i ];
            lineMesh.push( new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial( { color : 0xFF0000, size:0.3 } )
            ) );
        }

        return lineMesh;

    },

    createFaceMesh : function() {

    }
};