const renderButton = document.getElementById("renderButton");
const imageSource = document.getElementById("imageSource");

const imageWidth = imageSource.width;
const imageHeight = imageSource.height;

const mergeDimension = 16;

const targetWidth = imageSource.width / mergeDimension;
const targetHeight = imageSource.height / mergeDimension;

let arr = [];
let commonKeys = [];
// every pixel image is a collection of pixels; as in a 320x320 image has 1 color per pixel for 320x320 items
// make a fxn that gets the color of each pixel

function getImageData() {
    //make a canvas of the image and get the image data
    const canvasOriginal = document.getElementById("canvasOriginal");
    canvasOriginal.width = imageSource.width;
    canvasOriginal.height = imageSource.height;
    const contextOriginal = canvasOriginal.getContext("2d");
    contextOriginal.drawImage(imageSource, 0, 0);
  
    const imageData = contextOriginal.getImageData(
      0,
      0,
      canvasOriginal.width,
      canvasOriginal.height
    );
  
    console.log("Image is " + imageWidth + " x " + imageHeight);
    console.log("Target is " + targetWidth + " x " + targetHeight);
    console.log("Total data values " + imageData.data.length);
  
    return imageData;
  }

function buildRGB(imageData) {
    // make an empty array
    const rgbaValues = [];
    // loop through imagedata and get the rgb values for each 
    for(let i = 0; i < imageData.length; i += 4) {
        const rgb = {
            r: imageData[i],
            g: imageData[i + 1],
            b: imageData[i + 2],
            a: imageData[i + 3]
        };
        rgbaValues.push(rgb);
    }

    console.log("There are " + rgbaValues.length + " colours");
    // console.log(rgbValues);
    return rgbaValues;
}

function getPopularColours(imageData) {
    // make a map to house the different color codes
    // let map = new Map();
  
    // array to push the most common colour to
    let tracking = [];
    let popularColours = [];
  
    for (let i = 0; i < imageData.length; i++) {
      let row = Math.floor(i / imageWidth / mergeDimension);
      let column = Math.floor((i % imageWidth) / mergeDimension);
  
      let red = imageData[i].r;
      let green = imageData[i].g;
      let blue = imageData[i].b;
      let alpha = imageData[i].a;
      let colourLabel = `${red}-${green}-${blue}-${alpha}`;
  
      if (tracking[row] == undefined) {
        tracking[row] = new Array();
      }
      if (tracking[row][column] == undefined) {
        tracking[row][column] = new Array();
      }
  
      if (tracking[row][column][colourLabel] == undefined) {
        tracking[row][column][colourLabel] = 1;
      } else {
        tracking[row][column][colourLabel]++;
      }
    }
  
    for (let i = 0; i < tracking.length; i++) {
      for (let j = 0; j < tracking[i].length; j++) {
        if (popularColours[i] == undefined) {
          popularColours[i] = new Array();
        }
        if (popularColours[i][j] == undefined) {
          popularColours[i][j] = new Array();
        }
  
        let max = 0;
        let maxValue = "";
  
        // console.log(tracking[i][j].length);
        // console.log(tracking[i][j]);
  
        for (key in tracking[i][j]) {
          if (tracking[i][j][key] > max) {
            max = tracking[i][j][key];
            maxValue = key;
          }
        }
  
        popularColours[i][j] = key;
      }
    }
  
    return popularColours;
  }

function paintCanvas(arr) {
    const canva = document.getElementById("canvas-2");
    let context = canva.getContext("2d");
    canva.width = 16;
    canva.height = 16;
    let imageData = context.createImageData(canva.width, canva.height);
    console.log(imageData);
    let data = imageData.data;
    let split = [];

    arr.forEach((entry) => {
        entry.forEach(subEntry => {
            let temp = subEntry.split("-");
            console.log(temp);
            temp.forEach(num => {
                split.push(num);
            })            
        })
    });
    console.log(split);

    let count = 0;
    while (count < split.length) {
        data[count] = split[count];
        count++
    }

    context.putImageData(imageData, 0, 0);
}

renderButton.addEventListener("click", () => {
    // Get the image data
    let imageData = getImageData();
    // console.log(imageD);
    // get an array with all the rgba values of the image
    let rgbaValues = buildRGB(imageData.data);
    // console.log(arr);
    //get an array with the most common colour for each 16 pixels
    let popularColours = getPopularColours(rgbaValues);
    console.log(popularColours);

    paintCanvas(popularColours);
});

//to do: 
// have an image upload feature #5
// use php or node to upload image #6