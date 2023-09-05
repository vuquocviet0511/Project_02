import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";

import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";
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

const database = getDatabase(app);
const storage = getStorage(app);
//localStorage.removeItem("humidityChart");

// Initialize the Chart.js chart
function initializeHumidityChart() {
    var ctx1 = document.getElementById("HumidityChart").getContext("2d");
    var chart1 = new Chart(ctx1, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Độ ẩm",
            data: [],
            borderColor: "rgba(0, 128, 128, 1)",
            fill: false,
            pointRadius: 0.5,
            borderWidth: 2,
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Biểu đồ đường theo thời gian (Độ ẩm)",
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Thời gian",
              fontSize: 16,
              fontColor: "#000"
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Độ ẩm (%)",
              fontSize: 16,
              fontColor: "#000"
            },
            min: 0.00,
            max: 100.00
          }
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: "xy"
            },
            zoom: {
              enabled: true,
              mode: "xy"
            }
          }
        }
      }
    });
  
    // Retrieve chart data for humidity from Firebase or local storage if available
    var storedData = localStorage.getItem("humidityChart");
    if (storedData) {
      var parsedData = JSON.parse(storedData);
      chart1.data = parsedData;
      chart1.update();
    } else {
      // Replace 'humidityRef' with your actual Firebase reference for humidity data
      var humidityRef = ref(database, '/Sensor/humidity');
      onValue(humidityRef, function (snapshot) {
        var chart1Data = snapshot.val();
        if (chart1Data) {
          chart1.data = chart1Data;
          chart1.update();
        }
      });
    }
  
    return chart1;
  }
  
  // Create and update the humidity chart
  function createHumidityLineChart() {
    var chart1 = initializeHumidityChart();
  
    // Update the chart data for humidity every second
    function updateHumidityChart() {
      var currentTime = new Date();
      var hours = currentTime.getHours();
      var minutes = currentTime.getMinutes();
      var seconds = currentTime.getSeconds();
      var currentTimeLabel = hours + ":" + minutes + ":" + seconds;
  
      // Kiểm tra nếu thời gian là 23:59:59 thì xuất dữ liệu độ ẩm ra CSV
      if (hours === 23 && minutes === 59 && seconds === 59) {
        exportHumidityDataToCSV();
      }
  
      // Kiểm tra nếu thời gian là 00:00:00 thì xóa toàn bộ dữ liệu độ ẩm trong Firebase
      if (hours === 0 && minutes === 0 && seconds === 0) {
        // Xóa toàn bộ dữ liệu độ ẩm trong thư mục "humidityChart" của Firebase
        var databaseRef = ref(database, "humidityChart");
        remove(databaseRef);
      }
  
      // Fetch the humidity value from Firebase (replace 'humidityRef' with the actual reference)
      var humidityRef = ref(database, '/Sensor/humidity');
      onValue(humidityRef, function (snapshot) {
        var humidityValue = snapshot.val();
  
        // Add the new humidity data point to the chart
        chart1.data.labels.push(currentTimeLabel);
        chart1.data.datasets[0].data.push(humidityValue);
  
        // Update the humidity chart
        chart1.update();
  
        // Save humidity chart data to Firebase
        var databaseRef = ref(database, "humidityChart");
        set(databaseRef, chart1.data);
  
        // Save humidity chart data to local storage
        localStorage.setItem("humidityChart", JSON.stringify(chart1.data));
      });
    }
    setInterval(updateHumidityChart, 1000);
  }
  
  createHumidityLineChart();
  
  // Hàm thực hiện tạo file
  function exportHumidityDataToCSV() {
    var databaseRef = firebase.database().ref("humidityChart");
    databaseRef.once("value", function (snapshot) {
      var chart1Data = snapshot.val();
      if (chart1Data) {
        var csvContent = "Time,Humidity\n";
        chart1Data.labels.forEach((time, index) => {
          csvContent += time + "," + chart1Data.datasets[0].data[index] + "\n";
        });
  
        // Lấy ngày tháng năm hiện tại
        var today = new Date();
        var day = today.getDate();
        var month = today.getMonth() + 1; // Lưu ý tháng bắt đầu từ 0, cần cộng thêm 1
        var year = today.getFullYear();
  
        // Đặt tên file CSV với ngày tháng năm hiện tại
        var fileName = "humidityChart_" + day + "-" + month + "-" + year + ".csv";
  
        // Lấy tham chiếu đến Firebase Storage
        var storage = firebase.storage();
  
        // Tạo tham chiếu đến vị trí lưu trữ mong muốn
        var storageRef = storage.ref().child("Data/" + fileName);
  
        // Tải nội dung của file CSV lên Firebase Storage
        storageRef.putString(csvContent).then(function(snapshot) {
          console.log("File CSV đã được tải lên Firebase Storage.");
          // Sau khi tải lên thành công, bạn có thể thực hiện các thao tác khác ở đây.
        }).catch(function(error) {
          console.error("Lỗi khi tải file CSV lên Firebase Storage: ", error);
        });
      }
    });
  }