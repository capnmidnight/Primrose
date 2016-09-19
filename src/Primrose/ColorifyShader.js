const ColorifyShader = {

  uniforms: {
    "tDiffuse": { value: null },
    "amount":  { value: 1.0 }
  },

  vertexShader: [
    "varying vec2 vUv;",

    "void main() {",
      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join("\n"),

  fragmentShader: [
    "uniform float amount;",
    "uniform sampler2D tDiffuse;",

    "varying vec2 vUv;",

    "void main() {",
      "vec4 texel = texture2D( tDiffuse, vUv );",
      "gl_FragColor = vec4(texel.xyz * amount, texel.w);",
    "}"
  ].join("\n")

};