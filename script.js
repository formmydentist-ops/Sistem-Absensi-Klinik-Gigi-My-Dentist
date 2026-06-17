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
// SAAT HALAMAN DIBUKA
// =====================================

window.onload = function () {

    updateJam();

    setInterval(updateJam, 1000);

    loadKaryawan();

    document.getElementById("status").innerHTML =
        "🟢 Siap Absen";

};
