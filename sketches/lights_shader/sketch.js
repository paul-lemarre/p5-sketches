let myShader;

function preload() {
    myShader = loadShader("shader.vert", "shader.frag");
}

function setup() {
    pixelDensity(1);
    createCanvas(800, 600, WEBGL);
    camera(0, -80, 200);
}

function draw() {
    background(255);
    // Enable orbiting with the mouse.
    orbitControl();

    shader(myShader);
    noStroke();
    myShader.setUniform("iTime", millis() / 1000.0);
    sphere();
}

