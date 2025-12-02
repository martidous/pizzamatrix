let mandalaControls = {};

function setup() {
  createCanvas(windowWidth, windowHeight);
  // HSB mode, using values 0-360 for hue, 0-100 for others, 0-1 alpha
  colorMode(HSB, 360, 100, 100, 1);
  background(0);

  // --- THE GLASS HUD ---
  let ui = createDiv('').position(20, 20)
    .style('background', 'rgba(0,0,0,0.6)')
    .style('padding', '15px').style('border-radius', '8px')
    .style('color', '#fff').style('width', '280px')
    .style('font-family', 'Courier New, monospace')
    .style('backdrop-filter', 'blur(5px)');

  // Sliders to control the geometry
  mandalaControls.slices    = createControlKnob(ui, "Slices (Mirrors)", 2, 32, 12, 1);
  mandalaControls.speed     = createControlKnob(ui, "Spin Speed", -0.02, 0.02, 0.005, 0.001);
  mandalaControls.waveAmp   = createControlKnob(ui, "Pulse Amount", 0, 200, 80, 1);
  mandalaControls.waveFreq  = createControlKnob(ui, "Complexity", 1, 20, 8, 0.1);
  mandalaControls.colorSpd  = createControlKnob(ui, "Color Cycle", 0, 5, 1.5, 0.1);
}

function draw() {
  // 1. Create trails 
  blendMode(BLEND);
  fill(0, 0.05); // low opacity for long trails
  rect(0, 0, width, height);

  // 2. Switch to glowing additive light mode
  blendMode(ADD);
  translate(width / 2, height / 2);

  // --- GET SLIDER VALUES ---
  let numSlices = mandalaControls.slices.getValue();
  let spin = frameCount * mandalaControls.speed.getValue();
  let amp = mandalaControls.waveAmp.getValue();
  let freq = mandalaControls.waveFreq.getValue();
  let hueSpeed = mandalaControls.colorSpd.getValue();

  // Global rotation of the whole jewel
  rotate(spin);

  // Calculate the angle for each mirror slice
  let anglePerSlice = TWO_PI / numSlices;

  noFill();
  strokeWeight(2);

  // --- THE KALEIDOSCOPE LOOP ---
  for (let i = 0; i < numSlices; i++) {
    
    // Calculate color based on time and which slice we are drawing
    let hue = (frameCount * hueSpeed + i * 10) % 360;
    stroke(hue, 80, 80);
    push(); // Save current drawing state
    // Rotate to the position of this slice
    rotate(i * anglePerSlice);
    drawVibrantPattern(amp, freq);
    scale(1, -1); // Flip upside down
    drawVibrantPattern(amp, freq);
    pop(); // Restore drawing state for the next slice
  }
}

// --- THE SINGLE PATTERN ---
// This draws one "arm" of the mandala. The loop above repeats it.
function drawVibrantPattern(amplitude, frequency) {
  beginShape();
  // Draw a line extending outwards from center
  for (let r = 0; r < width/2 * 0.7; r += 5) {
    //  math that makes the line wavy instead of straight.
    // It's a Sine wave, wrapped radially.
    let angleOffset = sin(r * 0.01 * frequency - frameCount * 0.05);
    let y = angleOffset * amplitude * (r / 500); // Multiply by r/500 so it gets wavier further out
    // Add a slight twist based on distance (r)
    let x = r;
    vertex(x, y);
  }
  endShape();
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); background(0); }

// --- SLIDER HELPER 
function createControlKnob(parent, label, min, max, start, step) {
  let row = createDiv('').parent(parent).style('display','flex').style('justify-content','space-between').style('margin-bottom','8px');
  createSpan(label).parent(row).style('font-size','12px').style('width','100px');
  let s = createSlider(min, max, start, step).parent(row).style('width','100px').style('accent-color','#FF00FF'); // Magenta sliders
  let r = createSpan(start).parent(row).style('font-size','12px').style('width','40px').style('text-align','right').style('color','#aaa');
  s.input(() => r.html(step < 1 ? s.value().toFixed(2) : s.value()));
  return { getValue: () => s.value() };
}
