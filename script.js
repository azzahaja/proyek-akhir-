/* =====================================================
   DATA ALUMNI
===================================================== */

const alumniData = [

    {
        nama: "Aisyah Rahma",
        kampus: "Universitas Indonesia",
        jurusan: "Kedokteran",
        fakultas: "Kedokteran",
        angkatan: "2026",
        jalur: "SNBP",
        prestasi: "Olimpiade Sains Nasional"
    },

    {
        nama: "Fahri Akmal",
        kampus: "Universitas Gadjah Mada",
        jurusan: "Teknik",
        fakultas: "Teknik",
        angkatan: "2025",
        jalur: "SNBT",
        prestasi: "Juara Kompetisi Robotik"
    },

    {
        nama: "Nadia Putri",
        kampus: "Universitas Hasanuddin",
        jurusan: "Hukum",
        fakultas: "Hukum",
        angkatan: "2025",
        jalur: "Mandiri",
        prestasi: "Delegasi Debat Nasional"
    },

    {
        nama: "Muhammad Raihan",
        kampus: "Universitas Indonesia",
        jurusan: "Ekonomi",
        fakultas: "Ekonomi",
        angkatan: "2024",
        jalur: "SNBT",
        prestasi: "Juara Olimpiade Ekonomi"
    },

    {
        nama: "Sarah Aulia",
        kampus: "Universitas Gadjah Mada",
        jurusan: "Kedokteran",
        fakultas: "Kedokteran",
        angkatan: "2024",
        jalur: "SNBP",
        prestasi: "Beasiswa Prestasi Akademik"
    },

    {
        nama: "Andi Fadillah",
        kampus: "Universitas Hasanuddin",
        jurusan: "Teknik",
        fakultas: "Teknik",
        angkatan: "2023",
        jalur: "Mandiri",
        prestasi: "Juara Kompetisi Nasional"
    },

    {
        nama: "Zahra Nabila",
        kampus: "Universitas Indonesia",
        jurusan: "Hukum",
        fakultas: "Hukum",
        angkatan: "2023",
        jalur: "SNBP",
        prestasi: "Juara Debat Bahasa Indonesia"
    },

    {
        nama: "Rizky Maulana",
        kampus: "Universitas Gadjah Mada",
        jurusan: "Ekonomi",
        fakultas: "Ekonomi",
        angkatan: "2026",
        jalur: "SNBT",
        prestasi: "Finalis Olimpiade Ekonomi"
    }

];


/* =====================================================
   ELEMENT HTML
===================================================== */

const searchModal = document.getElementById("searchModal");

const searchInput = document.getElementById("searchInput");
const keyword = document.getElementById("keyword");

const kampusFilter = document.getElementById("kampusFilter");
const jurusanFilter = document.getElementById("jurusanFilter");
const angkatanFilter = document.getElementById("angkatanFilter");
const jalurFilter = document.getElementById("jalurFilter");
const fakultasFilter = document.getElementById("fakultasFilter");
const sortFilter = document.getElementById("sortFilter");

const searchResult = document.getElementById("searchResult");
const emptyResult = document.getElementById("emptyResult");
const resultCount = document.getElementById("resultCount");


/* =====================================================
   BUKA POPUP
===================================================== */

function showSearchPanel() {

    searchModal.classList.add("show");

    // Masukkan pencarian utama ke popup
    keyword.value = searchInput.value;

    // Jalankan pencarian
    filterAlumni();

    // Fokus ke input
    setTimeout(() => {
        keyword.focus();
    }, 100);

}


/* =====================================================
   TUTUP POPUP
===================================================== */

function closeSearch() {

    searchModal.classList.remove("show");

}


/* =====================================================
   KLIK DI LUAR POPUP
===================================================== */

searchModal.addEventListener("click", function(event) {

    if (event.target === searchModal) {
        closeSearch();
    }

});


/* =====================================================
   ESC UNTUK MENUTUP POPUP
===================================================== */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        closeSearch();
    }

});


/* =====================================================
   FILTER ALUMNI
===================================================== */

