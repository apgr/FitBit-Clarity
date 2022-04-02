import document from "document";
import clock from "clock";

import * as fs from "fs";
import * as messaging from "messaging";
import * as util from "../common/utils";
import * as clarityHRM from "./clarity/hrm";
import * as clarityActivity from "./clarity/activity";

import { me } from "appbit";
import { battery } from "power";
import { preferences } from "user-settings";
import { units } from "user-settings";
import { primaryGoal } from "user-activity";
import { goals } from "user-activity";
import { today } from "user-activity";

console.log('Hello world');
import { memory } from "system";
console.log("JS memory: " + memory.js.used + "/" + memory.js.total);

let settings = {};
let activityItems = document.getElementById(activityItems);

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
let sc1act = sc1.getElementById("sc1act");
let sc1actIcon = sc1.getElementById("sc1actIcon");
let sc1HRIcon = sc1.getElementById("sc1HRIcon");
let TimePrefix = [" ", " ", "PM"];
let shortDayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let MonthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let sc1grad = sc1.getElementById("sc1grad");
let sc1btn = sc1.getElementById("sc1btn");

// screen 2********************************************************************************************
let sc2Batt = sc2.getElementById("sc2Batt");
let sc2Day = sc2.getElementById("sc2Day");
let sc2Date = sc2.getElementById("sc2Date");
let sc2name = sc2.getElementById("sc2name"); 
let sc2act = sc2.getElementById("sc2act");
let sc2actIcon = sc2.getElementById("sc2actIcon");
let sc2progressBar = sc2.getElementById("sc2progressBar");
let DayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let shortMonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// screen 3---------------------------------------------------------------------------------------------
let sc3act1 = sc3.getElementById("sc3act1");
let sc3act1Icon = sc3.getElementById("sc3act1Icon");
let sc3act1ProgressBar = sc3.getElementById("sc3act1ProgressBar");
let sc3act2 = sc3.getElementById("sc3act2");
let sc3act2Icon = sc3.getElementById("sc3act2Icon");
let sc3act2ProgressBar = sc3.getElementById("sc3act2ProgressBar");
let sc3act3 = sc3.getElementById("sc3act3");
let sc3act3Icon = sc3.getElementById("sc3act3Icon");
let sc3act3ProgressBar = sc3.getElementById("sc3act3ProgressBar");
let sc3act4 = sc3.getElementById("sc3act4");
let sc3act4Icon = sc3.getElementById("sc3act4Icon");
let sc3act4ProgressBar = sc3.getElementById("sc3act4ProgressBar");
let sc3act5 = sc3.getElementById("sc3act5");
let sc3act5Icon = sc3.getElementById("sc3act5Icon");
let sc3HRIcon = sc3.getElementById("sc3HRIcon");
let sc3act5ProgressBar = sc3.getElementById("sc3act5ProgressBar");

// screen TZ---------------------------------------------------------------------------------------------
let scTZHours = scTZ.getElementById("scTZHours");
let scTZMins = scTZ.getElementById("scTZMins");
let scTZSecs = scTZ.getElementById("scTZSecs");
let scTZLabel = scTZ.getElementById("scTZLabel");
let scTZact = scTZ.getElementById("scTZact");
let scTZactIcon = scTZ.getElementById("scTZactIcon");
let scTZHRIcon = scTZ.getElementById("scTZHRIcon");
let scTZgrad = scTZ.getElementById("scTZgrad");
let scTZbtn = scTZ.getElementById("scTZbtn");
let scTZname = scTZ.getElementById("scTZname");

// scteen TZ2---------------------------------------------------------------------------------------------
let scTZ2offset = scTZ2.getElementById("scTZ2offset");
let scTZ2name = scTZ2.getElementById("scTZ2name");
let scTZ2DST = scTZ2.getElementById("scTZ2DST");
let scTZ2act = scTZ2.getElementById("scTZ2act");
let scTZ2actIcon = scTZ2.getElementById("scTZ2actIcon");
let scTZ2progressBar = scTZ2.getElementById("scTZ2progressBar");

