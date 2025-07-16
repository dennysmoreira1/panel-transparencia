// src/utils/exportUtils.js
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Exporta un arreglo de objetos a un archivo Excel (.xlsx)
 * @param {Array} data - Datos a exportar
 * @param {string} fileName - Nombre del archivo (sin extensión)
 */
export const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, `${fileName}.xlsx`);
};

/**
 * Exporta un arreglo de objetos a un archivo PDF utilizando columnas específicas
 * @param {Array} data - Datos a exportar
 * @param {string} fileName - Nombre del archivo (sin extensión)
 * @param {Array<string>} columns - Claves de las columnas a incluir
 */
export const exportToPDF = (data, fileName, columns) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(fileName, 14, 15);

    autoTable(doc, {
        startY: 20,
        head: [columns.map(key => key.charAt(0).toUpperCase() + key.slice(1))],
        body: data.map(row => columns.map(key => row[key])),
        styles: { fontSize: 10 }
    });

    doc.save(`${fileName}.pdf`);
};
