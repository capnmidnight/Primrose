/* global Document, Screen, Navigator, Element, Window */

Navigator.prototype.vibrate = 
    Navigator.prototype.vibrate ||
    Navigator.prototype.webkitVibrate ||
    Navigator.prototype.mozVibrate ||
    function () {
    };

Navigator.prototype.getUserMedia = 
    Navigator.prototype.getUserMedia ||
    Navigator.prototype.webkitGetUserMedia ||
    Navigator.prototype.mozGetUserMedia ||
    Navigator.prototype.msGetUserMedia ||
    Navigator.prototype.oGetUserMedia ||
    function () {
    };

Window.prototype.AudioContext = 
    Window.prototype.AudioContext ||
    Window.prototype.webkitAudioContext ||
    function () {
    };

Window.prototype.RTCPeerConnection = 
    Window.prototype.RTCPeerConnection ||
    Window.prototype.webkitRTCPeerConnection ||
    Window.prototype.mozRTCPeerConnection ||
    function () {
    };

Window.prototype.RTCIceCandidate = 
    Window.prototype.RTCIceCandidate ||
    Window.prototype.mozRTCIceCandidate ||
    function () {
    };

Window.prototype.RTCSessionDescription = 
    Window.prototype.RTCSessionDescription ||
    Window.prototype.mozRTCSessionDescription ||
    function () {
    };

Element.prototype.requestPointerLock =
    Element.prototype.requestPointerLock ||
    Element.prototype.webkitRequestPointerLock ||
    Element.prototype.mozRequestPointerLock ||
    function () {
    };

Element.prototype.requestFullscreen =
    Element.prototype.requestFullscreen ||
    Element.prototype.webkitRequestFullscreen ||
    Element.prototype.mozRequestFullScreen ||
    Element.prototype.msRequestFullscreen ||
    function () {
    };

Document.prototype.exitPointerLock =
    Document.prototype.exitPointerLock ||
    Document.prototype.webkitExitPointerLock ||
    Document.prototype.mozExitPointerLock ||
    function () {
    };

Document.prototype.exitFullscreen =
    Document.prototype.exitFullscreen ||
    Document.prototype.webkitExitFullscreen ||
    Document.prototype.mozCancelFullScreen ||
    Document.prototype.msExitFullscreen ||
    function () {
    };

// this doesn't seem to actually work
Screen.prototype.lockOrientation = 
    Screen.prototype.lockOrientation ||
    Screen.prototype.mozLockOrientation ||
    Screen.prototype.msLockOrientation ||
    function () {
    };
