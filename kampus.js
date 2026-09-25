let semuaKampus = [];


/* =========================================
   LOAD DATA KAMPUS
========================================= */

async function loadKampus() {

    const { data, error } = await db
        .from("kampus")
        .select(`
            id,
            nama,
            kota,
            provinsi,
            tipe,
            alumni (
                id,
                fakultas,
                jurusan
            )
        `)
        .order("nama", {
            ascending: true
        });


    if (error) {

        console.error("Error kampus:", error);

        const container =
            document.getElementById("kampusContainer");

        if (container) {
            container.innerHTML = `
                <div class="empty-result">

                    <h3>
                        Data kampus gagal dimuat
                    </h3>

                    <p>
                        Periksa koneksi Supabase.
                    </p>

                </div>
            `;
        }

        return;
    }


    semuaKampus = data || [];

    tampilkanKampus(semuaKampus);
}


/* =========================================
   TAMPILKAN KAMPUS
========================================= */

function tampilkanKampus(data) {

    const container =
        document.getElementById("kampusContainer");


    if (!container) {

        console.error(
            "kampusContainer tidak ditemukan."
        );

        return;
    }


    container.innerHTML = "";


    /* Jika tidak ada data */

    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-result">

                <h3>
                    Belum ada data kampus
                </h3>

                <p>
                    Data kampus akan muncul setelah
                    ditambahkan oleh admin.
                </p>

            </div>
        `;

        return;
    }


    /* =========================================
       LOOP SETIAP KAMPUS
    ========================================= */

    data.forEach(kampus => {

        const alumni =
            kampus.alumni || [];


        /* Jumlah alumni */

        const jumlahAlumni =
            alumni.length;


        /* =====================================
           AMBIL DATA FAKULTAS
        ===================================== */

        const fakultas = [
            ...new Set(
                alumni
                    .map(item => item.fakultas)
                    .filter(Boolean)
            )
        ];


        /* =====================================
           AMBIL DATA JURUSAN
        ===================================== */

        const jurusan = [
            ...new Set(
                alumni
                    .map(item => item.jurusan)
                    .filter(Boolean)
            )
        ];


        /* =====================================
           BUAT CARD
        ===================================== */

        const card =
            document.createElement("div");


        card.className =
            "kampus-card";


        card.innerHTML = `

            <!-- NAMA KAMPUS -->

            <div class="kampus-nama">

                <div class="kampus-icon">
                    🎓
                </div>

                <div>

                    <h3>
                        ${kampus.nama || "-"}
                    </h3>

                    <span class="kampus-tipe">
                        ${kampus.tipe || "Perguruan Tinggi"}
                    </span>

                </div>

            </div>


            <!-- INFORMASI KAMPUS -->

            <div class="kampus-info">

                <p>

                    <span>📍</span>

                    <span>
                        ${kampus.kota || "-"},
                        ${kampus.provinsi || "-"}
                    </span>

                </p>


                <p>

                    <span>🏫</span>

                    <span>
                        ${kampus.tipe || "-"}
                    </span>

                </p>

            </div>


            <!-- FAKULTAS -->

            <div class="kampus-fakultas">

                <p class="kampus-fakultas-title">
                    Fakultas
                </p>

                <ul class="kampus-fakultas-list">

                    ${
                        fakultas.length
                        ?
                        fakultas
                            .map(
                                item =>
                                    `<li>${item}</li>`
                            )
                            .join("")
                        :
                        `<li>Belum ada data</li>`
                    }

                </ul>

            </div>


            <!-- JURUSAN -->

            <div class="kampus-fakultas">

                <p class="kampus-fakultas-title">
                    Jurusan
                </p>

                <ul class="kampus-fakultas-list">

                    ${
                        jurusan.length
                        ?
                        jurusan
                            .map(
                                item =>
                                    `<li>${item}</li>`
                            )
                            .join("")
                        :
                        `<li>Belum ada data</li>`
                    }

                </ul>

            </div>


            <!-- JUMLAH ALUMNI -->

            <div class="kampus-card-footer">

                <span
                    class="jumlah-alumni"
                    title="Lihat alumni dari kampus ini"
                >
                    ${jumlahAlumni} Alumni
                </span>

            </div>

        `;


        /* =====================================
           TOMBOL JUMLAH ALUMNI
           
           HANYA BAGIAN JUMLAH ALUMNI
           YANG BISA DIKLIK
        ===================================== */

        const tombolAlumni =
            card.querySelector(
                ".jumlah-alumni"
            );


        if (tombolAlumni) {

            tombolAlumni.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();


                    window.location.href =
                        `alumni.html?kampus_id=${kampus.id}`;

                }
            );

        }


        /* =====================================
           MASUKKAN CARD KE CONTAINER
        ===================================== */

        container.appendChild(card);

    });

}


/* =========================================
   JALANKAN SAAT HALAMAN DIBUKA
========================================= */

loadKampus();