//------------- Settings -----------------------------------------------------------------------------
let TZoff = setup.getElementById("TZ-off");
let TZon = setup.getElementById("TZ-on");
let HRHon = setup.getElementById("HRH-on");
let HRHoff = setup.getElementById("HRH-off");
let Done = setup2.getElementById("Done");
let More = setup2.getElementById("More");
let DSToff = setup2.getElementById("DST-off");
let DSTon = setup2.getElementById("DST-on");
let scS2offset = setup2.getElementById("scS2offset");
let list = setup3.getElementById("mylist");
let items = list.getElementsByClassName("list-item");
let TZname = document.getElementById("TZ-name");
let setTZ = setup4.getElementById("set-TZ");
let stickyOff = setup4.getElementById("Sticky-off");
let stickyOn = setup4.getElementById("Sticky-on");
let scS4TZname = setup4.getElementById("scS4TZ-name");

// all screens
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
sc2progressBar.style.opacity = settings.Actopacity;
scTZ2progressBar.style.opacity = settings.Actopacity;
sc3act1ProgressBar.style.opacity = settings.Actopacity;
sc3act2ProgressBar.style.opacity = settings.Actopacity;
sc3act3ProgressBar.style.opacity = settings.Actopacity;
sc3act4ProgressBar.style.opacity = settings.Actopacity;
sc3act5ProgressBar.style.opacity = settings.Actopacity;

//----------- Get the HR icon right ------------------------------
if (settings.homeScreenHR) {
   sc1HRIcon.style.display="inline";
   sc1actIcon.style.display="none";  
   scTZHRIcon.style.display="inline";
   scTZactIcon.style.display="none"; 
   sc3HRIcon.style.display="none";
   sc3act5Icon.style.display="inline";
   sc3act5ProgressBar.style.display="inline";
} else {
   sc1HRIcon.style.display="none";
   sc1actIcon.style.display="inline"; 
   scTZHRIcon.style.display="none";
   scTZactIcon.style.display="inline";  
   sc3HRIcon.style.display="inline";
   sc3act5Icon.style.display="none"; 
   sc3act5ProgressBar.style.display="none";
} 

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
  
    let todayDate = evt.date;
    //code to deal with the date -------------------------------
    let day = todayDate.getDay();
    let date = todayDate.getDate();
    let month = todayDate.getMonth();

  
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
            //screen 3
        
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
        scS4TZname.text = settings.TimeZone;
        scS2offset.text=TZtext(settings.offset, settings.dstOffset);
  
    } //-----------------------end switch section---------------------------------
  
} //------------ close clock tick loop --------------------

/* ------- ACTIVITY --------- */

function activityCallback(data) {

  var x;
  var i=0;
  let sc3val = [sc3act1, sc3act2, sc3act3, sc3act4, sc3act5];
  let sc3icon = [sc3act1Icon, sc3act2Icon, sc3act3Icon, sc3act4Icon, sc3act5Icon];
  let sc3prog = [sc3act1ProgressBar, sc3act2ProgressBar, sc3act3ProgressBar, sc3act4ProgressBar, sc3act5ProgressBar];
  
//  var objname = {};

  for (x in data) {
  //  console.log(i);

    i=i+1;
    let act = data[x];

 //   for (b in act) {

    
      if (x == primaryGoal) {
        i=i-1
        if (!settings.homeScreenHR) {         
          sc1act.text = act.value; // screen 1
          sc1act.style.fill = act.baseColour; 
          sc1actIcon.href = act.icon;
          sc1actIcon.style.fill = act.colour;        
          scTZact.text = act.value; // screen TZ
          scTZact.style.fill = act.baseColour;        
          scTZactIcon.href = act.icon;
          scTZactIcon.style.fill = act.colour;        
        } else {
          sc3act5.text = act.value;
          sc3act5.style.fill = act.baseColour;
          sc3act5Icon.href = act.icon;
          sc3act5Icon.style.fill = act.colour;
          sc3act5ProgressBar.width = act.progress;
          sc3act5ProgressBar.style.fill = act.baseColour;     
        }
        
        sc2act.text = act.value; // screen 2
        sc2act.style.fill = act.baseColour; 
        sc2actIcon.href = act.icon;       
        sc2actIcon.style.fill = act.colour; 
        sc2progressBar.width = act.progress; 
        sc2progressBar.style.fill = act.baseColour;           
        scTZ2act.text = act.value; // screen TZ2       
        scTZ2act.style.fill = act.baseColour;        
        scTZ2actIcon.href = act.icon;   
        scTZ2actIcon.style.fill = act.colour; 
        scTZ2progressBar.width = act.progress;        
        scTZ2progressBar.style.fill = act.baseColour;      
      } else {
  //        eval("sc3act"+i).text = act.value;
          sc3val[i-1].text = act.value;
          sc3val[i-1].style.fill = act.baseColour;
          sc3icon[i-1].href = act.icon;
          sc3icon[i-1].style.fill = act.colour;
          sc3prog[i-1].width = act.progress;
          sc3prog[i-1].style.fill = act.baseColour;         
      }
  }
//  console.log(`App received: ${JSON.stringify(data)}`);
}
clarityActivity.initialize("seconds", activityCallback);


