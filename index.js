let semuaAlumniHome = [];


/* =========================================
   LOAD ALUMNI
========================================= */

async function loadAlumniHome() {

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
        .order("angkatan", {
            ascending: false
        });


    if (error) {

        console.error(error);

        document.getElementById(
            "alumniContainer"
        ).innerHTML = `
            <div class="empty-result">

                <h3>
                    Data gagal dimuat
                </h3>

                <p>
                    Periksa koneksi Supabase.
                </p>

            </div>
        `;

        return;
    }


    semuaAlumniHome = data || [];

    tampilkanAlumniHome(
        semuaAlumniHome
    );
}


/* =========================================
   TAMPILKAN ALUMNI
========================================= */

function tampilkanAlumniHome(data) {

    const container =
        document.getElementById(
            "alumniContainer"
        );


    container.innerHTML = "";


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-result">

                <h3>
                    Alumni tidak ditemukan
                </h3>

                <p>
                    Coba kata kunci lainnya.
                </p>

            </div>
        `;

        return;
    }


    data.forEach(alumni => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "alumni-card";


       card.innerHTML = `
    <div class="alumni-header">

    
        <div class="alumni-info">

            <h3>${alumni.nama}</h3>

            <p class="alumni-year">
                Angkatan ${alumni.angkatan}
            </p>

        </div>

    </div>

    <div class="alumni-detail">

        <p>
            🎓 ${alumni.kampus?.nama || "-"}
        </p>

        <p>
            📖 ${alumni.jurusan || "-"}
        </p>

        ${
            alumni.prestasi
            ? `<span class="achievement">
                🏅 ${alumni.prestasi}
               </span>`
            : ""
        }

    </div>
`;

        container.appendChild(card);

    });

}


/* =========================================
   SEARCH
========================================= */

function cariAlumni() {

    const keyword =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase()
            .trim();


    if (!keyword) {

        tampilkanAlumniHome(
            semuaAlumniHome
        );

        return;
    }


    const hasil =
        semuaAlumniHome.filter(
            alumni => {

                const teks = `

                    ${alumni.nama}

                    ${alumni.kampus?.nama || ""}

                    ${alumni.fakultas || ""}

                    ${alumni.jurusan || ""}

                    ${alumni.angkatan || ""}

                    ${alumni.jalur_masuk || ""}

                    ${alumni.prestasi || ""}

                `.toLowerCase();


                return teks.includes(
                    keyword
                );

            }
        );


    tampilkanAlumniHome(
        hasil
    );
}


loadAlumniHome();
async function loadStatistik() {

    const { data, error } = await db
        .from("alumni")
        .select(`
            id,
            angkatan,
            jurusan,
            prestasi,
            kampus_id
        `);

    if (error) {
        console.error("Gagal mengambil statistik:", error);
        return;
    }

    const alumni = data || [];

    // Ambil 5 tahun angkatan terbaru yang benar-benar ada
    const tahunTerbaru = [
        ...new Set(
            alumni
                .map(a => Number(a.angkatan))
                .filter(tahun => !isNaN(tahun))
        )
    ]
        .sort((a, b) => b - a)
        .slice(0, 5);

    // Hanya data alumni dari 5 tahun terbaru
    const alumni5Tahun = alumni.filter(a =>
        tahunTerbaru.includes(Number(a.angkatan))
    );

    // =========================
    // TOTAL ALUMNI
    // =========================

    const totalAlumni =
        alumni5Tahun.length;


    // =========================
    // TOTAL PERGURUAN TINGGI
    // =========================

    const totalKampus =
        new Set(
            alumni5Tahun
                .map(a => a.kampus_id)
                .filter(Boolean)
        ).size;


    // =========================
    // TOTAL JURUSAN
    // =========================

    const totalJurusan =
        new Set(
            alumni5Tahun
                .map(a => a.jurusan)
                .filter(Boolean)
        ).size;


    // =========================
    // TOTAL PRESTASI
    // =========================

    const totalPrestasi =
        alumni5Tahun.filter(a =>
            a.prestasi &&
            a.prestasi.trim() !== ""
        ).length;


    // =========================
    // TAMPILKAN KE HTML
    // =========================

    document.getElementById("totalAlumni").textContent =
        totalAlumni;

    document.getElementById("totalKampus").textContent =
        totalKampus;

    document.getElementById("totalJurusan").textContent =
        totalJurusan;

    document.getElementById("totalPrestasi").textContent =
        totalPrestasi;
}

loadStatistik();
