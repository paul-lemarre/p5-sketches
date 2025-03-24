precision mediump float;

varying vec4 vVertexColor;

varying vec3 Normal;
varying vec3 FragPos;

// Main
void main() {
    vec3 lightPos = vec3(0, 50, 100);
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(lightPos - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 col = diff * vec3(0.1, 0.5, 0.2);
    gl_FragColor = vec4(col, 1.0);
}
