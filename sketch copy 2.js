// paste the url of the model you trained in teachablemachine here
let URL = "model/";
let modelURL = URL + "model.json";
let metadataURL = URL + "metadata.json";

let model, webcam, ctx, labelContainer, sortedPrediction, maxPredictions, pose, posenetOutput;
let img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, sound1, btn;
let currentImg, showImgUntil, imgShowing, poseConfirmed;

const cam_w = 640;
const cam_h = 480;
const imgDisplayDuration = 5000; // time in milliseconds to show each image

function preload() {
  img1 = loadImage('squat.jpeg');
  img2 = loadImage('jumpingjack.jpeg');
  img3 = loadImage('obliquebend.jpeg');
  img4 = loadImage('scarecrow.jpeg');
  img5 = loadImage('twistjump.jpeg');
  img6 = loadImage('backbend.jpeg');
  img7 = loadImage('kneetoelbow.jpeg');
  img8 = loadImage('sidelunge.jpeg');
  img9 = loadImage('torsotwist.jpeg');
  img10 = loadImage('crisscross.jpeg');

  sound1 = loadSound('reward.mp3');
}

async function setup() {
  model = await tmPose.load(modelURL, metadataURL);
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
  btn.position(10, cam_h + 10);
  btn.mousePressed(startExercise);

  document.getElementById("status").innerHTML = "Ready";
}

function startExercise() {
  currentImg = img1;
  showImgUntil = millis() + imgDisplayDuration;
  imgShowing = true;
  poseConfirmed = false;
}

function draw() {
  clear();

  if (imgShowing && millis() < showImgUntil) {
    image(currentImg, 0, 0, cam_w, cam_h);
  } else if (imgShowing && millis() >= showImgUntil) {
    imgShowing = false;
  }

  if (pose && !imgShowing && !poseConfirmed) {
    drawSkeleton(pose); // Draw the skeleton
    
    if (checkPose()) {
      poseConfirmed = true;
      sound1.play();
      setTimeout(() => {
        currentImg = (currentImg === img1) ? img2 : img1; // Toggle between images
        showImgUntil = millis() + imgDisplayDuration;
        imgShowing = true;
        poseConfirmed = false;
      }, 1000); // Wait for 1 second before showing the next image
    }
  }
}

function drawSkeleton(pose) {
  stroke(255, 0, 0);
  strokeWeight(2);

  // Draw skeleton
  connect(pose, 5, 7); // Left shoulder to left elbow
  connect(pose, 7, 9); // Left elbow to left wrist
  connect(pose, 6, 8); // Right shoulder to right elbow
  connect(pose, 8, 10); // Right elbow to right wrist
  connect(pose, 5, 6); // Left shoulder to right shoulder
  connect(pose, 11, 12); // Left hip to right hip
  connect(pose, 5, 11); // Left shoulder to left hip
  connect(pose, 6, 12); // Right shoulder to right hip
  connect(pose, 11, 13); // Left hip to left knee
  connect(pose, 13, 15); // Left knee to left ankle
  connect(pose, 12, 14); // Right hip to right knee
  connect(pose, 14, 16); // Right knee to right ankle
}

function connect(pose, a, b) {
  if (pose.keypoints[a].score > 0.1 && pose.keypoints[b].score > 0.1) {
    line(
      pose.keypoints[a].position.x, pose.keypoints[a].position.y,
      pose.keypoints[b].position.x, pose.keypoints[b].position.y
    );
  }
}

function checkPose() {
  // Implement logic to check if the current pose matches the required pose
  // This function should return true if the pose matches
  return false; // Placeholder: should be replaced with actual checking logic
}

async function loop1(timestamp) {
  webcam.update();
  pose = await predict();
  window.requestAnimationFrame(loop1);
}

async function predict() {
  const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
  const prediction = await model.predict(posenetOutput);
  sortedPrediction = prediction.sort((a, b) => -a.probability + b.probability);
  drawVideo();
  return pose;
}

function drawVideo() {
  if (webcam.canvas) {
    ctx.drawImage(webcam.canvas, 0, 0);
  }
}