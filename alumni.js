let semuaAlumni = [];
let tahunTerbaru = [];

async function loadAlumni() {
    const { data, error } = await db
        .from("alumni")
        .select(`
            id,
            nama,
            fakultas,
            jurusan,
            angkatan,
            jalur_masuk,
            prestasi,
            kampus (
                id,
                nama
            )
        `)
        .order("angkatan", { ascending: false });

    if (error) {
        console.error("Error mengambil data alumni:", error);
        tampilkanError(error.message);
        return;
    }

    semuaAlumni = data || [];

    // Ambil 5 tahun angkatan terbaru yang benar-benar ada
    tahunTerbaru = [
        ...new Set(
            semuaAlumni
                .map(alumni => alumni.angkatan)
                .filter(tahun => tahun !== null)
                .map(tahun => Number(tahun))
        )
    ]
        .sort((a, b) => b - a)
        .slice(0, 5);

    tampilkanTahun();
    isiFilter();
    bacaURL();
    tampilkanAlumni();
}


// =========================================
// TAHUN TERBARU
// =========================================

function tampilkanTahun() {

    const container =
        document.getElementById("tahunContainer");

    if (!container) return;

    container.innerHTML = "";

    

    tahunTerbaru.forEach((tahun, index) => {

        const button =
            document.createElement("button");

        button.className =
            "year-button";

        if (index === 0) {
            button.classList.add("active");
        }

        button.textContent = tahun;

        button.dataset.tahun = tahun;

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".year-button")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            button.classList.add("active");

            container.dataset.tahun = tahun;

            tampilkanAlumni();
        });

        container.appendChild(button);
    });
}


// =========================================
// ISI FILTER
// =========================================

function isiFilter() {

    const filterKampus =
        document.getElementById("filterKampus");

    const filterFakultas =
        document.getElementById("filterFakultas");

    const filterJurusan =
        document.getElementById("filterJurusan");

    const filterPrestasi =
        document.getElementById("filterPrestasi");

    if (!filterKampus) return;

    const kampus = [
        ...new Map(
            semuaAlumni
                .filter(a => a.kampus)
                .map(a => [
                    a.kampus.id,
                    a.kampus.nama
                ])
        )
    ];

    const fakultas = [
        ...new Set(
            semuaAlumni
                .map(a => a.fakultas)
                .filter(Boolean)
        )
    ].sort();

    const jurusan = [
        ...new Set(
            semuaAlumni
                .map(a => a.jurusan)
                .filter(Boolean)
        )
    ].sort();


    kampus.forEach(([id, nama]) => {

        const option =
            document.createElement("option");

        option.value = id;
        option.textContent = nama;

        filterKampus.appendChild(option);
    });


    fakultas.forEach(nama => {

        const option =
            document.createElement("option");

        option.value = nama;
        option.textContent = nama;

        filterFakultas.appendChild(option);
    });


    jurusan.forEach(nama => {

        const option =
            document.createElement("option");

        option.value = nama;
        option.textContent = nama;

        filterJurusan.appendChild(option);
    });


    filterKampus.addEventListener(
        "change",
        tampilkanAlumni
    );

    filterFakultas.addEventListener(
        "change",
        tampilkanAlumni
    );

    filterJurusan.addEventListener(
        "change",
        tampilkanAlumni
    );

    filterPrestasi.addEventListener(
        "change",
        tampilkanAlumni
    );
}


// =========================================
// BACA URL
// =========================================

function bacaURL() {

    const params =
        new URLSearchParams(window.location.search);

    const kampusId =
        params.get("kampus_id");

    const fakultas =
        params.get("fakultas");

    const tahun =
        params.get("tahun");


    if (kampusId) {

        const filter =
            document.getElementById("filterKampus");

        if (filter) {
            filter.value = kampusId;
        }
    }


    if (fakultas) {

        const filter =
            document.getElementById("filterFakultas");

        if (filter) {
            filter.value = fakultas;
        }
    }


    if (tahun && tahunTerbaru.includes(Number(tahun))) {

        const container =
            document.getElementById("tahunContainer");

        if (container) {
            container.dataset.tahun = tahun;
        }

        document
            .querySelectorAll(".year-button")
            .forEach(button => {

                button.classList.remove("active");

                if (
                    Number(button.dataset.tahun) ===
                    Number(tahun)
                ) {
                    button.classList.add("active");
                }
            });
    }
}


