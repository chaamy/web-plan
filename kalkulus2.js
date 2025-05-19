// Fungsi untuk memilih tujuan dari card
function selectGoal(goal) {
  document.getElementById("goal").value = goal;
}

// Tampilkan input tambahan berdasarkan metode yang dipilih
document.getElementById("method").addEventListener("change", function () {
  const method = this.value;
  document.getElementById("incrementContainer").style.display = "none";
  document.getElementById("multiplierContainer").style.display = "none";

  if (method === "arithmetic") {
    document.getElementById("incrementContainer").style.display = "block";
  } else if (method === "geometric") {
    document.getElementById("multiplierContainer").style.display = "block";
  }
});

// Fungsi utama untuk menghitung rencana
function calculatePlan() {
  const goal = document.getElementById("goal").value;
  const target = parseFloat(document.getElementById("target").value) * 1000000;
  const duration = parseInt(document.getElementById("duration").value);
  const initial =
    parseFloat(document.getElementById("initial").value) * 1000000;
  const method = document.getElementById("method").value;
  const increment =
    parseFloat(document.getElementById("increment").value || 0) * 1000000;
  const multiplier = parseFloat(
    document.getElementById("multiplier").value || 1
  );

  if (!goal || isNaN(target) || isNaN(duration) || isNaN(initial) || !method) {
    alert("Harap isi semua field yang diperlukan dengan benar!");
    return;
  }

  if (target <= 0 || duration <= 0 || initial <= 0) {
    alert("Target, durasi, dan tabungan awal harus lebih dari 0!");
    return;
  }

  let savings = [];
  let total = 0;
  let current = initial;

  for (let month = 1; month <= duration; month++) {
    const monthlyAmount = current;
    total += monthlyAmount;

    savings.push({
      month: month,
      amount: monthlyAmount,
      total: total,
    });

    if (method === "arithmetic") {
      current += increment;
    } else if (method === "geometric") {
      current *= multiplier;
    }
  }

  displayResults(goal, target, duration, total, savings);
}

// Fungsi untuk menampilkan hasil di popup dulu
function displayResults(goal, target, duration, total, savings) {
  const percentage = Math.min(100, Math.round((total / target) * 100));
  const progressBar = document.getElementById("progressBar");

  progressBar.style.width = percentage + "%";
  progressBar.innerText = percentage + "%";

  if (percentage < 50) {
    progressBar.style.backgroundColor = "#f44336";
  } else if (percentage < 80) {
    progressBar.style.backgroundColor = "#ff9800";
  } else {
    progressBar.style.backgroundColor = "#4CAF50";
  }

  // Isi ucapan selamat / motivasi ke popup modal
  const popupMotivationText = document.getElementById("popupMotivationText");

  if (percentage >= 100) {
    popupMotivationText.innerHTML = `
      <h3>Selamat! 🎉</h3>
      <p>Target menabung ${getGoalName(
        goal
      )} Anda tercapai! Total tabungan ${formatRupiah(
      total
    )}, melebihi target ${formatRupiah(target)}.</p>
    `;
  } else if (percentage >= 80) {
    popupMotivationText.innerHTML = `
      <h3>Hampir sampai! 💪</h3>
      <p>Total tabungan Anda ${formatRupiah(
        total
      )} (${percentage}% dari target). Tinggal ${formatRupiah(
      target - total
    )} lagi untuk mencapai target ${getGoalName(goal)}.</p>
    `;
  } else if (percentage >= 50) {
    popupMotivationText.innerHTML = `
      <h3>Teruskan! ✨</h3>
      <p>Anda sudah mencapai ${percentage}% target ${getGoalName(
      goal
    )}. Total terkumpul ${formatRupiah(total)} dari ${formatRupiah(target)}.</p>
    `;
  } else {
    popupMotivationText.innerHTML = `
      <h3>Ayo mulai! 🌱</h3>
      <p>Anda baru mencapai ${percentage}% target ${getGoalName(
      goal
    )}. Total terkumpul ${formatRupiah(total)} dari ${formatRupiah(target)}.</p>
    `;
  }

  // Tampilkan modal popup
  const popupModal = document.getElementById("popupModal");
  popupModal.classList.remove("hidden");
  popupModal.classList.add("show"); 

  // Jangan tampilkan hasil dulu, sembunyikan kontainer hasil
  document.getElementById("resultContainer").classList.add("hidden");

  // Simpan data hasil supaya bisa dipakai saat tombol modal ditekan
  window.latestResultData = { goal, target, duration, total, savings };
}

