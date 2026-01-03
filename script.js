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


async function register(email, password) {
  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  window.location.href = "game.html";
}



//Pontos

async function initGame() {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    window.location.href = "login.html";
    return;
  }

  loadProfile();
  startPPS();
}


//Perfil

async function loadProfile() {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  document.getElementById("points").innerText = data.points;
}


//PPS

let ppsInterval;

function startPPS() {
  clearInterval(ppsInterval);

  ppsInterval = setInterval(async () => {
    const { data } = await supabase.auth.getUser();

    await supabase
      .from("profiles")
      .update({
        points: supabase.raw("points + points_per_second"),
        last_update: new Date()
      })
      .eq("id", data.user.id);

    loadProfile();
  }, 1000);
}

//Ranking

async function loadRanking() {
  const { data } = await supabase
    .from("ranking_global")
    .select("*")
    .limit(20);

  const list = document.getElementById("ranking");
  list.innerHTML = "";

  data.forEach((u, i) => {
    list.innerHTML += `<li>#${i + 1} ${u.email} — ${u.points}</li>`;
  });
}

//novo cad

async function registerUser() {
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  console.log("Signup:", email);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin
    }
  });

  console.log("Resultado:", data, error);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Usuário criado com sucesso");
}
