// =====================================
// ABSENSI MY DENTIST
// =====================================

let fotoBase64 = "";

// =====================================
// JAM & TANGGAL
// =====================================

function updateJam() {

    const now = new Date();

    document.getElementById("tanggal").innerHTML =
        now.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

    document.getElementById("jam").innerHTML =
        now.toLocaleTimeString("id-ID");

}

// =====================================
// SAAT HALAMAN DIBUKA
// =====================================

window.onload = function () {

    updateJam();

    setInterval(updateJam, 1000);

    document.getElementById("status").innerHTML =
        "🟢 Siap Absen";

};
