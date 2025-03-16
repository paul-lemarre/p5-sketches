// This attribute contains the position of the current pixel
attribute vec3 aPosition;

// get our texture coordinates from WEBGL/p5
attribute vec2 aTexCoord;
// create a varying vec2 which will store our texture coordinates
varying vec2 vTexCoord;

void main() {
  // copy the texcoords
  vTexCoord = aTexCoord;
  
  // We need to scale the position so that it is centered and covers the whole screen
  vec4 positionVec4 = vec4(aPosition, 1.0);
  
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0; // .xy means same action for both x and y
  
  gl_Position = positionVec4;
}