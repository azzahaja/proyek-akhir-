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

        console.error(error);

        document.getElementById(
            "kampusContainer"
        ).innerHTML = `
            <div class="empty-result">

                <h3>
                    Data kampus gagal dimuat
                </h3>

                <p>
                    Periksa koneksi Supabase.
                </p>

            </div>
        `;

        return;
    }


    semuaKampus = data || [];

    tampilkanKampus(
        semuaKampus
    );
}


/* =========================================
   TAMPILKAN KAMPUS
========================================= */

function tampilkanKampus(data) {

    const container =
        document.getElementById(
            "kampusContainer"
        );


    container.innerHTML = "";


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


    data.forEach(kampus => {

        const alumni =
            kampus.alumni || [];


        const jumlahAlumni =
            alumni.length;


        /* Fakultas */

        const fakultas =
            [
                ...new Set(
                    alumni
                        .map(item => item.fakultas)
                        .filter(Boolean)
                )
            ];


        /* Jurusan */

        const jurusan =
            [
                ...new Set(
                    alumni
                        .map(item => item.jurusan)
                        .filter(Boolean)
                )
            ];


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "kampus-card";


        card.innerHTML = `

    <div class="kampus-nama">
        <h3>${kampus.nama}</h3>
    </div>

    <p>
        📍 ${kampus.kota || "-"},
        ${kampus.provinsi || "-"}
    </p>

    <p>
        🏫 ${kampus.tipe || "-"}
    </p>

    <p>
        🏛 ${
            fakultas.length
            ? fakultas.join(", ")
            : "-"
        }
    </p>

    <p>
        📚 ${
            jurusan.length
            ? jurusan.join(", ")
            : "-"
        }
    </p>

    <span class="jumlah-alumni">
        ${jumlahAlumni} Alumni
    </span>

`;


        /*
         * Ketika kartu diklik,
         * masuk ke halaman alumni
         * dengan filter kampus.
         */

        card.addEventListener(
            "click",
            function() {

                window.location.href =
                    `alumni.html?kampus_id=${kampus.id}`;

            }
        );


        container.appendChild(
            card
        );

    });

}


loadKampus();