// =========================================
// TAMPILKAN ALUMNI
// =========================================

function tampilkanAlumni() {
    

   const container =
        document.getElementById("alumniContainer");

    const tahunContainer =
        document.getElementById("tahunContainer");

    const tahunFilter =
        tahunContainer?.dataset.tahun || "";

    const kampusFilter =
        document.getElementById("filterKampus")?.value;

    const fakultasFilter =
        document.getElementById("filterFakultas")?.value;

    const jurusanFilter =
        document.getElementById("filterJurusan")?.value;

    const prestasiFilter =
        document.getElementById("filterPrestasi")?.value;


    let hasil = [...semuaAlumni];


    // Hanya 5 tahun terbaru
    hasil = hasil.filter(alumni =>
    tahunTerbaru.some(
        tahun =>
            String(tahun) ===
            String(alumni.angkatan)
    )
);


    if (tahunFilter) {

        hasil = hasil.filter(alumni =>
            String(alumni.angkatan) ===
            String(tahunFilter)
        );
    }


    if (kampusFilter) {

        hasil = hasil.filter(alumni =>
            String(alumni.kampus?.id) ===
            String(kampusFilter)
        );
    }


    if (fakultasFilter) {

        hasil = hasil.filter(alumni =>
            alumni.fakultas === fakultasFilter
        );
    }


    if (jurusanFilter) {

        hasil = hasil.filter(alumni =>
            alumni.jurusan === jurusanFilter
        );
    }


    if (prestasiFilter === "ada") {

        hasil = hasil.filter(alumni =>
            alumni.prestasi &&
            alumni.prestasi.trim() !== ""
        );
    }


    if (prestasiFilter === "tidak") {

        hasil = hasil.filter(alumni =>
            !alumni.prestasi ||
            alumni.prestasi.trim() === ""
        );
    }


    container.innerHTML = "";


    if (hasil.length === 0) {

        container.innerHTML = `
            <div class="empty-result">
                <h3>Data alumni tidak ditemukan</h3>
                <p>
                    Tidak ada alumni yang sesuai
                    dengan filter yang dipilih.
                </p>
            </div>
        `;

        return;
    }


    hasil.forEach(alumni => {

        container.appendChild(
            buatKartuAlumni(alumni)
        );

    });
}


// =========================================
// BUAT KARTU ALUMNI
// =========================================

function buatKartuAlumni(alumni) {

    const card =
        document.createElement("article");

    card.className = "alumni-card";


    // Ambil inisial
    const inisial =
        alumni.nama
            .trim()
            .split(/\s+/)
            .map(kata => kata.charAt(0))
            .slice(0, 2)
            .join("")
            .toUpperCase();


    const namaKampus =
        alumni.kampus?.nama || "-";


    const prestasiHTML =
        alumni.prestasi &&
        alumni.prestasi.trim() !== ""
            ? `
                <div class="achievement">
                    <span class="achievement-icon">🏅</span>
                    <span>${alumni.prestasi}</span>
                </div>
              `
            : "";


    card.innerHTML = `

        <div class="alumni-header">

            <div class="alumni-avatar">
                ${inisial}
            </div>

            <div class="alumni-info">

                <h3>
                    ${alumni.nama}
                </h3>

                <div class="alumni-badges">

                    <span class="alumni-year">
                        Angkatan ${alumni.angkatan}
                    </span>

                    <span class="alumni-path">
                        ${alumni.jalur_masuk}
                    </span>

                </div>

            </div>

        </div>


        <div class="alumni-detail">

            <p class="campus-name">
                <span>🎓</span>
                ${namaKampus}
            </p>

            <p class="faculty-name">
                <span>🏛</span>
                ${alumni.fakultas}
            </p>

            <p class="major-name">
                <span>📚</span>
                ${alumni.jurusan}
            </p>

        </div>


       ${prestasiHTML}


        
    `;


    return card;
}


// =========================================
// ERROR
// =========================================

function tampilkanError(pesan) {

    const container =
        document.getElementById("alumniContainer");

    if (!container) return;

    container.innerHTML = `

        <div class="empty-result">

            <h3>
                Data gagal dimuat
            </h3>

            <p>
                Periksa koneksi Supabase.
            </p>

            <small>
                ${pesan}
            </small>

        </div>

    `;
}


// =========================================
// JALANKAN
// =========================================

loadAlumni();