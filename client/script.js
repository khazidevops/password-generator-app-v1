async function register() {
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;
  const message = document.getElementById("regMessage");

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    message.innerText = "✅ Registered successfully!";
    message.style.color = "green";
    document.getElementById("registerSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
  } else {
    message.innerText = "❌ Failed to register.";
    message.style.color = "red";
  }
}

async function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const errorBox = document.getElementById("loginError");

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      console.log("✅ Login success");
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("appSection").style.display = "block";
      errorBox.innerText = "";
      await loadProfiles();
    } else {
      console.error("❌ Invalid login");
      errorBox.innerText = "Invalid credentials.";
    }
  } catch (err) {
    console.error("❌ Login failed:", err);
    errorBox.innerText = "Server error during login.";
  }
}

function generatePassword() {
  const length = document.getElementById("length").value;
  const includeNumbers = document.getElementById("includeNumbers").checked;
  const includeSymbols = document.getElementById("includeSymbols").checked;
  const includeUppercase = document.getElementById("includeUppercase").checked;
  const includeLowercase = document.getElementById("includeLowercase").checked;

  let charset = "";
  if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
  if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeNumbers) charset += "0123456789";
  if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  if (!charset) {
    alert("Please select at least one character type.");
    return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  document.getElementById("passwordBox").value = password;
}

function copyPassword() {
  const passwordBox = document.getElementById("passwordBox");
  passwordBox.select();
  passwordBox.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("📋 Password copied to clipboard!");
}

async function saveToProfile() {
  const url = document.getElementById("url").value;
  const savedUsername = document.getElementById("savedUsername").value;
  const password = document.getElementById("passwordBox").value;

  if (!url || !savedUsername || !password) {
    alert("Please fill in all fields.");
    return;
  }

  const response = await fetch("/api/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, username: savedUsername, password })
  });

  if (response.ok) {
    await loadProfiles();
    document.getElementById("url").value = "";
    document.getElementById("savedUsername").value = "";
    document.getElementById("passwordBox").value = "";
  } else {
    alert("❌ Failed to save profile.");
  }
}

async function loadProfiles() {
  try {
    const response = await fetch("/api/profiles");
    if (!response.ok) throw new Error("Not logged in or server error");
    const profiles = await response.json();
    const list = document.getElementById("profileList");
    list.innerHTML = "";

    profiles.forEach(({ id, url, username, password }) => {
      const li = document.createElement("li");
      li.innerHTML = `🌐 ${url} | 👤 ${username} | 🔐 ${password}
        <button onclick="deleteProfile(${id})">Delete</button>
        <button onclick="editProfile(${id}, '${url}', '${username}', '${password}')">Edit</button>`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading profiles:", err.message);
  }
}

async function deleteProfile(id) {
  await fetch(`/api/delete/${id}`, { method: "DELETE" });
  await loadProfiles();
}

async function editProfile(id, oldUrl, oldUser, oldPass) {
  const newUrl = prompt("Edit URL", oldUrl);
  const newUser = prompt("Edit Username", oldUser);
  const newPass = prompt("Edit Password", oldPass);
  if (!newUrl || !newUser || !newPass) return;

  await fetch(`/api/edit/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: newUrl, username: newUser, password: newPass })
  });

  await loadProfiles();
}

function logout() {
  // Hide app section, show login section
  document.getElementById("appSection").style.display = "none";
  document.getElementById("loginSection").style.display = "block";

  // Clear login form
  document.getElementById("loginUsername").value = "";
  document.getElementById("loginPassword").value = "";
  document.getElementById("loginError").innerText = "";
}