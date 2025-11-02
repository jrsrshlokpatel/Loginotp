<!DOCTYPE html>
<html>
<head>
  <title>Phone Login</title>
  <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-auth-compat.js"></script>
</head>
<body>
  <h3>Phone Login</h3>
  <input id="phone" placeholder="+911234567890"><br>
  <div id="recaptcha-container"></div>
  <button onclick="sendOTP()">Send OTP</button>
  <br><input id="otp" placeholder="Enter OTP">
  <button onclick="verifyOTP()">Verify</button>
  <p id="status"></p>

  <script>
    const firebaseConfig = {
      apiKey: "AIzaSyDFzCatKhjhh-c-QvkQI3x9bzISVncrq3I",
      authDomain: "studio-uhq4l.firebaseapp.com",
      projectId: "studio-uhq4l",
      appId: "1:989256426031:web:f5dad5ddc4625baa549cda"
    };
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

    let verificationId;

    function sendOTP() {
      const phone = document.getElementById("phone").value;
      auth.signInWithPhoneNumber(phone, window.recaptchaVerifier)
        .then((confirmationResult) => {
          verificationId = confirmationResult.verificationId;
          document.getElementById("status").innerText = "OTP Sent!";
        })
        .catch((error) => {
          document.getElementById("status").innerText = "Error: " + error.message;
        });
    }

    function verifyOTP() {
      const code = document.getElementById("otp").value;
      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
      auth.signInWithCredential(credential)
        .then((result) => {
          document.getElementById("status").innerText = "✅ Login successful!";
        })
        .catch((error) => {
          document.getElementById("status").innerText = "❌ Error: " + error.message;
        });
    }
  </script>
</body>
</html>
