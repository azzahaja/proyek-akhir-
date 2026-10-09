console.log("admin.js berhasil dimuat");


/* =========================
   ELEMENT
========================= */

const loginSection =
    document.getElementById("loginSection");

const dashboardSection =
    document.getElementById("dashboardSection");

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

const logoutButton =
    document.getElementById("logoutButton");

const modal =
    document.getElementById("modal");

const modalContent =
    document.getElementById("modalContent");

const closeModal =
    document.getElementById("closeModal");

const tambahKampusButton =
    document.getElementById("tambahKampusButton");

const tambahAlumniButton =
    document.getElementById("tambahAlumniButton");


/* =========================
   CEK LOGIN
========================= */

async function cekLogin() {

    const {
        data,
        error
    } = await db.auth.getSession();

    if (error) {
        console.error(error);
        return;
    }

    if (data.session) {

        loginSection.style.display = "none";
        dashboardSection.style.display = "block";

        loadDashboard();

    } else {

        loginSection.style.display = "flex";
        dashboardSection.style.display = "none";

    }
}


/* =========================
   LOGIN
========================= */

loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        loginMessage.textContent =
            "Sedang login...";

        const {
            data,
            error
        } =
            await db.auth.signInWithPassword({
                email,
                password
            });

        if (error) {

            console.error(error);

            loginMessage.textContent =
                "Email atau password salah.";

            return;
        }

        loginMessage.textContent = "";

        cekLogin();

    }
);


/* =========================
   LOGOUT
========================= */

logoutButton.addEventListener(
    "click",
    async function() {

        await db.auth.signOut();

        cekLogin();

    }
);


/* =========================
   DASHBOARD
========================= */

async function loadDashboard() {

    await loadStatistik();

    await loadKampusAdmin();

    await loadAlumniAdmin();

}


/* =========================
   STATISTIK
========================= */

async function loadStatistik() {

    const {
        count: jumlahKampus
    } =
        await db
            .from("kampus")
            .select(
                "id",
                {
                    count: "exact",
                    head: true
                }
            );

    const {
        count: jumlahAlumni
    } =
        await db
            .from("alumni")
            .select(
                "id",
                {
                    count: "exact",
                    head: true
                }
            );

    document.getElementById(
        "totalKampus"
    ).textContent =
        jumlahKampus || 0;

    document.getElementById(
        "totalAlumni"
    ).textContent =
        jumlahAlumni || 0;
}


/* =========================
   LOAD KAMPUS
========================= */

async function loadKampusAdmin() {

    const {
        data,
        error
    } =
        await db
            .from("kampus")
            .select("*")
            .order(
                "nama",
                {
                    ascending: true
                }
            );

    if (error) {

        console.error(
            "Error kampus:",
            error
        );

        return;
    }

    const container =
        document.getElementById(
            "kampusAdminContainer"
        );

    container.innerHTML = "";

    data.forEach(kampus => {

        const card =
            document.createElement("div");

        card.className =
            "admin-card";

        card.innerHTML = `

            <div>

                <h3>
                    ${kampus.nama}
                </h3>

                <p>
                    ${kampus.kota || "-"},
                    ${kampus.provinsi || "-"}
                </p>

                <p>
                    ${kampus.tipe || "-"}
                </p>

            </div>

            <div class="admin-actions">

                <button
                    onclick="editKampus(${kampus.id})"
                >
                    Edit
                </button>

                <button
                    class="delete-button"
                    onclick="hapusKampus(${kampus.id})"
                >
                    Hapus
                </button>

            </div>

        `;

        container.appendChild(card);

    });
}


/* =========================
   LOAD ALUMNI
========================= */

