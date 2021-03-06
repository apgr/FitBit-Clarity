import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { me } from "appbit";
import * as fs from "fs";
import * as messaging from "messaging";
import { units } from "user-settings";
import * as util from "../common/utils";
import { battery } from "power";
import { goals } from "user-activity";
import { today } from "user-activity";
import { HeartRateSensor } from "heart-rate";

        console.log('Hello world');
        import { memory } from "system";
        console.log("JS memory: " + memory.js.used + "/" + memory.js.total);

let settings = {};

// Setup multiple screens and a click area
var Click = document.getElementById("Click");
let sc1 = document.getElementById("sc1");
var sc2 = document.getElementById("sc2");
var sc3 = document.getElementById("sc3");
var scTZ = document.getElementById("scTZ");
var scTZ2 = document.getElementById("scTZ2");
let setup = document.getElementById("setup");
let setup2 = document.getElementById("setup2");
let setup3 = document.getElementById("setup3");
let setup4 = document.getElementById("setup4");

// Update the clock every second
clock.granularity = "seconds"; // seconds, minutes, hours

//------- Get a handle on the screen elements -------------------------

// screen 1
let sc1Hours = sc1.getElementById("sc1Hours");
let sc1Mins = sc1.getElementById("sc1Mins");
let sc1Secs = sc1.getElementById("sc1Secs");
let sc1Label = sc1.getElementById("sc1Label");
let sc1Date = sc1.getElementById("sc1Date");
let sc1Steps = sc1.getElementById("sc1Steps");
let sc1StepsIcon = sc1.getElementById("sc1StepsIcon");
let TimePrefix = [" ", " ", "PM"];
let shortDayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let MonthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let goalProgressBar = sc1.getElementById("goalProgressBar");
let sc1grad = sc1.getElementById("sc1grad");
let sc1btn = sc1.getElementById("sc1btn");

// screen 2********************************************************************************************
let sc2Batt = sc2.getElementById("sc2Batt");
let sc2Day = sc2.getElementById("sc2Day");
let sc2Date = sc2.getElementById("sc2Date");
let sc2name = sc2.getElementById("sc2name"); 
let sc2Steps = sc2.getElementById("sc2Steps");
let sc2StepsIcon = sc2.getElementById("sc2StepsIcon");
let DayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let shortMonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// screen 3 

let sc3distance = sc3.getElementById("sc3distance");
let sc3distanceIcon = sc3.getElementById("sc3distanceIcon");
let sc3distanceGoalProgressBar = sc3.getElementById("sc3distanceGoalProgressBar");
let sc3flights = sc3.getElementById("sc3flights");
let sc3flightsIcon = sc3.getElementById("sc3flightsIcon");
let sc3flightsGoalProgressBar = sc3.getElementById("sc3flightsGoalProgressBar");
let sc3calories = sc3.getElementById("sc3calories");
let sc3caloriesIcon = sc3.getElementById("sc3caloriesIcon");
let sc3caloriesGoalProgressBar = sc3.getElementById("sc3caloriesGoalProgressBar");
let sc3activeMinutes = sc3.getElementById("sc3activeMinutes");
let sc3actminIcon = sc3.getElementById("sc3actminIcon");
let sc3activeMinutesGoalProgressBar = sc3.getElementById("sc3activeMinutesGoalProgressBar");
let sc3Progress = sc3.getElementById("sc3Progress");
let sc3hr = sc3.getElementById("sc3hr");
sc3hr.text = "--";

// screen TZ
let scTZHours = scTZ.getElementById("scTZHours");
let scTZMins = scTZ.getElementById("scTZMins");
let scTZSecs = scTZ.getElementById("scTZSecs");
let scTZLabel = scTZ.getElementById("scTZLabel");
let scTZSteps = scTZ.getElementById("scTZSteps");
let scTZStepsIcon = scTZ.getElementById("scTZStepsIcon");
let scTZProgressBar = scTZ.getElementById("scTZProgressBar");
let scTZgrad = scTZ.getElementById("scTZgrad");
let scTZbtn = scTZ.getElementById("scTZbtn");
let scTZname = scTZ.getElementById("scTZname");

