let semuaAlumniFakultas = [];

let daftarFakultas = [];


/* =========================================
   LOAD DATA ALUMNI
========================================= */

async function loadFakultas() {

    const { data, error } = await db
        .from("alumni")
        .select(`
            id,
            fakultas,
            jurusan,
            kampus (
                id,
                nama
            )
        `);


    if (error) {

        console.error(error);

        document.getElementById(
            "fakultasContainer"
        ).innerHTML = `
            <div class="empty-result">

                <h3>
                    Data fakultas gagal dimuat
                </h3>

                <p>
                    Periksa koneksi Supabase.
                </p>

            </div>
        `;

        return;
    }


    semuaAlumniFakultas =
        data || [];


    /* =====================================
       AMBIL NAMA FAKULTAS
    ====================================== */

    daftarFakultas =
        [
            ...new Set(
                semuaAlumniFakultas
                    .map(
                        alumni =>
                            alumni.fakultas
                    )
                    .filter(Boolean)
            )
        ]
        .sort();


    tampilkanFakultas();

}



/* =========================================
   TAMPILKAN FAKULTAS
========================================= */

function tampilkanFakultas() {

    const container =
        document.getElementById(
            "fakultasContainer"
        );


    container.innerHTML = "";


    if (
        daftarFakultas.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-result">

                <h3>
                    Belum ada data fakultas
                </h3>

                <p>
                    Data akan muncul setelah
                    alumni ditambahkan.
                </p>

            </div>
        `;

        return;
    }



    daftarFakultas.forEach(
        namaFakultas => {


            /* =================================
               ALUMNI DALAM FAKULTAS
            ================================== */

            const alumniFakultas =
                semuaAlumniFakultas.filter(
                    alumni =>
                        alumni.fakultas
                        ===
                        namaFakultas
                );



            /* =================================
               HITUNG KAMPUS
            ================================== */

            const kampusMap =
                new Map();


            alumniFakultas.forEach(
                alumni => {

                    if (
                        alumni.kampus
                    ) {

                        kampusMap.set(
                            alumni.kampus.id,
                            alumni.kampus.nama
                        );

                    }

                }
            );


            const daftarKampus =
                [
                    ...kampusMap.values()
                ];



            /* =================================
               BUAT CARD
            ================================== */

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "fakultas-card";


            card.innerHTML = `

                <h2>
                    ${namaFakultas}
                </h2>


                <p>
                    🏫 Kampus:
                    ${
                        daftarKampus.length
                        ?
                        daftarKampus.join(", ")
                        :
                        "-"
                    }
                </p>


                <p>
                    👥 Jumlah Alumni:
                    ${alumniFakultas.length}
                </p>


                <span class="jumlah-alumni">
                    Lihat Alumni
                </span>

            `;



            /* =================================
               KLIK CARD
            ================================== */

            card.addEventListener(
                "click",
                function() {

                    window.location.href =
                        `alumni.html?fakultas=${encodeURIComponent(
                            namaFakultas
                        )}`;

                }
            );


            container.appendChild(
                card
            );

        }
    );

}


loadFakultas();