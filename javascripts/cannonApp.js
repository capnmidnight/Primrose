/* global THREE, CANNON */
var GRASS = "/images/grass.png",
    ROCK = "/images/rock.png",
    SAND = "/images/sand.png",
    WATER = "/images/water.png",
    DECK = "/images/deck.png";

function CannonDemo ( vrDisplay, vrSensor ) {
  "use strict";

  var ctrls = findEverything(),
      renderer = new THREE.WebGLRenderer( {
        canvas: ctrls.output,
        alpha: true,
        antialias: true
      } ),
      scene = new THREE.Scene( ),
      world = new CANNON.World(),
      camera = put( new THREE.PerspectiveCamera( 50, ctrls.output.width /
          ctrls.output.height, 0.1, 1000 ) )
        .on( scene )
        .at( 0, 2, 10 ),
      sky = put( textured(
        shell( 50, 8, 4, Math.PI * 2, Math.PI ),
        "/images/bg2.jpg",
        true ) )
        .on( scene )
        .at( 0, 0, 0 ),
      lt,
      mass = 1,
      radius = 1,
      ball = put( textured( sphere( radius, 10, 20 ), ROCK, true, 1, mass ) )
        .on( scene, world )
        .at( -5, 5, 0 ),
      ground = put( textured( box( 10, 1, 10 ), DECK, true, 1, 0, 10, 10 ) )
        .on( scene, world )
        .at( 0, -1, 0 ),
      frictionMaterial = new CANNON.ContactMaterial(
        ball.physics.material,
        ground.physics.material,
        {
          friction: 0.4,
          restitution: 0.3,
          contactEquationStiffness: 1e8,
          contactEquationRelaxation: 3,
          frictionEquationStiffness: 1e8,
          frictionEquationRegularizationTime: 3
        });

  world.defaultContactMaterial.friction = 0.2;
  world.gravity.set( 0, -9.82, 0 );
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.addContactMaterial(frictionMaterial);

  ball.physics.velocity.set(4, 0, 0);

  window.addEventListener( "resize", refreshSize );
  refreshSize( );

  requestAnimationFrame( render );

  function refreshSize ( ) {
    var styleWidth = ctrls.outputContainer.clientWidth,
        styleHeight = ctrls.outputContainer.clientHeight,
        ratio = window.devicePixelRatio || 1,
        canvasWidth = styleWidth * ratio,
        canvasHeight = styleHeight * ratio,
        aspectWidth = canvasWidth;

    renderer.domElement.style.width = px( styleWidth );
    renderer.domElement.style.height = px( styleHeight );
    renderer.domElement.width = canvasWidth;
    renderer.domElement.height = canvasHeight;
    renderer.setViewport( 0, 0, canvasWidth, canvasHeight );
    camera.aspect = aspectWidth / canvasHeight;
    camera.updateProjectionMatrix( );
  }

  function render ( t ) {
    t = t * 0.001;
    requestAnimationFrame( render );
    if ( lt ) {
      update( t - lt );
    }
    renderer.render( scene, camera );
    lt = t;
  }

  function update ( dt ) {
    sky.rotation.set( 0, lt * 0.001, 0 );
    world.step( dt );
    for(var i = 0; i < world.bodies.length; ++i){
      var obj = world.bodies[i];
      obj.graphics.position.copy(obj.position);
      obj.graphics.quaternion.copy(obj.quaternion);
    }
  }
}

function put ( object ) {
  return {
    on: function ( s, w ) {
      s.add( object );
      if ( w && object.physics ) {
        w.add( object.physics );
      }
      return {
        at: function ( x, y, z ) {
          object.position.set( x, y, z );
          if(object.physics){
            object.physics.position.set(x, y, z);
          }
          return object;
        }
      };
    }
  };
}

function textured ( geometry, txt, unshaded, o, mass, s, t ) {
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
    var texture;
    if ( typeof txt === "string" ) {
      texture = THREE.ImageUtils.loadTexture( txt );
    }
    else {
      texture = txt;
    }

    if ( unshaded ) {
      material = new THREE.MeshBasicMaterial( {
        color: 0xffffff,
        map: texture,
        transparent: true,
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
        opacity: o
      } );
    }
    else {
      material = new THREE.MeshLambertMaterial( {
        color: 0xffffff,
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        opacity: o
      } );
    }

    if ( s * t > 1 ) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set( s, t );
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

  if(obj && geometry.physicsShape){
    var body = new CANNON.Body({mass: mass, material: new CANNON.Material()});
    body.addShape(geometry.physicsShape);
    body.linearDamping = body.angularDamping = 0.5;
    obj.physics = body;
    body.graphics = obj;
  }

  return obj;
}

function brick ( txt ) {
  return textured( box( 1, 1, 1 ), txt );
}

function fill ( txt, w, h, l ) {
  if ( h === undefined ) {
    h = 1;
    if ( l === undefined ) {
      l = 1;
      if ( w === undefined ) {
        w = 1;
      }
    }
  }
  var point = hub();
  for ( var z = 0; z < l; ++z ) {
    for ( var y = 0; y < h; ++y ) {
      for ( var x = 0; x < w; ++x ) {
        put( brick( txt ) )
            .on( point )
            .at( x, y, z );
      }
    }
  }
  return point;
}

function light ( color, intensity, distance, decay ) {
  return new THREE.PointLight( color, intensity, distance, decay );
}

function v3 ( x, y, z ) {
  return new THREE.Vector3( x, y, z );
}

function quad ( w, h ) {
  if ( h === undefined ) {
    h = w;
  }
  return new THREE.PlaneBufferGeometry( w, h );
}

function box ( w, h, l ) {
  if ( h === undefined ) {
    h = w;
    l = w;
  }
  var geom = new THREE.BoxGeometry( w, h, l );
  geom.physicsShape = new CANNON.Box(new CANNON.Vec3(w/2, h/2, l/2));
  return geom;
}

function hub ( ) {
  return new THREE.Object3D( );
}

function sphere ( r, slices, rings ) {
  var geom = new THREE.SphereGeometry( r, slices, rings );
  geom.physicsShape = new CANNON.Sphere(r);
  return geom;
}

function shell ( r, slices, rings, phi, theta ) {
  if ( phi === undefined ) {
    phi = Math.PI * 0.5;
  }
  if ( theta === undefined ) {
    theta = Math.PI * 0.5;
  }
  var phiStart = Math.PI + phi * 0.5,
      thetaStart = ( Math.PI - theta ) * 0.5,
      geom = new InsideSphereGeometry( r, slices, rings, phiStart, phi,
          thetaStart, theta, true );
  return geom;
}