// scteen TZ2
let scTZ2offset = scTZ2.getElementById("scTZ2offset");
let scTZ2name = scTZ2.getElementById("scTZ2name");
let scTZ2DST = scTZ2.getElementById("scTZ2DST");
let scTZ2Steps = scTZ2.getElementById("scTZ2Steps");
let scTZ2StepsIcon = scTZ2.getElementById("scTZ2StepsIcon");


//------------- Settings -----------------------------------------------------------------------------
let TZoff = setup.getElementById("TZ-off");
let TZon = setup.getElementById("TZ-on");
let Done = setup2.getElementById("Done");
let More = setup2.getElementById("More");
let DSToff = setup2.getElementById("DST-off");
let DSTon = setup2.getElementById("DST-on");
let setTZ = setup2.getElementById("set-TZ");
let list = setup3.getElementById("my-list");
let items = list.getElementsByClassName("tile-list-item");
let TZname = document.getElementById("TZ-name");
let stickyOff = setup4.getElementById("Sticky-off");
let stickyOn = setup4.getElementById("Sticky-on");

// all screens
let batteryLevel = document.getElementById("batteryLevel");
let sc1press = document.getElementById("sc1press");
let scTZpress = document.getElementById("scTZpress");
let scSetpress = document.getElementById("scSetpress");

//---------- Save/load data to/from file -------------------------------

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

settings = loadSettings();
me.onunload = saveSettings; // Register for the unload event


//----------- Set opacities of buttons and progress bars
sc1btn.style.opacity = settings.TZopacity;
scTZbtn.style.opacity = settings.TZopacity; 
sc3caloriesGoalProgressBar.style.opacity = settings.Actopacity;
sc3flightsGoalProgressBar.style.opacity = settings.Actopacity;
sc3activeMinutesGoalProgressBar.style.opacity = settings.Actopacity;
sc3distanceGoalProgressBar.style.opacity = settings.Actopacity;

//----------- Define Colour arrays -------------------------------------

var gradientColor1 = ['gold',
                      '#FC7C51',
                      '#F80070',
                      '#C9FF76',
                      '#71B2AE',
                      '#50DCF5',
                      '#408ADE',
                      '#5388B4',
                      '#5B5B5B',
                      '#ACACAC',
                      '#F1F1F1'];

var gradientColor2 = ['#FFCC33',
                      '#FC6B3A',
                      'deeppink',
                      'greenyellow',
                      'lightseagreen',
                      '#14D3F5',
                      '#3182DE',
                      'steelblue',
                      '#505050',
                      '#A0A0A0',
                      '#FFFFFF'];


//----------- Check to see if second timezone should be displayed at startup ------------------

let currentScreen = 1;
if (settings.homescreen==0 && settings.TZtoggle){
    sc1.style.display = "none";
    scTZ.style.display = "inline";
    currentScreen = 0;
//    console.log("Restoring Second Time Zone screen");
}


