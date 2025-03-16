let myShader;

function preload() {
  myShader = loadShader("shader.vert","shader.frag");
}

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  shader(myShader);
  myShader.setUniform("iResolution", [width, height,1]);
  myShader.setUniform("iTime", millis() / 1000.0);
  myShader.setUniform("iFrameRate", frameRate());
  myShader.setUniform("iFrame", frameCount);
  myShader.setUniform("iMouse", [mouseX,mouseY,mouseIsPressed,mouseIsPressed]);
  noStroke();
  rect(0,0,width,height);
}