function filterAlumni() {

    const searchText = keyword.value.toLowerCase().trim();

    const kampus = kampusFilter.value;
    const jurusan = jurusanFilter.value;
    const angkatan = angkatanFilter.value;
    const jalur = jalurFilter.value;
    const fakultas = fakultasFilter.value;

    let hasil = alumniData.filter(function(alumni) {

        // Pencarian umum
        const cocokSearch =
            alumni.nama.toLowerCase().includes(searchText) ||
            alumni.kampus.toLowerCase().includes(searchText) ||
            alumni.jurusan.toLowerCase().includes(searchText) ||
            alumni.prestasi.toLowerCase().includes(searchText);

        // Filter kampus
        const cocokKampus =
            kampus === "" ||
            alumni.kampus === kampus;

        // Filter jurusan
        const cocokJurusan =
            jurusan === "" ||
            alumni.jurusan === jurusan;

        // Filter angkatan
        const cocokAngkatan =
            angkatan === "" ||
            alumni.angkatan === angkatan;

        // Filter jalur
        const cocokJalur =
            jalur === "" ||
            alumni.jalur === jalur;

        // Filter fakultas
        const cocokFakultas =
            fakultas === "" ||
            alumni.fakultas === fakultas;


        return (
            cocokSearch &&
            cocokKampus &&
            cocokJurusan &&
            cocokAngkatan &&
            cocokJalur &&
            cocokFakultas
        );

    });


    /* =================================================
       SORTING
    ================================================= */

    if (sortFilter.value === "terbaru") {

        hasil.sort(function(a, b) {
            return Number(b.angkatan) - Number(a.angkatan);
        });

    }

    else if (sortFilter.value === "terlama") {

        hasil.sort(function(a, b) {
            return Number(a.angkatan) - Number(b.angkatan);
        });

    }

    else if (sortFilter.value === "nama") {

        hasil.sort(function(a, b) {
            return a.nama.localeCompare(b.nama);
        });

    }


    /* =================================================
       TAMPILKAN HASIL
    ================================================= */

    renderAlumni(hasil);

}


/* =====================================================
   RENDER CARD ALUMNI
===================================================== */

function renderAlumni(data) {

    searchResult.innerHTML = "";


    // Tidak ada hasil
    if (data.length === 0) {

        emptyResult.style.display = "block";

        resultCount.textContent =
            "Tidak ada alumni yang sesuai";

        return;

    }


    // Ada hasil
    emptyResult.style.display = "none";


    resultCount.textContent =
        `Menampilkan ${data.length} alumni`;


    data.forEach(function(alumni) {

        const card = document.createElement("div");

        card.className = "search-alumni-card";


        card.innerHTML = `

            <h3>${alumni.nama}</h3>

            <p>
                🎓 ${alumni.kampus}
            </p>

            <p>
                📚 ${alumni.jurusan}
            </p>

            <p>
                🏛️ Fakultas ${alumni.fakultas}
            </p>

            <p>
                📅 Angkatan ${alumni.angkatan}
            </p>

            <p>
                🛣️ Jalur ${alumni.jalur}
            </p>

            <p>
                🏆 ${alumni.prestasi}
            </p>

        `;


        searchResult.appendChild(card);

    });

}


/* =====================================================
   EVENT FILTER
===================================================== */

keyword.addEventListener("input", filterAlumni);

kampusFilter.addEventListener("change", filterAlumni);

jurusanFilter.addEventListener("change", filterAlumni);

angkatanFilter.addEventListener("change", filterAlumni);

jalurFilter.addEventListener("change", filterAlumni);

fakultasFilter.addEventListener("change", filterAlumni);

sortFilter.addEventListener("change", filterAlumni);


/* =====================================================
   RESET FILTER
===================================================== */

function resetFilter() {

    keyword.value = "";

    kampusFilter.value = "";

    jurusanFilter.value = "";

    angkatanFilter.value = "";

    jalurFilter.value = "";

    fakultasFilter.value = "";

    sortFilter.value = "terbaru";


    filterAlumni();

}


/* =====================================================
   DATA AWAL
===================================================== */

document.addEventListener("DOMContentLoaded", function() {

    renderAlumni(alumniData);

});