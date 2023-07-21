function createSketchPad(size){
  const sketchPad_div = document.getElementById('sketchPad');

  //remove old SketchPad
  while (sketchPad_div.hasChildNodes()) {
    sketchPad_div.removeChild(sketchPad_div.firstChild);
  }

  //create new SketchPad grid items based on the input: size
  sketchPad_div.style['grid-template-columns'] = `repeat(${size}, 1fr)`;
  sketchPad_div.style['grid-template-rows'] = `repeat(${size}, 1fr)`;
  sketchPad_div.classList.add('removeBorder'); //remove border-bottom and border-right of wraper so it doesn't overlap with border of grid items

  for (let i = 0; i<size ** 2;i++){
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    sketchPad_div.appendChild(gridItem);
    gridItem.addEventListener('mouseover',changeGridColor);
    gridItem.addEventListener('mousedown',changeGridColor);
  }
}

function randomColor(){
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function changeColor(e,color){
  e.target.setAttribute(`style`, `background-color:${color}`);
}

function changeGridColor(e){
  if (e.buttons === 1){
    e.preventDefault() //preventing dragging element event occuring cause by mousedown and mousemove events
    if (eraseMode){changeColor(e,'rgb(255,255,255)');}
    else if (rainbowColorMode){changeColor(e,randomColor());}
    else {
      if (shadingMode) {color = shading(color)}
      changeColor(e,color);
    }
    if (e.type === 'mouseover'){
      if (eraseMode){changeColor(e,'rgb(255,255,255)')}
      else if (rainbowColorMode){changeColor(e,randomColor());}
      else {
        if (shadingMode) {color = shading(color)};
        changeColor(e,color);
      }
    }
  }
}

function clearSketchPad(){
  const gridItems = document.querySelectorAll('.grid-item')
  gridItems.forEach(element => {
    element.removeAttribute('style');
  });
  interactions = 0;
  color = originalColor;
  if (eraseMode){
  document.getElementById('eraseMode').classList.toggle('button-active');
  eraseMode = false;
  }
}

function getSizeInput(e){
  let size = (e.target.value);
  const text = document.querySelector('.gridSize');
  text.textContent = `Grid Size: ${size}x${size}`;
  createSketchPad(parseInt(size));
};

function toggleRainbow(e){
  if (rainbowColorMode) {
    rainbowColorMode = false;
    e.target.classList.toggle('button-active');                                
  }
  else {
    rainbowColorMode = true;
    e.target.classList.toggle('button-active');
    if (shadingMode){
      shadingMode = false;
      color = originalColor ;
      document.getElementById('shadingMode').classList.toggle('button-active');
    }
  }
}

function toggleErase(e){
  if (eraseMode) {
    eraseMode = false;
    e.target.classList.toggle('button-active');                                
  }
  else {
    eraseMode = true;
    e.target.classList.toggle('button-active');
  }
}

function toggleShading(e){
  if (shadingMode) {
    shadingMode = false;
    e.target.classList.toggle('button-active');
    color = originalColor ; // restore orginal chosen color                               
  }
  else {
    shadingMode = true;
    interactions = 0;
    e.target.classList.toggle('button-active');
    if (rainbowColorMode){
      rainbowColorMode = false;
      document.getElementById('rainbowMode').classList.toggle('button-active');
    }
  }
}

//Adding 10% more darken color to the grid.
//The objective is to achieve a completely black grid only after ten interactions
function shading(color) {
  if (interactions < maxInteractions) {
    const rgbValues = color.match(/\d+/g);
    const r = parseInt(rgbValues[0]);
    const g = parseInt(rgbValues[1]);
    const b = parseInt(rgbValues[2]);

    const darkerR = Math.floor(r * 0.9); // Darken the red channel by 10%
    const darkerG = Math.floor(g * 0.9); // Darken the green channel by 10%
    const darkerB = Math.floor(b * 0.9); // Darken the blue channel by 10%
    interactions++;
    return `rgb(${darkerR}, ${darkerG}, ${darkerB})`;
  }
  else return color
}

function hexToRGB(hexColor) {
  if (hexColor.charAt(0) === '#') {hexColor = hexColor.substr(1);}
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function pickColor(e){
  color = hexToRGB(e.target.value);
  originalColor  = color;
  interactions = 0;
}

//updating Copyright Year
function updateYear() {
  const currentYear = new Date().getFullYear();
  document.getElementById('currentYear').textContent = currentYear;
}

let originalColor  = 'rgb(0,0,0)' //store orginal chosen color to restore when toggle of Shading Mode
let color = 'rgb(0,0,0)'; // //default color = black
let rainbowColorMode = false; //default rainbowColor = inactive
let eraseMode = false; //default eraseMode = inactive
let shadingMode = false; //default shadingMode = inactive
let interactions = 0;
const maxInteractions = 10;

createSketchPad(16); //default grid size = 16x16
updateYear();

document.getElementById('sizeInput').addEventListener('input', getSizeInput);
document.getElementById('clearSketchPad').addEventListener('click',clearSketchPad);
document.getElementById('colorPicker').addEventListener('input', pickColor)
document.getElementById('rainbowMode').addEventListener('click', toggleRainbow)
document.getElementById('eraseMode').addEventListener('click', toggleErase)
document.getElementById('shadingMode').addEventListener('click', toggleShading)

