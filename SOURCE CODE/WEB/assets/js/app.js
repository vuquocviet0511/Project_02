import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


	const firebaseConfig = {
		apiKey: "AIzaSyDqUC9ZcBzbjtDWmwfm7lCIUrJnOGp5FC0",
		authDomain: "doan2-2002.firebaseapp.com",
		databaseURL: "https://doan2-2002-default-rtdb.firebaseio.com",
		projectId: "doan2-2002",
		storageBucket: "doan2-2002.appspot.com",
		messagingSenderId: "677053026374",
		appId: "1:677053026374:web:00d8490561061deb4c7a47"
	};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth(app);


var username = document.getElementById("username")
var email = document.getElementById("email")
var password = document.getElementById("password")
var copassword = document.getElementById("copassword")


// signup
window.signup = function(e){
    if(password)

    if(username.value == "" || email.value =="" || password.value ==""){
        alert("All Field Are Required")
    }
    if(password.value == copassword.value){
     
    }
    else{
        alert("Password Confirmation is Wrong")
        return false
    }

    e.preventDefault();
    var obj = {
      username: username.value,
      email: email.value,
      password: password.value,
    };
    createUserWithEmailAndPassword(auth, obj.email, obj.password)
    .then(function(userCredential) {
      const user = userCredential.user;
      const userData = {
        username: obj.username,
        email: obj.email
      };
      
      return set(ref(database, 'users/' + user.uid), userData);
    })
    .then(function() {
      window.location.replace('./signin.html');
      alert("Signup successful");
    })
    .catch(function(err){
      alert("Error in " + err)
    });
   
    console.log(obj);
  };


//signin
// Sau khi người dùng đăng nhập thành công
// Set isLoggedIn thành true


window.signin= function(e) {
  e.preventDefault();
  var obj = {
    email: email.value,
    password: password.value,
  };

  signInWithEmailAndPassword(auth, obj.email, obj.password)
  .then(function(userCredential) {
    var aaaa = userCredential.user.uid;
    localStorage.setItem("uid", aaaa);
    console.log(aaaa);

    const user = userCredential.user;
    const dt = moment().utcOffset(7).format();
    
    // Kiểm tra nếu người dùng đã từng đăng nhập trước đó
    if (user.last_logout) {
      console.log("Last logout:", user.last_logout);
    }
    
    return update(ref(database, 'users/' + user.uid), {
      last_login: dt,
    });
  })
  .then(function() {
    localStorage.setItem('isLoggedIn', true);
    window.location.replace('index.html');
  })
  .catch(function(err) {
    alert("Login error: " + err);
  });

console.log(obj);
}


window.signout = function() {
  const user = auth.currentUser;
  const dt = moment().utcOffset(7).format();

  update(ref(database, 'users/' + user.uid), {
    last_logout: dt,
  })
    .then(function() {
      return signOut(auth);
    })
    .then(function() {
      localStorage.setItem('isLoggedIn', false);
      localStorage.removeItem("uid");
      console.log("User signed out successfully");
      window.location.replace('signin.html');
    })
    .catch(function(error) {
      alert("Sign out error: " + error);
    });
};
//forgot
window.forgot = function(e) {
  e.preventDefault();
  var obj = {
    email: email.value,
  };

  sendPasswordResetEmail(auth, obj.email)
    .then(function() {
      alert("Password reset email sent!");
      // Password reset email sent!
      // ..
      window.location.replace('./signin.html')
    })
    .catch(function(error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // Handle error or show an error message to the user
      alert("Error sending password reset email: " + errorMessage);
    });

  console.log(obj);
};
