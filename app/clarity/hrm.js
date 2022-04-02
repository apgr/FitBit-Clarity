/*
  Returns the Heart Rate BPM, with off-wrist detection.
  Callback raised to update your UI.
*/
import { me } from "appbit";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { user } from "user-profile";

let hrm, watchID, hrmCallback;
let lastReading = 0;
let heartRate;
let zone, colour, animate;

export function initialize(callback) {
  if (me.permissions.granted("access_heart_rate") && me.permissions.granted("access_user_profile")) {
    hrmCallback = callback;
    hrm = new HeartRateSensor();
    setupEvents();
    start();
    lastReading = hrm.timestamp;
  } else {
    console.log("Denied Heart Rate or User Profile permissions");
    callback({
      value: "--",
      animate: false,
      baseColour: "fb-magenta",
      colour: "fb-magenta",
      icon: "icons/heart_rate_36px.png"
    });
  }
}

function getReading() {
  zone = user.heartRateZone(hrm.heartRate || 0)  
  if (hrm.timestamp === lastReading) {
    heartRate = "--";
  } else {
    heartRate = hrm.heartRate;
    if (zone === "peak") {colour = "fb-white";} 
    else if (zone === "cardio") {colour = "fb-peach";} 
    else if (zone === "fat-burn") {colour = "fb-orange";} 
    else {colour = "fb-magenta";}
    if (heartRate !== "--" && zone !== "out-of-range") {
        animate = true;
    } else {
        animate = false;
    }  
  } 
  lastReading = hrm.timestamp;
  hrmCallback({
    value: heartRate,
    animate: animate,
    baseColour: "fb-magenta",
    colour: colour,
    icon: "icons/heart_rate_36px.png"
  });
}

function setupEvents() {
  display.addEventListener("change", function() {
    if (display.on) {
      start();
    } else {
      stop();
    }
  });
}

function start() {
  if (!watchID) {
    hrm.start();
    getReading();
    watchID = setInterval(getReading, 1000);
  }
}

function stop() {
  hrm.stop();
  clearInterval(watchID);
  watchID = null;
}
