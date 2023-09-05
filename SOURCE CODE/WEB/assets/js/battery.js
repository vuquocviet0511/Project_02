import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
const firebaseConfig = {
	apiKey: "AIzaSyDqUC9ZcBzbjtDWmwfm7lCIUrJnOGp5FC0",
	authDomain: "doan2-2002.firebaseapp.com",
	databaseURL: "https://doan2-2002-default-rtdb.firebaseio.com",
	projectId: "doan2-2002",
	storageBucket: "doan2-2002.appspot.com",
	messagingSenderId: "677053026374",
	appId: "1:677053026374:web:00d8490561061deb4c7a47"
};
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const database = getDatabase(app);
// pin index
// pin

const chargeLevel = document.getElementById("charge-level");
const charge = document.getElementById("charge");
const chargingTimeRef = document.getElementById("charging-time");

window.onload = () => {
  // For browsers that don't support the battery status API
  if (!navigator.getBattery) {
	alert("Battery Status API Is Not Supported In Your Browser");
	return false;
  }
};

navigator.getBattery().then((battery) => {
  function updateAllBatteryInfo() {
	updateChargingInfo();
	updateLevelInfo();
  }
  updateAllBatteryInfo();

  battery.addEventListener("chargingchange", () => {
	updateAllBatteryInfo();
  });

  battery.addEventListener("levelchange", () => {
	updateAllBatteryInfo();
  });

  function updateChargingInfo() {
	if (battery.charging) {
	  chargingTimeRef.innerText = "";
	} else {
	  if (parseInt(battery.dischargingTime)) {
		let hr = parseInt(battery.dischargingTime / 3600);
		let min = parseInt(battery.dischargingTime / 60 - hr * 60);
		chargingTimeRef.innerText = `${hr}hr ${min}mins remaining`;
	  }
	}
  }

  function updateLevelInfo() {
	let batteryLevel = `${parseInt(battery.level * 100)}%`;
	charge.style.width = batteryLevel;
	chargeLevel.textContent = batteryLevel;
  }

  // Listen for changes in Firebase and update the battery level accordingly
  const batteryRef = ref(database, "Battery/percentage");
  onValue(batteryRef, (snapshot) => {
	const firebaseBatteryLevel = snapshot.val();
	if (firebaseBatteryLevel) {
	  charge.style.width = `${firebaseBatteryLevel}%`;
	  chargeLevel.textContent = `${firebaseBatteryLevel}%`;
	}
  });
});


//battery
const batteryCapacityRef = ref(database, "Battery/percentage");
  onValue(batteryCapacityRef, (snapshot) => {
    // Lấy giá trị pin từ snapshot
    const batteryCapacity = snapshot.val();

    // Sử dụng giá trị pin ở đây (ví dụ: cập nhật giao diện người dùng)
    const batteryLiquid = document.querySelector('.battery__liquid');
    const batteryStatus = document.querySelector('.battery__status');
    const batteryPercentage = document.querySelector('.battery__percentage');

    // Cập nhật số lượng pin và hiển thị phần trăm pin
    batteryPercentage.innerHTML = batteryCapacity + '%';
    batteryLiquid.style.height = `${batteryCapacity}%`;
    const voltageRef = ref(database,"/Battery/voltage");
    onValue(voltageRef, (snapshot) => {
    
        const voltage = snapshot.val();
        batteryStatus.innerHTML = voltage + 'V';
      });
    
    
   
  });
  
window.console = window.console || function(t) {};
if (document.location.search.match(/type=embed/gi)) {
  window.parent.postMessage("resize", "*");
}
console.log('Please activate dark mode, if you want to use it!');
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); //add this
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
	localStorage.setItem('theme', 'light'); //add this
    }    
}
toggleSwitch.addEventListener('change', switchTheme, false);

const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}