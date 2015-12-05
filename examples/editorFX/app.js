/* global THREE, Primrose */

var app, ed;
function StartDemo () {
  app = new Primrose.VRApplication(
      "Codevember", {
        disablePhysics: true,
        sceneModel: "../models/scene4.json"
      }
  );

  app.addEventListener( "ready", function () {
    app.scene.Light1.intensity *= 2;
    app.scene.Light1.distance *= 2;
    app.scene.Light2.intensity *= 2;
    app.scene.Light2.distance *= 2;
    app.scene.Light3.intensity *= 2;
    app.scene.Light3.distance *= 2;
    app.scene.Ground.material.shading = THREE.FlatShading;
    app.scene.Ground.material.needsUpdate = true;
    app.scene.Text.material.emissive.setRGB( 1, 1, 1 );

    ed = makeEditor(
        app.scene, app.pickingScene, "textEditor",
        1, 1,
        0, 0, 2.5,
        0, 0, 0, {
          tokenizer: Primrose.Text.Grammars.JavaScript,
          fontSize: 20
        } );
    ed.editor.value = StartDemo.toString();
    ed.editor.focus();
  }.bind( this ) );

  var t = 0;
  app.addEventListener( "update", function ( dt ) {
    t += dt * 0.001;
    app.scene.Ground.rotation.x = t * 100;

    setPointer2();
  }.bind( this ) );

  function setPointer ( v1, v2, v3, p, uv ) {
    var a = new THREE.Vector3().subVectors( v2, v1 ).normalize(),
        b = new THREE.Vector3().subVectors( v3, v1 ).normalize(),
        c = new THREE.Vector3().subVectors( p, v1 ),
        n = new THREE.Vector3().crossVectors( a, b ),
        dist = n.dot( c ),
        d = p.sub( n.clone().multiplyScalar( dist ) ).clone();
    p.add( n.multiplyScalar( 0.01 ) );
    if(uv){
      var m = new THREE.Matrix4().set(a.x, b.x, n.x, 0, a.y, b.y, n.y, 0, a.z, b.z, n.z, 0, 0, 0, 0, 1),
          mI = new THREE.Matrix4().getInverse(m),
          q = new THREE.Vector3()
          .subVectors(d, v1)
          .applyMatrix4(mI);
      a.set(uv[1].x - uv[0].x, uv[1].y - uv[0].y, 0);
      b.set(uv[2].x - uv[0].x, uv[2].y - uv[0].y, 0);
      n.set(0, 0, 1);
      m.set(a.x, b.x, n.x, 0, a.y, b.y, n.y, 0, a.z, b.z, n.z, 0, 0, 0, 0, 1);
      q.applyMatrix4(m).add(uv[0]);
      return q;
    }
  }

  function setPointer1 () {
    var p = app.pointer.position,
        vs = ed.geometry.vertices,
        ps = [ ];
    for ( var i = 0; i < vs.length; ++i ) {
      var v = vs[i].clone().applyMatrix4( ed.matrix ),
          d = v.distanceToSquared( p );
      if ( d <= 0.05 ) {
        var obj = {
          dist: d,
          point: v
        };
        if ( ps.length < 3 ) {
          ps.push( obj );
        }
        else {
          for ( var j = 0; j < ps.length; ++j ) {
            if ( obj.dist < ps[j].dist ) {
              var temp = ps[j];
              ps[j] = obj;
              obj = temp;
            }
          }
        }
      }
    }

    if ( ps.length === 3 ) {
      setPointer( ps[1].point, ps[0].point, ps[2].point, p );
      app.pointer.material.color.setRGB( 0, 1, 0 );
    }
    else {
      app.pointer.material.color.setRGB( 1, 0, 0 );
    }
  }

  function setPointer2 () {
    var p = app.pointer.position,
        fs = ed.geometry.faces,
        minFace = null,
        minDist = 0.6,
        vs = ed.geometry.vertices.map( function ( v ) {
          return v.clone().applyMatrix4( ed.matrix );
        } );
    for ( var i = 0; i < fs.length; ++i ) {
      var f = fs[i];
      var dist = vs[f.b].distanceToSquared( p );
      if ( dist < minDist ) {
        minDist = dist;
        minFace = i;
      }
    }
    if ( minFace !== null ) {
      var f = fs[minFace],
          uv = ed.geometry.faceVertexUvs[0][minFace];
      var q = setPointer( vs[f.b], vs[f.a], vs[f.c], p, uv ),
          x = Math.min(1024, Math.max(0, Math.round(1024 * q.x))),
          y = Math.min(1024, Math.max(0, Math.round(1024 * (1 - q.y))));
      ed.editor.startPointer(x, y);
      ed.editor.endPointer();
      app.pointer.material.color.setRGB( 0, 1, 0 );
    }
    else {
      app.pointer.material.color.setRGB( 1, 0, 0 );
    }
  }
var maxX = Number.MIN_VALUE, minX = Number.MAX_VALUE, maxY = Number.MIN_VALUE, minY = Number.MAX_VALUE;
  app.start();
}