async function loadAlumniAdmin() {

    const {
        data,
        error
    } =
        await db
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
                    nama
                )
            `)
            .order(
                "angkatan",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(
            "Error alumni:",
            error
        );

        return;
    }

    const container =
        document.getElementById(
            "alumniAdminContainer"
        );

    container.innerHTML = "";

    data.forEach(alumni => {

        const card =
            document.createElement("div");

        card.className =
            "admin-card";

        card.innerHTML = `

            <div>

                <h3>
                    ${alumni.nama}
                </h3>

                <p>
                    Kampus:
                    ${alumni.kampus?.nama || "-"}
                </p>

                <p>
                    Fakultas:
                    ${alumni.fakultas || "-"}
                </p>

                <p>
                    Jurusan:
                    ${alumni.jurusan || "-"}
                </p>

                <p>
                    Angkatan:
                    ${alumni.angkatan || "-"}
                </p>

                <p>
                    Jalur:
                    ${alumni.jalur_masuk || "-"}
                </p>

                <p>
                    Prestasi:
                    ${alumni.prestasi || "-"}
                </p>

            </div>

            <div class="admin-actions">

                <button
                    onclick="editAlumni(${alumni.id})"
                >
                    Edit
                </button>

                <button
                    class="delete-button"
                    onclick="hapusAlumni(${alumni.id})"
                >
                    Hapus
                </button>

            </div>

        `;

        container.appendChild(card);

    });
}


/* =========================
   MODAL
========================= */

function bukaModal(html) {

    modalContent.innerHTML = html;

    modal.style.display = "flex";
}


function tutupModal() {

    modal.style.display = "none";

    modalContent.innerHTML = "";

}


closeModal.addEventListener(
    "click",
    tutupModal
);


/* =========================
   TAMBAH KAMPUS
========================= */

tambahKampusButton.addEventListener(
    "click",
    function() {

        bukaModal(`

            <h2>Tambah Kampus</h2>

            
<form id="formKampus" class="admin-form">

                <label>Nama Kampus</label>

                <input
                    type="text"
                    id="namaKampus"
                    required
                >

                <label>Kota</label>

                <input
                    type="text"
                    id="kotaKampus"
                >

                <label>Provinsi</label>

                <input
                    type="text"
                    id="provinsiKampus"
                >

                <label>Tipe</label>

                <select id="tipeKampus">

                    <option value="PTN">
                        PTN
                    </option>

                    <option value="PTS">
                        PTS
                    </option>

                </select>

                <button type="submit">
                    Simpan Kampus
                </button>

            </form>

        `);


        document
            .getElementById("formKampus")
            .addEventListener(
                "submit",
                simpanKampus
            );

    }
);


/* =========================
   SIMPAN KAMPUS
========================= */

async function simpanKampus(event) {

    event.preventDefault();

    const nama =
        document.getElementById(
            "namaKampus"
        ).value.trim();

    const kota =
        document.getElementById(
            "kotaKampus"
        ).value.trim();

    const provinsi =
        document.getElementById(
            "provinsiKampus"
        ).value.trim();

    const tipe =
        document.getElementById(
            "tipeKampus"
        ).value;


    const {
        error
    } =
        await db
            .from("kampus")
            .insert([
                {
                    nama,
                    kota,
                    provinsi,
                    tipe
                }
            ]);


    if (error) {

        console.error(error);

        alert(
            "Data kampus gagal ditambahkan."
        );

        return;
    }


    alert(
        "Data kampus berhasil ditambahkan!"
    );

    tutupModal();

    loadDashboard();

}


/* =========================
   TAMBAH ALUMNI
========================= */

tambahAlumniButton.addEventListener(
    "click",
    async function() {

        const {
            data: kampus,
            error
        } =
            await db
                .from("kampus")
                .select("id, nama")
                .order(
                    "nama",
                    {
                        ascending: true
                    }
                );


        if (error) {

            console.error(error);

            alert(
                "Data kampus gagal dimuat."
            );

            return;
        }


        const pilihanKampus =
            kampus.map(item => `

                <option value="${item.id}">
                    ${item.nama}
                </option>

            `).join("");


        bukaModal(`

            <h2>Tambah Alumni</h2>

               
            <form id="formAlumni" class="admin-form">
                <label>Nama Alumni</label>

                <input
                    type="text"
                    id="namaAlumni"
                    required
                >


                <label>Kampus</label>

                <select
                    id="kampusAlumni"
                    required
                >

                    <option value="">
                        Pilih Kampus
                    </option>

                    ${pilihanKampus}

                </select>


                <label>Fakultas</label>

                <input
                    type="text"
                    id="fakultasAlumni"
                    required
                >


                <label>Jurusan</label>

                <input
                    type="text"
                    id="jurusanAlumni"
                    required
                >


                <label>Angkatan</label>

                <input
                    type="number"
                    id="angkatanAlumni"
                    required
                >


                <label>Jalur Masuk</label>

                <select
                    id="jalurAlumni"
                    required
                >

                    <option value="">
                        Pilih Jalur
                    </option>

                    <option value="SNBP">
                        SNBP
                    </option>

                    <option value="SNBT">
                        SNBT
                    </option>

                    <option value="Mandiri">
                        Mandiri
                    </option>

                    <option value="Lainnya">
                        Lainnya
                    </option>

                </select>


                <label>Prestasi</label>

                <input
                    type="text"
                    id="prestasiAlumni"
                    placeholder="Opsional"
                >


                <button type="submit">
                    Simpan Alumni
                </button>

            </form>

        `);


        document
            .getElementById("formAlumni")
            .addEventListener(
                "submit",
                simpanAlumni
            );

    }
);


/* =========================
   SIMPAN ALUMNI
========================= */

async function simpanAlumni(event) {

    event.preventDefault();


    const nama =
        document.getElementById(
            "namaAlumni"
        ).value.trim();


    const kampus_id =
        document.getElementById(
            "kampusAlumni"
        ).value;


    const fakultas =
        document.getElementById(
            "fakultasAlumni"
        ).value.trim();


    const jurusan =
        document.getElementById(
            "jurusanAlumni"
        ).value.trim();


    const angkatan =
        document.getElementById(
            "angkatanAlumni"
        ).value;


    const jalur_masuk =
        document.getElementById(
            "jalurAlumni"
        ).value;


    const prestasi =
        document.getElementById(
            "prestasiAlumni"
        ).value.trim();


    const {
        error
    } =
        await db
            .from("alumni")
            .insert([

                {
                    nama,
                    kampus_id,
                    fakultas,
                    jurusan,
                    angkatan,
                    jalur_masuk,
                    prestasi:
                        prestasi || null
                }

            ]);


    if (error) {

        console.error(error);

        alert(
            "Data alumni gagal ditambahkan."
        );

        return;
    }


    alert(
        "Data alumni berhasil ditambahkan!"
    );


    tutupModal();

    loadDashboard();

}


/* =========================
   HAPUS KAMPUS
========================= */

async function hapusKampus(id) {

    const yakin =
        confirm(
            "Yakin ingin menghapus kampus ini?"
        );


    if (!yakin) return;


    const {
        error
    } =
        await db
            .from("kampus")
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(error);

        alert(
            "Kampus gagal dihapus. Jika masih memiliki alumni, hapus atau pindahkan data alumninya terlebih dahulu."
        );

        return;
    }


    alert(
        "Kampus berhasil dihapus."
    );


    loadDashboard();

}


/* =========================
   HAPUS ALUMNI
========================= */

async function hapusAlumni(id) {

    const yakin =
        confirm(
            "Yakin ingin menghapus alumni ini?"
        );


    if (!yakin) return;


    const {
        error
    } =
        await db
            .from("alumni")
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(error);

        alert(
            "Alumni gagal dihapus."
        );

        return;
    }


    alert(
        "Alumni berhasil dihapus."
    );


    loadDashboard();

}


/* =========================
   EDIT KAMPUS
========================= */

async function editKampus(id) {

    const {
        data,
        error
    } =
        await db
            .from("kampus")
            .select("*")
            .eq(
                "id",
                id
            )
            .single();


    if (error) {

        console.error(error);

        return;
    }


    bukaModal(`

        <h2>Edit Kampus</h2>

        
