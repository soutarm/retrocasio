import clock from "clock";
import document from "document";
import * as messaging from "messaging";
import { me as appbit } from "appbit";
import { today } from "user-activity";
import { preferences } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { battery } from "power";
import { vibration } from "haptics";
import { display } from "display";
import * as util from "../common/utils";

const dayNames = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

// Get a handle on the <text> element
const faceImage = document.getElementById("face-image");
const faceToggle = document.getElementById("face-toggle");
const bgImage = document.getElementById("bg-image");
const bgToggle = document.getElementById("bg-toggle");
const hrIcon = document.getElementById("hr-icon");
const hrIconShadow = document.getElementById("hr-icon-shadow");
const hrIndicator = document.getElementById("hr-indicator");
const hrShadow = document.getElementById("hr-shadow");
const dateLabel = document.getElementById("date-label");
const dateShadow = document.getElementById("date-shadow");

const timeH = document.getElementById("time-h");
const timeHShadow = document.getElementById("time-h-shadow");
const timeHH = document.getElementById("time-hh");
const timeHHShadow = document.getElementById("time-hh-shadow");
const timeDot = document.getElementById("time-dot");
const timeDotShadow = document.getElementById("time-dot-shadow");
const timeM = document.getElementById("time-m");
const timeMShadow = document.getElementById("time-m-shadow");
const timeMM = document.getElementById("time-mm");
const timeMMShadow = document.getElementById("time-mm-shadow");
const timeS = document.getElementById("time-s");
const timeSShadow = document.getElementById("time-s-shadow");
const timeSS = document.getElementById("time-ss");
const timeSSShadow = document.getElementById("time-ss-shadow")
const secondsToggle = document.getElementById("seconds-toggle");
const pmIndicator = document.getElementById("pm-indicator");
const pmShadow = document.getElementById("pm-shadow");

const stepCount = document.getElementById("step-count");
const batt25 = document.getElementById("batt-25");
const batt50 = document.getElementById("batt-50");
const batt75 = document.getElementById("batt-75");
const batt100 = document.getElementById("batt-100");
const batteryLevel = document.getElementById("battery-level");
const cals = document.getElementById("cals");
const calsShadow = document.getElementById("cals-shadow");
const stepShadow = document.getElementById("step-shadow");
const batteryShadow = document.getElementById("battery-shadow");
const stepToggle = document.getElementById("step-toggle");
const battToggle = document.getElementById("batt-toggle");

const imageElements = [
  timeH,
  timeHH,
  timeM,
  timeMM,
  timeDot,
  timeS,
  timeSS,
  hrIcon,
];

const shadows = [
  hrIconShadow,
  timeHShadow,
  timeHHShadow,
  timeDotShadow,
  timeMShadow,
  timeMMShadow,
  timeSShadow,
  timeSSShadow,
];

const textElements = [
  hrIndicator,
  dateLabel,
  pmIndicator,
  stepCount,
  batteryLevel,
  cals,
];
const textShadows = [
  hrShadow,
  dateShadow,
  stepShadow,
  batteryShadow,
  pmShadow,
];

const aodOnColor = "#656565";
const aodOffColor = "#000000";

// Toggle defaults
let darkMode;
let lightOn;
let secondsOn;
let showAdjusted;
let showCals;
let touchControls;
const setDefaults = () => {
  darkMode = false;
  lightOn = false;
  secondsOn = true;
  showAdjusted = false;
  showCals = false;
  touchControls = true;
};
setDefaults();

// Message is received
messaging.peerSocket.onmessage = evt => {
  console.log(`App received: ${JSON.stringify(evt)}`);
  const newVal = JSON.parse(evt.data.newValue);
  switch(evt.data.key) {
    case 'toggleTouch':
      touchControls = !newVal;
      break;
    case 'toggleDarkMode':
      darkMode = newVal;
      toggleAod();
      break;
    case 'toggleSeconds':
      secondsOn = !newVal;
      updateSeconds();
      break;
    case 'toggleCalories':
      showCals = newVal;
      updateBatteryCals();
      break;
    case 'toggleAdjusted':
      showAdjusted = newVal;
      updateSteps();
      break;
    default:
      // Reset everything if we get an unknown setting
      setDefaults();
      toggleAod();
  }
};

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("App Socket Closed");
};

// Enable AOD
// if (appbit.permissions.granted("access_aod")) {
//   display.aodAllowed = true;
// }
const toggleAod = () => {
  // const { on, aodAllowed, aodEnabled, aodAvailable, autoOff, aodActive } = display;
  // darkMode = aodActive || fakeAodTimedout;
  if (darkMode) {
    faceImage.style.opacity = 0.5;
  } else {
    faceImage.style.opacity = 1;
  }
  
  updateBg();
  updateBatteryCals();
  updateDateTime();
  updateSeconds();
  updateSteps();
  updateHr();

  imageElements.forEach(i => i.style.opacity = darkMode ? 0.4 : 1);
  textElements.forEach(t => t.style.fill = darkMode ? aodOnColor : aodOffColor);
  
  shadows.forEach(s => s.style.opacity = darkMode ? 0 : 1);
  textShadows.forEach(s => s.style.opacity = darkMode ? 0 : 0.2);
}
// display.addEventListener("change", () => {
//   toggleAod();
// });

// Update the clock every minute
clock.granularity = "seconds";

// Interactive elements
faceToggle.layer = 1;
bgToggle.layer = 2;
secondsToggle.layer = 3;
stepToggle.layer = 3;
battToggle.layer = 3;

