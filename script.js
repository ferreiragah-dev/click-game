function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function register() {
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  if (!email || !password) {
    alert("Preencha todos os campos");
    return;
  }

  const users = getUsers();

  if (users.find(u => u.email === email)) {
    alert("Usuário já existe");
    return;
  }

  users.push({ email, password, points: 0 });
  saveUsers(users);

  alert("Cadastro realizado");
  window.location.href = "login.html";
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Login inválido");
    return;
  }

  localStorage.setItem("loggedUser", email);
  window.location.href = "game.html";
}

function logout() {
  localStorage.removeItem("loggedUser");
  window.location.href = "login.html";
}

function getLoggedUser() {
  return localStorage.getItem("loggedUser");
}

function addPoint() {
  const email = getLoggedUser();
  if (!email) return;

  const users = getUsers();
  const user = users.find(u => u.email === email);

  user.points += 1;
  saveUsers(users);

  document.getElementById("points").innerText = user.points;
}

(function initGame() {
  if (!document.getElementById("points")) return;

  const email = getLoggedUser();
  if (!email) {
    window.location.href = "login.html";
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.email === email);

  document.getElementById("userEmail").innerText = email;
  document.getElementById("points").innerText = user.points;
})();