<form id="formEditKampus" 
class="admin-form">

            <label>Nama Kampus</label>

            <input
                type="text"
                id="editNamaKampus"
                value="${data.nama || ""}"
                required
            >

            <label>Kota</label>

            <input
                type="text"
                id="editKotaKampus"
                value="${data.kota || ""}"
            >

            <label>Provinsi</label>

            <input
                type="text"
                id="editProvinsiKampus"
                value="${data.provinsi || ""}"
            >

            <label>Tipe</label>

            <select id="editTipeKampus">

                <option value="PTN"
                    ${data.tipe === "PTN" ? "selected" : ""}>
                    PTN
                </option>

                <option value="PTS"
                    ${data.tipe === "PTS" ? "selected" : ""}>
                    PTS
                </option>

            </select>

            <button type="submit">
                Simpan Perubahan
            </button>

        </form>

    `);


    document
        .getElementById("formEditKampus")
        .addEventListener(
            "submit",
            async function(event) {

                event.preventDefault();


                const {
                    error
                } =
                    await db
                        .from("kampus")
                        .update({

                            nama:
                                document
                                    .getElementById(
                                        "editNamaKampus"
                                    )
                                    .value
                                    .trim(),

                            kota:
                                document
                                    .getElementById(
                                        "editKotaKampus"
                                    )
                                    .value
                                    .trim(),

                            provinsi:
                                document
                                    .getElementById(
                                        "editProvinsiKampus"
                                    )
                                    .value
                                    .trim(),

                            tipe:
                                document
                                    .getElementById(
                                        "editTipeKampus"
                                    )
                                    .value

                        })
                        .eq(
                            "id",
                            id
                        );


                if (error) {

                    console.error(error);

                    alert(
                        "Data gagal diperbarui."
                    );

                    return;
                }


                alert(
                    "Data berhasil diperbarui!"
                );


                tutupModal();

                loadDashboard();

            }
        );

}


/* =========================
   EDIT ALUMNI
========================= */

async function editAlumni(id) {

    const {
        data: alumni,
        error: alumniError
    } =
        await db
            .from("alumni")
            .select("*")
            .eq(
                "id",
                id
            )
            .single();


    if (alumniError) {

        console.error(alumniError);

        return;
    }


    const {
        data: kampus
    } =
        await db
            .from("kampus")
            .select("id, nama")
            .order(
                "nama",
                {
                    ascending: true
                }
            );


    const pilihanKampus =
        kampus.map(item => `

            <option
                value="${item.id}"
                ${item.id == alumni.kampus_id
                    ? "selected"
                    : ""}
            >
                ${item.nama}
            </option>

        `).join("");


    bukaModal(`

        <h2>Edit Alumni</h2>

        <form id="formEditAlumni"
         class="admin-form">

            <label>Nama Alumni</label>

            <input
                type="text"
                id="editNamaAlumni"
                value="${alumni.nama || ""}"
                required
            >

            <label>Kampus</label>

            <select
                id="editKampusAlumni"
                required
            >
                ${pilihanKampus}
            </select>

            <label>Fakultas</label>

            <input
                type="text"
                id="editFakultasAlumni"
                value="${alumni.fakultas || ""}"
                required
            >

            <label>Jurusan</label>

            <input
                type="text"
                id="editJurusanAlumni"
                value="${alumni.jurusan || ""}"
                required
            >

            <label>Angkatan</label>

            <input
                type="number"
                id="editAngkatanAlumni"
                value="${alumni.angkatan || ""}"
                required
            >

            <label>Jalur Masuk</label>

            <select
                id="editJalurAlumni"
                required
            >

                <option
                    value="SNBP"
                    ${alumni.jalur_masuk === "SNBP"
                        ? "selected"
                        : ""}
                >
                    SNBP
                </option>

                <option
                    value="SNBT"
                    ${alumni.jalur_masuk === "SNBT"
                        ? "selected"
                        : ""}
                >
                    SNBT
                </option>

                <option
                    value="Mandiri"
                    ${alumni.jalur_masuk === "Mandiri"
                        ? "selected"
                        : ""}
                >
                    Mandiri
                </option>

                <option
                    value="Lainnya"
                    ${alumni.jalur_masuk === "Lainnya"
                        ? "selected"
                        : ""}
                >
                    Lainnya
                </option>

            </select>

            <label>Prestasi</label>

            <input
                type="text"
                id="editPrestasiAlumni"
                value="${alumni.prestasi || ""}"
            >

            <button type="submit">
                Simpan Perubahan
            </button>

        </form>

    `);


    document
        .getElementById("formEditAlumni")
        .addEventListener(
            "submit",
            async function(event) {

                event.preventDefault();


                const {
                    error
                } =
                    await db
                        .from("alumni")
                        .update({

                            nama:
                                document
                                    .getElementById(
                                        "editNamaAlumni"
                                    )
                                    .value
                                    .trim(),

                            kampus_id:
                                document
                                    .getElementById(
                                        "editKampusAlumni"
                                    )
                                    .value,

                            fakultas:
                                document
                                    .getElementById(
                                        "editFakultasAlumni"
                                    )
                                    .value
                                    .trim(),

                            jurusan:
                                document
                                    .getElementById(
                                        "editJurusanAlumni"
                                    )
                                    .value
                                    .trim(),

                            angkatan:
                                document
                                    .getElementById(
                                        "editAngkatanAlumni"
                                    )
                                    .value,

                            jalur_masuk:
                                document
                                    .getElementById(
                                        "editJalurAlumni"
                                    )
                                    .value,

                            prestasi:
                                document
                                    .getElementById(
                                        "editPrestasiAlumni"
                                    )
                                    .value
                                    .trim() || null

                        })
                        .eq(
                            "id",
                            id
                        );


                if (error) {

                    console.error(error);

                    alert(
                        "Data alumni gagal diperbarui."
                    );

                    return;
                }


                alert(
                    "Data alumni berhasil diperbarui!"
                );


                tutupModal();

                loadDashboard();

            }
        );

}



/* =========================
   MULAI
========================= */

cekLogin();
/* ================================
   IMPORT CSV
================================ */

let dataCSV = [];


/* ================================
   TOMBOL PREVIEW CSV
================================ */

document
    .getElementById("previewCsvBtn")
    ?.addEventListener("click", previewCSV);


/* ================================
   BACA FILE CSV
================================ */

function previewCSV() {

    const fileInput = document.getElementById("csvFile");
    const preview = document.getElementById("csvPreview");

    preview.innerHTML = "";

    if (!fileInput.files.length) {

        preview.innerHTML = `
            <div class="import-error">
                Silakan pilih file CSV terlebih dahulu.
            </div>
        `;

        return;
    }

    const file = fileInput.files[0];

    if (!file.name.toLowerCase().endsWith(".csv")) {

        preview.innerHTML = `
            <div class="import-error">
                File harus berformat CSV.
            </div>
        `;

        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {

        const text = event.target.result;

        const rows = parseCSV(text);

        if (rows.length < 2) {

            preview.innerHTML = `
                <div class="import-error">
                    File CSV tidak memiliki data.
                </div>
            `;

            return;
        }

        const headers = rows[0].map(header =>
            header.trim().toLowerCase()
        );

        const kolomWajib = [
            "nama",
            "kampus_id",
            "fakultas",
            "jurusan",
            "angkatan",
            "jalur_masuk",
            "prestasi"
        ];

        const kolomKurang = kolomWajib.filter(
            kolom => !headers.includes(kolom)
        );

        if (kolomKurang.length > 0) {

            preview.innerHTML = `
                <div class="import-error">
                    <strong>Kolom CSV tidak lengkap.</strong><br>
                    Kolom yang kurang:
                    ${kolomKurang.join(", ")}
                </div>
            `;

            return;
        }

        dataCSV = rows
            .slice(1)
            .filter(row =>
                row.some(value => value.trim() !== "")
            )
            .map(row => {

                const data = {};

                headers.forEach((header, index) => {
                    data[header] = row[index]
                        ? row[index].trim()
                        : "";
                });

                return data;
            });

        tampilkanPreviewCSV(dataCSV);
    };

    reader.readAsText(file);
}


/* ================================
   PARSER CSV
   Mendukung , dan ;
================================ */

function parseCSV(text) {

    const baris = text
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .split("\n")
        .filter(baris => baris.trim() !== "");

    if (baris.length === 0) {
        return [];
    }

    const pemisah = baris[0].includes(";")
        ? ";"
        : ",";

    return baris.map(baris => {

        const hasil = [];

        let nilai = "";
        let dalamKutipan = false;

        for (let i = 0; i < baris.length; i++) {

            const karakter = baris[i];
            const berikutnya = baris[i + 1];

            if (
                karakter === '"' &&
                dalamKutipan &&
                berikutnya === '"'
            ) {
                nilai += '"';
                i++;
            }

            else if (karakter === '"') {
                dalamKutipan = !dalamKutipan;
            }

            else if (
                karakter === pemisah &&
                !dalamKutipan
            ) {
                hasil.push(nilai.trim());
                nilai = "";
            }

            else {
                nilai += karakter;
            }
        }

        hasil.push(nilai.trim());

        return hasil;
    });
}


/* ================================
   TAMPILKAN PREVIEW
================================ */

function tampilkanPreviewCSV(data) {

    const preview = document.getElementById("csvPreview");

    if (!data.length) {

        preview.innerHTML = `
            <div class="import-error">
                Tidak ada data yang dapat diimport.
            </div>
        `;

        return;
    }

    let html = `
        <div class="import-success">
            <strong>${data.length} data ditemukan.</strong>
            Silakan periksa data sebelum melakukan import.
        </div>

        <table>

            <thead>
                <tr>
                    <th>Nama</th>
                    <th>Kampus ID</th>
                    <th>Fakultas</th>
                    <th>Jurusan</th>
                    <th>Angkatan</th>
                    <th>Jalur Masuk</th>
                    <th>Prestasi</th>
                </tr>
            </thead>

            <tbody>
    `;

    data.slice(0, 10).forEach(alumni => {

        html += `
            <tr>
                <td>${alumni.nama}</td>

                <td>${alumni.kampus_id}</td>

                <td>${alumni.fakultas}</td>

                <td>${alumni.jurusan}</td>

                <td>${alumni.angkatan}</td>

                <td>${alumni.jalur_masuk}</td>

                <td>${alumni.prestasi || "-"}</td>
            </tr>
        `;
    });

    html += `
            </tbody>

        </table>

        <button
            type="button"
            class="admin-button"
            onclick="importDataCSV()"
            style="margin-top:15px;"
        >
            Import ${data.length} Data
        </button>
    `;

    preview.innerHTML = html;
}
/* ================================
   IMPORT DATA KE SUPABASE
================================ */

async function importDataCSV() {

    const preview = document.getElementById("csvPreview");

    if (!dataCSV || dataCSV.length === 0) {
        preview.innerHTML += `
            <div class="import-error">
                Tidak ada data yang dapat diimport.
            </div>
        `;
        return;
    }

    /* Ubah data CSV menjadi format tabel alumni */

    const dataImport = dataCSV.map(alumni => ({
    nama: alumni.nama?.trim() || null,

    kampus_id: alumni.kampus_id?.trim()
        ? Number(alumni.kampus_id)
        : null,

    fakultas: alumni.fakultas?.trim() || null,

    jurusan: alumni.jurusan?.trim() || null,

    angkatan: alumni.angkatan?.trim()
        ? Number(alumni.angkatan)
        : null,

    jalur_masuk: alumni.jalur_masuk?.trim() || null,

    prestasi: alumni.prestasi?.trim() || null
}));


    /* ================================
       VALIDASI DATA
    ================================= */

    const dataTidakValid = dataImport.filter(alumni => {
    return !alumni.nama;
});


    if (dataTidakValid.length > 0) {

    preview.innerHTML += `
        <div class="import-error">
            Ada <strong>${dataTidakValid.length}</strong>
            data yang tidak valid.
            <br><br>
            Kolom <strong>nama</strong> wajib diisi.
        </div>
    `;

    return;
}


    /* ================================
       CEK KAMPUS ID
    ================================= */

    const daftarKampus = [
        ...new Set(
            dataImport.map(alumni => alumni.kampus_id)
        )
    ];

    const { data: kampusAda, error: errorKampus } = await db
        .from("kampus")
        .select("id")
        .in("id", daftarKampus);


    if (errorKampus) {

        console.error("Error cek kampus:", errorKampus);

        preview.innerHTML += `
            <div class="import-error">
                Gagal mengecek kampus.
                <br>
                ${errorKampus.message}
            </div>
        `;

        return;
    }


    const idKampusAda = kampusAda.map(kampus => kampus.id);

    const idKampusTidakAda = daftarKampus.filter(
        id => !idKampusAda.includes(id)
    );


    if (idKampusTidakAda.length > 0) {

        preview.innerHTML += `
            <div class="import-error">
                <strong>Import dibatalkan.</strong>
                <br><br>
                Kampus ID berikut tidak ditemukan di Supabase:
                <strong>${idKampusTidakAda.join(", ")}</strong>
                <br><br>
                Periksa kembali kolom kampus_id pada CSV.
            </div>
        `;

        return;
    }


    /* ================================
       KIRIM KE SUPABASE
    ================================= */

    preview.innerHTML += `
        <div class="import-success">
            Sedang mengimport ${dataImport.length} data...
        </div>
    `;


    const { data, error } = await db
        .from("alumni")
        .insert(dataImport)
        .select();


    /* ================================
       JIKA ERROR
    ================================= */

    if (error) {

        console.error("Error import alumni:", error);

        preview.innerHTML += `
            <div class="import-error">
                <strong>Import gagal.</strong>
                <br><br>
                ${error.message}
            </div>
        `;

        return;
    }


    /* ================================
       BERHASIL
    ================================= */

    preview.innerHTML += `
        <div class="import-success">
            <strong>Import berhasil!</strong>
            <br>
            ${data.length} data alumni berhasil ditambahkan ke Supabase.
        </div>
    `;


    /* Kosongkan file */

    document.getElementById("csvFile").value = "";

    dataCSV = [];
}