let model, webcam, ctx, labelContainer, sortedPrediction, maxPredictions, pose, posenetOutput;
let models = [];

let btn;
let currentImg, showImgUntil, imgShowing, poseConfirmed;
let currentPose;
let currentPoseProbability;
let exerciseIndex = 0;
let running = false;
let squatCount = 0;
let jumpingjackCount = 0;
let obliquebendCount = 0;
let scarecrowCount = 0;


// paste the url of the model you trained in teachablemachine here
let URL = `models/model${exerciseIndex}/`;
let modelURL = URL + "model.json";
let metadataURL = URL + "metadata.json";
// let doPredictions = true;

const exercises = [
  "squat",
  "jumpingjack",
  "obliquebend",  
  "scarecrow",
  // "twistjump", // remove this
  // "backbend", // remove this 
  // "kneetoelbow", // remove this
  // "sidelunge", // remove this
  // "crisscross" // remove this
];
let images = [];
let sounds = [];

const cam_w = 1280;
const cam_h = 720;
const imgDisplayDuration = 5000; // time in milliseconds to show each image

function preload() {

  images.push(loadImage('squatc.jpg'));
  images.push(loadImage('jumpingjackc.jpg'));
  images.push(loadImage('obliquebendc.jpg'));
  images.push(loadImage('scarecrowc.jpg'));
  // images.push(loadImage('twistjump.jpeg'));
  //images.push(loadImage('backbend.jpeg'));
  // images.push(loadImage('kneetoelbow.jpeg'));
  // images.push(loadImage('sidelunge.jpeg'));
  // images.push(loadImage('crisscross.jpeg'));
  
  sounds.push(loadSound('reward.mp3'));
  sounds.push(loadSound('reward2.mp3'));
  sounds.push(loadSound('reward3.mp3'));
  sounds.push(loadSound('reward4.mp3'));
  // sounds.push(loadSound('reward5.mp3'));
  // sounds.push(loadSound('reward6.mp3'));
  // sounds.push(loadSound('reward7.mp3'));
  // sounds.push(loadSound('reward8.mp3'));
  // sounds.push(loadSound('reward9.mp3'));
}

async function setup() {
  // model = await tmPose.load(modelURL, metadataURL);
  // load all the models into an array
  for(let i = 0; i < 4; i++) {
    let url = `models/model${i}/`;
    let modelurl = url + "model.json";
    let metadataurl = url + "metadata.json";
    let tempmodel = await tmPose.load(modelurl, metadataurl);
    models.push(tempmodel);
  }
  model = models[exerciseIndex]

  maxPredictions = model.getTotalClasses();

  document.getElementById("status").innerHTML = "Setting up camera";

  const flip = true;
  webcam = new tmPose.Webcam(cam_w, cam_h, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop1);

  const canvas = document.getElementById("canvas");
  canvas.width = cam_w;
  canvas.height = cam_h;
  ctx = canvas.getContext("2d");
  createCanvas(cam_w, cam_h);

  btn = createButton('Start Exercise');
  btn.addClass("start-button");
  // btn.position(10, cam_h + 10);
  btn.mousePressed(startExercise);

  document.getElementById("status").innerHTML = "Ready";
  currentPose = "loading..."
  currentPoseProbability = ""
}

function startExercise() {
  setTimeout(function() {
    running = true;
    currentImg = images[exerciseIndex];
    showImgUntil = millis() + imgDisplayDuration;
    imgShowing = true;
    poseConfirmed = false;
    btn.hide();
  }, 3000)
}


