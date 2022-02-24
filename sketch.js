
/***********************************************************************************
  Clickable Nanobot Experience
  by Luis Sanchez
  
  Utilizes the p5 Clickable library to create an interactive experience focused on 
  a series of fictional nanobots.

  The page displays an image of the nanobot in the center in an idle animation. Below
  it are a series of 5 interactive buttons that interact with the nanobots in different
  ways.

  1.) Search Mode Description - Describes what the search mode of the nanobot does.
  2.) Operation Mode Description - Describes what the operation mode of the nanobot does.
  3.) Add Nanobot - Adds a nanobot to the background, once 30 nanobots are on screen,
      they are mobilized and move off the screen.
  4.) Remove Nanobot - Removes a nanobot from the background
  5.) Toggle Modes - This button will toggle between the search and operation mode of
      the nanobot, which is visually different.

***********************************************************************************/

// The nanobot image to display across the page.
var mainImage;
// Determines what mode to display, false = search mode, true = operation mode.
var opMode;
// Determines if the background nanobots are being deployed, if they are, no buttons can
// be interacted with until the animation is over.
var deploying;
// Boolean that determines whether a mode description should be shown or not.
var showDescription;
// Defines what type of description to show, 0 = Search, 1 = Operation.
var descriptionType;
// The Y value for the central nanobot image.
var imageY;
// The ClickableManager object that handles all the buttons and interactions.
var clickablesManager;
// The array of Clickable objects built from the manager.
var clickables;
// An array that preserves the x positions of up to 30 nanobots.
var botXPositions = [];
// An array that preserves the x positions of up to 30 nanobots.
var botYPositions = [];

// Constant index for increment button.
const incrementID = 0;
// Constant index for decrement button.
const decrementID = 1;
// Constant index for search mode description button.
const searchDescID = 2;
// Constant index for toggle mode button.
const operationID = 3;
// Constant index for operation mode description button.
const opDescID = 4;

// Constant display text for search mode description.
const searchText = "The nanobots start in a hyper-mobile \"search mode\", where"+
" they are the most capable of traversing the body. They utilize an array of 10 cameras"+
" around their carapace to get a 360 degree visualization of their surroundings.";

// Constant display text for operation mode description.
const operationText = "Once a nanobot has reached its designated target, it will shift"+
" into \"operation mode\" by opening the storage module in its tip. Inside the nanobot"+
" is an array of miniature tools used for conducting medical aid on the body. These tools"+
" consist of 2 calipers/claws, a medical saw, a scalpel, and a syringe for administering"+
" antibiotics and healing medication to any wounds."

/**
 * Loads the Clickable objects from the given CSV and the Nanobot image from the assets
 * folder.
 */
function preload() {
  clickablesManager = new ClickableManager('assets/clickableLayout.csv');
  mainImage = loadImage('assets/SearchMode.png');
}

/**
 * Calls the setup function for the ClickableManager object and initializes all the
 * relevant global variables for interaction.
 */
function setup() {
  createCanvas(800,700);
  imageY = height/2 - 60;
  opMode = false;
  deploying = false;
  offScreenCount = 0;
  showDescription = false;
  descriptionType = 0;
  clickables = clickablesManager.setup();
  setupClickables();
  console.log(clickables);
}

// Determines the direction of movement for the nanobot idle animation.
var speedY = 0.5;

/**
 * Draws the nanobot swarm (if the arrays have elements), the descriptions (if they have
 * been toggled on by the buttons), the central nanobot image (always), and the array of
 * Clickable object buttons.
 */
function draw() {
  background('#0A2463');

  imageMode(CENTER);
  drawSwarm();
  drawDescription();
  drawMainNanobot();

  imageMode(CORNER);
  clickablesManager.draw();
}

/**
 * Draws the search mode/operation mode description above the corresponding button
 * for each description.
 */
