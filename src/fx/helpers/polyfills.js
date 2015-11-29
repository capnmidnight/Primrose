navigator.vibrate = navigator.vibrate ||
    navigator.webkitVibrate ||
    navigator.mozVibrate ||
    function () {
    };

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    navigator.oGetUserMedia ||
    function () {
    };

window.AudioContext = window.AudioContext ||
    window.webkitAudioContext ||
    function(){
    };

window.RTCPeerConnection = window.RTCPeerConnection ||
    window.webkitRTCPeerConnection ||
    window.mozRTCPeerConnection ||
    function () {
    };

window.RTCIceCandidate = window.RTCIceCandidate ||
    window.mozRTCIceCandidate ||
    function () {
    };

window.RTCSessionDescription = window.RTCSessionDescription ||
    window.mozRTCSessionDescription ||
    function () {
    };

window.Element.prototype.requestPointerLock =
    window.Element.prototype.requestPointerLock ||
    window.Element.prototype.webkitRequestPointerLock ||
    window.Element.prototype.mozRequestPointerLock ||
    function () {
    };

window.Element.prototype.requestFullscreen =
    window.Element.prototype.requestFullscreen ||
    window.Element.prototype.webkitRequestFullscreen ||
    window.Element.prototype.mozRequestFullScreen ||
    window.Element.prototype.msRequestFullscreen ||
    function () {
    };

window.Document.prototype.exitFullscreen =
    window.Document.prototype.exitFullscreen ||
    window.Document.prototype.webkitExitFullscreen ||
    window.Document.prototype.mozCancelFullScreen ||
    window.Document.prototype.msExitFullscreen ||
    function () {
    };

// this doesn't seem to actually work
screen.lockOrientation = screen.lockOrientation ||
    screen.mozLockOrientation ||
    screen.msLockOrientation ||
    function () {
    };
