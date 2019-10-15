// See the 'assets' folder for our MP3 file URL
const MP3 =
  "https://cdn.glitch.com/16f0c613-9371-4e3e-8523-41c6f38423a9%2F01%20Get%20a%20Hit.mp3?v=1571150535131";

// Master volume in decibels
const volume = 0;

let player, analyser;
let showing = false;
let seed;
let palette = [];
let time;

// Create a new canvas to the browser size
async function setup() {
  createCanvas(windowWidth, windowHeight);

  // Make the volume quieter
  Tone.Master.volume.value = volume;

  // We can use 'player' to
  player = new Tone.Player();
  player.loop = true;
  player.autostart = false;
  player.loopStart = 1.0;

  // Load and "await" the MP3 file
  await player.load(MP3);

  // Create an analyser node that makes a waveform
  analyser = new AudioEnergy();

  // Connect with analyser as well so we can detect waveform
  player.connect(Tone.Master);

  Tone.Master.connect(analyser);
}

// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Render loop that draws shapes with p5
function draw() {
  // Ensure everything is loaded first
  if (!player || !analyser) return;

  const dim = Math.min(width, height);

  // Clear with color on setup
  background(240);

  // Update the analyser, only need to do this once per draw()
  analyser.update(deltaTime);

  if (showing) {
    randomSeed(seed);
    noiseSeed(seed);

    drawShapes(palette);
  }

  // Draw a 'play' or 'stop' button
  if (player && player.loaded && !showing) {
    noStroke();
    background("#83c9c7");
    cursor(CROSS);
    //polygon(width / 2, height / 2, dim * 0.1, 3);
  }
}

function drawShapes(palette) {
  background("#b7e0df");
  // All of your code needs to go in here...
  const dim = Math.min(width, height);

  const shapes = ["circle", "rect"];

  const x = mouseX;
  const y = mouseY;

  const color = random(palette);
  fill(color);
  noStroke();

  const range = "bass";
  const scale = map(analyser.getEnergy(range), -100, -30, 0, 1, true);

  const highend = analyser.getEnergy(9000, 10000);
  const highendlevel = map(highend, -100, -30, 0, 100, true);

  circle(width / 2, height / 2, highendlevel);

  //ADD LOWMID?
  // const range = 'bass';
  // const scale = map(analyser.getEnergy(range), -100, -30, 0, 1, true);

  const diameter = dim * 0.5 * scale;

  // Generates a random CIRCLE or RECTANGLE
  const shape = random(shapes);
  if (shape === "circle") {
    circle(x, y, diameter);
  } else if (shape === "rect") {
    rectMode(CENTER);
    rect(x, y, diameter, diameter);
  }
}

function mousePressed() {
  if (player && player.loaded) {
    if (player.state !== "started") {
      player.start();
    }
    palette = shuffle(RISO_COLORS).slice(0, 5);
    seed = random(0, 10000);
    player.mute = false;
    showing = true;
  }
}

function mouseReleased() {
  if (player && player.loaded) {
    player.mute = true;
    showing = false;
  }
}

// Draw a basic polygon, handles triangles, squares, pentagons, etc
// function polygon(x, y, radius, sides = 3, angle = 0) {
//   beginShape();
//   for (let i = 0; i < sides; i++) {
//     const a = angle + TWO_PI * (i / sides);
//     let sx = x + cos(a) * radius;
//     let sy = y + sin(a) * radius;
//     vertex(sx, sy);
//   }
//   endShape(CLOSE);
// }

// Draw a line segment centred at the given point
function segment(x, y, length, angle = 0) {
  const r = length / 2;
  const u = Math.cos(angle);
  const v = Math.sin(angle);
  line(x - u * r, y - v * r, x + u * r, y + v * r);
}
