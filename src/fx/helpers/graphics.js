/* global THREE, Primrose, isMobile, pliny */

pliny.issue( "", {
  name: "document InsideSphereGeometry",
  type: "closed",
  description: "Finish writing the documentation for the [`InsideSphereGeometry`](#InsideSphereGeometry) class\n\
in the helpers/graphics.js file."
} );
pliny.class( "", {
  name: "InsideSphereGeometry",
  parameters: [
    {name: "radius", type: "Number", description: "How far the sphere should extend away from a center point."},
    {name: "widthSegments", type: "Number", description: "The number of faces wide in which to slice the geometry."},
    {name: "heightSegments", type: "Number", description: "The number of faces tall in which to slice the geometry."},
    {name: "phiStart", type: "Number", description: "The angle in radians around the Y-axis at which the sphere starts."},
    {name: "phiLength", type: "Number", description: "The change of angle in radians around the Y-axis to which the sphere ends."},
    {name: "thetaStart", type: "Number", description: "The angle in radians around the Z-axis at which the sphere starts."},
    {name: "thetaLength", type: "Number", description: "The change of angle in radians around the Z-axis to which the sphere ends."}
  ],
  description: "The InsideSphereGeometry is basically an inside-out Sphere. Or\n\
more accurately, it's a Sphere where the face winding order is reversed, so that\n\
textures appear on the inside of the sphere, rather than the outside. I know, that's\n\
note exactly helpful.\n\
\n\
Say you want a to model the sky as a sphere, or the inside of a helmet. You don't\n\
care anything about the outside of this sphere, only the inside. You would use\n\
InsideSphereGeometry in this case. Or its alias, [`shell()`](#shell)."
} );
function InsideSphereGeometry ( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) {
  "use strict";

  THREE.Geometry.call( this );

  this.type = 'InsideSphereGeometry';

  this.parameters = {
    radius: radius,
    widthSegments: widthSegments,
    heightSegments: heightSegments,
    phiStart: phiStart,
    phiLength: phiLength,
    thetaStart: thetaStart,
    thetaLength: thetaLength
  };

  radius = radius || 50;

  widthSegments = Math.max( 3, Math.floor( widthSegments ) || 8 );
  heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );

  phiStart = phiStart !== undefined ? phiStart : 0;
  phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

  thetaStart = thetaStart !== undefined ? thetaStart : 0;
  thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

  var x,
      y,
      vertices = [ ],
      uvs = [ ];

  for ( y = 0; y <= heightSegments; y++ ) {

    var verticesRow = [ ];
    var uvsRow = [ ];

    for ( x = widthSegments; x >= 0; x-- ) {

      var u = x / widthSegments;

      var v = y / heightSegments;

      var vertex = new THREE.Vector3();
      vertex.x = -radius * Math.cos( phiStart + u * phiLength ) * Math.sin(
          thetaStart + v * thetaLength );
      vertex.y = radius * Math.cos( thetaStart + v * thetaLength );
      vertex.z = radius * Math.sin( phiStart + u * phiLength ) * Math.sin(
          thetaStart + v * thetaLength );

      this.vertices.push( vertex );

      verticesRow.push( this.vertices.length - 1 );
      uvsRow.push( new THREE.Vector2( 1 - u, 1 - v ) );

    }

    vertices.push( verticesRow );
    uvs.push( uvsRow );

  }

  for ( y = 0; y < heightSegments; y++ ) {

    for ( x = 0; x < widthSegments; x++ ) {

      var v1 = vertices[ y ][ x + 1 ];
      var v2 = vertices[ y ][ x ];
      var v3 = vertices[ y + 1 ][ x ];
      var v4 = vertices[ y + 1 ][ x + 1 ];

      var n1 = this.vertices[ v1 ].clone()
          .normalize();
      var n2 = this.vertices[ v2 ].clone()
          .normalize();
      var n3 = this.vertices[ v3 ].clone()
          .normalize();
      var n4 = this.vertices[ v4 ].clone()
          .normalize();

      var uv1 = uvs[ y ][ x + 1 ].clone();
      var uv2 = uvs[ y ][ x ].clone();
      var uv3 = uvs[ y + 1 ][ x ].clone();
      var uv4 = uvs[ y + 1 ][ x + 1 ].clone();

      if ( Math.abs( this.vertices[ v1 ].y ) === radius ) {

        uv1.x = ( uv1.x + uv2.x ) / 2;
        this.faces.push( new THREE.Face3( v1, v3, v4, [ n1, n3, n4 ] ) );
        this.faceVertexUvs[ 0 ].push( [ uv1, uv3, uv4 ] );

      }
      else if ( Math.abs( this.vertices[ v3 ].y ) === radius ) {

        uv3.x = ( uv3.x + uv4.x ) / 2;
        this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
        this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

      }
      else {

        this.faces.push( new THREE.Face3( v1, v2, v4, [ n1, n2, n4 ] ) );
        this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv4 ] );

        this.faces.push( new THREE.Face3( v2, v3, v4, [ n2.clone(), n3,
          n4.clone() ] ) );
        this.faceVertexUvs[ 0 ].push( [ uv2.clone(), uv3, uv4.clone() ] );

      }

    }

  }

  this.computeFaceNormals();

  for ( var i = 0; i < this.faces.length; ++i ) {
    var f = this.faces[i];
    f.normal.multiplyScalar( -1 );
    for ( var j = 0; j < f.vertexNormals.length; ++j ) {
      f.vertexNormals[j].multiplyScalar( -1 );
    }
  }

  this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );

}
if ( typeof window.THREE !== "undefined" ) {

  InsideSphereGeometry.prototype = Object.create( THREE.Geometry.prototype );
  InsideSphereGeometry.prototype.constructor = InsideSphereGeometry;
}

