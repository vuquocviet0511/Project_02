import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, doc, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
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


async function updateTemperatureOnHTML() {
	const temperatureRef = ref(database, '/Sensor/temperature');
	onValue(temperatureRef, async (snapshot) => {
	  const temperature = snapshot.val();
	
	  const temperatureElement = document.getElementById("moudule1");
	  temperatureElement.innerHTML = temperature + '°C';

	  const temperatureCard = document.getElementById("temperatureCard");
		temperatureCard.classList.remove("green", "yellow", "red");

		if (temperature < 25) {
		temperatureCard.classList.add("green");
		} else if (temperature >= 25 && temperature <= 30) {
		temperatureCard.classList.add("yellow");
		} else {
		temperatureCard.classList.add("red");
		}
		
	});
  }
  updateTemperatureOnHTML();
  
  
  function updateHumidityOnHTML() {
	const HumidityRef = ref(database, '/Sensor/humidity');
	onValue(HumidityRef, (snapshot) => {
	  const Humidity = snapshot.val();
	
	  const HumidityElement = document.getElementById("moudule2");
	  HumidityElement.innerHTML = Humidity + '%';

	  const HumidityCard = document.getElementById("HumidityCard");
		HumidityCard.classList.remove("green", "yellow", "red");

		if (Humidity > 90) {
		HumidityCard.classList.add("green");
		} else if (Humidity >= 40 && Humidity <= 90) {
		HumidityCard.classList.add("yellow");
		} else {
		HumidityCard.classList.add("red");
		}
		
	});
  }
  updateHumidityOnHTML();

  function updateSoilMoistureOnHTML() {
	const SoilMoistureRef = ref(database, '/Sensor/soil_moisture_percent');
	onValue(SoilMoistureRef, (snapshot) => {
	  const SoilMoisture = snapshot.val();
	
	  const SoilMoistureElement = document.getElementById("moudule3");
	  SoilMoistureElement.innerHTML = SoilMoisture + '%';

	  const SoilMoistureCard = document.getElementById("SoilMoistureCard");
		SoilMoistureCard.classList.remove("green", "yellow", "red");

		if (SoilMoisture > 90) {
		SoilMoistureCard.classList.add("green");
		} else if (SoilMoisture >= 40 && SoilMoisture <= 90) {
		SoilMoistureCard.classList.add("yellow");
		} else {
		SoilMoistureCard.classList.add("red");
		}
	});
  }
  updateSoilMoistureOnHTML();
  function updateLightIntensityOnHTML() {
	const LightIntensityRef = ref(database, '/Sensor/lux');
	onValue(LightIntensityRef, (snapshot) => {
	  const LightIntensity = snapshot.val();
	
	  const LightIntensityElement = document.getElementById("moudule4");
	  LightIntensityElement.innerHTML = LightIntensity + ' LUX';

	  const LightIntensityCard = document.getElementById("LightIntensityCard");
		LightIntensityCard.classList.remove("green", "yellow", "red");

		if (LightIntensity > 90) {
		LightIntensityCard.classList.add("green");
		} else if (LightIntensity >= 40 && LightIntensity <= 90) {
		LightIntensityCard.classList.add("yellow");
		} else {
		LightIntensityCard.classList.add("red");
		}
	});
  }
  
  updateLightIntensityOnHTML();



$(document).ready(function () {
	setInterval(function () {
		$(".loader").hide();
		$(".loader-overlay").hide();
	}, 1000);

	$("#sidebar-toggle, .sidebar-overlay").click(function () {
		$(".sidebar").toggleClass("sidebar-show");
		$(".sidebar-overlay").toggleClass("d-block");
	});

	$(".sidebar-items .submenu-items").click(function () {
		$(".sidebar-items .submenu-items").removeClass("active");
		$(this).toggleClass("active");
	});

	function clickMenu(goId, title) {
		$(goId).click(function (e) {
			e.preventDefault();

			$(".sidebar-items .items").removeClass("active");
			$(".sidebar-items .submenu a").removeClass("active");
			$(this).addClass("active");

		});
	}

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

// Reference to the "Device/motor_status" field in Firebase Realtime Database
const motorRef = ref(database, "Device/motor_status");

// Listen for changes in the "Device/motor_status" field
onValue(motorRef, (snapshot) => {
    const motorStatus = snapshot.val();
    
    // Update the status based on the value from Firebase
    const cardImage = document.getElementById('card-image');
    const statusBox = document.getElementById('status');
    
    if (motorStatus === "ON") {
        cardImage.src = 'assets/images/motoron.gif';
        statusBox.textContent = 'ON';
		statusBox.style.color = "green";
    } else {
        cardImage.src = 'assets/images/motoroff.jpg';
        statusBox.textContent = 'OFF';
		statusBox.style.color= "red";
    }
});
// Reference to the "Device/motor_status" field in Firebase Realtime Database
const lampRef = ref(database, "Device/lamps_status");

// Listen for changes in the "Device/motor_status" field
onValue(lampRef, (snapshot) => {
    const lampStatus = snapshot.val();
    
    // Update the status based on the value from Firebase
    const cardImage1 = document.getElementById('card-image1');
    const statusBox1 = document.getElementById('status1');
    
    if (lampStatus === "ON") {
        cardImage1.src = 'assets/images/lampon.gif';
        statusBox1.textContent = 'ON';
		statusBox1.style.color = "green";
    } else {
        cardImage1.src = 'assets/images/lampoff.png';
        statusBox1.textContent = 'OFF';
		statusBox1.style.color= "red";
    }
});

   

