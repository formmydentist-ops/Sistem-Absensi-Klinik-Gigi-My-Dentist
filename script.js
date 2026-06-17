// =====================================
// VARIABEL
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

setInterval(updateJam,1000);

updateJam();

// =====================================
// AKTIFKAN KAMERA
// =====================================

async function aktifkanKamera(){

    try{

        stream = await navigator.mediaDevices.getUserMedia({

            video:{
                facingMode:"user"
            },

            audio:false

        });

        const video=document.getElementById("video");

        video.srcObject=stream;

        await video.play();

    }

    catch(err){

        document.getElementById("hasil").innerHTML=
        "❌ Kamera tidak dapat diakses";

        console.log(err);

    }

}

// =====================================
// LOAD HALAMAN
// =====================================

window.onload=function(){

    aktifkanKamera();

};

// =====================================
// AMBIL FOTO
// =====================================

document.getElementById("btnFoto")

.addEventListener("click",function(){

    const video=document.getElementById("video");

    const canvas=document.getElementById("canvas");

    canvas.width=video.videoWidth;

    canvas.height=video.videoHeight;

    const ctx=canvas.getContext("2d");

    ctx.drawImage(video,0,0);

    fotoBase64=canvas.toDataURL("image/png");

    document.getElementById("preview").src=fotoBase64;

    document.getElementById("preview").style.display="block";

});

// =====================================
// ULANGI FOTO
// =====================================

document.getElementById("btnUlangi")

.addEventListener("click",function(){

    fotoBase64="";

    document.getElementById("preview").style.display="none";

});

// =====================================
// ABSEN
// =====================================

document.getElementById("btnAbsen")

.addEventListener("click",function(){

    if(document.getElementById("nama").value==""){

        alert("Pilih karyawan.");

        return;

    }

    if(fotoBase64==""){

        alert("Ambil foto terlebih dahulu.");

        return;

    }

    document.getElementById("hasil").innerHTML=

    "✅ Foto berhasil diambil";

});