//------------ Update the <text> element every tick with the current time ---------------------
clock.ontick = (evt) => {
  
//console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
//console.log('Current Screen: ' + currentScreen);
    
    let todayDate = evt.date;
    //code to deal with the date
    let day = todayDate.getDay();
    let date = todayDate.getDate();
    let month = todayDate.getMonth();
  
    //------- code visible on all screens to deal with the battery level ------
    batteryLevel.width = Math.round(300 * battery.chargeLevel / 100);
    batteryLevel.style.fill = chargeLevelToColor(battery.chargeLevel);
  
    switch(currentScreen){
        case 0:
        case 1://-------------------------------------------------------------------
            //code to deal with the time  

            let TZ2 = newTZ(settings.offset, settings.dstOffset);
            let hours = todayDate.getHours();
            let TZhours = TZ2.getHours();
            let index = 0;
            let TZindex = 0;
            if (preferences.clockDisplay === "12h") {
             // 12h format.
                 index = 1;
                 TZindex = 1;
                 if (hours >= 12) index = 2;
                 if (TZhours >= 12) TZindex = 2;
                 hours = hours % 12 || 12;
                 TZhours = TZhours % 12 || 12;
            }
            hours = util.monoDigits(hours);
            TZhours = util.monoDigits(TZhours);

            //screen 1 text

            sc1Date.text = shortDayName[day] + ', ' + MonthName[month] + ' ' + date;
            sc1Hours.text = `${hours}`;
            sc1Mins.text = util.monoDigits(todayDate.getMinutes());
            sc1Secs.text = util.monoDigits(todayDate.getSeconds());
            sc1Label.text = TimePrefix[index];
            sc1Label.style.fill = settings.hoursColor;
            sc1btn.style.fill = settings.TZhoursColor;
            sc1press.style.fill = settings.TZhoursColor;
            sc1grad.gradient.colors.c1 = settings.hoursColor;
            sc1grad.gradient.colors.c2 = settings.hoursColor2;

            //second Time Zone screen scTZ
            scTZHours.text = `${TZhours}`;
            scTZMins.text = util.monoDigits(TZ2.getMinutes());
            scTZSecs.text = util.monoDigits(TZ2.getSeconds());
            scTZLabel.text = TimePrefix[TZindex];
            scTZLabel.style.fill = settings.TZhoursColor;
            scTZbtn.style.fill = settings.hoursColor;
            scTZpress.style.fill = settings.hoursColor;
            scTZgrad.gradient.colors.c1 = settings.TZhoursColor;
            scTZgrad.gradient.colors.c2 = settings.TZhoursColor2;
            scTZname.text = settings.TimeZone;

        case 2://-------------------------------------------------------------------
            //screen 2 date items
            sc2Day.text = DayName[day];
            sc2Date.text = shortMonthName[month] + ' ' + date;
            sc2Batt.text = 'Battery ' + battery.chargeLevel + '%';
        
        case 3://-------------------------------------------------------------------
            //------- code to deal with the activities ---------
            //steps
            let steps = today.adjusted.steps.toLocaleString();  
            sc1Steps.text = util.monoDigits(steps);
            sc2Steps.text = util.monoDigits(today.adjusted.steps.toLocaleString());
            scTZSteps.text = sc2Steps.text;
            scTZ2Steps.text = sc2Steps.text;
            const stepsGoalPercent = Math.min(100, Math.round(today.adjusted.steps / goals.steps * 100));
            goalProgressBar.width = Math.round(300 * stepsGoalPercent / 100);
            scTZProgressBar.width = Math.round(300 * stepsGoalPercent / 100);
            if (stepsGoalPercent >= 100) {
                sc1StepsIcon.style.fill = 'greenyellow';
                sc2StepsIcon.style.fill = 'greenyellow';
                scTZStepsIcon.style.fill = 'greenyellow';
                scTZ2StepsIcon.style.fill = 'greenyellow';
            } else {
                sc1StepsIcon.style.fill = 'fb-cyan';
                sc2StepsIcon.style.fill = 'fb-cyan';
                scTZStepsIcon.style.fill = 'fb-cyan';
                scTZ2StepsIcon.style.fill = 'fb-cyan';   
            }

            //------ elevation gain, distance, calories, active mins
            let flights = today.adjusted.elevationGain.toLocaleString();
            sc3flights.text = util.monoDigits(flights);
            const flightsGoalPercent = Math.min(100, Math.round(today.adjusted.elevationGain / goals.elevationGain * 100));
            sc3flightsGoalProgressBar.width = Math.round(300 * flightsGoalPercent / 100);
            if (flightsGoalPercent >= 100) {
                sc3flightsIcon.style.fill = 'greenyellow';
                sc3flightsGoalProgressBar.width = 0;
            } else {
                sc3flightsIcon.style.fill = 'steelblue';
            }

            let distance = today.adjusted.distance;
            const distanceGoalPercent = Math.min(100, Math.round(today.adjusted.distance / goals.distance * 100));
            sc3distanceGoalProgressBar.width = Math.round(300 * distanceGoalPercent / 100); 
            if (distanceGoalPercent >= 100) {
                sc3distanceIcon.style.fill = 'greenyellow';
                sc3distanceGoalProgressBar.width = 0;
              } else {
                sc3distanceIcon.style.fill = 'fb-blue';    
              }
            if (units.distance === "us"){    
                distance = distance * 0.00062137;
                sc3distance.text = distance.toFixed(2);
              } else {
                sc3distance.text = distance.toLocaleString();
              }

            let calories = today.adjusted.calories.toLocaleString();
            sc3calories.text = util.monoDigits(calories);
            const caloriesGoalPercent = Math.min(100, Math.round(today.adjusted.calories / goals.calories * 100));
            sc3caloriesGoalProgressBar.width = Math.round(300 * caloriesGoalPercent / 100);
            if (caloriesGoalPercent >= 100) {
                sc3caloriesIcon.style.fill = 'greenyellow';
                sc3caloriesGoalProgressBar.width = 0;
              } else {
                sc3caloriesIcon.style.fill = 'fb-orange';
              }

            let activeMinutes = today.adjusted.activeMinutes.toLocaleString();
            sc3activeMinutes.text = util.monoDigits(activeMinutes);
            const activeMinutesGoalPercent = Math.min(100, Math.round(today.adjusted.activeMinutes / goals.activeMinutes * 100));
            sc3activeMinutesGoalProgressBar.width = Math.round(300 * activeMinutesGoalPercent / 100); 
            if (activeMinutesGoalPercent >= 100) {
                sc3actminIcon.style.fill = 'greenyellow';
                sc3activeMinutesGoalProgressBar.width = 0;
              } else {
                sc3actminIcon.style.fill = 'gold';
              }

        case 4://-------------------------------------------------------------------
          //screen TZ2
            let UTCstring = TZtext(settings.offset, settings.dstOffset);
            scTZ2offset.text = UTCstring;
            switch(UTCstring.length){    
                case 7:
                    scTZ2offset.style.fontSize = 80;
                    break;
                case 9:
                    scTZ2offset.style.fontSize = 60;
                    break;
                case 10:
                    scTZ2offset.style.fontSize = 57;
                    break
                default:
                    scTZ2offset.style.fontSize = 80;
            }

            scTZ2name.text = settings.TimeZone;
            switch(scTZ2name.text.length){    
                case 10:
                    scTZ2name.style.fontSize = 60;
                    break;
                case 11:
                case 12:
                case 13:
                    scTZ2name.style.fontSize = 50;
                    break;
                case 14:
                case 15:
                case 16:        
                    scTZ2name.style.fontSize = 40;
                    break
                case 17:
                case 18:        
                    scTZ2name.style.fontSize = 37;
                    break        
                default:
                    scTZ2name.style.fontSize = 60;
            }

            if(settings.DST){
                scTZ2DST.text = 'Daylight Savings';
            } else {
                scTZ2DST.text = '';
            }
        
      case 5://-------------------------------------------------------------------
        //------------ Settings Screens ------------------------------------------
        TZname.text = settings.TimeZone;
  
    } //-----------------------end switch section---------------------------------
  
} //------------ close clock tick loop --------------------


