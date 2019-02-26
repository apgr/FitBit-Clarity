import { settingsStorage } from "settings";
import * as messaging from "messaging";
// Import the Companion module
import { me } from "companion"

var TimeZone = [
    {"values":[{"TZ":"-11","name":"Samoa","value":"-11"}],"selected":[0]},
    {"values":[{"TZ":"-10","name":"Hawaii","value":"-10"}],"selected":[1]},
    {"values":[{"TZ":"-9:30","name":"Marquesas Islands","value":"-9.5"}],"selected":[2]},            
    {"values":[{"TZ":"-9","name":"Alaska","value":"-9"}],"selected":[3]},
    {"values":[{"TZ":"-8","name":"Pacific","value":"-8"}],"selected":[4]},
    {"values":[{"TZ":"-7","name":"Mountain","value":"-7"}],"selected":[5]},
    {"values":[{"TZ":"-6","name":"Central","value":"-6"}],"selected":[6]},
    {"values":[{"TZ":"-5","name":"Eastern","value":"-5"}],"selected":[7]},
    {"values":[{"TZ":"-4","name":"Santiago","value":"-4"}],"selected":[8]},
    {"values":[{"TZ":"-3:30","name":"Newfoundland","value":"-3.5"}],"selected":[9]},            
    {"values":[{"TZ":"-3","name":"Buenos Aires","value":"-3"}],"selected":[10]},
    {"values":[{"TZ":"-2","name":"Mid-Atlantic","value":"-2"}],"selected":[11]},
    {"values":[{"TZ":"-1","name":"Azores","value":"-1"}],"selected":[12]},
    {"values":[{"TZ":"0","name":"GMT","value":"0"}],"selected":[13]},
    {"values":[{"TZ":"1","name":"Central European","value":"1"}],"selected":[14]},
    {"values":[{"TZ":"2","name":"Eastern European","value":"2"}],"selected":[15]},
    {"values":[{"TZ":"3","name":"Moscow","value":"3"}],"selected":[16]},
    {"values":[{"TZ":"3:30","name":"Iran","value":"3.5"}],"selected":[17]},
    {"values":[{"TZ":"4","name":"Seychelles","value":"4"}],"selected":[18]},
    {"values":[{"TZ":"4:30","name":"Afghanistan","value":"4.5"}],"selected":[19]},
    {"values":[{"TZ":"5","name":"Pakistan","value":"5"}],"selected":[20]},
    {"values":[{"TZ":"5:30","name":"India","value":"5.5"}],"selected":[21]},
    {"values":[{"TZ":"5:45","name":"Nepal","value":"5.75"}],"selected":[22]},
    {"values":[{"TZ":"6","name":"Bangladesh","value":"6"}],"selected":[23]},
    {"values":[{"TZ":"6:30","name":"Cocos Islands","value":"6.5"}],"selected":[24]},
    {"values":[{"TZ":"7","name":"Thailand","value":"7"}],"selected":[25]},
    {"values":[{"TZ":"8","name":"China","value":"8"}],"selected":[26]},
    {"values":[{"TZ":"9","name":"Japan","value":"9"}],"selected":[27]},
    {"values":[{"TZ":"9:30","name":"Australian Central","value":"9.5"}],"selected":[28]},
    {"values":[{"TZ":"10","name":"Australian Eastern","value":"10"}],"selected":[29]},
    {"values":[{"TZ":"11","name":"Solomon Islands","value":"11"}],"selected":[30]},
    {"values":[{"TZ":"12","name":"New Zealand","value":"12"}],"selected":[31]}
]

if (me.launchReasons.peerAppLaunched) {
    // The Device application caused the Companion to start
    console.log("Device application was launched!")
}

//settingsStorage.clear()
// Message socket opens
messaging.peerSocket.onopen = () => {
    console.log("Companion Socket Open");
//    restoreSettings();
};

// Message socket closes
messaging.peerSocket.close = () => {
    console.log("Companion Socket Closed");
};

// Settings have been changed
settingsStorage.onchange = function(evt) {
    sendValue(evt.key, evt.newValue);
}

//Recieve a message from app-------------------
messaging.peerSocket.onmessage = function(evt) {
//    console.log(`Companion received: ${JSON.stringify(evt)}`);
  
    if (evt.data.key === "secondTimeZone"){
        let secondTimeZone = evt.data.value;
        settingsStorage.setItem("secondTimeZone", secondTimeZone);
    }
    if (evt.data.key === "DST"){
        let DST = evt.data.value;
        settingsStorage.setItem("DST", DST);
    }
    if (evt.data.key === "TimeZone"){
        let index = evt.data.value;
//        console.log("TimeZone " + JSON.stringify(TimeZone[index]));
        settingsStorage.setItem("TimeZone", JSON.stringify(TimeZone[index]));
//        console.log("save TimeZone = " + settingsStorage.getItem("TimeZone"));
    }
    if (evt.data.key === "TZtoggle"){
        let TZtoggle = evt.data.value;
        settingsStorage.setItem("TZtoggle", TZtoggle);
    }
    if (evt.data.key === "slider"){
        let slider = evt.data.value;
        settingsStorage.setItem("slider", slider);
    }
    if (evt.data.key === "Activity-slider"){
        let Actslider = evt.data.value;
        settingsStorage.setItem("Activity-slider", Actslider);
    }
    if (evt.data.key === "hoursColorVal"){
        let hoursColour = evt.data.value;
        settingsStorage.setItem("hoursColorVal", hoursColorVal);
    }
    if (evt.data.key === "TZhoursColorVal"){
        let TZhoursColour = evt.data.value;
        settingsStorage.setItem("TZhoursColorVal", TZhoursColorVal);
    }
}

//-------- Restore previously saved slider settings and send to the device -----------------
//function restoreSettings() {
//    let key = settingsStorage.key(0);
//    if (key) {
//        sendValue(key, settingsStorage.getItem(key));
//    }
//   let key = settingsStorage.key(5);
//    if (key) {
//        sendValue(key, settingsStorage.getItem(key));
//    }
//}

//----------------- Send the data ----------------------------------
function sendValue(key, val) {
    if (val) {
        sendSettingData({
          key: key,
          value: JSON.parse(val)
        });
    }
  }

function sendSettingData(data) {
  // If we have a MessageSocket, send the data to the device
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send(data);
    } else {
        console.log("No peerSocket connection");
    }
}