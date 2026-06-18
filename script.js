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

// =====================================
// KAMERA LIVE
// =====================================

async function aktifkanKamera() {

    try {

        stream = await navigator.mediaDevices.getUserMedia({

            video: {

                facingMode: "user",

                width: {
                    ideal: 720
                },

                height: {
                    ideal: 1280
                }

            },

            audio: false

        });

        const video = document.getElementById("video");

        video.srcObject = stream;

        await video.play();

        document.getElementById("status").innerHTML =
            "🟢 Kamera Aktif";

    }

    catch (error) {

        console.log(error);

        document.getElementById("status").innerHTML =
            "🔴 Kamera tidak dapat diakses";

    }

}

    catch(error){

        console.log(error);

        document.getElementById("status").innerHTML =
            "🔴 Gagal memuat data karyawan";

    }

}

// =====================================
// AMBIL FOTO
// =====================================

function ambilFoto() {

    const video = document.getElementById("video");

    const canvas = document.getElementById("canvas");

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0);

    fotoBase64 = canvas.toDataURL("image/png");

    const preview = document.getElementById("preview");

    preview.src = fotoBase64;

    preview.style.display = "block";

}

// =====================================
// RESET FOTO
// =====================================

function resetFoto() {

    fotoBase64 = "";

    document.getElementById("preview").style.display = "none";

}

// =====================================
// SAAT HALAMAN DIBUKA
// =====================================

window.onload = function () {

    updateJam();

    setInterval(updateJam, 1000);

    loadKaryawan();

    aktifkanKamera();

    document.getElementById("btnFoto")

        .addEventListener("click", ambilFoto);

    document.getElementById("btnReset")

        .addEventListener("click", resetFoto);

    document.getElementById("status").innerHTML =
        "🟢 Siap Absen";

};
