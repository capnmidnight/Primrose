/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function PrimroseDemo(w, h) {

    function refreshSize() {
        var w = ctrls.outputContainer.clientWidth,
                h = ctrls.outputContainer.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }

    function render(t) {
        requestAnimationFrame(render);
        if (lt && !prim.isFocused()) {
        }
        texture.needsUpdate = true;
        renderer.render(scene, camera);
        lt = t;
    }

    var ctrls = findEverything(),
            prim = new Primrose("editor", {
                width: w + "px",
                height: h + "px",
                pointerEventSource: ctrls.output,
                file: PrimroseDemo.toString()
            }),
            scene = new THREE.Scene(),
            camera = new THREE.PerspectiveCamera(75, ctrls.output.width / ctrls.output.height, 0.1, 1000),
            renderer = new THREE.WebGLRenderer({
                canvas: ctrls.output,
                alpha: true,
                antialias: true
            }),
            geometry = new THREE.BoxGeometry(3, 1.5, 3),
            texture = new THREE.Texture(prim.getCanvas()),
            material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: false,
                useScreenCoordinates: false,
                color: 0xffffff,
                shading: THREE.FlatShading}),
            cube = new THREE.Mesh(geometry, material),
            lt = 0;

    texture.anisotropy = renderer.getMaxAnisotropy();

    ctrls.controls.appendChild(prim.operatingSystemSelect);
    ctrls.controls.appendChild(prim.keyboardSelect);
    ctrls.controls.appendChild(prim.themeSelect);

    prim.placeSurrogateUnder(ctrls.output);

    window.addEventListener("resize", refreshSize);
    refreshSize();

    // the following will be necessary for Three.js r70
    //renderer.setPixelRatio(window.devicePixelRatio);

    camera.position.z = 3;
    scene.add(cube);
    prim.focus();
    requestAnimationFrame(render);
}