window.addEventListener( "load", function () {
  var loading = document.getElementById( "loading" ),
      progressBar = document.getElementById( "progressBar" ),
      scripts = [
        "../../bin/three.min.js",
        /*
        "../../bin/Primrose.min.js",
        /* */
         "../../src/core.js",
         "../../src/fx/helpers/DOM.js",
         "../../src/fx/helpers/flags.js",
         "../../src/fx/helpers/fmt.js",
         "../../src/fx/helpers/forms.js",
         "../../src/fx/helpers/fullscreen.js",
         "../../src/fx/helpers/graphics.js",
         "../../src/fx/helpers/help.js",
         "../../src/fx/helpers/math.js",
         "../../src/fx/helpers/oop.js",
         "../../src/fx/helpers/options.js",
         "../../src/fx/helpers/requests.js",
         "../../src/fx/Angle.js",
         "../../src/fx/Application.js",
         "../../src/fx/BaseControl.js",
         "../../src/fx/Button.js",
         "../../src/fx/ButtonFactory.js",
         "../../src/fx/ChatApplication.js",
         "../../src/fx/Keys.js",
         "../../src/fx/ModelLoader.js",
         "../../src/fx/NetworkedInput.js",
         "../../src/fx/Projector.js",
         "../../src/fx/StateList.js",
         "../../src/fx/VRApplication.js",
         "../../src/fx/WebRTCSocket.js",
         "../../src/fx/Workerize.js",
         "../../src/fx/input/ButtonAndAxis.js",
         "../../src/fx/input/Camera.js",
         "../../src/fx/input/FPSInput.js",
         "../../src/fx/input/Gamepad.js",
         "../../src/fx/input/Keyboard.js",
         "../../src/fx/input/LeapMotion.js",
         "../../src/fx/input/Location.js",
         "../../src/fx/input/Motion.js",
         "../../src/fx/input/Mouse.js",
         "../../src/fx/input/Speech.js",
         "../../src/fx/input/Touch.js",
         "../../src/fx/input/VR.js",
         "../../src/fx/output/Audio3D.js",
         "../../src/fx/output/HapticGlove.js",
         "../../src/fx/output/Music.js",
         "../../src/fx/output/Speech.js",
         "../../src/fx/text/CodePage.js",
         "../../src/fx/text/CommandPack.js",
         "../../src/fx/text/Cursor.js",
         "../../src/fx/text/Grammar.js",
         "../../src/fx/text/OperatingSystem.js",
         "../../src/fx/text/Point.js",
         "../../src/fx/text/Rectangle.js",
         "../../src/fx/text/Rule.js",
         "../../src/fx/text/Size.js",
         "../../src/fx/text/Terminal.js",
         "../../src/fx/text/Token.js",
         "../../src/fx/text/code_pages/DE_QWERTZ.js",
         "../../src/fx/text/code_pages/EN_UKX.js",
         "../../src/fx/text/code_pages/EN_US.js",
         "../../src/fx/text/code_pages/FR_AZERTY.js",
         "../../src/fx/text/command_packs/TestViewer.js",
         "../../src/fx/text/command_packs/TextEditor.js",
         "../../src/fx/text/controls/PlainText.js",
         "../../src/fx/text/controls/TextBox.js",
         "../../src/fx/text/grammars/Basic.js",
         "../../src/fx/text/grammars/JavaScript.js",
         "../../src/fx/text/grammars/PlainText.js",
         "../../src/fx/text/grammars/TestResults.js",
         "../../src/fx/text/operating_systems/OSX.js",
         "../../src/fx/text/operating_systems/Windows.js",
         "../../src/fx/text/renderers/Canvas.js",
         "../../src/fx/text/renderers/DOM.js",
         "../../src/fx/text/themes/Dark.js",
         "../../src/fx/text/themes/Default.js",
         /* */
        "app.js" ];

  function loadNext ( i ) {
    if ( i < scripts.length ) {
      var tag = document.createElement( "script" );
      tag.type = "text/javascript";
      var next = function ( i ) {
        progressBar.style.width = ( 100 * i / scripts.length ) + "%";
        loadNext( i );
      }.bind( tag, i + 1 );
      tag.onload = tag.onerror = next;
      tag.src = scripts[i];
      document.body.appendChild( tag );
    }
    else {
      loading.parentNode.removeChild( loading );
    }
  }

  loadNext( 0 );
}, false );