pliny.issue( "", {
  name: "document shell",
  type: "closed",
  description: "Finish writing the documentation for the [`shell`](#shell) function\n\
in the helpers/graphics.js file."
} );

pliny.function( "", {
  name: "shell",
  parameters: [
    {name: "radius", type: "Number", description: "How far the sphere should extend away from a center point."},
    {name: "widthSegments", type: "Number", description: "The number of faces wide in which to slice the geometry."},
    {name: "heightSegments", type: "Number", description: "The number of faces tall in which to slice the geometry."},
    {name: "phi", type: "Number", description: "The angle in radians around the Y-axis of the sphere."},
    {name: "thetaStart", type: "Number", description: "The angle in radians around the Z-axis of the sphere."}
  ],
  description: "The shell is basically an inside-out sphere. Say you want a to model\n\
the sky as a sphere, or the inside of a helmet. You don't care anything about the\n\
outside of this sphere, only the inside. You would use InsideSphereGeometry in this\n\
case. It is mostly an alias for [`InsideSphereGeometry`](#InsideSphereGeometry).",
  examples: [
    {name: "Create a sky sphere", description: "To create a sphere that hovers around the user at a\n\
far distance, showing a sky of some kind, you can use the `shell()` function in\n\
combination with the [`textured()`](#textured) function. Assuming you have an image\n\
file to use as the texture, execute code as such:\n\
\n\
    grammar(\"JavaScript\");\n\
    var sky = textured(\n\
      shell(\n\
          // The radius value should be less than your draw distance.\n\
          1000,\n\
          // The number of slices defines how smooth the sphere will be in the\n\
          // horizontal direction. Think of it like lines of longitude.\n\
          18,\n\
          // The number of rinigs defines how smooth the sphere will be in the\n\
          // vertical direction. Think of it like lines of latitude.\n\
          9,\n\
          // The phi angle is the number or radians around the 'belt' of the sphere\n\
          // to sweep out the geometry. To make a full circle, you'll need 2 * PI\n\
          // radians.\n\
          Math.PI * 2,\n\
          // The theta angle is the number of radians above and below the 'belt'\n\
          // of the sphere to sweep out the geometry. Since the belt sweeps a full\n\
          // 360 degrees, theta only needs to sweep a half circle, or PI radians.\n\
          Math.PI ),\n\
      // Specify the texture image next.\n\
      \"skyTexture.jpg\",\n\
      // Specify that the material should be shadeless, i.e. no shadows. This\n\
      // works best for skymaps.\n\
      true );"}
  ]
} );
function shell ( r, slices, rings, phi, theta ) {
  var SLICE = 0.45;
  if ( phi === undefined ) {
    phi = Math.PI * SLICE;
  }
  if ( theta === undefined ) {
    theta = Math.PI * SLICE;
  }
  var phiStart = 1.5 * Math.PI - phi * 0.5,
      thetaStart = ( Math.PI - theta ) * 0.5,
      geom = new InsideSphereGeometry( r, slices, rings, phiStart, phi,
          thetaStart, theta, true );
  return geom;
}

pliny.issue( "", {
  name: "document axis",
  type: "open",
  description: "Finish writing the documentation for the [`axis`](#axis) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "axis",
  description: "<under construction>"
} );
function axis ( length, width ) {
  var center = hub();
  put( brick( 0xff0000, length, width, width ) ).on( center );
  put( brick( 0x00ff00, width, length, width ) ).on( center );
  put( brick( 0x0000ff, width, width, length ) ).on( center );
  return center;
}

pliny.issue( "", {
  name: "document box",
  type: "open",
  description: "Finish writing the documentation for the [`box`](#box) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "box",
  description: "<under construction>"
} );
function box ( w, h, l ) {
  if ( h === undefined ) {
    h = w;
    l = w;
  }
  return new THREE.BoxGeometry( w, h, l );
}

