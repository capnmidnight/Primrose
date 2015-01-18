/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function PrimroseDemo(w, h) {

    var ctrls = findEverything(),
            lt = 0,
            lastTouchX,
            lastTouchY,
            touchSpeed = 0,
            SPEED = 0.002,
            heading = 0,
            keyState = {},
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
            floor = texturedBox(25, 1, 25, 25, 25, "test/deck.png"),
            editor = texturedBox(5, 5, 5, 1, 1, prim);

    ctrls.controls.appendChild(prim.operatingSystemSelect);
    ctrls.controls.appendChild(prim.keyboardSelect);
    ctrls.controls.appendChild(prim.themeSelect);

    setupKeyOption(ctrls.leftKey);
    setupKeyOption(ctrls.rightKey);
    setupKeyOption(ctrls.forwardKey);
    setupKeyOption(ctrls.backKey);

    prim.placeSurrogateUnder(ctrls.output);

    window.addEventListener("resize", refreshSize);
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("touchstart", touchStart);
    window.addEventListener("touchmove", touchMove);
    window.addEventListener("touchend", touchEnd);
    refreshSize();

    editor.position.y = 0;
    floor.position.y = -3;
    camera.position.z = 5;
    scene.add(floor);
    scene.add(editor);
    requestAnimationFrame(render);

    function refreshSize() {
        var w = ctrls.outputContainer.clientWidth,
                h = ctrls.outputContainer.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }

    function keyDown(evt) {
        if (!prim.isFocused()) {
            keyState[evt.keyIdentifier] = true;
        }
    }

    function keyUp(evt) {
        keyState[evt.keyIdentifier] = false;
    }

    function mouseMove(evt) {
        if (!prim.isFocused()) {
            heading -= evt.movementX * 0.001;
        }
    }

    function touchStart(evt) {
        if (!prim.isFocused()) {
            lastTouchX = evt.touches[0].clientX;
            lastTouchY = evt.touches[0].clientY;
        }
    }

    function touchMove(evt) {
        if (!prim.isFocused()) {
            var x = evt.touches[0].clientX, y = evt.touches[0].clientY;
            heading += (x - lastTouchX) * 0.005;
            touchSpeed = y - lastTouchY;
            lastTouchX = x;
            lastTouchY = y;
        }
    }
    
    function touchEnd(evt){
        if(!prim.isFocused()){
            touchSpeed = 0;
        }
    }

    function update(dt) {
        if (keyState[ctrls.forwardKey.dataset.keyidentifier]) {
            camera.position.z -= SPEED * dt;
            camera.position.x -= SPEED * Math.sin(heading) * dt;
        }
        else if (keyState[ctrls.backKey.dataset.keyidentifier]) {
            camera.position.z += SPEED * Math.cos(heading) * dt;
            camera.position.x += SPEED * Math.sin(heading) * dt;
        }
        if (keyState[ctrls.leftKey.dataset.keyidentifier]) {
            camera.position.x -= SPEED * Math.cos(heading) * dt;
            camera.position.z += SPEED * Math.sin(heading) * dt;
        }
        else if (keyState[ctrls.rightKey.dataset.keyidentifier]) {
            camera.position.x += SPEED * Math.cos(heading) * dt;
            camera.position.z -= SPEED * Math.sin(heading) * dt;
        }
        camera.position.z -= SPEED * touchSpeed * dt;
        camera.position.x -= SPEED * touchSpeed * Math.sin(heading) * dt;
        camera.quaternion.setFromAxisAngle(camera.up, heading);
    }

    function render(t) {
        requestAnimationFrame(render);
        if (lt) {
            update(t - lt);
        }
        renderer.render(scene, camera);
        lt = t;
    }

    function texturedBox(w, h, l, s, t, txt) {
        var geometry = new THREE.BoxGeometry(w, h, l),
                texture;

        if (typeof (txt) === "string") {
            texture = THREE.ImageUtils.loadTexture(txt);
            texture.anisotropy = renderer.getMaxAnisotropy();
        }
        else if (txt instanceof Primrose) {
            texture = txt.getTexture(renderer.getMaxAnisotropy());
        }

        if (s * t > 1) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(s, t);
        }

        var material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            useScreenCoordinates: false,
            color: 0xffffff,
            shading: THREE.FlatShading
        });

        var obj = new THREE.Mesh(geometry, material);
        return obj;
    }

    function clearKeyOption(evt) {
        this.value = "";
        this.dataset.keyidentifier = "";
    }

    function setKeyOption(evt) {
        this.dataset.keyidentifier = evt.keyIdentifier;
        this.value = this.value || evt.keyIdentifier;
        this.value = this.value.toUpperCase();
    }

    function setupKeyOption(elem) {
        elem.addEventListener("keydown", clearKeyOption);
        elem.addEventListener("keyup", setKeyOption);
    }
}