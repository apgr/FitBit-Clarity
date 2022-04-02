/*
  A simple way of returning activity data in the correct format based on user preferences.
  Callback should be used to update your UI.
*/
import { me } from "appbit";
import clock from "clock";
import { today } from "user-activity";
import { goals } from "user-activity";
import { units } from "user-settings";

let activityCallback;

export function initialize(granularity, callback) {
  if (me.permissions.granted("access_activity")) {
    clock.granularity = granularity;
    clock.addEventListener("tick", tickHandler);
    activityCallback = callback;
  } else {
    console.log("Denied User Activity permission");
    callback({
      calories: getDeniedStats(),
      elevationGain: getDeniedStats(),
      activeZoneMinutes: getDeniedStats(),
      distance: getDeniedStats(),
      steps: getDeniedStats()
    });
  }
}

let activityData = () => {
  return {
    calories: getCalories(),
    elevationGain: getElevationGain(),
    activeZoneMinutes: getActiveZoneMinutes(),
    distance: getDistance(),
    steps: getSteps()
  };  
}

//console.log('Cal ' + goals.calories);
//console.log('El '+ goals.elevationGain);
//console.log('AZM ' + goals.activeZoneMinutes.total);
//console.log('Dist ' + goals.distance/1000);
//console.log('Steps ' + goals.steps);

function tickHandler(evt) {
  activityCallback(activityData());
}

function getCalories() {
  let val = (today.adjusted.calories || 0);
  let goalPercent = Math.min(100, Math.round(val / goals.calories * 100));
  let width = Math.round(336 * goalPercent / 100);
  var baseColour = 'fb-orange';
  var colour = ""; 
  var icon = 'icons/calories_36px.png';
  if (goalPercent >= 100) {
     colour = 'greenyellow';
     width = 0;
  } else {
     colour = 'fb-orange';
  }
  return {
    value: val > 999 ? Math.floor(val/1000) + "," + ("00"+(val%1000)).slice(-3) : val,
    progress: width,
    baseColour: baseColour,
    colour: colour,
    icon: icon
  }
}

function getElevationGain() {
  let val = today.adjusted.elevationGain || 0;
  let goalPercent = Math.min(100, Math.round(val / goals.elevationGain * 100));
  let width = Math.round(336 * goalPercent / 100);
  var baseColour = 'steelblue';
  var colour = "";
  var icon = 'icons/floors_36px.png';
  if (goalPercent >= 100) {
     colour = 'greenyellow';
     width = 0;
  } else {
     colour = 'steelblue';
  }
  return {
     value: `${val}`,
     progress: width,
     baseColour: baseColour,
     colour: colour,
     icon: icon
  }
}

function getDistance() {
  let val = (today.adjusted.distance || 0) / 1000;
  let goalPercent = Math.min(100, Math.round(val / (goals.distance/1000) * 100));
  let width = Math.round(336 * goalPercent / 100);
  var baseColour = 'fb-blue';
  var colour = "";  
  var icon = 'icons/distance_36px.png';
  if(units.distance === "us") {
     val *= 0.621371;
  }
  if (goalPercent >= 100) {
     colour = 'greenyellow';
     width = 0;
  } else {
     colour = 'fb-blue';    
  }
  return {
     value: `${val.toFixed(2)}`,
     progress: width,
     baseColour: baseColour,
     colour: colour,
     icon: icon
  }
}

function getActiveZoneMinutes() {
  let val = (today.adjusted.activeZoneMinutes.total || 0);
  let goalPercent = Math.min(100, Math.round(val / goals.activeZoneMinutes.total * 100));
  let width = Math.round(336 * goalPercent / 100);
  var baseColour = 'gold';
  var colour = "";
  var icon = 'icons/azm_36px.png';
  if (goalPercent >= 100) {
     colour = 'greenyellow';
     width = 0;
  } else {
     colour = 'gold';
  }
  return {
     value: `${val}`,
     progress: width,
     baseColour: baseColour,    
     colour: colour,
     icon: icon
  }
}

function getSteps() {
  let val = (today.adjusted.steps || 0);
  let goalPercent = Math.min(100, Math.round(val / goals.steps * 100));
  let width = Math.round(336 * goalPercent / 100);
  var baseColour = 'fb-cyan';
  var colour = "";
  var icon = 'icons/steps_36px.png';
  if (goalPercent >= 100) {
     colour = 'greenyellow';
     width = 0;
  } else {
     colour = 'fb-cyan';
  } 
  return {
     value: val > 999 ? Math.floor(val/1000) + "," + ("00"+(val%1000)).slice(-3) : val,
     progress: width,
     baseColour: baseColour,
     colour: colour,
     icon: icon
  }
}

function getDeniedStats() {
  return "Denied";
}