//-------------- heart rate monitor -----------------------
var hrMon = new HeartRateSensor();
// Declare an event handler that will be called every time a new HR value is received.
hrMon.onreading = function() {
  // Peek the current sensor values
    sc3hr.text = util.monoDigits(hrMon.heartRate);
}
// Begin monitoring the sensor
hrMon.start();


//------- on click make screen 2 visible for 20 seconds, on second click go to screen three, on third click return to screen 1 -----
let screenOnNextClick = 2;
let settingsScreen = false;
let doubleclick = 0;
let timer;
let dbl;

Click.onclick = function(e) {
    if (e.screenY > (300*0.75) && e.screenX < (300*0.25) && settings.secondTimeZone){
        if(currentScreen == 0) {
            screenOnNextClick = 1;
            settings.homescreen = 1;
            scTZpress.style.display="inline";
            setTimeout(function() {
                scTZpress.style.display="none";
            }, 100);

        } else {
            screenOnNextClick = 0;
            settings.homescreen = 0;
            sc1press.style.display = "inline";
            setTimeout(function() {
                sc1press.style.display="none";
            }, 100);
        }
    } else if (e.screenY < (300*0.25) && e.screenX > (300*0.75)){ //-------- Goto settings screen ---------
          dbl = setTimeout(function() {
              doubleclick = 0;
              settingsScreen = false;
          }, 300);
          doubleclick = doubleclick + 1;
          settingsScreen = true;    
          if (doubleclick ==2 ){
              clearTimeout(dbl);
              clearTimeout(timer);
              screenOnNextClick = 5;
              scSetpress.style.display = "inline";
              setTimeout(function() {
                  scSetpress.style.display="none";
              }, 150);          
          }
    }

    switch(screenOnNextClick) {  
        case 0:  
            display(scTZ);
            screenOnNextClick=4;
            currentScreen=0;
            settingsScreen = false;
            clearTimeout(timer);
            break;

        case 1:  
            display(sc1);
            screenOnNextClick=2;
            currentScreen=1;
            settingsScreen = false;
            clearTimeout(timer);
            break;

        case 2:
            display(sc2);
            screenOnNextClick=3;
            currentScreen=2;
            settingsScreen = false;
            clearTimeout(timer);
            break;

        case 3:
            display(sc3);
            if(settings.TZtoggle) {      
                screenOnNextClick=settings.homescreen;
            } else {
                screenOnNextClick=1;
                settings.homescreen=1;
            }
            currentScreen=3; 
            settingsScreen = false;
            clearTimeout(timer);
            break;

        case 4:
            display(scTZ2);
            screenOnNextClick=2;
            currentScreen=4; 
            settingsScreen = false;
            clearTimeout(timer);
            break;

        case 5:
            display(setup);
            if(settings.DST){
                DSTon.value=1;
                DSToff.value=0;
            } else {
                DSTon.value=0;
                DSToff.value=1;
            }      
            if(settings.secondTimeZone){
                TZon.value=0;
                TZoff.value=0;
            } else {
                TZon.value=0;
                TZoff.value=1;  
            }
            if(settings.TZtoggle){
                stickyOn.value=1;
                stickyOff.value=0;
            } else {
                stickyOn.value=0;
                stickyOff.value=1;
            }      
            screenOnNextClick=5;
            currentScreen=5;
            settingsScreen=true;
            clearTimeout(timer);
            break;
    }

    if(!settingsScreen){
        timer = setTimeout(home, 20000); //--- set timeout to return home
    }
}  

