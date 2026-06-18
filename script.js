// =====================================
// ABSENSI MY DENTIST
// =====================================

let fotoBase64 = "";
let stream = null;

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
// LOAD KARYAWAN
// =====================================

async function loadKaryawan() {

    try {

        const response = await fetch(

            CONFIG.API_URL + "?action=getKaryawan"

        );

        const data = await response.json();

        const select = document.getElementById("nama");

        select.innerHTML =
            '<option value="">Pilih Karyawan</option>';

        data.forEach(function(item){

            const option = document.createElement("option");

            option.value = item.nama;

            option.textContent = item.nama;

            option.dataset.jabatan = item.jabatan;

            select.appendChild(option);

        });

    }

    catch(error){

        console.log(error);

        document.getElementById("status").innerHTML =
            "🔴 Gagal memuat data karyawan";

    }

}

// =====================================
// KAMERA LIVE
// =====================================

async function aktifkanKamera() {

    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia) {

        document.getElementById("status").innerHTML =
            "🔴 Browser tidak mendukung kamera";

        return;

    }

    try {

        stream = await navigator.mediaDevices.getUserMedia({

            video: {

                facingMode: "user"

            },

            audio: false

        });

        const video = document.getElementById("video");

        video.srcObject = stream;

        await video.play();

        document.getElementById("status").innerHTML =
            "🟢 Kamera Aktif";

    }

    catch (err) {

        console.log(err);

        document.getElementById("status").innerHTML =
            "🔴 Kamera gagal diakses";

    }

}

// =====================================
// AMBIL FOTO
// =====================================

function ambilFoto() {

    const video = document.getElementById("video");

    const canvas = document.getElementById("canvas");

    const preview = document.getElementById("preview");

    if (!video.videoWidth) {

        alert("Kamera belum siap.");

        return;

    }

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0);

    fotoBase64 = canvas.toDataURL("image/jpeg", 0.9);

    preview.src = fotoBase64;

    preview.style.display = "block";

    document.getElementById("status").innerHTML =
        "📷 Foto berhasil diambil";

}

// =====================================
// RESET FOTO
// =====================================

function resetFoto() {

    fotoBase64 = "";

    const preview = document.getElementById("preview");

    preview.src = "";

    preview.style.display = "none";

    document.getElementById("status").innerHTML =
        "🟢 Siap mengambil foto";

}

// =====================================
// SAAT HALAMAN DIBUKA
// =====================================

window.onload = async function () {

    updateJam();

    setInterval(updateJam, 1000);

    await loadKaryawan();

    await aktifkanKamera();

    console.log("Window Loaded");

    document.getElementById("btnFoto").onclick = ambilFoto;

    document.getElementById("btnReset").onclick = resetFoto;

    document.getElementById("status").innerHTML =
        "🟢 Siap Absen";

};