// let faceIndex = 0;
// const faceMax = 2;
// faceToggle.onclick = () => {
//   vibration.start("bump");
//   faceIndex += 1;
//   if (faceIndex > faceMax) {
//     faceIndex = 0;
//   }
//   faceImage.image = `faces/${faceIndex}.png`;
// }

// Event handlers
let lightTimer;
const updateBg = () => {
    bgImage.image = darkMode ? 'bg-dark.png' : lightOn ? 'bg-on.png' : 'bg.png';
    if (lightOn) {
      lightTimer = setTimeout(() => {lightOn = false; updateBg()}, 3000);
    }
}
bgToggle.onclick = () => {
  if (touchControls && !darkMode) {
    lightOn = true;
    vibration.start("bump");
    updateBg();
  }
}

faceToggle.onclick = () => {
  if (touchControls) {
    darkMode = !darkMode;
    vibration.start("bump");
    toggleAod();
  }
}

const updateDateTime = (evt) => {
  let todaysDate = evt ? evt.date : new Date();
  
  hrIndicator.text = hrm.heartRate || "";
  
  dateLabel.text = `${dayNames[todaysDate.getDay()]} ${todaysDate.getDate()}`;
  
  let hours = todaysDate.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    if (hours > 11) {
      pmIndicator.text = "PM";
    } else {
      pmIndicator.text = "AM";
    }
    hours = util.zeroPad(hours % 12 || 12);
  } else {
    // 24h format
    pmIndicator.text = "";
    hours = util.zeroPad(hours);
  }
  if (!darkMode) {
    pmShadow.text = pmIndicator.text;
  }
  
  const mins = util.zeroPad(todaysDate.getMinutes());
  const folder = darkMode ? 'a-white/' : 'a/'; 
  timeH.image = `${folder}${hours.charAt(0)}.png`;
  timeHH.image = `${folder}${hours.charAt(1)}.png`;
  timeM.image = `${folder}${mins.charAt(0)}.png`;
  timeMM.image = `${folder}${mins.charAt(1)}.png`;
  timeDot.image = `${folder}on.png`;
}

const updateSteps = () => {
  let todaySteps = 0;
  let adjustedSteps = 0;
  if (appbit.permissions.granted("access_activity")) {
    todaySteps = today.local.steps;
    adjustedSteps = today.adjusted.steps;
  }
  stepCount.text = showAdjusted ? util.numberWithCommas(adjustedSteps) + "*" : util.numberWithCommas(todaySteps);
  stepShadow.text = stepCount.text;
}

const updateSeconds = () => {
  const opac = secondsOn ? darkMode ? 0.4 : 1 : 0;
  timeS.style.opacity = opac;
  timeSS.style.opacity = opac;
  timeSShadow.style.opacity = opac;
  timeSSShadow.style.opacity = opac;
  if (secondsOn) {
    const secs = util.zeroPad(new Date().getSeconds());
    const folder = darkMode ? 'b-white/' : 'b/'; 
    timeS.image = `${folder}${secs.charAt(0)}.png`;
    timeSS.image = `${folder}${secs.charAt(1)}.png`;
    if (!darkMode) {
      timeSShadow.image = timeS.image;
      timeSSShadow.image = timeSS.image;
    }
  }
}
secondsToggle.onclick = () => {
  if (touchControls) {
    secondsOn = !secondsOn;
    vibration.start("bump");
    updateSeconds();
  }
}

const updateBatteryCals = () => {
  cals.style.opacity = showCals ? 1 : 0;
  calsShadow.style.opacity = showCals ? 0.2 : 0;
  const battLevel = parseInt(Math.floor(battery.chargeLevel), 10);
  batteryLevel.text = showCals
    ? util.numberWithCommas(today.adjusted.calories)
    : battLevel + "%";
  batt100.style.opacity = battLevel > 75 ? 1 : 0;
  batt75.style.opacity = battLevel > 50 ? 1 : 0;
  batt50.style.opacity = battLevel > 25 ? 1 : 0;
  batt25.style.opacity = blink || battLevel > 15 ? 1 : 0;
  const battImg = darkMode ? 'battery-dot-white.png' : 'battery-dot.png';
  [batt100, batt75, batt50, batt25].forEach(b => b.image = battImg);
  batteryShadow.text = batteryLevel.text;
}

let blink = true;
const hrm = new HeartRateSensor();
hrm.start();
if (BodyPresenceSensor) {
  const body = new BodyPresenceSensor();
  body.start();
}
const updateHr = () => {
  if (!body.present) {
    hrm.stop();
    blink = false;
  } else {
    blink = !blink;
    hrm.start();
  }
  hrIcon.image = darkMode ? 'heart-white.png' : 'heart.png';
}

stepToggle.onclick = () => {
  if (touchControls) {
    showAdjusted = !showAdjusted;
    vibration.start("bump");
    updateSteps();
  }
}

battToggle.onclick = () => {
  if (touchControls) {
    showCals = !showCals;
    vibration.start("bump");
    updateBatteryCals();
  }
}

// Update the <text> elements every tick with the current time
clock.ontick = (evt) => {
  updateDateTime(evt);
  updateHr();

  if (!darkMode) {
    hrIcon.style.opacity = blink ? 1 : 0;
    hrIconShadow.style.opacity = blink ? 0.2 : 0;
    timeDot.style.opacity = blink ? 1 : 0;
    timeDotShadow.style.opacity = timeDot.style.opacity;
    dateShadow.text = dateLabel.text;
    hrShadow.text = hrIndicator.text;
    timeHShadow.image = timeH.image;
    timeHHShadow.image = timeHH.image;
    timeMShadow.image = timeM.image;
    timeMMShadow.image = timeMM.image;
  }

  updateSeconds();
  updateSteps();
  updateBatteryCals();
}