var TZnames = ["Samoa", "Hawaii", "Marquesas Islands", "Alaska", "Pacific", "Mountain", "Central", "Eastern", "Santiago", "Newfoundland", "Buenos Aires", "Mid-Atlantic", "Azores", "GMT", "Central European", "Eastern European", "Moscow", "Iran", "Seychelles", "Afghanistan", "Pakistan", "India", "Nepal", "Bangladesh", "Cocos Islands", "Thailand", "China", "Japan", "Australian Central", "Australian Eastern", "Solomon Islands", "New Zealand"];
          
var TZhours = [-11, -10, -9.5, -9, -8, -7, -6, -5,-4, -3.5, -3, -2, -1, 0, 1, 2, 3, 3.5,4, 4.5, 5, 5.5, 5.75, 6, 6.5, 7, 8, 9, 9.5, 10, 11, 12];
          
//---------- responses to settigns screen buttons -------------------

TZoff.onclick = function(evt){
    settings.secondTimeZone = false;
    settings.homescreen = 1;
    sc1btn.style.display="none";
    scTZbtn.style.display="none";
    home();
    saveSettings();
    sendValue("secondTimeZone", settings.secondTimeZone);
}

TZon.onclick = function(evt){
    settings.secondTimeZone = true;
    sc1btn.style.display="inline";
    scTZbtn.style.display="inline";
    display(setup2);
    saveSettings();
    sendValue("secondTimeZone", settings.secondTimeZone);
}

