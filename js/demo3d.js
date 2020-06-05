import * as THREE from 'https://unpkg.com/three@0.116.1/build/three.module.js';
import { Primrose, Light } from './package/primrose.min.js';

const {
    renderer,
    scene,
    camera
} = makeScene(),
    raycaster = new THREE.Raycaster(),
    mouse = new THREE.Vector2();

makeEditor("test.js", 1);
makeEditor("test.js", -1);

// >>>> BEGIN POINTER EVENTS <<<<
function pointerMove(pointerType) {
    return function (evt) {
        const hit = getHit(evt),
            curEditor = getEditor(hit);
        // did the editor change?
        if (curEditor !== Primrose.hoveredControl) {
            // manage the hover events
            if (curEditor !== null) {
                curEditor[pointerType].readOverEventUV();
            }
            else if (Primrose.hoveredControl != null) {
                Primrose.hoveredControl[pointerType].readOutEventUV();
            }
        }

        // manage the mouse-move event
        if (curEditor !== null) {
            curEditor[pointerType].readMoveEventUV(hit);
        }
    };
}

function pointerDown(pointerType) {
    return function (evt) {
        const hit = getHit(evt),
            curEditor = getEditor(hit);

        // Did we click on an editor?
        if (curEditor !== null) {
            curEditor[pointerType].readDownEventUV(hit);
        }
        else if (Primrose.focusedControl !== null) {
            Primrose.focusedControl.blur();
        }
    };
}

function pointerUp(pointerType) {
    return function (evt) {
        const hit = getHit(evt),
            curEditor = getEditor(hit);

        // Did we release the mouse on an editor?
        if (curEditor !== null) {
            curEditor[pointerType].readUpEventUV(hit);
        }
    };
}


let currentTouchID = null;
const findTouch = (touches) => {
    for (let touch of touches) {
        if (currentTouchID === null
            || touch.identifier === currentTouchID) {
            return touch;
        }
    }
    return null;
}

const withPrimaryTouch = (callback) => {
    return (evt) => {
        evt.preventDefault();
        callback(findTouch(evt.touches)
            || findTouch(evt.changedTouches))
    };
};

renderer.domElement.addEventListener("mousedown", pointerDown("mouse"));
renderer.domElement.addEventListener("mousemove", pointerMove("mouse"));
renderer.domElement.addEventListener("mouseup", pointerUp("mouse"));
renderer.domElement.addEventListener("touchstart", withPrimaryTouch(pointerDown("touch")));
renderer.domElement.addEventListener("touchmove", withPrimaryTouch(pointerMove("touch")));
renderer.domElement.addEventListener("touchend", withPrimaryTouch(pointerUp("touch")));
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

async function makeEditor(file, side) {

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

    mesh.position.set(side * 0.5, 1.7, -1);
    mesh.rotation.set(0, -side * 0.25, 0);

    scene.add(mesh);
    Primrose.add(mesh, editor);

    const response = await fetch(file),
        code = await response.text();
    editor.value = code;

    if (side === 1) {
        editor.theme = Light;
    }
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