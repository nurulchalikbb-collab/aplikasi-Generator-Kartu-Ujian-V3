// ==========================================
// 1. STATE & KONFIGURASI UTAMA APLIKASI
// ==========================================
let paperSize = 'A4'; // 'A4' (6 kartu/lembar) atau 'F4' (8 kartu/lembar)
let activeSinglePhotoNisn = null;
const STORAGE_KEY = 'kartu_ujian_v3_saved_project';

// Data SVG Default (Logo & TTD Contoh agar langsung terlihat rapi saat dibuka)
const defaultLogoLeft = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,5 90,27 90,73 50,95 10,73 10,27" fill="#065f46" stroke="#fbbf24" stroke-width="4"/><circle cx="50" cy="50" r="22" fill="#fbbf24"/><text x="50" y="56" font-family="Arial" font-size="16" font-weight="bold" fill="#065f46" text-anchor="middle">KEMENAG</text></svg>`);
const defaultLogoRight = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#047857" stroke="#10b981" stroke-width="4"/><path d="M30 62 L50 32 L70 62 Z" fill="#ffffff"/><circle cx="50" cy="26" r="6" fill="#fbbf24"/></svg>`);
const defaultTtdSvg = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60"><path d="M15,45 C30,10 45,50 60,25 C70,10 75,45 95,30 C110,20 125,42 145,35" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/></svg>`);
const defaultStempelSvg = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="#6d28d9" stroke-width="3" opacity="0.75"/><circle cx="50" cy="50" r="34" fill="none" stroke="#6d28d9" stroke-width="1.5" opacity="0.75"/><text x="50" y="47" font-family="Arial" font-size="9" font-weight="bold" fill="#6d28d9" text-anchor="middle" opacity="0.8">MADRASAH</text><text x="50" y="59" font-family="Arial" font-size="8" font-weight="bold" fill="#6d28d9" text-anchor="middle" opacity="0.8">NUSANTARA</text></svg>`);

const config = {
    instansi: "KEMENTERIAN AGAMA REPUBLIK INDONESIA",
    sekolah: "MADRASAH TSANAWIYAH NEGERI 1 NUSANTARA",
    alamat: "Jl. Pendidikan Raya No. 45, Kota Nusantara • Telp. (021) 555-0192",
    judul: "KARTU PESERTA ASESMEN MADRASAH",
    tapel: "TAHUN PELAJARAN 2025/2026",
    accentColor: "#065f46",
    tgl: "Nusantara, 12 Mei 2026",
    jabatan: "Kepala Madrasah,",
    kamad: "Dr. H. Ahmad Muzakki, M.Pd.I",
    nip: "NIP. 19780415 200501 1 004",
    catatan: "• Kartu wajib dibawa selama ujian berlangsung.\n• Peserta hadir 15 menit sebelum ujian dimulai.",
    logoLeft: defaultLogoLeft,
    logoRight: defaultLogoRight,
    ttdImg: defaultTtdSvg,
    stempelImg: defaultStempelSvg
};

// Penyimpanan Foto Berbasis NISN
const photoMap = {};

// Data Contoh Awal (4 Peserta)
let students = [
    { nopes: "01-001-001-8", nisn: "0091234501", nis: "23001", nama: "MUHAMMAD RIZKY PRATAMA", ttl: "Jakarta, 14 Maret 2010", kelas: "IX-A", ruang: "Ruang 01" },
    { nopes: "01-001-002-7", nisn: "0091234502", nis: "23002", nama: "AISYAH PUTRI RAMADHANI", ttl: "Bandung, 22 Agustus 2010", kelas: "IX-A", ruang: "Ruang 01" },
    { nopes: "01-001-003-6", nisn: "0091234503", nis: "23003", nama: "FAJAR NUGROHO SAPUTRA", ttl: "Surabaya, 05 Januari 2010", kelas: "IX-B", ruang: "Ruang 02" },
    { nopes: "01-001-004-5", nisn: "0091234504", nis: "23004", nama: "ZAHRA SALSABILA KHAIRUNNISA", ttl: "Yogyakarta, 19 November 2010", kelas: "IX-B", ruang: "Ruang 02" }
];

// ==========================================
// 2. INISIALISASI & SIMPAN / MUAT PROYEK
// ==========================================
window.onload = function() {
    loadProjectFromLocal();
    syncFormWithConfig();
    syncImagePreviews();
    updateClassFilterOptions();
    renderAll();
};

function syncFormWithConfig() {
    document.getElementById('cfg-instansi').value = config.instansi;
    document.getElementById('cfg-sekolah').value = config.sekolah;
    document.getElementById('cfg-alamat').value = config.alamat;
    document.getElementById('cfg-judul').value = config.judul;
    document.getElementById('cfg-tapel').value = config.tapel;
    document.getElementById('cfg-color').value = config.accentColor;
    document.getElementById('cfg-tgl').value = config.tgl;
    document.getElementById('cfg-jabatan').value = config.jabatan;
    document.getElementById('cfg-kamad').value = config.kamad;
    document.getElementById('cfg-nip').value = config.nip;
    document.getElementById('cfg-catatan').value = config.catatan;
}

function saveProjectToLocal() {
    try {
        const payload = {
            savedAt: new Date().toISOString(),
            paperSize: paperSize,
            config: config,
            students: students
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        showToast("Pengaturan kop, TTD & daftar peserta berhasil disimpan!", "success");
    } catch (err) {
        showToast("Gagal menyimpan ke penyimpanan browser. Gunakan tombol Unduh Cadangan (.json).", "warning");
        console.error(err);
    }
}

function loadProjectFromLocal() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const saved = JSON.parse(raw);
        if (saved.config) Object.assign(config, saved.config);
        if (Array.isArray(saved.students)) students = saved.students;
        if (saved.paperSize) setPaperSize(saved.paperSize);
    } catch (err) {
        console.error("Gagal memuat data tersimpan:", err);
    }
}

function exportProjectFile() {
    try {
        const payload = {
            app: "Generator Kartu Ujian V3",
            exportedAt: new Date().toISOString(),
            paperSize: paperSize,
            config: config,
            students: students
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Backup_Kartu_Ujian_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("File cadangan proyek (.json) berhasil diunduh!", "success");
    } catch (err) {
        showToast("Gagal mengekspor file cadangan.", "error");
    }
}

function importProjectFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.config) Object.assign(config, imported.config);
            if (Array.isArray(imported.students)) students = imported.students;
            if (imported.paperSize) setPaperSize(imported.paperSize);

            syncFormWithConfig();
            syncImagePreviews();
            updateClassFilterOptions();
            updatePhotoMatchBadge();
            renderAll();
            saveProjectToLocal();
            showToast("File cadangan proyek berhasil dipulihkan!", "success");
        } catch (err) {
            showToast("Format file cadangan (.json) tidak valid.", "error");
        }
    };
    reader.readAsText(file);
    event.target.value = "";
}

// ==========================================
// 3. NAVIGASI TAB, UKURAN KERTAS, CETAK & PDF
// ==========================================
function switchTab(tabName) {
    const tabs = ['data', 'kop', 'ttd'];
    tabs.forEach(t => {
        const btn = document.getElementById(`tab-btn-${t}`);
        const panel = document.getElementById(`tab-panel-${t}`);
        if (!btn || !panel) return;

        if (t === tabName) {
            btn.classList.add('text-emerald-700', 'border-emerald-600', 'bg-white');
            btn.classList.remove('text-slate-500', 'border-transparent');
            panel.classList.remove('hidden');
        } else {
            btn.classList.remove('text-emerald-700', 'border-emerald-600', 'bg-white');
            btn.classList.add('text-slate-500', 'border-transparent');
            panel.classList.add('hidden');
        }
    });
}

function setPaperSize(size) {
    paperSize = size === 'F4' ? 'F4' : 'A4';
    const btnA4 = document.getElementById('btn-paper-a4');
    const btnF4 = document.getElementById('btn-paper-f4');
    const label = document.getElementById('print-paper-label');

    if (paperSize === 'A4') {
        btnA4.className = "px-3 py-1.5 rounded-lg font-bold bg-white text-emerald-900 shadow-sm transition";
        btnF4.className = "px-3 py-1.5 rounded-lg font-semibold text-emerald-100 hover:text-white transition";
    } else {
        btnF4.className = "px-3 py-1.5 rounded-lg font-bold bg-white text-emerald-900 shadow-sm transition";
        btnA4.className = "px-3 py-1.5 rounded-lg font-semibold text-emerald-100 hover:text-white transition";
    }

    if (label) label.textContent = paperSize;
    renderAll();
}

function printCards() {
    const sheetsHtml = document.getElementById('sheets-wrapper').innerHTML;
    if (!sheetsHtml || getFilteredStudents().length === 0) {
        showToast("Tidak ada kartu untuk dicetak.", "warning");
        return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (printWindow) {
        const pageDimensions = paperSize === 'F4' ? '215mm 330mm' : '210mm 297mm';
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8">
                <title>Cetak Kartu Ujian (${paperSize})</title>
                <script src="https://cdn.tailwindcss.com"><\/script>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                <link rel="stylesheet" href="style.css">
                <style>
                    @page { size: ${pageDimensions}; margin: 4mm; }
                    body { background: #ffffff; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    .paper-sheet { box-shadow: none !important; margin: 0 auto !important; padding: 2mm 0 !important; min-height: auto !important; page-break-after: always; break-after: page; }
                    .paper-sheet:last-child { page-break-after: auto; break-after: auto; }
                    .exam-card { border: 1.5px solid #000000 !important; }
                    .no-print { display: none !important; }
                </style>
            </head>
            <body>
                ${sheetsHtml}
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.focus();
                            window.print();
                        }, 600);
                    };
                <\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
    } else {
        window.print();
    }
}

async function downloadPDF() {
    const filtered = getFilteredStudents();
    if (filtered.length === 0) {
        showToast("Tidak ada kartu untuk diunduh sebagai PDF.", "warning");
        return;
    }

    if (typeof html2pdf === 'undefined') {
        showToast("Modul PDF sedang dimuat, silakan coba beberapa detik lagi.", "warning");
        return;
    }

    const btn = document.getElementById('btn-download-pdf');
    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i><span>Membuat PDF...</span>`;
    showToast(`Sedang merender ${filtered.length} kartu ke file PDF (${paperSize})...`, "info");

    try {
        const sourceWrapper = document.getElementById('sheets-wrapper');
        const cloneContainer = document.createElement('div');
        cloneContainer.style.background = '#ffffff';
        cloneContainer.style.width = paperSize === 'F4' ? '215mm' : '210mm';

        const sheets = sourceWrapper.querySelectorAll('.paper-sheet');
        sheets.forEach((sheet, idx) => {
            const clonedSheet = sheet.cloneNode(true);
            clonedSheet.style.boxShadow = 'none';
            clonedSheet.style.margin = '0';
            clonedSheet.style.padding = '5mm 0';
            clonedSheet.style.minHeight = 'auto';
            if (idx < sheets.length - 1) {
                clonedSheet.style.pageBreakAfter = 'always';
            }
            cloneContainer.appendChild(clonedSheet);
        });

        const pdfFormat = paperSize === 'F4' ? [215, 330] : 'a4';
        const opt = {
            margin: [3, 0, 3, 0],
            filename: `Kartu_Ujian_${paperSize}_${new Date().toISOString().slice(0, 10)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false },
            jsPDF: { unit: 'mm', format: pdfFormat, orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'] }
        };

        await html2pdf().set(opt).from(cloneContainer).save();
        showToast("File PDF Kartu Ujian berhasil diunduh!", "success");
    } catch (err) {
        console.error("PDF Export Error:", err);
        showToast("Gagal membuat file PDF. Silakan gunakan tombol Cetak.", "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const colors = {
        success: 'bg-emerald-700 text-white border-emerald-800',
        error: 'bg-rose-600 text-white border-rose-700',
        warning: 'bg-amber-500 text-slate-950 border-amber-600',
        info: 'bg-slate-800 text-white border-slate-900'
    };

    const icons = {
        success: 'fa-circle-check',
        error: 'fa-circle-exclamation',
        warning: 'fa-triangle-exclamation',
        info: 'fa-circle-info'
    };

    const toast = document.createElement('div');
    toast.className = `px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2.5 transform transition-all duration-300 translate-x-0 ${colors[type] || colors.info}`;
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info} text-sm"></i><span>${escapeHtml(message)}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-x-4');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ==========================================
// 4. DOWNLOAD TEMPLATE & IMPORT EXCEL (.XLSX)
// ==========================================
function downloadExcelTemplate() {
    if (typeof XLSX === 'undefined') {
        showToast("Library Excel sedang dimuat, silakan coba beberapa detik lagi.", "warning");
        return;
    }

    const sampleRows = [
        {
            "No Peserta": "01-001-001-8",
            "NISN": "0091234501",
            "NIS": "23001",
            "Nama Lengkap": "MUHAMMAD RIZKY PRATAMA",
            "Tempat Tanggal Lahir": "Jakarta, 14 Maret 2010",
            "Kelas": "IX-A",
            "Ruang": "Ruang 01"
        },
        {
            "No Peserta": "01-001-002-7",
            "NISN": "0091234502",
            "NIS": "23002",
            "Nama Lengkap": "AISYAH PUTRI RAMADHANI",
            "Tempat Tanggal Lahir": "Bandung, 22 Agustus 2010",
            "Kelas": "IX-A",
            "Ruang": "Ruang 01"
        }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleRows);
    worksheet['!cols'] = [
        { wch: 16 }, { wch: 14 }, { wch: 10 },
        { wch: 28 }, { wch: 24 }, { wch: 10 }, { wch: 12 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data_Peserta");
    XLSX.writeFile(workbook, "Template_Kartu_Ujian_V3.xlsx");
    showToast("Template Excel berhasil diunduh!", "success");
}

function handleExcelUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (typeof XLSX === 'undefined') {
        showToast("Library Excel belum siap. Periksa koneksi internet Anda.", "error");
        return;
    }

    const statusEl = document.getElementById('excel-status');
    statusEl.textContent = "Membaca file Excel...";

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

            if (!rows || rows.length === 0) {
                showToast("File Excel kosong atau tidak memiliki baris data.", "warning");
                statusEl.textContent = "File Excel kosong";
                return;
            }

            const mappedStudents = rows.map((row, idx) => {
                const normalized = {};
                Object.keys(row).forEach(k => {
                    normalized[k.toLowerCase().replace(/[^a-z0-9]/g, '')] = String(row[k]).trim();
                });

                const nopes = normalized.nopeserta || normalized.nomorpeserta || normalized.nopes || `01-001-${String(idx + 1).padStart(3, '0')}`;
                const nisn = normalized.nisn || "";
                const nis = normalized.nis || normalized.nomorinduk || "-";
                const nama = (normalized.namalengkap || normalized.nama || normalized.namapeserta || `PESERTA ${idx + 1}`).toUpperCase();
                const ttl = normalized.tempattanggallahir || normalized.ttl || normalized.tanggallahir || "-";
                const kelas = normalized.kelas || normalized.rombel || "-";
                const ruang = normalized.ruang || normalized.ruangujian || "Ruang 01";

                return { nopes, nisn, nis, nama, ttl, kelas, ruang };
            }).filter(s => s.nama && s.nama !== "");

            students = mappedStudents;
            statusEl.textContent = `Berhasil memuat ${students.length} peserta dari ${file.name}`;
            statusEl.classList.add('text-emerald-700', 'font-semibold');

            updateClassFilterOptions();
            updatePhotoMatchBadge();
            renderAll();
            showToast(`${students.length} data peserta berhasil diimpor dari Excel!`, "success");
        } catch (err) {
            statusEl.textContent = "Gagal membaca file Excel.";
            showToast("Format file Excel tidak didukung atau rusak.", "error");
            console.error(err);
        }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = "";
}

// ==========================================
// 5. EKSTRAK FOTO MASSAL VIA ZIP (JSZIP)
// ==========================================
async function handleZipUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const zipStatusEl = document.getElementById('zip-status');
    zipStatusEl.textContent = "Mengekstrak arsip ZIP...";

    try {
        const zip = await JSZip.loadAsync(file);
        let extractedCount = 0;
        const imagePromises = [];

        zip.forEach((relativePath, zipEntry) => {
            if (zipEntry.dir || relativePath.includes('__MACOSX') || relativePath.startsWith('.')) {
                return;
            }

            if (/\.(jpe?g|png|webp)$/i.test(zipEntry.name)) {
                const fileNameOnly = zipEntry.name.split('/').pop();
                const nisnKey = fileNameOnly.replace(/\.[^/.]+$/, "").trim();

                if (nisnKey) {
                    const promise = zipEntry.async("blob").then(blob => {
                        if (photoMap[nisnKey] && photoMap[nisnKey].startsWith('blob:')) {
                            URL.revokeObjectURL(photoMap[nisnKey]);
                        }
                        photoMap[nisnKey] = URL.createObjectURL(blob);
                        extractedCount++;
                    });
                    imagePromises.push(promise);
                }
            }
        });

        await Promise.all(imagePromises);

        zipStatusEl.textContent = `Selesai: ${extractedCount} file foto diekstrak dari ZIP`;
        zipStatusEl.classList.add('text-blue-700', 'font-semibold');

        updatePhotoMatchBadge();
        renderAll();
        showToast(`${extractedCount} foto berhasil diekstrak & dicocokkan dengan NISN!`, "success");
    } catch (err) {
        zipStatusEl.textContent = "Gagal mengekstrak file ZIP.";
        showToast("File ZIP rusak atau tidak dapat dibaca.", "error");
        console.error(err);
    }
    event.target.value = "";
}

function updatePhotoMatchBadge() {
    let matched = 0;
    students.forEach(s => {
        if (s.nisn && photoMap[s.nisn]) matched++;
    });
    document.getElementById('photo-match-badge').textContent = `${matched} / ${students.length} Foto Cocok`;
}

function triggerSinglePhotoUpload(nisn, index) {
    if (!nisn) {
        showToast("Siswa ini belum memiliki NISN. Edit data untuk mengisi NISN terlebih dahulu.", "warning");
        return;
    }
    activeSinglePhotoNisn = nisn;
    document.getElementById('single-photo-input').click();
}

function handleSinglePhotoSelected(event) {
    const file = event.target.files[0];
    if (!file || !activeSinglePhotoNisn) return;

    if (photoMap[activeSinglePhotoNisn] && photoMap[activeSinglePhotoNisn].startsWith('blob:')) {
        URL.revokeObjectURL(photoMap[activeSinglePhotoNisn]);
    }
    photoMap[activeSinglePhotoNisn] = URL.createObjectURL(file);
    
    updatePhotoMatchBadge();
    renderAll();
    showToast(`Foto untuk NISN ${activeSinglePhotoNisn} berhasil dipasang!`, "success");
    event.target.value = "";
}

// ==========================================
// 6. CRUD MANUAL PESERTA & FILTER
// ==========================================
function openStudentModal(editIdx = -1) {
    const modal = document.getElementById('student-modal');
    const title = document.getElementById('modal-title');
    document.getElementById('edit-index').value = editIdx;

    if (editIdx >= 0 && students[editIdx]) {
        const s = students[editIdx];
        title.textContent = "Edit Data Peserta";
        document.getElementById('m-nopes').value = s.nopes;
        document.getElementById('m-nisn').value = s.nisn;
        document.getElementById('m-nis').value = s.nis;
        document.getElementById('m-nama').value = s.nama;
        document.getElementById('m-ttl').value = s.ttl;
        document.getElementById('m-kelas').value = s.kelas;
        document.getElementById('m-ruang').value = s.ruang;
    } else {
        title.textContent = "Tambah Peserta Manual";
        document.getElementById('student-form').reset();
    }
    modal.classList.remove('hidden');
}

function closeStudentModal() {
    document.getElementById('student-modal').classList.add('hidden');
}

function saveManualStudent(event) {
    event.preventDefault();
    const editIdx = parseInt(document.getElementById('edit-index').value, 10);
    const studentObj = {
        nopes: document.getElementById('m-nopes').value.trim(),
        nisn: document.getElementById('m-nisn').value.trim(),
        nis: document.getElementById('m-nis').value.trim() || "-",
        nama: document.getElementById('m-nama').value.trim().toUpperCase(),
        ttl: document.getElementById('m-ttl').value.trim() || "-",
        kelas: document.getElementById('m-kelas').value.trim(),
        ruang: document.getElementById('m-ruang').value.trim()
    };

    if (editIdx >= 0) {
        students[editIdx] = studentObj;
        showToast("Data peserta berhasil diperbarui!", "success");
    } else {
        students.push(studentObj);
        showToast("Peserta baru berhasil ditambahkan!", "success");
    }

    closeStudentModal();
    updateClassFilterOptions();
    updatePhotoMatchBadge();
    renderAll();
}

function deleteStudent(idx) {
    students.splice(idx, 1);
    updateClassFilterOptions();
    updatePhotoMatchBadge();
    renderAll();
    showToast("Data peserta dihapus.", "info");
}

function clearAllStudents() {
    if (students.length === 0) return;
    students = [];
    updateClassFilterOptions();
    updatePhotoMatchBadge();
    renderAll();
    showToast("Semua daftar peserta dikosongkan.", "warning");
}

function updateClassFilterOptions() {
    const select = document.getElementById('filter-kelas');
    const currentVal = select.value;
    const uniqueClasses = [...new Set(students.map(s => s.kelas).filter(Boolean))].sort();

    select.innerHTML = `<option value="ALL">Semua Kelas (${students.length})</option>`;
    uniqueClasses.forEach(cls => {
        const opt = document.createElement('option');
        opt.value = cls;
        opt.textContent = `Kelas ${cls}`;
        select.appendChild(opt);
    });

    if (uniqueClasses.includes(currentVal)) {
        select.value = currentVal;
    }
}

// ==========================================
// 7. PENGATURAN KOP, LOGO, TTD & WARNA
// ==========================================
function updateConfig() {
    config.instansi = document.getElementById('cfg-instansi').value;
    config.sekolah = document.getElementById('cfg-sekolah').value;
    config.alamat = document.getElementById('cfg-alamat').value;
    config.judul = document.getElementById('cfg-judul').value;
    config.tapel = document.getElementById('cfg-tapel').value;
    config.tgl = document.getElementById('cfg-tgl').value;
    config.jabatan = document.getElementById('cfg-jabatan').value;
    config.kamad = document.getElementById('cfg-kamad').value;
    config.nip = document.getElementById('cfg-nip').value;
    config.catatan = document.getElementById('cfg-catatan').value;
    renderAll();
}

function setAccentColor(hex) {
    config.accentColor = hex;
    document.getElementById('cfg-color').value = hex;
    renderAll();
}

function handleImageSetting(event, key) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        config[key] = e.target.result;
        syncImagePreviews();
        renderAll();
        showToast("Gambar berhasil diperbarui!", "success");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
}

function removeImageSetting(key) {
    config[key] = "";
    syncImagePreviews();
    renderAll();
}

function syncImagePreviews() {
    document.getElementById('preview-logo-left').src = config.logoLeft || "https://placehold.co/80x80/f1f5f9/94a3b8?text=Kiri";
    document.getElementById('preview-logo-right').src = config.logoRight || "https://placehold.co/80x80/f1f5f9/94a3b8?text=Kanan";
    document.getElementById('preview-ttd').src = config.ttdImg || "https://placehold.co/120x50/f1f5f9/94a3b8?text=TTD";
    document.getElementById('preview-stempel').src = config.stempelImg || "https://placehold.co/80x80/f1f5f9/94a3b8?text=Cap";
}

// ==========================================
// 8. RENDER DAFTAR MINI & LEMBAR KARTU PRESISI
// ==========================================
function getFilteredStudents() {
    const keyword = document.getElementById('search-student').value.toLowerCase().trim();
    const selectedKelas = document.getElementById('filter-kelas').value;

    return students.map((s, originalIndex) => ({ ...s, originalIndex })).filter(s => {
        const matchKelas = selectedKelas === 'ALL' || s.kelas === selectedKelas;
        const matchQuery = !keyword || 
            s.nama.toLowerCase().includes(keyword) || 
            s.nisn.toLowerCase().includes(keyword) || 
            s.nopes.toLowerCase().includes(keyword);
        return matchKelas && matchQuery;
    });
}

function renderAll() {
    const filtered = getFilteredStudents();
    document.getElementById('total-students-count').textContent = students.length;

    const miniContainer = document.getElementById('student-list-mini');
    if (filtered.length === 0) {
        miniContainer.innerHTML = `<div class="p-4 text-center text-slate-400">Tidak ada data peserta yang cocok.</div>`;
    } else {
        miniContainer.innerHTML = filtered.map(s => {
            const hasPhoto = Boolean(s.nisn && photoMap[s.nisn]);
            return `
                <div class="px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition">
                    <div class="min-w-0 pr-2">
                        <div class="font-bold text-slate-800 truncate">${escapeHtml(s.nama)}</div>
                        <div class="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>NISN: <b>${escapeHtml(s.nisn || '-')}</b></span>
                            <span>•</span>
                            <span class="text-emerald-700 font-semibold">${escapeHtml(s.kelas)} (${escapeHtml(s.ruang)})</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 flex-shrink-0">
                        <span class="w-2 h-2 rounded-full ${hasPhoto ? 'bg-emerald-500' : 'bg-slate-300'}" title="${hasPhoto ? 'Foto Terpasang' : 'Belum Ada Foto'}"></span>
                        <button onclick="openStudentModal(${s.originalIndex})" class="p-1.5 text-slate-500 hover:text-blue-600 rounded" title="Edit">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button onclick="deleteStudent(${s.originalIndex})" class="p-1.5 text-slate-500 hover:text-rose-600 rounded" title="Hapus">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    const sheetsWrapper = document.getElementById('sheets-wrapper');
    const cardsPerSheet = paperSize === 'A4' ? 6 : 8;
    const totalPages = Math.max(1, Math.ceil(filtered.length / cardsPerSheet));

    document.getElementById('summary-text').textContent = `${filtered.length} Kartu • ${totalPages} Halaman ${paperSize} (Ukuran Kartu 10,5 x 7,5 cm)`;

    if (filtered.length === 0) {
        sheetsWrapper.innerHTML = `
            <div class="paper-sheet ${paperSize === 'A4' ? 'paper-a4' : 'paper-f4'} flex items-center justify-center">
                <div class="text-center text-slate-400 col-span-2 py-20">
                    <i class="fa-regular fa-id-card text-5xl mb-3 block"></i>
                    <p class="font-bold text-sm">Belum ada kartu untuk ditampilkan</p>
                    <p class="text-xs mt-1">Upload file Excel atau tambahkan peserta secara manual di panel kiri.</p>
                </div>
            </div>
        `;
        return;
    }

    let pagesHtml = '';
    for (let page = 0; page < totalPages; page++) {
        const slice = filtered.slice(page * cardsPerSheet, (page + 1) * cardsPerSheet);
        const cardsHtml = slice.map(student => buildCardHtml(student)).join('');
        pagesHtml += `
            <div class="paper-sheet ${paperSize === 'A4' ? 'paper-a4' : 'paper-f4'}">
                ${cardsHtml}
            </div>
        `;
    }
    sheetsWrapper.innerHTML = pagesHtml;
}

function buildCardHtml(s) {
    const photoUrl = (s.nisn && photoMap[s.nisn]) ? photoMap[s.nisn] : null;
    const formattedNotes = escapeHtml(config.catatan).replace(/\n/g, '<br>');

    return `
        <div class="exam-card">
            <div class="relative flex items-center justify-between border-b-2 border-slate-900 pb-1.5 min-h-[12.5mm]">
                <div class="w-[11mm] h-[11mm] flex items-center justify-center flex-shrink-0">
                    ${config.logoLeft ? `<img src="${config.logoLeft}" class="max-w-full max-h-full object-contain" alt="Logo Kiri">` : ''}
                </div>
                <div class="flex-1 text-center px-1 leading-tight">
                    <div class="text-[7px] font-bold tracking-wide text-slate-700 uppercase">${escapeHtml(config.instansi)}</div>
                    <div class="text-[9.5px] font-extrabold text-slate-950 uppercase tracking-tight mt-0.5">${escapeHtml(config.sekolah)}</div>
                    <div class="text-[6.2px] text-slate-600 mt-0.5 line-clamp-1">${escapeHtml(config.alamat)}</div>
                </div>
                <div class="w-[11mm] h-[11mm] flex items-center justify-center flex-shrink-0">
                    ${config.logoRight ? `<img src="${config.logoRight}" class="max-w-full max-h-full object-contain" alt="Logo Kanan">` : ''}
                </div>
            </div>

            <div style="background-color: ${config.accentColor};" class="text-white text-center py-0.5 px-2 rounded-sm my-1">
                <div class="text-[8.5px] font-extrabold tracking-wider uppercase leading-tight">${escapeHtml(config.judul)}</div>
                <div class="text-[6.8px] font-semibold tracking-widest opacity-95 uppercase">${escapeHtml(config.tapel)}</div>
            </div>

            <div class="flex gap-2.5 items-start flex-1 pt-0.5">
                <div onclick="triggerSinglePhotoUpload('${escapeHtml(s.nisn)}', ${s.originalIndex})" 
                     title="Klik untuk upload/ganti foto peserta ini"
                     class="w-[21mm] h-[27mm] border border-slate-800 bg-slate-50 flex-shrink-0 flex flex-col items-center justify-center overflow-hidden cursor-pointer relative group">
                    ${photoUrl 
                        ? `<img src="${photoUrl}" class="w-full h-full object-cover" alt="Foto ${escapeHtml(s.nama)}">` 
                        : `<div class="text-center p-1 text-slate-400">
                             <i class="fa-solid fa-user text-lg mb-0.5 block"></i>
                             <span class="text-[6px] font-bold block leading-tight">PAS FOTO<br>3 x 4</span>
                           </div>`
                    }
                    <div class="absolute inset-0 bg-black/50 text-white text-[6.5px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition no-print text-center px-1">
                        Ganti Foto
                    </div>
                </div>

                <table class="w-full text-[7.8px] leading-[1.32] text-slate-900 border-collapse">
                    <tr>
                        <td class="w-[22mm] font-semibold text-slate-700 align-top">No. Peserta</td>
                        <td class="w-[2.5mm] align-top">:</td>
                        <td class="font-extrabold text-slate-950 tracking-wide align-top">${escapeHtml(s.nopes)}</td>
                    </tr>
                    <tr>
                        <td class="font-semibold text-slate-700 align-top">NIS / NISN</td>
                        <td class="align-top">:</td>
                        <td class="font-semibold align-top">${escapeHtml(s.nis)} / ${escapeHtml(s.nisn || '-')}</td>
                    </tr>
                    <tr>
                        <td class="font-semibold text-slate-700 align-top">Nama Lengkap</td>
                        <td class="align-top">:</td>
                        <td class="font-extrabold uppercase align-top line-clamp-2">${escapeHtml(s.nama)}</td>
                    </tr>
                    <tr>
                        <td class="font-semibold text-slate-700 align-top">Tempat, Tgl Lahir</td>
                        <td class="align-top">:</td>
                        <td class="align-top truncate max-w-[46mm]">${escapeHtml(s.ttl)}</td>
                    </tr>
                    <tr>
                        <td class="font-semibold text-slate-700 align-top">Kelas / Ruang</td>
                        <td class="align-top">:</td>
                        <td class="align-top">
                            <span class="font-bold">${escapeHtml(s.kelas)}</span> 
                            <span class="mx-1 text-slate-400">|</span> 
                            <span class="px-1.5 py-0.2 bg-slate-100 border border-slate-400 rounded font-extrabold text-[7.5px]">${escapeHtml(s.ruang)}</span>
                        </td>
                    </tr>
                </table>
            </div>

            <div class="flex items-end justify-between pt-1 mt-0.5 border-t border-dashed border-slate-300 text-[6.5px]">
                <div class="text-slate-600 leading-tight max-w-[52mm] italic">
                    ${formattedNotes}
                </div>

                <div class="relative text-left min-w-[38mm] leading-tight">
                    <div class="text-slate-800">${escapeHtml(config.tgl)}</div>
                    <div class="text-slate-800">${escapeHtml(config.jabatan)}</div>
                    
                    <div class="relative h-[8.5mm] my-0.5 flex items-center">
                        ${config.ttdImg ? `<img src="${config.ttdImg}" class="h-[8.5mm] max-w-[28mm] object-contain relative z-10" alt="TTD">` : ''}
                        ${config.stempelImg ? `<img src="${config.stempelImg}" class="h-[11.5mm] w-[11.5mm] object-contain absolute -left-2 -top-1.5 z-20 stamp-multiply pointer-events-none" alt="Stempel">` : ''}
                    </div>

                    <div class="font-extrabold text-slate-950 underline">${escapeHtml(config.kamad)}</div>
                    <div class="text-slate-700 text-[6px]">${escapeHtml(config.nip)}</div>
                </div>
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    if (!text) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}