function drawDescription() {
  if(showDescription) {
    let descX, descY, descText;

    if(descriptionType === 0) {
      descX = 160;
      descText = searchText;
    }
    else {
      descX = width-160;
      descText = operationText;
    }

    rectMode(CENTER);
    fill(57, 32, 97, 180);
    stroke('white');
    strokeWeight(2);
    rect(descX, height/2 - 90, 230, 300);
    textAlign(CENTER, CENTER);
    noStroke();
    fill('white');
    text(descText, descX, height/2 - 90, 150, 250);
    noFill();
    rectMode(CORNER);
  }
}

/**
 * Draws a sequence of nanobots based around the number of X,Y coordinates logged 
 * in the x and y positions arrays. 
 */
function drawSwarm() {
  let imageWidth, imageHeight;
  imageWidth = 70;

  if(!opMode) {
    imageHeight = 75;  
  }
  else {
    imageHeight = 126;
  }
  // Display all the nanobots with no movement if there is less than 30 on screen.
  if(botXPositions.length < 30 && !deploying) {
    for(let i = 0; i < botXPositions.length; i++) {
      image(mainImage, botXPositions[i], botYPositions[i], imageWidth, imageHeight);
    }
  }
  else {
    // Once there are more than 30 nanobots on screen, slowly increase the y position 
    // of each nanobot by 12 until they are offscreen.
    if(botXPositions.length > 0) {
      // Set deploying to true to disable button interactions.
      deploying = true;
      for(let i = 0; i < botXPositions.length; i++) {
        if(botYPositions[i] < height+100) {
          botYPositions[i] += 12;
          image(mainImage, botXPositions[i], botYPositions[i], imageWidth, imageHeight);
        }
        else {
          // Once a nanobot is offscreen, it is removed from both arrays.
          botXPositions.splice(i, 1);
          botYPositions.splice(i, 1);
        }
      }
    }
    else {
      // Set deploying back to false to reenable button interactions since the animations
      // have all been completed.
      deploying = false;
    }
  }
}

/**
 * Draws the central nanobot in the middle of the canvas. Has a slight idle animation that
 * bobs up and down.
 */
function drawMainNanobot() {
  image(mainImage, width/2, imageY);
  imageY += speedY;

  if(imageY >= height/2 - 45) {
    speedY = -0.5;
  }
  if(imageY <= height/2 - 75) {
    speedY = 0.5;
  }
}

// change individual fields of the clickables
function setupClickables() {
  // These are the CALLBACK functions. Right now, we do the SAME function for all of the clickables
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onPress = clickableButtonPressed;
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
  }
}

//--- CLICKABLE CALLBACK FUNCTIONS ----

clickableButtonPressed = function () {
  // Increment button adds new X, Y values to the X, Y arrays.
  if(this.id === incrementID && !deploying) {
    botXPositions.push(random(100, (width-100)));
    botYPositions.push(random(150, 450));
  }

  // Decrement button removes the most recently added nanobot from the background.
  if(this.id === decrementID && !deploying) {
    if(botXPositions.length > 0) {
      botXPositions.pop();
      botYPositions.pop();
    } 
  }

  // Toggle mode button updates the image reference for all the nanobots on the canvas.
  if(this.id === operationID && !deploying) {
    if(!opMode) {
      mainImage = loadImage('assets/OperationMode.png');
    }
    else {
      mainImage = loadImage('assets/SearchMode.png');
    }
    opMode = !opMode;
  }

  // Search Description button only displays the description for search mode on the
  // left side of the canvas.
  if(this.id === searchDescID && !deploying) {
    showDescription = !showDescription;
    descriptionType = 0;
  }

  // Operation Description button only displays the description for operation mode on 
  // the right side of the canvas.
  if(this.id === opDescID && !deploying) {
    showDescription = !showDescription;
    descriptionType = 1;
  }
}

// Recolor when moused over.
clickableButtonHover = function () {
  this.color = "#0A3200";
  this.noTint = false;
  this.tint = "#0A3200";
  this.textColor = "white";
}

// Default color for buttons when not hovered.
clickableButtonOnOutside = function () {
  this.color = "#6290C8";
  this.textColor = "white";
  this.noTint = true;
}