function draw() {
  background(0);

  if (imgShowing && millis() < showImgUntil && running == true) {
    image(currentImg, 0, 0, cam_w, cam_h);
  } else if (imgShowing && millis() >= showImgUntil) {
    imgShowing = false;
    // Switch to pose checking mode
  }


  if (pose && !imgShowing && !poseConfirmed && running == true) {
    // draw keypoints
    pose.keypoints.forEach((keypoint) => {
      ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
    });

    // draw connecting bones
    // left arm
    stroke(255);
    strokeWeight(5);
    line(pose.keypoints[5].position.x, pose.keypoints[5].position.y, pose.keypoints[7].position.x, pose.keypoints[7].position.y)

    line(pose.keypoints[7].position.x, pose.keypoints[7].position.y, pose.keypoints[9].position.x, pose.keypoints[9].position.y)

    line(pose.keypoints[6].position.x, pose.keypoints[6].position.y, pose.keypoints[8].position.x, pose.keypoints[8].position.y)

    line(pose.keypoints[8].position.x, pose.keypoints[8].position.y, pose.keypoints[10].position.x, pose.keypoints[10].position.y)

    line(pose.keypoints[5].position.x, pose.keypoints[5].position.y, pose.keypoints[6].position.x, pose.keypoints[6].position.y)

    line(pose.keypoints[11].position.x, pose.keypoints[11].position.y, pose.keypoints[12].position.x, pose.keypoints[12].position.y)

    line(pose.keypoints[5].position.x, pose.keypoints[5].position.y, pose.keypoints[11].position.x, pose.keypoints[11].position.y)

    line(pose.keypoints[6].position.x, pose.keypoints[6].position.y, pose.keypoints[12].position.x, pose.keypoints[12].position.y)

    line(pose.keypoints[11].position.x, pose.keypoints[11].position.y, pose.keypoints[13].position.x, pose.keypoints[13].position.y)

    line(pose.keypoints[13].position.x, pose.keypoints[13].position.y, pose.keypoints[15].position.x, pose.keypoints[15].position.y)

    line(pose.keypoints[12].position.x, pose.keypoints[12].position.y, pose.keypoints[14].position.x, pose.keypoints[14].position.y)

    line(pose.keypoints[14].position.x, pose.keypoints[14].position.y, pose.keypoints[16].position.x, pose.keypoints[16].position.y)

    line(pose.keypoints[0].position.x, pose.keypoints[0].position.y, pose.keypoints[1].position.x, pose.keypoints[1].position.y)

    line(pose.keypoints[0].position.x, pose.keypoints[0].position.y, pose.keypoints[2].position.x, pose.keypoints[2].position.y)

    line(pose.keypoints[1].position.x, pose.keypoints[1].position.y, pose.keypoints[3].position.x, pose.keypoints[3].position.y)

    line(pose.keypoints[0].position.x, pose.keypoints[0].position.y, pose.keypoints[4].position.x, pose.keypoints[4].position.y)

    line(pose.keypoints[1].position.x, pose.keypoints[1].position.y, pose.keypoints[4].position.x, pose.keypoints[4].position.y)

    line(pose.keypoints[2].position.x, pose.keypoints[2].position.y, pose.keypoints[4].position.x, pose.keypoints[4].position.y)

    line(pose.keypoints[3].position.x, pose.keypoints[3].position.y, pose.keypoints[4].position.x, pose.keypoints[4].position.y)

    fill(255)
    strokeWeight(1)

    // text(currentPose, width/2, 20);
    // text(currentPoseProbability, width/2, 40);

    text(squatCount, 0, 0);
    text(jumpingjackCount, 1, 1);
    text(obliquebendCount, 2, 2);
    text(scarecrowCount, 3, 3);

    // console.log(pose)

    if (checkPose()) {
      doPredictions = false;
      poseConfirmed = true;
      sounds[exerciseIndex].play();

      switch(exerciseIndex) {
        case 0:
          squatCount++
          break;
        case 1:
         jumpingjackCount++
         break;
        case 2:
         obliquebendCount++
         break;
        case 3:
          scarecrowCount++
          break;
    
      }
      

      setTimeout(() => {
        currentImg = images[exerciseIndex]; // Toggle between images
        showImgUntil = millis() + imgDisplayDuration;
        if(exerciseIndex > 0) {
          imgShowing = true;
        }
        poseConfirmed = false;
        doPredictions = true;
      }, 3000); // Wait for 1 second before showing the next image
    }
  }
}

debug.addEventListener("click", function(){
  console.log(exerciseIndex)
  doPredictions = false;
      poseConfirmed = true;
      sounds[exerciseIndex].play();
      if(exerciseIndex < exercises.length-1) {
        exerciseIndex++;
        model = models[exerciseIndex]
      } else {
        exerciseIndex = 0;
        model = models[0];
        running = false;
        btn.show()// show the button again
      }
      // URL = `models/model${exerciseIndex}/`;
      // modelURL = URL + "model.json";
      // metadataURL = URL + "metadata.json";
      // model = tmPose.load(modelURL, metadataURL);

      setTimeout(() => {
        currentImg = images[exerciseIndex]; // Toggle between images
        showImgUntil = millis() + imgDisplayDuration;
        // imgShowing = false;
        if(exerciseIndex > 0) {
          imgShowing = true;
        }
        poseConfirmed = false;
        doPredictions = true;
      }, 1000); // Wait for 1 second before showing the next image
})


function checkPose() {
  // Implement logic to check if the current pose matches the required pose
  // This function should return true if the pose matches
  if(!poseConfirmed && currentPose == exercises[exerciseIndex]) {
    console.log(`You did a ${currentPose}, good job.`)
    
    if(exerciseIndex < exercises.length - 1) {
      exerciseIndex++;
      model = models[exerciseIndex]
      
    }else{
      exerciseIndex = 0;
      model = models[0];
      running = false;
      btn.show()// show the button again 
    }
    return true;
  }
  

  return false; // Placeholder: should be replaced with actual checking logic
}

async function loop1(timestamp) {
  webcam.update();
  //if(!doPredictions) {
    if(running) {
      pose = await predict();
    }
  //}
  window.requestAnimationFrame(loop1);
}

async function predict() {
  // store the pose information (keypoints AND detected pose from trained model)
  const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
  const prediction = await model.predict(posenetOutput);
  sortedPrediction = prediction.sort((a, b) => -a.probability + b.probability);
  drawVideo();
  // console.log("hello")
  console.log(sortedPrediction[0].className)
  currentPose = sortedPrediction[0].className;
  currentPoseProbability = sortedPrediction[0].probability;

  return pose;
}

function drawVideo() {
  if (webcam.canvas) {
    ctx.drawImage(webcam.canvas, 0, 0);
  }
}

function drawSkeleton() {

}