//-------------- heart rate monitor -----------------------

function hrmCallback(data) {
  
  if (!settings.homeScreenHR){
     sc3act5.text = `${data.value}`;
     sc3act5.style.fill = data.colour; 
     sc3HRIcon.style.fill = data.baseColour; 
  } else {
     sc1act.text = data.value; // screen 1
     sc1act.style.fill = data.colour; 
     sc1HRIcon.href = data.icon;
     sc1HRIcon.style.fill = data.baseColour;        
     scTZact.text = data.value; // screen TZ
     scTZact.style.fill = data.colour;        
     scTZHRIcon.href = data.icon;
     scTZHRIcon.style.fill = data.baseColour; 
  }
  if (data.animate) {
     sc1HRIcon.animate("highlight");
     scTZHRIcon.animate("highlight");
     sc3HRIcon.animate("highlight");
  } else {
     sc1HRIcon.animate("unhighlight");
     scTZHRIcon.animate("unhighlight");
     sc3HRIcon.animate("unhighlight");    
  }
}
clarityHRM.initialize(hrmCallback);


//------- on click make screen 2 visible for 20 seconds, on second click go to screen three, on third click return to screen 1 -----
let screenOnNextClick = 2;
let settingsScreen = false;
let doubleclick = 0;
let timer;
let dbl;