DSToff.onclick = function(evt){
    settings.DST = false;
    settings.dstOffset=0;
    saveSettings();
    sendValue("DST", settings.DST);
}

DSTon.onclick = function(evt){
    settings.DST = true;
    settings.dstOffset=1;
    saveSettings();
    sendValue("DST", settings.DST);
}

setTZ.onclick = function(evt){
    display(setup3);
}

More.onclick = function(evt){ 
    display(setup4);
}

Done.onclick = function(evt){
    home();
}

stickyOff.onclick = function(evt){
    settings.TZtoggle = false;
    saveSettings();
    sendValue("TZtoggle", settings.TZtoggle);
    setTimeout(function() {
        home();
    }, 500);
}

stickyOn.onclick = function(evt){
    settings.TZtoggle = true;
    saveSettings();
    sendValue("TZtoggle", settings.TZtoggle);
    setTimeout(function() {
        home();
    }, 500);
}

//--- get time zone details from setup list

items.forEach((element, index) => {
    let touch = element.getElementById("touch-me");
    touch.onclick = (evt) => {
//        console.log(`touched: ${index}`);
//        console.log(TZhours[index] + " " + TZnames[index]);
        settings.TimeZone = TZnames[index];
        settings.TZindex = index;
        settings.offset = Number(TZhours[index]);//convert string to number or all will go wrong!
        saveSettings();    
        display(setup2);
        sendValue("TimeZone", settings.TZindex);
    }
});


//------------ function to return to homescreen ---------
function home() {
    settingsScreen = false;
    if(settings.TZtoggle){
        if(settings.homescreen == 1){
            display(sc1);
            screenOnNextClick=2;
            currentScreen=1;        
        } else {
            display(scTZ);
            screenOnNextClick=4;
            currentScreen=0;
        }    
    } else {
        display(sc1);
        screenOnNextClick=2;
        currentScreen=1;
        settings.homescreen=1;
    }     
}


//------------- Companion is alive ---------------------------------------------------------
messaging.peerSocket.onopen = () => {
    console.log("Companion is awake.....");
    sendValue("DST", settings.DST);
    sendValue("TZtoggle", settings.TZtoggle);
    sendValue("TimeZone", settings.TZindex);
    sendValue("secondTimeZone", settings.secondTimeZone);
    sendValue("Activity-slider", settings.Actopacity*100);
    sendValue("slider", settings.TZopacity*100);
    sendValue("hoursColorVal", settings.hoursColorVal);
    sendValue("TZhoursColorVal", settings.TZhoursColorVal);
};


//------------- Settings Code: Allows user to setup TimeZone options-----------------------
messaging.peerSocket.onmessage = function(evt) {
//    console.log(`App received: ${JSON.stringify(evt)}`);
    if (evt.data.key === "secondTimeZone"){
        settings.secondTimeZone = evt.data.value;
        if (settings.secondTimeZone){
            sc1btn.style.display="inline";
            scTZbtn.style.display="inline";
        } else {
            sc1btn.style.display="none";
            scTZbtn.style.display="none";
            settings.homescreen=1;
        }
        home();
        saveSettings();
    }
    if (evt.data.key === "DST"){
        settings.DST = evt.data.value;
        if (settings.DST){
            settings.dstOffset=1;
        } else {
            settings.dstOffset=0;
        }
        saveSettings();
    }
    if (evt.data.key === "TimeZone"){
        let TZ = evt.data.value;
        settings.TimeZone = TZ.values[0].name;
        settings.offset = Number(TZ.values[0].value);//convert string to number or all will go wrong!
        saveSettings();
    }
    if (evt.data.key === "TZtoggle"){
        settings.TZtoggle = evt.data.value;
        saveSettings();
    }

    if (evt.data.key === "slider"){
        settings.TZopacity = evt.data.value/100;
        sc1btn.style.opacity = settings.TZopacity;
        scTZbtn.style.opacity = settings.TZopacity;     
        saveSettings();
    }
    if (evt.data.key === "Activity-slider"){
        settings.Actopacity = evt.data.value/100;   
        sc3caloriesGoalProgressBar.style.opacity = settings.Actopacity;
        sc3flightsGoalProgressBar.style.opacity = settings.Actopacity;
        sc3activeMinutesGoalProgressBar.style.opacity = settings.Actopacity;
        sc3distanceGoalProgressBar.style.opacity = settings.Actopacity;     
        saveSettings();
    } 
      if (evt.data.key === "hoursColorVal"){
        settings.hoursColorVal = evt.data.value;
        settings.hoursColor = gradientColor1[settings.hoursColorVal];
        settings.hoursColor2 = gradientColor2[settings.hoursColorVal];
        saveSettings();
    }
      if (evt.data.key === "TZhoursColorVal"){
        settings.TZhoursColorVal = evt.data.value;
        settings.TZhoursColor = gradientColor1[settings.TZhoursColorVal];
        settings.TZhoursColor2 = gradientColor2[settings.TZhoursColorVal];
        saveSettings();
    } 
}


