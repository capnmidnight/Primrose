/* global Primrose, THREE, self */
Primrose.Projector = ( function () {
  function Projector ( isWorker ) {
    if ( isWorker ) {
self.THREE={REVISION:"72dev"};if(typeof define==="function"&&define.amd){define("three",THREE)}else{if("undefined"!==typeof exports&&"undefined"!==typeof module){module.exports=THREE}}if(Math.sign===undefined){Math.sign=function(a){return(a<0)?-1:(a>0)?1:+a}}if(Function.prototype.name===undefined&&Object.defineProperty!==undefined){Object.defineProperty(Function.prototype,"name",{get:function(){return this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1]}})}THREE.Quaternion=function(a,d,c,b){this._x=a||0;this._y=d||0;this._z=c||0;this._w=(b!==undefined)?b:1};THREE.Quaternion.prototype={constructor:THREE.Quaternion,get xfunction(){return this._x},set xfunction(a){this._x=a;this.onChangeCallback()},get yfunction(){return this._y},set yfunction(a){this._y=a;this.onChangeCallback()},get zfunction(){return this._z},set zfunction(a){this._z=a;this.onChangeCallback()},get wfunction(){return this._w},set wfunction(a){this._w=a;this.onChangeCallback()},set:function(a,d,c,b){this._x=a;this._y=d;this._z=c;this._w=b;this.onChangeCallback();return this},clone:function(){return new this.constructor(this._x,this._y,this._z,this._w)},copy:function(a){this._x=a.x;this._y=a.y;this._z=a.z;this._w=a.w;this.onChangeCallback();return this},setFromEuler:function(g,h){if(g instanceof THREE.Euler===false){throw new Error("THREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.")}var f=Math.cos(g._x/2);var e=Math.cos(g._y/2);var c=Math.cos(g._z/2);var d=Math.sin(g._x/2);var b=Math.sin(g._y/2);var a=Math.sin(g._z/2);if(g.order==="XYZ"){this._x=d*e*c+f*b*a;this._y=f*b*c-d*e*a;this._z=f*e*a+d*b*c;this._w=f*e*c-d*b*a}else{if(g.order==="YXZ"){this._x=d*e*c+f*b*a;this._y=f*b*c-d*e*a;this._z=f*e*a-d*b*c;this._w=f*e*c+d*b*a}else{if(g.order==="ZXY"){this._x=d*e*c-f*b*a;this._y=f*b*c+d*e*a;this._z=f*e*a+d*b*c;this._w=f*e*c-d*b*a}else{if(g.order==="ZYX"){this._x=d*e*c-f*b*a;this._y=f*b*c+d*e*a;this._z=f*e*a-d*b*c;this._w=f*e*c+d*b*a}else{if(g.order==="YZX"){this._x=d*e*c+f*b*a;this._y=f*b*c+d*e*a;this._z=f*e*a-d*b*c;this._w=f*e*c-d*b*a}else{if(g.order==="XZY"){this._x=d*e*c-f*b*a;this._y=f*b*c-d*e*a;this._z=f*e*a+d*b*c;this._w=f*e*c+d*b*a}}}}}}if(h!==false){this.onChangeCallback()}return this},setFromAxisAngle:function(c,d){var a=d/2,b=Math.sin(a);this._x=c.x*b;this._y=c.y*b;this._z=c.z*b;this._w=Math.cos(a);this.onChangeCallback();return this},setFromRotationMatrix:function(e){var d=e.elements,i=d[0],h=d[4],g=d[8],c=d[1],b=d[5],a=d[9],l=d[2],k=d[6],j=d[10],f=i+b+j,n;if(f>0){n=0.5/Math.sqrt(f+1);this._w=0.25/n;this._x=(k-a)*n;this._y=(g-l)*n;this._z=(c-h)*n}else{if(i>b&&i>j){n=2*Math.sqrt(1+i-b-j);this._w=(k-a)/n;this._x=0.25*n;this._y=(h+c)/n;this._z=(g+l)/n}else{if(b>j){n=2*Math.sqrt(1+b-i-j);this._w=(g-l)/n;this._x=(h+c)/n;this._y=0.25*n;this._z=(a+k)/n}else{n=2*Math.sqrt(1+j-i-b);this._w=(c-h)/n;this._x=(g+l)/n;this._y=(a+k)/n;this._z=0.25*n}}}this.onChangeCallback();return this},setFromUnitVectors:function(){var c,a;var b=0.000001;return function(d,e){if(c===undefined){c=new THREE.Vector3()}a=d.dot(e)+1;if(a<b){a=0;if(Math.abs(d.x)>Math.abs(d.z)){c.set(-d.y,d.x,0)}else{c.set(0,-d.z,d.y)}}else{c.crossVectors(d,e)}this._x=c.x;this._y=c.y;this._z=c.z;this._w=a;this.normalize();return this}}(),inverse:function(){this.conjugate().normalize();return this},conjugate:function(){this._x*=-1;this._y*=-1;this._z*=-1;this.onChangeCallback();return this},dot:function(a){return this._x*a._x+this._y*a._y+this._z*a._z+this._w*a._w},lengthSq:function(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w},length:function(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)},normalize:function(){var a=this.length();if(a===0){this._x=0;this._y=0;this._z=0;this._w=1}else{a=1/a;this._x=this._x*a;this._y=this._y*a;this._z=this._z*a;this._w=this._w*a}this.onChangeCallback();return this},multiply:function(a,b){if(b!==undefined){console.warn("THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.");return this.multiplyQuaternions(a,b)}return this.multiplyQuaternions(this,a)},multiplyQuaternions:function(l,k){var i=l._x,h=l._y,g=l._z,j=l._w;var e=k._x,d=k._y,c=k._z,f=k._w;this._x=i*f+j*e+h*c-g*d;this._y=h*f+j*d+g*e-i*c;this._z=g*f+j*c+i*d-h*e;this._w=j*f-i*e-h*d-g*c;this.onChangeCallback();return this},multiplyVector3:function(a){console.warn("THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead.");return a.applyQuaternion(this)},slerp:function(c,k){if(k===0){return this}if(k===1){return this.copy(c)}var i=this._x,h=this._y,g=this._z,j=this._w;var b=j*c._w+i*c._x+h*c._y+g*c._z;if(b<0){this._w=-c._w;this._x=-c._x;this._y=-c._y;this._z=-c._z;b=-b}else{this.copy(c)}if(b>=1){this._w=j;this._x=i;this._y=h;this._z=g;return this}var d=Math.acos(b);var a=Math.sqrt(1-b*b);if(Math.abs(a)<0.001){this._w=0.5*(j+this._w);this._x=0.5*(i+this._x);this._y=0.5*(h+this._y);this._z=0.5*(g+this._z);return this}var f=Math.sin((1-k)*d)/a,e=Math.sin(k*d)/a;this._w=(j*f+this._w*e);this._x=(i*f+this._x*e);this._y=(h*f+this._y*e);this._z=(g*f+this._z*e);this.onChangeCallback();return this},equals:function(a){return(a._x===this._x)&&(a._y===this._y)&&(a._z===this._z)&&(a._w===this._w)},fromArray:function(b,a){if(a===undefined){a=0}this._x=b[a];this._y=b[a+1];this._z=b[a+2];this._w=b[a+3];this.onChangeCallback();return this},toArray:function(b,a){if(b===undefined){b=[]}if(a===undefined){a=0}b[a]=this._x;b[a+1]=this._y;b[a+2]=this._z;b[a+3]=this._w;return b},onChange:function(a){this.onChangeCallback=a;return this},onChangeCallback:function(){}};THREE.Quaternion.slerp=function(d,c,b,a){return b.copy(d).slerp(c,a)};THREE.Vector3=function(a,c,b){this.x=a||0;this.y=c||0;this.z=b||0};THREE.Vector3.prototype={constructor:THREE.Vector3,set:function(a,c,b){this.x=a;this.y=c;this.z=b;return this},setX:function(a){this.x=a;return this},setY:function(a){this.y=a;return this},setZ:function(a){this.z=a;return this},setComponent:function(a,b){switch(a){case 0:this.x=b;break;case 1:this.y=b;break;case 2:this.z=b;break;default:throw new Error("index is out of range: "+a)}},getComponent:function(a){switch(a){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+a)}},clone:function(){return new this.constructor(this.x,this.y,this.z)},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;return this},add:function(b,a){if(a!==undefined){console.warn("THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.");return this.addVectors(b,a)}this.x+=b.x;this.y+=b.y;this.z+=b.z;return this},addScalar:function(a){this.x+=a;this.y+=a;this.z+=a;return this},addVectors:function(d,c){this.x=d.x+c.x;this.y=d.y+c.y;this.z=d.z+c.z;return this},addScaledVector:function(a,b){this.x+=a.x*b;this.y+=a.y*b;this.z+=a.z*b;return this},sub:function(b,a){if(a!==undefined){console.warn("THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.");return this.subVectors(b,a)}this.x-=b.x;this.y-=b.y;this.z-=b.z;return this},subScalar:function(a){this.x-=a;this.y-=a;this.z-=a;return this},subVectors:function(d,c){this.x=d.x-c.x;this.y=d.y-c.y;this.z=d.z-c.z;return this},multiply:function(b,a){if(a!==undefined){console.warn("THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.");return this.multiplyVectors(b,a)}this.x*=b.x;this.y*=b.y;this.z*=b.z;return this},multiplyScalar:function(a){this.x*=a;this.y*=a;this.z*=a;return this},multiplyVectors:function(d,c){this.x=d.x*c.x;this.y=d.y*c.y;this.z=d.z*c.z;return this},applyEuler:function(){var a;return function b(c){if(c instanceof THREE.Euler===false){console.error("THREE.Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order.")}if(a===undefined){a=new THREE.Quaternion()}this.applyQuaternion(a.setFromEuler(c));return this}}(),applyAxisAngle:function(){var a;return function b(c,d){if(a===undefined){a=new THREE.Quaternion()}this.applyQuaternion(a.setFromAxisAngle(c,d));return this}}(),applyMatrix3:function(b){var a=this.x;var f=this.y;var d=this.z;var c=b.elements;this.x=c[0]*a+c[3]*f+c[6]*d;this.y=c[1]*a+c[4]*f+c[7]*d;this.z=c[2]*a+c[5]*f+c[8]*d;return this},applyMatrix4:function(b){var a=this.x,f=this.y,d=this.z;var c=b.elements;this.x=c[0]*a+c[4]*f+c[8]*d+c[12];this.y=c[1]*a+c[5]*f+c[9]*d+c[13];this.z=c[2]*a+c[6]*f+c[10]*d+c[14];return this},applyProjection:function(b){var a=this.x,h=this.y,g=this.z;var c=b.elements;var f=1/(c[3]*a+c[7]*h+c[11]*g+c[15]);this.x=(c[0]*a+c[4]*h+c[8]*g+c[12])*f;this.y=(c[1]*a+c[5]*h+c[9]*g+c[13])*f;this.z=(c[2]*a+c[6]*h+c[10]*g+c[14])*f;return this},applyQuaternion:function(a){var l=this.x;var k=this.y;var j=this.z;var h=a.x;var g=a.y;var f=a.z;var i=a.w;var d=i*l+g*j-f*k;var c=i*k+f*l-h*j;var b=i*j+h*k-g*l;var e=-h*l-g*k-f*j;this.x=d*i+e*-h+c*-f-b*-g;this.y=c*i+e*-g+b*-h-d*-f;this.z=b*i+e*-f+d*-g-c*-h;return this},project:function(){var a;return function b(c){if(a===undefined){a=new THREE.Matrix4()}a.multiplyMatrices(c.projectionMatrix,a.getInverse(c.matrixWorld));return this.applyProjection(a)}}(),unproject:function(){var a;return function b(c){if(a===undefined){a=new THREE.Matrix4()}a.multiplyMatrices(c.matrixWorld,a.getInverse(c.projectionMatrix));return this.applyProjection(a)}}(),transformDirection:function(b){var a=this.x,f=this.y,d=this.z;var c=b.elements;this.x=c[0]*a+c[4]*f+c[8]*d;this.y=c[1]*a+c[5]*f+c[9]*d;this.z=c[2]*a+c[6]*f+c[10]*d;this.normalize();return this},divide:function(a){this.x/=a.x;this.y/=a.y;this.z/=a.z;return this},divideScalar:function(b){if(b!==0){var a=1/b;this.x*=a;this.y*=a;this.z*=a}else{this.x=0;this.y=0;this.z=0}return this},min:function(a){if(this.x>a.x){this.x=a.x}if(this.y>a.y){this.y=a.y}if(this.z>a.z){this.z=a.z}return this},max:function(a){if(this.x<a.x){this.x=a.x}if(this.y<a.y){this.y=a.y}if(this.z<a.z){this.z=a.z}return this},clamp:function(b,a){if(this.x<b.x){this.x=b.x}else{if(this.x>a.x){this.x=a.x}}if(this.y<b.y){this.y=b.y}else{if(this.y>a.y){this.y=a.y}}if(this.z<b.z){this.z=b.z}else{if(this.z>a.z){this.z=a.z}}return this},clampScalar:function(){var c,b;return function a(d,e){if(c===undefined){c=new THREE.Vector3();b=new THREE.Vector3()}c.set(d,d,d);b.set(e,e,e);return this.clamp(c,b)}}(),floor:function(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);this.z=Math.floor(this.z);return this},ceil:function(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);this.z=Math.ceil(this.z);return this},round:function(){this.x=Math.round(this.x);this.y=Math.round(this.y);this.z=Math.round(this.z);return this},roundToZero:function(){this.x=(this.x<0)?Math.ceil(this.x):Math.floor(this.x);this.y=(this.y<0)?Math.ceil(this.y):Math.floor(this.y);this.z=(this.z<0)?Math.ceil(this.z):Math.floor(this.z);return this},negate:function(){this.x=-this.x;this.y=-this.y;this.z=-this.z;return this},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)},lengthManhattan:function(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)},normalize:function(){return this.divideScalar(this.length())},setLength:function(a){var b=this.length();if(b!==0&&a!==b){this.multiplyScalar(a/b)}return this},lerp:function(a,b){this.x+=(a.x-this.x)*b;this.y+=(a.y-this.y)*b;this.z+=(a.z-this.z)*b;return this},lerpVectors:function(c,b,a){this.subVectors(b,c).multiplyScalar(a).add(c);return this},cross:function(c,b){if(b!==undefined){console.warn("THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.");return this.crossVectors(c,b)}var a=this.x,e=this.y,d=this.z;this.x=e*c.z-d*c.y;this.y=d*c.x-a*c.z;this.z=a*c.y-e*c.x;return this},crossVectors:function(d,c){var h=d.x,f=d.y,e=d.z;var j=c.x,i=c.y,g=c.z;this.x=f*g-e*i;this.y=e*j-h*g;this.z=h*i-f*j;return this},projectOnVector:function(){var c,a;return function b(d){if(c===undefined){c=new THREE.Vector3()}c.copy(d).normalize();a=this.dot(c);return this.copy(c).multiplyScalar(a)}}(),projectOnPlane:function(){var b;return function a(c){if(b===undefined){b=new THREE.Vector3()}b.copy(this).projectOnVector(c);return this.sub(b)}}(),reflect:function(){var b;return function a(c){if(b===undefined){b=new THREE.Vector3()}return this.sub(b.copy(c).multiplyScalar(2*this.dot(c)))}}(),angleTo:function(a){var b=this.dot(a)/(this.length()*a.length());return Math.acos(THREE.Math.clamp(b,-1,1))},distanceTo:function(a){return Math.sqrt(this.distanceToSquared(a))},distanceToSquared:function(d){var c=this.x-d.x;var b=this.y-d.y;var a=this.z-d.z;return c*c+b*b+a*a},setEulerFromRotationMatrix:function(b,a){console.error("THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.")},setEulerFromQuaternion:function(b,a){console.error("THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.")},getPositionFromMatrix:function(a){console.warn("THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().");return this.setFromMatrixPosition(a)},getScaleFromMatrix:function(a){console.warn("THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().");return this.setFromMatrixScale(a)},getColumnFromMatrix:function(b,a){console.warn("THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().");return this.setFromMatrixColumn(b,a)},setFromMatrixPosition:function(a){this.x=a.elements[12];this.y=a.elements[13];this.z=a.elements[14];return this},setFromMatrixScale:function(a){var d=this.set(a.elements[0],a.elements[1],a.elements[2]).length();var c=this.set(a.elements[4],a.elements[5],a.elements[6]).length();var b=this.set(a.elements[8],a.elements[9],a.elements[10]).length();this.x=d;this.y=c;this.z=b;return this},setFromMatrixColumn:function(b,a){var d=b*4;var c=a.elements;this.x=c[d];this.y=c[d+1];this.z=c[d+2];return this},equals:function(a){return((a.x===this.x)&&(a.y===this.y)&&(a.z===this.z))},fromArray:function(b,a){if(a===undefined){a=0}this.x=b[a];this.y=b[a+1];this.z=b[a+2];return this},toArray:function(b,a){if(b===undefined){b=[]}if(a===undefined){a=0}b[a]=this.x;b[a+1]=this.y;b[a+2]=this.z;return b},fromAttribute:function(b,a,c){if(c===undefined){c=0}a=a*b.itemSize+c;this.x=b.array[a];this.y=b.array[a+1];this.z=b.array[a+2];return this}};THREE.Matrix4=function(){this.elements=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);if(arguments.length>0){console.error("THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.")}};THREE.Matrix4.prototype={constructor:THREE.Matrix4,set:function(n,m,k,i,f,e,d,c,a,q,p,o,l,j,h,g){var b=this.elements;b[0]=n;b[4]=m;b[8]=k;b[12]=i;b[1]=f;b[5]=e;b[9]=d;b[13]=c;b[2]=a;b[6]=q;b[10]=p;b[14]=o;b[3]=l;b[7]=j;b[11]=h;b[15]=g;return this},identity:function(){this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);return this},clone:function(){return new THREE.Matrix4().fromArray(this.elements)},copy:function(a){this.elements.set(a.elements);return this},extractPosition:function(a){console.warn("THREE.Matrix4: .extractPosition() has been renamed to .copyPosition().");return this.copyPosition(a)},copyPosition:function(a){var c=this.elements;var b=a.elements;c[12]=b[12];c[13]=b[13];c[14]=b[14];return this},extractBasis:function(b,a,c){var d=this.elements;b.set(d[0],d[1],d[2]);a.set(d[4],d[5],d[6]);c.set(d[8],d[9],d[10]);return this},makeBasis:function(b,a,c){this.set(b.x,a.x,c.x,0,b.y,a.y,c.y,0,b.z,a.z,c.z,0,0,0,0,1);return this},extractRotation:function(){var a;return function(b){if(a===undefined){a=new THREE.Vector3()}var g=this.elements;var f=b.elements;var e=1/a.set(f[0],f[1],f[2]).length();var d=1/a.set(f[4],f[5],f[6]).length();var c=1/a.set(f[8],f[9],f[10]).length();g[0]=f[0]*e;g[1]=f[1]*e;g[2]=f[2]*e;g[4]=f[4]*d;g[5]=f[5]*d;g[6]=f[6]*d;g[8]=f[8]*c;g[9]=f[9]*c;g[10]=f[10]*c;return this}}(),makeRotationFromEuler:function(o){if(o instanceof THREE.Euler===false){console.error("THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.")}var k=this.elements;var n=o.x,m=o.y,l=o.z;var G=Math.cos(n),F=Math.sin(n);var D=Math.cos(m),A=Math.sin(m);var t=Math.cos(l),r=Math.sin(l);if(o.order==="XYZ"){var v=G*t,s=G*r,h=F*t,g=F*r;k[0]=D*t;k[4]=-D*r;k[8]=A;k[1]=s+h*A;k[5]=v-g*A;k[9]=-F*D;k[2]=g-v*A;k[6]=h+s*A;k[10]=G*D}else{if(o.order==="YXZ"){var q=D*t,p=D*r,C=A*t,u=A*r;k[0]=q+u*F;k[4]=C*F-p;k[8]=G*A;k[1]=G*r;k[5]=G*t;k[9]=-F;k[2]=p*F-C;k[6]=u+q*F;k[10]=G*D}else{if(o.order==="ZXY"){var q=D*t,p=D*r,C=A*t,u=A*r;k[0]=q-u*F;k[4]=-G*r;k[8]=C+p*F;k[1]=p+C*F;k[5]=G*t;k[9]=u-q*F;k[2]=-G*A;k[6]=F;k[10]=G*D}else{if(o.order==="ZYX"){var v=G*t,s=G*r,h=F*t,g=F*r;k[0]=D*t;k[4]=h*A-s;k[8]=v*A+g;k[1]=D*r;k[5]=g*A+v;k[9]=s*A-h;k[2]=-A;k[6]=F*D;k[10]=G*D}else{if(o.order==="YZX"){var E=G*D,B=G*A,j=F*D,i=F*A;k[0]=D*t;k[4]=i-E*r;k[8]=j*r+B;k[1]=r;k[5]=G*t;k[9]=-F*t;k[2]=-A*t;k[6]=B*r+j;k[10]=E-i*r}else{if(o.order==="XZY"){var E=G*D,B=G*A,j=F*D,i=F*A;k[0]=D*t;k[4]=-r;k[8]=A*t;k[1]=E*r+i;k[5]=G*t;k[9]=B*r-j;k[2]=j*r-B;k[6]=F*t;k[10]=i*r+E}}}}}}k[3]=0;k[7]=0;k[11]=0;k[12]=0;k[13]=0;k[14]=0;k[15]=1;return this},setRotationFromQuaternion:function(a){console.warn("THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion().");return this.makeRotationFromQuaternion(a)},makeRotationFromQuaternion:function(l){var e=this.elements;var h=l.x,g=l.y,f=l.z,i=l.w;var n=h+h,a=g+g,j=f+f;var d=h*n,c=h*a,b=h*j;var m=g*a,k=g*j,r=f*j;var s=i*n,p=i*a,o=i*j;e[0]=1-(m+r);e[4]=c-o;e[8]=b+p;e[1]=c+o;e[5]=1-(d+r);e[9]=k-s;e[2]=b-p;e[6]=k+s;e[10]=1-(d+m);e[3]=0;e[7]=0;e[11]=0;e[12]=0;e[13]=0;e[14]=0;e[15]=1;return this},lookAt:function(){var a,c,b;return function(e,f,d){if(a===undefined){a=new THREE.Vector3()}if(c===undefined){c=new THREE.Vector3()}if(b===undefined){b=new THREE.Vector3()}var g=this.elements;b.subVectors(e,f).normalize();if(b.length()===0){b.z=1}a.crossVectors(d,b).normalize();if(a.length()===0){b.x+=0.0001;a.crossVectors(d,b).normalize()}c.crossVectors(b,a);g[0]=a.x;g[4]=c.x;g[8]=b.x;g[1]=a.y;g[5]=c.y;g[9]=b.y;g[2]=a.z;g[6]=c.z;g[10]=b.z;return this}}(),multiply:function(a,b){if(b!==undefined){console.warn("THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.");return this.multiplyMatrices(a,b)}return this.multiplyMatrices(this,a)},multiplyMatrices:function(Q,P){var s=Q.elements;var O=P.elements;var c=this.elements;var p=s[0],n=s[4],m=s[8],l=s[12];var N=s[1],M=s[5],L=s[9],K=s[13];var F=s[2],E=s[6],D=s[10],C=s[14];var t=s[3],r=s[7],q=s[11],o=s[15];var i=O[0],g=O[4],e=O[8],d=O[12];var J=O[1],I=O[5],H=O[9],G=O[13];var B=O[2],A=O[6],v=O[10],u=O[14];var k=O[3],j=O[7],h=O[11],f=O[15];c[0]=p*i+n*J+m*B+l*k;c[4]=p*g+n*I+m*A+l*j;c[8]=p*e+n*H+m*v+l*h;c[12]=p*d+n*G+m*u+l*f;c[1]=N*i+M*J+L*B+K*k;c[5]=N*g+M*I+L*A+K*j;c[9]=N*e+M*H+L*v+K*h;c[13]=N*d+M*G+L*u+K*f;c[2]=F*i+E*J+D*B+C*k;c[6]=F*g+E*I+D*A+C*j;c[10]=F*e+E*H+D*v+C*h;c[14]=F*d+E*G+D*u+C*f;c[3]=t*i+r*J+q*B+o*k;c[7]=t*g+r*I+q*A+o*j;c[11]=t*e+r*H+q*v+o*h;c[15]=t*d+r*G+q*u+o*f;return this},multiplyToArray:function(d,c,e){var f=this.elements;this.multiplyMatrices(d,c);e[0]=f[0];e[1]=f[1];e[2]=f[2];e[3]=f[3];e[4]=f[4];e[5]=f[5];e[6]=f[6];e[7]=f[7];e[8]=f[8];e[9]=f[9];e[10]=f[10];e[11]=f[11];e[12]=f[12];e[13]=f[13];e[14]=f[14];e[15]=f[15];return this},multiplyScalar:function(a){var b=this.elements;b[0]*=a;b[4]*=a;b[8]*=a;b[12]*=a;b[1]*=a;b[5]*=a;b[9]*=a;b[13]*=a;b[2]*=a;b[6]*=a;b[10]*=a;b[14]*=a;b[3]*=a;b[7]*=a;b[11]*=a;b[15]*=a;return this},multiplyVector3:function(a){console.warn("THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead.");return a.applyProjection(this)},multiplyVector4:function(a){console.warn("THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.");return a.applyMatrix4(this)},multiplyVector3Array:function(b){console.warn("THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.");return this.applyToVector3Array(b)},applyToVector3Array:function(){var a;return function(f,e,d){if(a===undefined){a=new THREE.Vector3()}if(e===undefined){e=0}if(d===undefined){d=f.length}for(var c=0,b=e;c<d;c+=3,b+=3){a.fromArray(f,b);a.applyMatrix4(this);a.toArray(f,b)}return f}}(),applyToBuffer:function(){var b;return function a(c,g,f){if(b===undefined){b=new THREE.Vector3()}if(g===undefined){g=0}if(f===undefined){f=c.length/c.itemSize}for(var e=0,d=g;e<f;e++,d++){b.x=c.getX(d);b.y=c.getY(d);b.z=c.getZ(d);b.applyMatrix4(this);c.setXYZ(b.x,b.y,b.z)}return c}}(),rotateAxis:function(a){console.warn("THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.");a.transformDirection(this)},crossVector:function(a){console.warn("THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.");return a.applyMatrix4(this)},determinant:function(){var c=this.elements;var n=c[0],m=c[4],k=c[8],i=c[12];var f=c[1],e=c[5],d=c[9],b=c[13];var a=c[2],q=c[6],p=c[10],o=c[14];var l=c[3],j=c[7],h=c[11],g=c[15];return(l*(+i*d*q-k*b*q-i*e*p+m*b*p+k*e*o-m*d*o)+j*(+n*d*o-n*b*p+i*f*p-k*f*o+k*b*a-i*d*a)+h*(+n*b*q-n*e*o-i*f*q+m*f*o+i*e*a-m*b*a)+g*(-k*e*a-n*d*q+n*e*p+k*f*q-m*f*p+m*d*a))},transpose:function(){var b=this.elements;var a;a=b[1];b[1]=b[4];b[4]=a;a=b[2];b[2]=b[8];b[8]=a;a=b[6];b[6]=b[9];b[9]=a;a=b[3];b[3]=b[12];b[12]=a;a=b[7];b[7]=b[13];b[13]=a;a=b[11];b[11]=b[14];b[14]=a;return this},flattenToArrayOffset:function(c,b){var a=this.elements;c[b]=a[0];c[b+1]=a[1];c[b+2]=a[2];c[b+3]=a[3];c[b+4]=a[4];c[b+5]=a[5];c[b+6]=a[6];c[b+7]=a[7];c[b+8]=a[8];c[b+9]=a[9];c[b+10]=a[10];c[b+11]=a[11];c[b+12]=a[12];c[b+13]=a[13];c[b+14]=a[14];c[b+15]=a[15];return c},getPosition:function(){var a;return function(){if(a===undefined){a=new THREE.Vector3()}console.warn("THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.");var b=this.elements;return a.set(b[12],b[13],b[14])}}(),setPosition:function(a){var b=this.elements;b[12]=a.x;b[13]=a.y;b[14]=a.z;return this},getInverse:function(r,h){var g=this.elements;var A=r.elements;var p=A[0],n=A[4],k=A[8],i=A[12];var v=A[1],u=A[5],t=A[9],s=A[13];var d=A[2],c=A[6],b=A[10],a=A[14];var q=A[3],o=A[7],l=A[11],j=A[15];g[0]=t*a*o-s*b*o+s*c*l-u*a*l-t*c*j+u*b*j;g[4]=i*b*o-k*a*o-i*c*l+n*a*l+k*c*j-n*b*j;g[8]=k*s*o-i*t*o+i*u*l-n*s*l-k*u*j+n*t*j;g[12]=i*t*c-k*s*c-i*u*b+n*s*b+k*u*a-n*t*a;g[1]=s*b*q-t*a*q-s*d*l+v*a*l+t*d*j-v*b*j;g[5]=k*a*q-i*b*q+i*d*l-p*a*l-k*d*j+p*b*j;g[9]=i*t*q-k*s*q-i*v*l+p*s*l+k*v*j-p*t*j;g[13]=k*s*d-i*t*d+i*v*b-p*s*b-k*v*a+p*t*a;g[2]=u*a*q-s*c*q+s*d*o-v*a*o-u*d*j+v*c*j;g[6]=i*c*q-n*a*q-i*d*o+p*a*o+n*d*j-p*c*j;g[10]=n*s*q-i*u*q+i*v*o-p*s*o-n*v*j+p*u*j;g[14]=i*u*d-n*s*d-i*v*c+p*s*c+n*v*a-p*u*a;g[3]=t*c*q-u*b*q-t*d*o+v*b*o+u*d*l-v*c*l;g[7]=n*b*q-k*c*q+k*d*o-p*b*o-n*d*l+p*c*l;g[11]=k*u*q-n*t*q-k*v*o+p*t*o+n*v*l-p*u*l;g[15]=n*t*d-k*u*d+k*v*c-p*t*c-n*v*b+p*u*b;var e=p*g[0]+v*g[4]+d*g[8]+q*g[12];if(e===0){var f="THREE.Matrix4.getInverse(): can't invert matrix, determinant is 0";if(h||false){throw new Error(f)}else{console.warn(f)}this.identity();return this}this.multiplyScalar(1/e);return this},translate:function(a){console.error("THREE.Matrix4: .translate() has been removed.")},rotateX:function(a){console.error("THREE.Matrix4: .rotateX() has been removed.")},rotateY:function(a){console.error("THREE.Matrix4: .rotateY() has been removed.")},rotateZ:function(a){console.error("THREE.Matrix4: .rotateZ() has been removed.")},rotateByAxis:function(a,b){console.error("THREE.Matrix4: .rotateByAxis() has been removed.")},scale:function(b){var d=this.elements;var a=b.x,e=b.y,c=b.z;d[0]*=a;d[4]*=e;d[8]*=c;d[1]*=a;d[5]*=e;d[9]*=c;d[2]*=a;d[6]*=e;d[10]*=c;d[3]*=a;d[7]*=e;d[11]*=c;return this},getMaxScaleOnAxis:function(){var c=this.elements;var d=c[0]*c[0]+c[1]*c[1]+c[2]*c[2];var b=c[4]*c[4]+c[5]*c[5]+c[6]*c[6];var a=c[8]*c[8]+c[9]*c[9]+c[10]*c[10];return Math.sqrt(Math.max(d,Math.max(b,a)))},makeTranslation:function(a,c,b){this.set(1,0,0,a,0,1,0,c,0,0,1,b,0,0,0,1);return this},makeRotationX:function(a){var d=Math.cos(a),b=Math.sin(a);this.set(1,0,0,0,0,d,-b,0,0,b,d,0,0,0,0,1);return this},makeRotationY:function(a){var d=Math.cos(a),b=Math.sin(a);this.set(d,0,b,0,0,1,0,0,-b,0,d,0,0,0,0,1);return this},makeRotationZ:function(a){var d=Math.cos(a),b=Math.sin(a);this.set(d,-b,0,0,b,d,0,0,0,0,1,0,0,0,0,1);return this},makeRotationAxis:function(a,b){var f=Math.cos(b);var k=Math.sin(b);var j=1-f;var i=a.x,h=a.y,g=a.z;var e=j*i,d=j*h;this.set(e*i+f,e*h-k*g,e*g+k*h,0,e*h+k*g,d*h+f,d*g-k*i,0,e*g-k*h,d*g+k*i,j*g*g+f,0,0,0,0,1);return this},makeScale:function(a,c,b){this.set(a,0,0,0,0,c,0,0,0,0,b,0,0,0,0,1);return this},compose:function(a,b,c){this.makeRotationFromQuaternion(b);this.scale(c);this.setPosition(a);return this},decompose:function(){var a,b;return function(i,h,g){if(a===undefined){a=new THREE.Vector3()}if(b===undefined){b=new THREE.Matrix4()}var f=this.elements;var m=a.set(f[0],f[1],f[2]).length();var l=a.set(f[4],f[5],f[6]).length();var k=a.set(f[8],f[9],f[10]).length();var j=this.determinant();if(j<0){m=-m}i.x=f[12];i.y=f[13];i.z=f[14];b.elements.set(this.elements);var e=1/m;var d=1/l;var c=1/k;b.elements[0]*=e;b.elements[1]*=e;b.elements[2]*=e;b.elements[4]*=d;b.elements[5]*=d;b.elements[6]*=d;b.elements[8]*=c;b.elements[9]*=c;b.elements[10]*=c;h.setFromRotationMatrix(b);g.x=m;g.y=l;g.z=k;return this}}(),makeFrustum:function(g,q,e,n,i,h){var f=this.elements;var p=2*i/(q-g);var m=2*i/(n-e);var o=(q+g)/(q-g);var l=(n+e)/(n-e);var k=-(h+i)/(h-i);var j=-2*h*i/(h-i);f[0]=p;f[4]=0;f[8]=o;f[12]=0;f[1]=0;f[5]=m;f[9]=l;f[13]=0;f[2]=0;f[6]=0;f[10]=k;f[14]=j;f[3]=0;f[7]=0;f[11]=-1;f[15]=0;return this},makePerspective:function(e,c,g,b){var a=g*Math.tan(THREE.Math.degToRad(e*0.5));var f=-a;var h=f*c;var d=a*c;return this.makeFrustum(h,d,f,a,g,b)},makeOrthographic:function(d,n,k,a,g,f){var c=this.elements;var m=n-d;var e=k-a;var b=f-g;var l=(n+d)/m;var j=(k+a)/e;var i=(f+g)/b;c[0]=2/m;c[4]=0;c[8]=0;c[12]=-l;c[1]=0;c[5]=2/e;c[9]=0;c[13]=-j;c[2]=0;c[6]=0;c[10]=-2/b;c[14]=-i;c[3]=0;c[7]=0;c[11]=0;c[15]=1;return this},equals:function(a){var d=this.elements;var c=a.elements;for(var b=0;b<16;b++){if(d[b]!==c[b]){return false}}return true},fromArray:function(a){this.elements.set(a);return this},toArray:function(){var a=this.elements;return[a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8],a[9],a[10],a[11],a[12],a[13],a[14],a[15]]}};THREE.Math={generateUUID:function(){var d="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");var b=new Array(36);var a=0,c;return function(){for(var e=0;e<36;e++){if(e===8||e===13||e===18||e===23){b[e]="-"}else{if(e===14){b[e]="4"}else{if(a<=2){a=33554432+(Math.random()*16777216)|0}c=a&15;a=a>>4;b[e]=d[(e===19)?(c&3)|8:c]}}}return b.join("")}}(),clamp:function(d,e,c){return(d<e)?e:((d>c)?c:d)},clampBottom:function(b,c){return b<c?c:b},euclideanModulo:function(b,a){return((b%a)+a)%a},mapLinear:function(b,c,a,e,d){return e+(b-c)*(d-e)/(a-c)},smoothstep:function(b,c,a){if(b<=c){return 0}if(b>=a){return 1}b=(b-c)/(a-c);return b*b*(3-2*b)},smootherstep:function(b,c,a){if(b<=c){return 0}if(b>=a){return 1}b=(b-c)/(a-c);return b*b*b*(b*(b*6-15)+10)},random16:function(){return(65280*Math.random()+255*Math.random())/65535},randInt:function(a,b){return a+Math.floor(Math.random()*(b-a+1))},randFloat:function(a,b){return a+Math.random()*(b-a)},randFloatSpread:function(a){return a*(0.5-Math.random())},degToRad:function(){var a=Math.PI/180;return function(b){return b*a}}(),radToDeg:function(){var a=180/Math.PI;return function(b){return b*a}}(),isPowerOfTwo:function(a){return(a&(a-1))===0&&a!==0},nextPowerOfTwo:function(a){a--;a|=a>>1;a|=a>>2;a|=a>>4;a|=a>>8;a|=a>>16;a++;return a}};
    }
    this.objectIDs = [ ];
    this.objects = {};
    this.transformCache = {};
    this.boundsCache = {};
    this.vertCache = {};
    this.a = new THREE.Vector3();
    this.b = new THREE.Vector3();
    this.c = new THREE.Vector3();
    this.d = new THREE.Vector3();
    this.m = new THREE.Matrix4();
    this.listeners = {
      hit: [ ]
    };
  }

  Projector.prototype.addEventListener = function ( evt, handler ) {
    if ( !this.listeners[evt] ) {
      this.listeners[evt] = [ ];
    }
    this.listeners[evt].push( handler );
  };

  Projector.prototype._fire = function () {
    var args = Array.prototype.slice.call( arguments ),
        evt = args.shift();
    this.listeners[evt].forEach( function ( t ) {
      t.apply( t.executionContext, args );
    } );
  };

  Projector.prototype._transform = function ( obj, v ) {
    var p = v.clone();
    while ( obj !== null ) {
      p.applyMatrix4( obj.matrix );
      obj = obj.parent;
    }
    return p;
  };

  // We have to transform the vertices of the geometry into world-space
  // coordinations, because the object they are on could be rotated or
  // positioned somewhere else.
  Projector.prototype._getVerts = function ( obj ) {
    var key = Array.prototype.join.call(obj.matrix.elements, "," );
    if ( key !== this.transformCache[obj.uuid] ) {
      var trans = [ ];
      this.vertCache[obj.uuid] = trans;
      var verts = obj.geometry.vertices;
      for ( var i = 0; i < verts.length; ++i ) {
        trans[i] = this._transform( obj, verts[i] );
      }
      this.transformCache[obj.uuid] = key;
      var bounds = [ ],
          faces = [ ],
          minX = Number.MAX_VALUE,
          minY = Number.MAX_VALUE,
          minZ = Number.MAX_VALUE,
          maxX = Number.MIN_VALUE,
          maxY = Number.MIN_VALUE,
          maxZ = Number.MIN_VALUE;

      this.boundsCache[obj.uuid] = faces;

      for ( i = 0; i < trans.length; ++i ) {
        var v = trans[i];
        minX = Math.min( minX, v.x );
        minY = Math.min( minY, v.y );
        minZ = Math.min( minZ, v.z );
        maxX = Math.max( maxX, v.x );
        maxY = Math.max( maxY, v.y );
        maxZ = Math.max( maxZ, v.z );
      }

      bounds[0] = new THREE.Vector3( minX, maxY, minZ );
      bounds[1] = new THREE.Vector3( maxX, maxY, minZ );
      bounds[2] = new THREE.Vector3( maxX, minY, minZ );
      bounds[3] = new THREE.Vector3( minX, minY, minZ );
      bounds[4] = new THREE.Vector3( minX, maxY, maxZ );
      bounds[5] = new THREE.Vector3( maxX, maxY, maxZ );
      bounds[6] = new THREE.Vector3( maxX, minY, maxZ );
      bounds[7] = new THREE.Vector3( minX, minY, maxZ );

      faces[0] = [ bounds[0], bounds[1], bounds[2], bounds[3] ];
      faces[1] = [ bounds[4], bounds[5], bounds[6], bounds[7] ];
      faces[2] = [ bounds[0], bounds[1], bounds[5], bounds[4] ];
      faces[3] = [ bounds[2], bounds[3], bounds[7], bounds[6] ];
      faces[4] = [ bounds[0], bounds[4], bounds[7], bounds[3] ];
      faces[5] = [ bounds[1], bounds[5], bounds[6], bounds[2] ];
    }
    return this.vertCache[obj.uuid];
  };

  Projector.prototype.setObject = function ( obj ) {
    if ( !this.objects[obj.uuid] ) {
      this.objectIDs.push( obj.uuid );
      this.objects[obj.uuid] = obj;
    }
    else {
      this.setProperty( obj.uuid, "pickUV", obj.pickUV );
      this.setProperty( obj.uuid, "visible", obj.visible );
      this.setProperty( obj.uuid, "geometry.faces", obj.geometry.faces );
      this.setProperty( obj.uuid, "geometry.faceVertexUvs", obj.geometry.faceVertexUvs );
    }
    this.setProperty( obj.uuid, "geometry.vertices", obj.geometry.vertices );
    var head = obj,
        toSet = {},
        path = "";
    while ( head !== null ) {
      toSet[path + "matrix"] = head.matrix;
      path += "parent.";
      head = head.parent;
    }
    for ( var k in toSet ) {
      this.setProperty( obj.uuid, k, toSet[k] );
    }
  };

  Projector.prototype.setProperty = function ( objID, propName, value ) {
    var obj = this.objects[objID],
        parts = propName.split( "." );
    while ( parts.length > 1 ) {
      propName = parts.shift();
      if ( !obj[propName] ) {
        obj[propName] = {};
      }
      obj = obj[propName];
    }
    if ( parts.length === 1 ) {
      propName = parts[0];
      if ( propName === "vertices" ) {
        value = value.map( function ( v ) {
          return new THREE.Vector3().fromArray( v );
        } );
      }
      else if ( propName === "matrix" ) {
        value = new THREE.Matrix4().fromArray( value );
      }
      obj[parts[0]] = value;
    }
  };

  Projector.prototype.projectPointer = function ( p, from ) {
    var // We set minDist to a high value to make sure we capture everything.
        minDist = 0.5,
        minObj = null,
        // There is currently no selected face
        minFaceIndex = null,
        minVerts = null,
        faces = null,
        face = null,
        odd = null,
        v0 = null,
        v1 = null,
        v2 = null,
        dist = null,
        value = null,
        i,
        j,
        k;

    p = new THREE.Vector3().fromArray( p );
    from = new THREE.Vector3().fromArray( from );

    // Shoot this.a vector to the selector point
    this.d.subVectors( p, from ).normalize();
    for ( j = 0; j < this.objectIDs.length; ++j ) {
      var objID = this.objectIDs[j],
          obj = this.objects[objID];
      if ( obj.visible && obj.geometry.vertices ) {
        var verts = this._getVerts( obj ),
            // determine if we're even roughly pointing at an object
            pointingAtCube = false;

        faces = this.boundsCache[obj.uuid];

        for ( i = 0; i < faces.length && !pointingAtCube; ++i ) {
          var bounds = faces[i],
              insideFace = true;
          for ( k = 0; k < bounds.length && insideFace; ++k ) {
            this.a.subVectors( bounds[k], from );
            insideFace &= this.a.dot( this.d ) >= 0;
          }
          pointingAtCube |= insideFace;
        }

        if ( pointingAtCube ) {
          faces = obj.geometry.faces;
          // Find the face that is closest to the pointer
          for ( i = 0; i < faces.length; ++i ) {
            face = faces[i];
            odd = ( i % 2 ) === 1;
            v0 = verts[odd ? face[1] : face[0]];
            v1 = verts[odd ? face[2] : face[1]];
            v2 = verts[odd ? face[0] : face[2]];
            // Shoot a vector from the camera to each of the three corners
            // of the mesh face
            this.a.subVectors( v0, from )
                .normalize();
            this.b.subVectors( v1, from )
                .normalize();
            this.c.subVectors( v2, from )
                .normalize();
            // Find whether or not the point is inside the triangle defined
            // by the face vertices. It will point inside the triangle when
            // all of the vector dot products are positive.
            var d1 = this.a.dot( this.d ),
                d2 = this.b.dot( this.d ),
                d3 = this.c.dot( this.d );
            // Find the distance to the closest point in the polygon
            dist = Math.min(
                p.distanceToSquared( v0 ),
                p.distanceToSquared( v1 ),
                p.distanceToSquared( v2 ) );
            if ( d1 > 0 && d2 > 0 && d3 > 0 && dist < minDist ) {
              minObj = obj;
              minDist = dist;
              minFaceIndex = i;
              minVerts = verts;
            }
          }
        }
      }
    }

    if ( minObj !== null && minFaceIndex !== null ) {

      value = {
        objectID: minObj.uuid
      };

      if ( minObj.pickUV ) {
        faces = minObj.geometry.faces;
        face = faces[minFaceIndex];
        // We need to know the arity of the face because we will be building
        // a pair of axis vectors and we need to know which one is the "middle"
        // vertex.
        odd = ( minFaceIndex % 2 ) === 1;
        // I had to determine this order by trial and error, but now it looks
        // like it's a basic rotation, where the last two points of the previou
        // polygon are used as the first two points of the next polygon, what
        // is called a "Triangle Strip".
        v0 = minVerts[odd ? face[1] : face[0]];
        v1 = minVerts[odd ? face[2] : face[1]];
        v2 = minVerts[odd ? face[0] : face[2]];
        // Two vectors define the axes of a plane, i.e. our polygon face
        this.a.subVectors( v1, v0 )
            .normalize();
        this.b.subVectors( v2, v0 )
            .normalize();
        // The cross product of two non-parallel vectors is a new vector that
        // is perpendicular to both of the original vectors, AKA the face
        // "normal" vector. It sticks straight up out of the face, pointing
        // roughly in the direction of our pointer ball.
        this.c.crossVectors( this.a, this.b );
        // This matrix is a succinct way to define our plane. We'll use it
        // later to figure out how to express the location of the pointer ball
        // in corrodinates local to the plane.
        this.m.set(
            this.a.x, this.b.x, this.c.x, 0,
            this.a.y, this.b.y, this.c.y, 0,
            this.a.z, this.b.z, this.c.z, 0,
            0, 0, 0, 1 );

        // A value of 0 will tell us that there is no solvable solution, so we
        // want to avoid that.
        if ( this.m.determinant() !== 0 ) {

          // translate the point of interest into the reference frame of the
          // plane. We don't have to do any rotations because we are treating this
          // object as an infinitely small point.
          this.d.subVectors( p, v0 );
          // determine how far away from the plane the point lies
          dist = this.c.dot( this.d );

          // inverting the plane matrix will then let us apply it to the vector in
          // question to figure out the coordinates the point has in that plane.
          this.m.getInverse( this.m );
          this.d.applyMatrix4( this.m );

          // Now, construct a new plane based on the UV coordinates for the face.
          // We want to figure out where in the texture lies a coordinate that is
          // similar to how the pointer currently relates to the face.
          var uvs = minObj.geometry.faceVertexUvs[0][minFaceIndex],
              uv0 = uvs[odd ? 1 : 0],
              uv1 = uvs[odd ? 2 : 1],
              uv2 = uvs[odd ? 0 : 2];

          // I'm reusing the this.a and this.b vectors here to save memory, these
          // are a wholey new set of axes defining a new plane.
          this.a.set( uv1[0] - uv0[0], uv1[1] - uv0[1], 0 );
          this.b.set( uv2[0] - uv0[0], uv2[1] - uv0[1], 0 );

          // The normal for the texture is always straight out in the Z axis, so
          // there is no need to do any sort of calculations.
          this.m.set(
              this.a.x, this.b.x, 0, 0,
              this.a.y, this.b.y, 0, 0,
              this.a.z, this.b.z, 1, 0,
              0, 0, 0, 1 );

          var dx = Math.max( Math.abs( this.a.x ), Math.abs( this.b.x ) ),
              dy = Math.max( Math.abs( this.a.y ), Math.abs( this.b.y ) );

          // This is it, we've got our point now!
          this.d.applyMatrix4( this.m );
          this.d.x /= dx;
          this.d.y /= dy;
          this.d.x += uv0[0];
          this.d.y += uv0[1];
          value.point = [ this.d.x, this.d.y ];
          value.distance = dist;
        }
      }
    }

    this._fire( "hit", value );
  };

  return Projector;
} )();