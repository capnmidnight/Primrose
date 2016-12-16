import WebVRPolyfill from "./WebVRPolyfill";
import WebVRStandardMonitor from "./WebVRStandardMonitor";

export default function install() {
  new WebVRPolyfill();

  if(!WebVRStandardMonitor._shimSetup){
    WebVRStandardMonitor._shimSetup = true;
    var oldGetVRDisplays = navigator.getVRDisplays || Promise.resolve.bind(Promise, []);
    navigator.getVRDisplays = function () {
    return oldGetVRDisplays.call(navigator)
      .then((displays) => {
        var created = false;
        for(var i = 0; i < displays.length && !created; ++i){
          var dsp = displays[i];
          created = dsp instanceof WebVRStandardMonitor;
        }
        if (!created) {
          displays.unshift(new WebVRStandardMonitor(displays[0]));
        }
        return displays;
      });
    };
  }
}