//----------------- Send data ----------------------------------
function sendValue(key, val) {
    sendSettingData({
        key: key,
        value: val
    });
}

function sendSettingData(data) {
  // If we have a MessageSocket, send the data to the device
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send(data);
    } else {
        console.log("No peerSocket connection");
    }
}


//----------- Load settings from filesystem ----------------------------
function loadSettings() {
    try {
        console.log("Loading settings...");
        return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
    } catch (ex) {   
        // Defaults
        console.log("Loading stock settings")
        return {
            DST : false,
            dstOffset : 0,
            secondTimeZone : false,
            TZopacity : 1,
            TimeZone : "Central European",
            TZindex : 14,
            TZtoggle : false,
            offset : 0,
            Actopacity : 0.4,
            homescreen : 1,
            hoursColorVal : 1,
            hoursColor : "#FFCC33",
            hoursColor2 : "#ffdc73",
            TZhoursColorVal : 3,
            TZhoursColor : "deeppink",
            TZhoursColor2 : "#ff4bac"
        }
    }
}


//------------- Save settings to the filesystem ------------------------
function saveSettings() {
//    console.log("Saving settings...");
    fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}


//----------------- time zone calculations --------------------

function newTZ(offset, dstOffset){
    var d = new Date();
    let localTime = d.getTime();
    let localOffset = d.getTimezoneOffset() 
    localOffset = localOffset * 60000;
    // obtain UTC time in msec
    let utc = localTime + localOffset;
    // create new Date object for different city using supplied offset          
    var nd = new Date(utc + (3600000*(offset + dstOffset)));
    // return time as a string
    return nd;
}


//------------ Function to generate UTC offset text ------------

function TZtext(offset, dstOffset){
    var sign = "";
    var string = "";
    let totalOffset = offset + dstOffset;
    if (totalOffset >= 0){
        sign=" +";
    } else {
        sign=" -";
    }
    let hrs = Math.floor(Math.abs(totalOffset));  
    let min = (Math.abs(totalOffset)-hrs)*60;
    if (min !==0){
        string = 'UTC' + sign + hrs + ':' + min;
    } else if (totalOffset==0){
        string = 'UTC';
    } else {  
        string = 'UTC' + sign + hrs;
    }
    return string;
}


//------------ Function that get the color for the battery level label based on the current charge level --------
function chargeLevelToColor(value) {
    const percent = Math.round(value);
    let color = 'white';
    if (percent <= 25) {
        color = 'fb-red';
    } else if (percent <= 50) {
        color = 'fb-orange';
    } else if (percent <= 80) {
        color = 'fb-yellow-press';
    } else {
        color = 'fb-extra-dark-gray';
    }
    return color; 
}

// Funtion to display a screen ----------------------------------------------------------------------
function display(screen) {
    sc1.style.display = "none";
    scTZ.style.display = "none"; 
    sc2.style.display = "none";
    scTZ2.style.display = "none";
    sc3.style.display = "none";
    setup.style.display = "none";
    setup2.style.display = "none";
    setup3.style.display = "none";
    setup4.style.display = "none";
    screen.style.display = "inline";
}