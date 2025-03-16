precision mediump float;
uniform vec3 iResolution;           // viewport resolution (in pixels)
uniform float iTime;                 // shader playback time (in seconds)
uniform float iFrameRate;            // shader frame rate
uniform int iFrame;                // shader playback frame
uniform vec4 iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click

#define numOctaves 8

//----------------  CUSTOM NOISE FUNCTION  -----------------
//----------------------------------------------------------
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
// 

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 10.0) * x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
  0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
  -0.577350269189626,  // -1.0 + 2.0 * C.x
  0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

// Compute final noise value at P
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

//----------------------------------------------------------
// https://github.com/kbinani/colormap-shaders/tree/master

float colormap_red(float x) {
  if(x < 0.4128910005092621) {
    return (-6.30796693758704E+02 * x + 6.59139629181867E+02) * x + 8.16592339699109E+01;
  } else if(x < 0.5004365747118258) {
    return -1.99292307692284E+01 * x + 2.54503076923075E+02;
  } else if(x < 0.6000321805477142) {
    return -4.46903540903651E+02 * x + 4.68176638176691E+02;
  } else {
    return ((2.43537534073204E+03 * x - 5.03831150657605E+03) * x + 2.73595321475367E+03) * x - 1.53778856560153E+02;
  }
}

float colormap_green(float x) {
  if(x < 0.3067105114459991) {
    return (((((-1.43558931121826E+06 * x + 1.21789289489746E+06) * x - 3.88754308517456E+05) * x + 5.87745165729522E+04) * x - 3.61237992835044E+03) * x + 4.00139210969209E+02) * x + 4.80612502318691E+01;
  } else if(x < 0.4045854562297116) {
    return 3.64978461538455E+02 * x + 8.50984615384636E+01;
  } else if(x < 0.5035906732082367) {
    return 1.25827692307720E+02 * x + 1.81855384615367E+02;
  } else {
    return ((((-2.83948052403926E+04 * x + 1.08768529946603E+05) * x - 1.62569302478295E+05) * x + 1.17919256227845E+05) * x - 4.16776268978779E+04) * x + 6.01529271177582E+03;
  }
}

float colormap_blue(float x) {
  if(x < 0.1012683545126085) {
    return 5.85993431855501E+01 * x + 4.56403940886700E+00;
  } else if(x < 0.2050940692424774) {
    return 3.51072173913048E+02 * x - 2.50542028985514E+01;
  } else if(x < 0.5022056996822357) {
    return (-7.65121475963620E+02 * x + 1.20827362856208E+03) * x - 1.68677387505814E+02;
  } else if(x < 0.5970333516597748) {
    return -1.62299487179500E+02 * x + 3.26660512820525E+02;
  } else {
    return ((1.27993125066091E+03 * x - 3.19799978871341E+03) * x + 2.16242391471484E+03) * x - 1.93738146367890E+02;
  }
}

vec4 colormap(float x) {
  float r = clamp(colormap_red(x) / 255.0, 0.0, 1.0);
  float g = clamp(colormap_green(x) / 255.0, 0.0, 1.0);
  float b = clamp(colormap_blue(x) / 255.0, 0.0, 1.0);
  return vec4(r, g, b, 1.0);
}

//--------------Factorial brownian motion function--------------
float fbm(in vec2 x) {
  float H = 5.0;
  float G = exp2(-H);
  float f = 1.0;
  float a = 1.0;
  float t = 0.0;
  for(int i = 0; i < numOctaves; i++) {
    t += a * snoise(f * x);
    f *= 2.01;
    a *= G;
  }
  return t;
}

float pattern(in vec2 p, out vec2 q, out vec2 r) {
  float scaling = 0.7;
  q.x = fbm(scaling * p + vec2(-0.02 * iTime, 0.015 * iTime));
  q.y = fbm(scaling * p + vec2(0.03 * iTime, -0.02 * iTime));

  r.x = fbm(scaling * p + scaling * q + vec2(1.7, 9.2));
  r.y = fbm(scaling * p + scaling * q + vec2(8.3, 2.8));

  return fbm(p + scaling * r);
}

// Main
void main() {
  vec2 uv = ((gl_FragCoord.xy / iResolution.xy) * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
  vec2 q = vec2(0.0);
  vec2 r = vec2(0.0);
  float val = pattern(uv.xy, q, r);
  vec4 color = mix(colormap(val), colormap(length(r)), length(q));
  // gl_FragColor = vec4(uv.x, uv.y, uv.x * uv.y, 1.0);
  gl_FragColor = color;
}