pliny.issue( "", {
  name: "document light",
  type: "open",
  description: "Finish writing the documentation for the [`light`](#light) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "light",
  description: "<under construction>"
} );
function light ( color, intensity, distance, decay ) {
  return new THREE.PointLight( color, intensity, distance, decay );
}

pliny.issue( "", {
  name: "document v3",
  type: "open",
  description: "Finish writing the documentation for the [`v3`](#v3) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "v3",
  description: "<under construction>"
} );
function v3 ( x, y, z ) {
  return new THREE.Vector3( x, y, z );
}

pliny.issue( "", {
  name: "document quad",
  type: "open",
  description: "Finish writing the documentation for the [`quad`](#quad) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "quad",
  description: "<under construction>"
} );
function quad ( w, h, s, t ) {
  if ( h === undefined ) {
    h = w;
  }
  return new THREE.PlaneBufferGeometry( w, h, s, t );
}

pliny.issue( "", {
  name: "document hub",
  type: "open",
  description: "Finish writing the documentation for the [`hub`](#hub) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "hub",
  description: "<under construction>"
} );
function hub ( ) {
  return new THREE.Object3D( );
}

pliny.issue( "", {
  name: "document brick",
  type: "open",
  description: "Finish writing the documentation for the [`brick`](#brick) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "brick",
  description: "<under construction>"
} );
function brick ( txt, w, h, l ) {
  return textured( box( w || 1, h || 1, l || 1 ), txt, false, 1, w, l );
}

pliny.issue( "", {
  name: "document put",
  type: "open",
  description: "Finish writing the documentation for the [`put`](#put) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "put",
  description: "<under construction>"
} );
function put ( object ) {
  return {
    on: function ( s ) {
      s.add( object );
      return {
        at: function ( x, y, z ) {
          object.position.set( x, y, z );
          return object;
        }
      };
    }
  };
}

pliny.issue( "", {
  name: "document textured",
  type: "open",
  description: "Finish writing the documentation for the [`textured`](#textured) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "textured",
  description: "<under construction>"
} );
function textured ( geometry, txt, unshaded, o, s, t ) {
  var material;
  if ( o === undefined ) {
    o = 1;
  }

  if ( typeof txt === "number" ) {
    if ( unshaded ) {
      material = new THREE.MeshBasicMaterial( {
        transparent: true,
        color: txt,
        opacity: o,
        shading: THREE.FlatShading
      } );
    }
    else {
      material = new THREE.MeshLambertMaterial( {
        transparent: true,
        color: txt,
        opacity: o
      } );
    }
  }
  else {
    if ( unshaded ) {
      material = new THREE.MeshBasicMaterial( {
        color: 0xffffff,
        transparent: true,
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
        opacity: o
      } );
    }
    else {
      material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        transparent: true,
        side: THREE.DoubleSide,
        opacity: o
      } );
    }

    var setTexture = function ( texture ) {
      if ( !texture ) {
        console.log( txt );
        console.trace();
      }
      else {
        material.map = texture;
        if ( s * t > 1 ) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set( s, t );
        }
      }
    };

    if ( typeof txt === "string" ) {
      Primrose.loadTexture( txt, setTexture );
    }
    else if ( txt instanceof Primrose.Text.Controls.TextBox ) {
      setTexture( txt.renderer.texture );
    }
    else {
      setTexture( txt );
    }
  }

  var obj = null;
  if ( geometry.type.indexOf( "Geometry" ) > -1 ) {
    obj = new THREE.Mesh( geometry, material );
  }
  else if ( geometry instanceof THREE.Object3D ) {
    geometry.material = material;
    obj = geometry;
  }

  return obj;
}

pliny.issue( "", {
  name: "document sphere",
  type: "open",
  description: "Finish writing the documentation for the [`sphere`](#sphere) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "sphere",
  description: "<under construction>"
} );
function sphere ( r, slices, rings ) {
  return new THREE.SphereBufferGeometry( r, slices, rings );
}

pliny.issue( "", {
  name: "document cylinder",
  type: "open",
  description: "Finish writing the documentation for the [`cylinder`](#cylinder) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "cylinder",
  description: "<under construction>"
} );
function cylinder ( rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd ) {
  return new THREE.CylinderGeometry( rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd );
}

pliny.issue( "", {
  name: "document cloud",
  type: "open",
  description: "Finish writing the documentation for the [`cloud`](#cloud) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "cloud",
  description: "<under construction>"
} );
function cloud ( verts, c, s ) {
  var geom = new THREE.Geometry();
  for ( var i = 0; i < verts.length; ++i ) {
    geom.vertices.push( verts[i] );
  }
  var mat = new THREE.PointsMaterial( {color: c, size: s} );
  return new THREE.Points( geom, mat );
}

pliny.issue( "", {
  name: "document helpers/graphics",
  type: "open",
  description: "Finish writing the documentation for the [graphics](#graphics) class in the helpers/ directory"
} );
