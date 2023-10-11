// Get references to the canvas and buttons
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const clearButton = document.getElementById("clear-button");

const increaseSizeButton = document.getElementById("increase-size");
const decreaseSizeButton = document.getElementById("decrease-size");

const brushSizeDisplay = document.getElementById("brush-size-display")

let brushSize = 2; // Initial brush size

brushSizeDisplay.innerHTML = brushSize;

increaseSizeButton.addEventListener("click", () => {
    brushSize += 1; // Increase the brush size
    context.lineWidth = brushSize;

    brushSizeDisplay.innerHTML = brushSize;
});

decreaseSizeButton.addEventListener("click", () => {
    if (brushSize > 1) {
        brushSize -= 1; // Decrease the brush size, but ensure it doesn't go below 2
        context.lineWidth = brushSize;
    }

    brushSizeDisplay.innerHTML = brushSize;
});





// Addin Color picker feture 
const colorPicker = document.getElementById("color-picker");

colorPicker.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    context.strokeStyle = selectedColor;
});





// Adding eraser toggle feature 

const toggleModeButton = document.getElementById("toggle-mode");
let isEraserMode = false;

toggleModeButton.addEventListener("click", () => {
    isEraserMode = !isEraserMode;

    if (isEraserMode) {
        context.globalCompositeOperation = "destination-out"; // Eraser mode
        context.strokeStyle = 'rgba(255,255,255)'; // Set the stroke color to white

    } else {
        context.globalCompositeOperation = "source-over"; // Paintbrush mode
        context.strokeStyle = colorPicker.value; // Set the stroke color back to the selected color
    }
});



// Adding eraser - brush toggle feture: 
// Define a variable to track eraser mode's state
let eraserModeActive = false;

// Function to toggle eraser mode
function toggleEraserMode() {
  eraserModeActive = !eraserModeActive; // Toggle the state

  // Get the image element
  const eraserImage = document.getElementById('eraser-image');
  //Get canvas elemet 
  const canvas = document.getElementById('canvas');

  // Set the image source based on the eraser mode's state
  if (eraserModeActive) {
    eraserImage.src = 'paintbrush.png'; // Change to paintbrush image

    canvas.style.cursor = 'url("eraser.cur"), auto'; // Set cursor to eraser
  } else {
    eraserImage.src = 'eraser.png'; // Change back to eraser image

    canvas.style.cursor = 'url("brush.cur"), auto'; // Set cursor to default brush
  }
}

// Add a click event listener to the button to toggle eraser mode
const eraserButton = document.getElementById('toggle-mode');
eraserButton.addEventListener('click', toggleEraserMode);






// Add Save feture 
const saveButton = document.getElementById("save-button");

saveButton.addEventListener("click", () => {
    const canvasData = canvas.toDataURL("image/png"); // Change "image/png" to "image/jpeg" for JPG format
    const a = document.createElement("a");
    a.href = canvasData;
    a.download = "drawing.png"; // Change the filename and extension as needed
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});






//Undo and Redo options

const undoButton = document.getElementById("undo-button");
const redoButton = document.getElementById("redo-button");
const undoStack = [];
const redoStack = []; // New redo stack
let lastImageData = null;

undoButton.addEventListener("click", () => {
    if (undoStack.length > 0) {
        // Pop the last item from the undo stack, which contains the image data
        const imageData = undoStack.pop();
        
        // Save the current canvas content before undoing
        lastImageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Restore the canvas to the previous state
        context.putImageData(imageData, 0, 0);
        
        // Push the undone data onto the redo stack
        redoStack.push(imageData);
    }
});

redoButton.addEventListener("click", () => {
    if (redoStack.length > 0) {
        // Pop the last item from the redo stack, which contains the image data
        const imageData = redoStack.pop();
        
        // Save the current canvas content before redoing
        lastImageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Restore the canvas to the redo state
        context.putImageData(imageData, 0, 0);
        
        // Push the redone data onto the undo stack
        undoStack.push(imageData);
    }
});

canvas.addEventListener("mousedown", () => {
    drawing = true;
    context.beginPath();
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
    context.closePath();
    
    // Save the canvas content to the undo stack after each stroke
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    undoStack.push(imageData);
    
    // Clear the redo stack when a new stroke is made
    redoStack.length = 0; // Clear the redo stack
    lastImageData = null;
});







// drawing feture on the canvas
let drawing = false;

// Set up initial drawing properties
context.lineWidth = 2;
context.strokeStyle = "#000";

// Event listeners
canvas.addEventListener("mousedown", () => {
    drawing = true;
    context.beginPath();
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
    context.closePath();
});

canvas.addEventListener("mousemove", draw);

clearButton.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
});

function draw(event) {
    if (!drawing) return;

    context.lineTo(event.clientX - canvas.getBoundingClientRect().left, event.clientY - canvas.getBoundingClientRect().top);
    context.stroke();
}

// Prevent right-click context menu on the canvas
canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});



//set canvas size
// Get references to the HTML elements
let canvasWidthInput = document.querySelector(".width");
let canvasHeightInput = document.querySelector(".height");
let setCanvasButton = document.getElementById("set-canvas");

// Event listener for the "Set Canvas Size" button
setCanvasButton.addEventListener("click", () => {
    // Get the width and height values from the input fields
    let newWidth = parseInt(canvasWidthInput.value, 10);
    let newHeight = parseInt(canvasHeightInput.value, 10);

    // Set the canvas size
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Clear the canvas (optional)
    context.clearRect(0, 0, canvas.width, canvas.height);
});