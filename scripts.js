const test = document.getElementById("test");
const img1 = document.getElementById("img_split");
let arr = [];
let commonKeys = [];
// every pixel image is a collection of pixels; as in a 320x320 image has 1 color per pixel for 320x320 items
// make a fxn that gets the color of each pixel
function main() {
    //make a canvas of the image and get the image data
    const canvas = document.getElementById("canvas");
    canvas.width = img1.width;
    canvas.height = img1.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img1, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // console.log(imageData);
    return imageData;
};

function buildRGB(imageData) {
    // make an empty array
    const rgbValues = [];
    // loop through imagedata and get the rgb values for each 
    for(let i = 0; i < imageData.length; i += 4) {
        const rgb = {
            r: imageData[i],
            g: imageData[i + 1],
            b: imageData[i + 2],
            a: imageData[i + 3]
        };
        rgbValues.push(rgb);
    }
    // console.log(rgbValues);
    return rgbValues;
}

function commonCol(imgdata) {
    // make a map to house the different color codes
    let map = new Map();
    // array to push the most common colour to
    let temp = [];
    // array to house each most common colour in order
    let keys = [];
    // set a counter so every 16 pixels you push the most common element to an array and reset
    let count = 0;
    for (let i = 0; i < imgdata.length; i++) {
        //build the colour object for keys
        let red = imgdata[i].r;
        let green = imgdata[i].g;
        let blue = imgdata[i].b;
        let alpha = imgdata[i].a;
        let col = `${red},${green},${blue},${alpha}`;
        if(count < 15) {
            if (!map.has(col)) {
                map.set(col,1);
                count++;
            } else {
                map.set(col, map.get(col)+1);
                count++;
            }
        } else if (count === 15) {
            map.set(col, map.get(col)+1);
            //push the most common key/value pair to array
            temp.push([...map.entries()].reduce((a, e) => e[1] > a[1] ? e : a));
            // reset
            map.clear();
            count = 0;
        }
    }
    //push the keys to an array
    temp.forEach(pair => {
        keys.push(pair[0]);
    });
    console.log(keys);
    return keys;
}

function paintCanvas(){
    const canva = document.getElementById("canvas-2");
    let context = canva.getContext("2d");
    canva.width = 64;
    canva.height = 64;
    let imageData = context.createImageData(canva.width, canva.height);
    console.log(imageData);
    let data = imageData.data;
    let split = [];
    commonKeys.forEach(entry => {
        split.push(entry.split(","));
    })
    console.log(split);

    if (commonKeys !== undefined) {
        let count = 0;
        for (let i = 0; i < 64*64*4; i += 4) {
            data[i] = split[count][0];
            data[i+1] = split[count][1];
            data[i+2] = split[count][2];
            data[i+3] = split[count][3];
            count++
        }
    }

    // console.log(imageData);

    context.putImageData(imageData, 0, 0);
}   

test.addEventListener("click", () => {
    //get the image data
    let imageD = main();
    // console.log(imageD);
    // get an array with all the rgba values of the image
    arr = buildRGB(imageD.data);
    // console.log(arr);
    //get an array with the most common colour for each 16 pixels
    commonKeys = commonCol(arr);
    // console.log(commonKeys); //array of 64x64
    paintCanvas();
});

//to do: 
// have an image upload feature #5
// use php or node to upload image #6
// use built in method to convert the image to 16x16 #1 scratch
// find the most popular colour in that square #2 done
// push that colour as square for (x,y) array #3 done
// colour the array images #4 