const apiBase = "https://scriptbox.onrender.com";

async function googleOAuth(idToken) {
  const res = await fetch(apiBase + "/auth/oauth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: idToken }),
  });
  if (res.ok) {
    const data = await res.json();
    localStorage.setItem("sb_token", data.token);
    window.location.href = "../dashboard.html";
  } else {
    alert("Google login failed");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const signupBtn = document.querySelector(".next-btn");
  const verifyBtn = document.querySelector(".confirm-btn");
  const googleBtn = document.querySelector(".google");

  if (signupBtn) {
    signupBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const payload = {
        username: document.querySelector('input[placeholder="Username"]').value,
        email: document.querySelector('input[type="email"]').value,
        password: document.querySelector('input[type="password"]').value,
        dob: document.querySelector('.dob-field').value
      };
      
      signupBtn.innerText = "Sending...";
      const res = await fetch(apiBase + "/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        localStorage.setItem("user_email", payload.email);
        window.location.href = "verification_code.html";
      } else {
        alert("Signup failed");
        signupBtn.innerText = "Next";
      }
    });
  }

  if (verifyBtn) {
    verifyBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = localStorage.getItem("user_email");
      const code = document.querySelector(".code-input").value;
      const res = await fetch(apiBase + "/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("sb_token", data.token);
        window.location.href = "../dashboard.html";
      } else {
        alert("Invalid code");
      }
    });
  }

  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      google.accounts.id.initialize({
        client_id: "484573911641-vepujquvvl229otcchk9k486dqgoj4bc.apps.googleusercontent.com",
        callback: (response) => googleOAuth(response.credential),
      });
      google.accounts.id.prompt();
    });
  }
});