// Tombol di popup modal untuk tampilkan hasil lengkap
document.getElementById("showResultsBtn").addEventListener("click", () => {
  const popupModal = document.getElementById("popupModal");
  popupModal.classList.add("hidden");

  // Ambil data hasil dari penyimpanan sementara
  const { goal, target, duration, total, savings } = window.latestResultData;

  const percentage = Math.min(100, Math.round((total / target) * 100));
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage + "%";
  progressBar.innerText = percentage + "%";

  if (percentage < 50) {
    progressBar.style.backgroundColor = "#ff1100";
  } else if (percentage < 80) {
    progressBar.style.backgroundColor = "#ff9800";
  } else {
    progressBar.style.backgroundColor = "#57ff4f";
  }

  document.getElementById("summary").innerHTML = `
    <h3>Ringkasan Rencana</h3>
    <p><strong>Tujuan:</strong> ${getGoalName(goal)}</p>
    <p><strong>Target Dana:</strong> ${formatRupiah(target)}</p>
    <p><strong>Jangka Waktu:</strong> ${duration} bulan</p>
    <p><strong>Total Tabungan:</strong> ${formatRupiah(total)}</p>
    <p><strong>Status:</strong> ${
      percentage >= 100 ? "Target tercapai!🎉" : "Belum mencapai target"
    }</p>
  `;

  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  savings.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.month}</td>
      <td>${formatRupiah(item.amount)}</td>
      <td>${formatRupiah(item.total)}</td>
    `;
    tableBody.appendChild(row);
  });

  // Tampilkan hasilnya
  document.getElementById("resultContainer").classList.remove("hidden");
  document.getElementById("resultContainer").scrollIntoView({ behavior: "smooth" });
});

// Fungsi reset
function resetForm() {
  document.getElementById("plannerForm").reset();
  document.getElementById("incrementContainer").style.display = "none";
  document.getElementById("multiplierContainer").style.display = "none";
  document.getElementById("resultContainer").classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Helper: format rupiah
function formatRupiah(amount) {
  return (
    "Rp" +
    Math.round(amount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  );
}

// Helper: nama tujuan
function getGoalName(goal) {
  const goals = {
    nikah: "pernikahan",
    umroh: "umroh",
    haji: "haji",
  };
  return goals[goal] || "";
}

// Fungsi ganti halaman
function nextPage(pageId) {
  const allPages = document.querySelectorAll(".page, .section");
  allPages.forEach((page) => (page.style.display = "none"));

  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.style.display = "block";
    window.scrollTo(0, 0);
  }
}

// Fungsi tampilkan section tertentu
function showSection(id) {
  const sections = document.querySelectorAll(".section, .page");
  sections.forEach((section) => {
    section.style.display = "none";
  });

  const target = document.getElementById(id);
  if (target) {
    target.style.display = "block";
    target.scrollIntoView({ behavior: "smooth" });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById("logo");
  const navbar = document.getElementById("navbar");

  const header = document.getElementById("header");
  const home = document.getElementById("home");
  const startButton = document.getElementById("startButton");

  // Animasi logo
  setTimeout(() => {
    logo.classList.add("shrinkAndFade");
  }, 2000);

  setTimeout(() => {
    logo.style.display = "none";
    navbar.classList.add("show");
    home.classList.add("show");
    home.classList.add("active");
  }, 3000);

  startButton.addEventListener("click", function () {
    header.style.display = "none";
    nextPage("page2");
  });
});

// Navbar scroll effect


document.getElementById("showResultsBtn").addEventListener("click", function () {
  // Sembunyikan popup
  document.getElementById("popupModal").classList.add("hidden");

  // Sembunyikan form input
  document.getElementById("formContainer").classList.add("hidden");

  // Tampilkan hasil
  document.getElementById("resultContainer").classList.remove("hidden");
});

function goToFormPage() {
  // Tampilkan halaman kalkulasi
  document.getElementById("page3").classList.remove("hidden");

  // Tampilkan form input
  document.getElementById("formContainer").classList.remove("hidden");

  // Sembunyikan hasil jika sebelumnya masih terlihat
  document.getElementById("resultContainer").classList.add("hidden");

  // Sembunyikan halaman menu (page2)
  document.getElementById("page2").classList.add("hidden");

  // (Opsional) Reset form
  document.getElementById("saving-form").reset();
}
