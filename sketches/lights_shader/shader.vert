precision highp float;

attribute vec3 aPosition;
attribute vec4 aVertexColor;
attribute vec3 aNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform float iTime;

varying vec4 vVertexColor;

varying vec3 Normal;
varying vec3 FragPos;

void main() {
    vec3 position = aPosition;
    position.x += 0.1 * sin(iTime * 1.2 + position.x * position.y * 100.0);
    position.y += 0.1 * cos(iTime * 3.2 + position.x * position.y * 100.0);

  // Apply the camera transform
    vec4 viewModelPosition = uModelViewMatrix * vec4(position, 1.0);

  // Tell WebGL where the vertex goes
    gl_Position = uProjectionMatrix * viewModelPosition;  
  // Pass along data to the fragment shader
    vVertexColor = aVertexColor;
    FragPos = viewModelPosition.xyz;
    Normal = aNormal;
}
