const ColorifyShader = {

  uniforms: {
    "tDiffuse": { value: null },
    "amount":  { value: 1.0 }
  },

  vertexShader:
"varying vec2 vUv;\n\
\n\
void main() {\n\
  vUv = uv;\n\
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\
}",

  fragmentShader:
"uniform float amount;\n\
uniform sampler2D tDiffuse;\n\
\n\
varying vec2 vUv;\n\
\n\
void main() {\n\
  vec4 texel = texture2D( tDiffuse, vUv );\n\
  vec2 p = vUv - vec2(0.5, 0.5);\n\
  float scale = amount * min(1.0, 4.0 - pow(4.0 * dot(p, p), 2.0));\n\
  gl_FragColor = vec4(texel.xyz * scale, texel.w);\n\
}"

};