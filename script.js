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

            updateButton();
            
            cekForm();

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

                facingMode: {
                    ideal: "user"
                }

            },

            audio: false

        });

        const video = document.getElementById("video");

        video.srcObject = stream;

        await video.play();

        // Live Camera Mirror
        video.style.transform = "scaleX(-1)";

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

    // Bersihkan canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mirror hasil foto
    ctx.save();

    ctx.translate(canvas.width, 0);

    ctx.scale(-1, 1);

    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.restore();

    // Simpan hasil mirror
    fotoBase64 = canvas.toDataURL(
        "image/jpeg",
        0.9
    );

    // Preview mirror
    preview.src = fotoBase64;

    preview.style.display = "block";

    preview.style.transform = "none";

    document.getElementById("status").innerHTML =
    "📷 Foto berhasil diambil";

    updateButton();
    
    cekForm();

}

// =====================================
// RESET FOTO
// =====================================

function resetFoto() {

    fotoBase64 = "";

    const preview = document.getElementById("preview");

    preview.src = "";

    preview.style.display = "none";

    preview.style.transform = "none";

    document.getElementById("status").innerHTML =
        "🟢 Siap mengambil foto";

    updateButton();
    
    cekForm();

}

// =====================================
// CEK FORM
// =====================================

function cekForm() {

    const nama =
        document.getElementById("nama").value;

    const btn =
        document.getElementById("btnAbsen");

    if (nama !== "" && fotoBase64 !== "") {

        btn.disabled = false;

        btn.style.opacity = "1";

        btn.style.cursor = "pointer";

    }

    else {

        btn.disabled = true;

        btn.style.opacity = "0.5";

        btn.style.cursor = "not-allowed";

    }

}

// =====================================
// CEK BUTTON
// =====================================

function updateButton() {

    const nama = document.getElementById("nama").value;

    const btnFoto = document.getElementById("btnFoto");

    const btnReset = document.getElementById("btnReset");

    const btnAbsen = document.getElementById("btnAbsen");

    // ==========================
    // Belum pilih karyawan
    // ==========================

    if (nama === "") {

        btnFoto.disabled = true;
        btnReset.disabled = true;
        btnAbsen.disabled = true;

        return;

    }

    // ==========================
    // Sudah pilih karyawan
    // ==========================

    btnFoto.disabled = false;

    // ==========================
    // Sudah ambil foto
    // ==========================

    if (fotoBase64 !== "") {

        btnReset.disabled = false;
        btnAbsen.disabled = false;

    }

    else {

        btnReset.disabled = true;
        btnAbsen.disabled = true;

    }

}

// =====================================
// LOADING
// =====================================

function showLoading(text = "Mengupload foto...") {

    document.getElementById("loading").style.display = "flex";

    document.getElementById("loadingText").innerHTML = text;

}

function hideLoading() {

    document.getElementById("loading").style.display = "none";

}

// =====================================
// RESET FORM
// =====================================

function resetForm() {

    fotoBase64 = "";

    document.getElementById("nama").selectedIndex = 0;

    document.getElementById("preview").src = "";

    document.getElementById("preview").style.display = "none";

    document.getElementById("btnAbsen").disabled = true;

    document.getElementById("btnAbsen").innerHTML =
        "✅ ABSEN";

    document.getElementById("status").innerHTML =
        "🟢 Siap Absen";
    updateButton();
    
    cekForm();

}

// =====================================
// ABSEN
// =====================================

async function kirimAbsen() {

    const nama = document.getElementById("nama").value;

    const status = document.getElementById("status");

    if (nama == "") {

        alert("Pilih karyawan terlebih dahulu.");

        return;

    }

    if (fotoBase64 == "") {

        alert("Silakan ambil foto terlebih dahulu.");

        return;

    }

    const option =
        document.getElementById("nama").selectedOptions[0];

    const jabatan =
        option.dataset.jabatan;

    document.getElementById("btnAbsen").disabled = true;

    document.getElementById("btnAbsen").innerHTML =
        "⏳ Menyimpan...";
    
    showLoading("📤 Mengupload foto...");

    status.innerHTML =
        "⏳ Mengirim absensi...";

    try {

        const formData = new FormData();

formData.append("nama", nama);

formData.append("jabatan", jabatan);

formData.append("foto", fotoBase64);

const response = await fetch(

    CONFIG.API_URL,

    {

        method: "POST",

        body: formData

    }

);

        const hasil =
            await response.json();

        console.log(hasil);

        if (hasil.success) {

    showLoading("✅ Absensi berhasil");

status.innerHTML =
    "✅ " + hasil.message;

setTimeout(function(){

    hideLoading();

    resetForm();

},2000);

}

        else {

    hideLoading();

    status.innerHTML =
        "❌ " + hasil.message;

}

    }

    catch (err) {

    catch(err){

    hideLoading();

    console.log(err);

    alert(err);

    status.innerHTML =
        err.toString();

}

    document.getElementById("btnAbsen").disabled = false;

    document.getElementById("btnAbsen").innerHTML =
        "✅ ABSEN";

}

// =====================================
// SAAT HALAMAN DIBUKA
// =====================================

window.onload = async function () {

    updateJam();

    setInterval(updateJam, 1000);

    await loadKaryawan();

    await aktifkanKamera();

    document.getElementById("btnFoto").onclick =
        ambilFoto;

    document.getElementById("btnReset").onclick =
        resetFoto;
    document.getElementById("nama").onchange = function(){

    updateButton();

    cekForm();

};

updateButton();

    document.getElementById("btnAbsen").onclick =
        kirimAbsen;

    document.getElementById("status").innerHTML =
        "🟢 Siap Absen";

};
