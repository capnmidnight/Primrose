/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function PrimroseDemo(w, h) {
    var ctrls = findEverything();
    prim = new Primrose("editor", {
        width: w + "px",
        height: h + "px",
        mouseEventSource: ctrls.output,
        file: PrimroseDemo.toString()
    });
    var scene = new THREE.Scene(),
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
            rotAxis = new THREE.Vector3(0.25, 1, 0.125);

    cube = new THREE.Mesh(geometry, material);

    renderer.setSize(ctrls.output.clientWidth, ctrls.output.clientHeight);
    texture.anisotropy = renderer.getMaxAnisotropy();

    ctrls.controls.appendChild(prim.operatingSystemSelect);
    ctrls.controls.appendChild(prim.keyboardSelect);
    ctrls.controls.appendChild(prim.themeSelect);
    
    prim.placeSurrogateUnder(ctrls.output);


    // the following will be necessary for Three.js r70
    //renderer.setPixelRatio(window.devicePixelRatio);

    scene.add(cube);
    camera.position.z = 3;
    prim.focus();
    function render(t) {
        requestAnimationFrame(render);
        texture.needsUpdate = true;
        cube.quaternion.setFromAxisAngle(rotAxis, t / 10000);
        renderer.render(scene, camera);
    }
    requestAnimationFrame(render);
}