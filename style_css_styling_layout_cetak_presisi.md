body {
    font-family: 'Inter', sans-serif;
    background-color: #f1f5f9;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
::-webkit-scrollbar-track {
    background: #e2e8f0;
}
::-webkit-scrollbar-thumb {
    background: #94a3b8;
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
    background: #64748b;
}

/* Ukuran Kartu Presisi Standar Plastik ID Card / Nametag: 10.5cm x 7.5cm */
.exam-card {
    width: 105mm;
    height: 75mm;
    background: #ffffff;
    border: 1.5px solid #1e293b;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3.5mm 4mm;
    page-break-inside: avoid;
    break-inside: avoid;
}

/* Efek Stempel Basah di atas TTD */
.stamp-multiply {
    mix-blend-mode: multiply;
}

/* Pratinjau Lembar Kertas di Layar */
.paper-sheet {
    background: white;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    margin: 0 auto 24px auto;
    padding: 8mm;
    display: grid;
    grid-template-columns: repeat(2, 105mm);
    gap: 3mm;
    justify-content: center;
    align-content: start;
}

.paper-a4 {
    width: 210mm;
    min-height: 297mm;
}

.paper-f4 {
    width: 215mm;
    min-height: 330mm;
}

/* Pengaturan Khusus Saat Dicetak (CTRL+P / Tombol Cetak) */
@media print {
    @page {
        margin: 5mm;
    }
    body {
        background: #ffffff !important;
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
    .no-print {
        display: none !important;
    }
    #preview-container {
        width: 100% !important;
        height: auto !important;
        overflow: visible !important;
        padding: 0 !important;
        margin: 0 !important;
        background: transparent !important;
    }
    .paper-sheet {
        box-shadow: none !important;
        margin: 0 auto !important;
        padding: 2mm 0 !important;
        width: 100% !important;
        min-height: auto !important;
        page-break-after: always;
        break-after: page;
    }
    .paper-sheet:last-child {
        page-break-after: auto;
        break-after: auto;
    }
    .exam-card {
        border: 1.5px solid #000000 !important;
    }
}