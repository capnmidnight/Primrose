# PRIMROSE

Primrose is a syntax highlighting text editor that renders into an HTML5 Canvas element. This is particularly useful for texturing 3D objects in WebGL apps.

## Features

* International keyboard support (left-to-right rendering only)
* Wide Unicode character-aware
* Line numbering
* Color theming
* Syntax highlighting for:
  * JavaScript, 
  * HTML, and 
  * BASIC

## Getting started with Primrose

### In a 2D page
Here is a basic example that creates an editor in a 2D web page.

#### index.html
```html
<html>
   <body>
      <primrose style="width:50em;height:25em"></primrose>
   </body>
   <script type="module" src="node_modules/primrose/src/primrose.js"></script>_
</html>
```

### In a 3D WebGL app
Here is a basic example that creates an editor in a 3D WebGL app, using [Three.js](https://www.threejs.org).

<em>NOTE: While Primrose can manage most input events on its own, in WebGL contexts, it's not able to figure out what the user's pointer is pointing at. Mouse or VR motion controller support requires implementing Raycast-based picking on your own. However, Primrose does offer a simple interface for implementing pointer operations.</em>

#### index.html
```html
<html style="width:100%;height:100%">
  <body style="width:100%;height:100%">
  </body>
  <script type="module" src="index.js"></script>
</html>
```

#### index.js
```javascript
import * as THREE from 'https://unpkg.com/three@0.116.1/build/three.module.js';
import { Primrose } from './src/primrose.js';

const {
        renderer,
        scene,
        camera
    } = makeScene(),
    raycaster = new THREE.Raycaster(),
    mouse = new THREE.Vector2();

makeEditor(document.getElementById('code').textContent.trim());

// >>>> BEGIN POINTER EVENTS <<<<
renderer.domElement.addEventListener("pointermove", (evt) => {
    const hit = getHit(evt),
        curEditor = getEditor(hit);

    // did the editor change?
    if (curEditor !== Primrose.hoveredControl) {
        // manage the hover events
        if (curEditor !== null) {
            curEditor.readUVOverEvent();
        }
        else if (Primrose.hoveredControl != null) {
            Primrose.hoveredControl.readUVOutEvent();
        }
    }

    // manage the mouse-move event
    if (curEditor !== null) {
        curEditor.readUVMoveEvent(hit);
    }
});

renderer.domElement.addEventListener("pointerdown", (evt) => {
    const hit = getHit(evt),
        curEditor = getEditor(hit);

    // Did we click on an editor?
    if (curEditor !== null) {
        curEditor.readUVDownEvent(hit);
    }
    else if (Primrose.focusedControl !== null) {
        Primrose.focusedControl.blur();
    }
});

renderer.domElement.addEventListener("pointerup", (evt) => {
    const hit = getHit(evt),
        curEditor = getEditor(hit);

    // Did we release the mouse on an editor?
    if (curEditor !== null) {
        curEditor.readUVUpEvent(hit);
    }
});
/// >>>> END POINTER EVENTS <<<<


// Find whatever object we're pointing at (if any)
function getHit(evt) {
    mouse.set(
        (evt.clientX / window.innerWidth) * 2 - 1,
        - (evt.clientY / window.innerHeight) * 2 + 1);

    raycaster.setFromCamera(mouse, camera);

    const hits = raycaster.intersectObject(scene, true);
    return hits.length > 0 ? hits[0] : null;
}

// Find whichever (if any) editor we're currently
// pointing at.
function getEditor(hit) {
    return hit
        && Primrose.has(hit.object)
        && Primrose.get(hit.object)
        || null;
}

function makeEditor(code) {

    // For WebGL textures, you will probably want a 
    // relatively high resolution texture to be able
    // to have text rendered sharply.
    //
    // The scaleFactor changes the resolution of the canvas
    // without changing the relative size of elements
    // within the canvas.
    //
    // The fontSize is relative to the configured width/height,
    // regardless of scaleFactor.
    //
    // Use SHIFT+<mouse wheel> to live-modify the fontSize.
    const editor = new Primrose({
        width: 2048,
        height: 2048,
        scaleFactor: 1,
        fontSize: 24
    });

    const texture = Object.assign(new THREE.CanvasTexture(editor.canvas), {
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        minFilter: THREE.LinearMipmapNearestFilter,
        magFilter: THREE.LinearFilter,
        anisotropy: 8
    });

    // Primrose tells us when it has refreshed, we don't need
    // to do it every frame.
    editor.addEventListener('update', function () {
        texture.needsUpdate = true;
    });

    const mesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(1, 1),
        new THREE.MeshBasicMaterial({ map: texture, opacity: 0.95, transparent: true })
    );

    mesh.position.set(-0.5, 1.7, -1);
    mesh.rotation.set(0, 0.25, 0);

    scene.add(mesh);
    Primrose.add(mesh, editor);

    editor.value = code;
}

function makeScene() {
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    document.body.appendChild(renderer.domElement);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x606060);

    const gridColor = new THREE.Color(0x808080),
        grid = new THREE.GridHelper(20, 40, gridColor, gridColor);
    scene.add(grid);

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 20);
    camera.position.set(0, 1.6, 0);

    const resize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', resize);
    resize();

    renderer.setAnimationLoop(() =>
        renderer.render(scene, camera));

    return { renderer, scene, camera };
}
```
## Contributing

### Conduct

First, please read the [Conduct Policy](CONDUCT.md).

### Contributions

If you think you can be a polite person in accordance with the Conduct Policy, I'd be more than happy to add anyone who asks as a contributor. Just [email me](sean.mcbeth+gh@gmail.com) your profile info and a brief description of what you'd like to work on.

## LICENSING

Primrose is free, open source software (MIT) and may readily be used with other FOSS projects.