Click.onclick = function(e) {
    if (e.screenY > (336*0.7) && e.screenX < (336*0.4) && settings.secondTimeZone){
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
    } else if (e.screenY < (336*0.4) && e.screenX > (336*0.6)){ //-------- Goto settings screen ---------
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
                DSTon.class = "text-button top right DSTprimary";             
                DSToff.class = "text-button top left DSTsecondary";
            } else {
                DSTon.value=0;
                DSToff.value=1;
                DSTon.class = "text-button top right DSTsecondary";
                DSToff.class = "text-button top left DSTprimary";
            }      
            if(settings.secondTimeZone){
                TZon.value=1;
                TZoff.value=0;
            } else {
                TZon.value=0;
                TZoff.value=1;  
            }
            if(settings.homeScreenHR){
                HRHon.value=1;
                HRHoff.value=0;
                HRHon.class = "text-button top right HRHprimary";
                HRHoff.class = "text-button top left HRHsecondary";              
            } else {
                HRHon.value=0;
                HRHoff.value=1;
                HRHon.class = "text-button top right HRHsecondary";
                HRHoff.class = "text-button top left HRHprimary";    
            }
             if(settings.TZtoggle){           
                stickyOn.value=1;
                stickyOff.value=0;
                stickyOn.class = "text-button bottom right stickyPrimary";
                stickyOff.class = "text-button bottom left stickySecondary";                              
            } else {
                stickyOn.value=0;
                stickyOff.value=1;
                stickyOn.class = "text-button bottom right stickySecondary";
                stickyOff.class = "text-button bottom left stickyPrimary";                
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
    DSTon.class = "text-button top right DSTsecondary";
    DSToff.class = "text-button top left DSTprimary";
    scS2offset.text=TZtext(settings.offset, settings.dstOffset);
    display(setup2);
}

DSTon.onclick = function(evt){
    settings.DST = true;
    settings.dstOffset=1;
    saveSettings();
    sendValue("DST", settings.DST);
    DSTon.class = "text-button top right DSTprimary";             
    DSToff.class = "text-button top left DSTsecondary"; 
    scS2offset.text=TZtext(settings.offset, settings.dstOffset);
    display(setup2);
}

HRHoff.onclick = function(evt){
    settings.homeScreenHR = false;
    saveSettings();
    sendValue("homeScreenHR", settings.homeScreenHR);
    HRHon.class = "text-button top right HRHsecondary";
    HRHoff.class = "text-button top left HRHprimary";
    sc1HRIcon.style.display="none";
    sc1actIcon.style.display="inline";         
    scTZHRIcon.style.display="none";
    scTZactIcon.style.display="inline"; 
    sc3HRIcon.style.display="inline";
    sc3act5Icon.style.display="none"; 
    sc3act5ProgressBar.style.display="none";
    home();
}

HRHon.onclick = function(evt){
    settings.homeScreenHR = true;
    saveSettings();
    sendValue("homeScreenHR", settings.homeScreenHR);
    HRHon.class = "text-button top right HRHprimary";
    HRHoff.class = "text-button top left HRHsecondary"; 
    sc1HRIcon.style.display="inline";
    sc1actIcon.style.display="none";         
    scTZHRIcon.style.display="inline";
    scTZactIcon.style.display="none";        
    sc3HRIcon.style.display="none";
    sc3act5Icon.style.display="inline"; 
    sc3act5ProgressBar.style.display="inline";  
    home();
}
  
setTZ.onclick = function(evt){
    list.value=31;
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
    stickyOn.class = "text-button bottom right stickySecondary";
    stickyOff.class = "text-button bottom left stickyPrimary";  
    setTimeout(function() {
    display(setup2);
    }, 500);
}

stickyOn.onclick = function(evt){
    settings.TZtoggle = true;
    saveSettings();
    sendValue("TZtoggle", settings.TZtoggle);
    stickyOn.class = "text-button bottom right stickyPrimary";
    stickyOff.class = "text-button bottom left stickySecondary";  
    setTimeout(function() {
    display(setup2);
    }, 500);
}

//--- get time zone details from setup list

items.forEach((element, index) => {
    let touch = element.getElementById("touch");
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


//------------- Companion is alive ---------------------------------------------------------
messaging.peerSocket.onopen = () => {
    console.log("Companion is awake.....");
    sendValue("DST", settings.DST);
    sendValue("TZtoggle", settings.TZtoggle);
    sendValue("TimeZone", settings.TZindex);
    sendValue("secondTimeZone", settings.secondTimeZone);
    sendValue("homeScreenHR", settings.homeScreenHR);
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

      if (evt.data.key === "homeScreenHR"){
        settings.homeScreenHR = evt.data.value;
        if (settings.homeScreenHR) {
            sc1HRIcon.style.display="inline";
            sc1actIcon.style.display="none";         
            scTZHRIcon.style.display="inline";
            scTZactIcon.style.display="none";        
            sc3HRIcon.style.display="none";
            sc3act5Icon.style.display="inline"; 
            sc3act5ProgressBar.style.display="inline";
        } else {
            sc1HRIcon.style.display="none";
            sc1actIcon.style.display="inline";         
            scTZHRIcon.style.display="none";
            scTZactIcon.style.display="inline"; 
            sc3HRIcon.style.display="inline";
            sc3act5Icon.style.display="none"; 
            sc3act5ProgressBar.style.display="none";
        } 
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
        sc3act1ProgressBar.style.opacity = settings.Actopacity;
        sc3act2ProgressBar.style.opacity = settings.Actopacity;
        sc3act3ProgressBar.style.opacity = settings.Actopacity;
        sc3act4ProgressBar.style.opacity = settings.Actopacity;
        sc3act5ProgressBar.style.opacity = settings.Actopacity;
        sc2progressBar.style.opacity = settings.Actopacity;
        scTZ2progressBar.style.opacity = settings.Actopacity;
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
      console.log(settings.homeScreenHR);
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
            homeScreenHR : 0,
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