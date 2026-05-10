// FILE: app/admin/utils/generateCodesPDF.ts
import { jsPDF } from "jspdf";
import { customAlphabet } from "nanoid";

const nano = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 16);

function hexToRgb(hex: string) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

function drawImageContain(doc: any, imgData: string, x: number, y: number, w: number, h: number) {
    const props = doc.getImageProperties(imgData);
    const imgRatio = props.width / props.height;
    const boxRatio = w / h;
    let newWidth, newHeight;
    
    if (imgRatio > boxRatio) {
        newWidth = w;
        newHeight = w / imgRatio;
    } else {
        newHeight = h;
        newWidth = h * imgRatio;
    }
    
    const offsetX = x + (w - newWidth) / 2;
    const offsetY = y + (h - newHeight) / 2;
    
    doc.addImage(imgData, "PNG", offsetX, offsetY, newWidth, newHeight);
}

interface GeneratePDFParams {
    count: number;
    price: string | number;
    color: string;
    background: string;
    title: string;
    startSerial?: number;
}

export async function generateCodesPDF({ count, price, color, background, title, startSerial = 84027 }: GeneratePDFParams) {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = 210;
    const pageHeight = 297;
    const cols = 3;
    const rows = 6;
    const margin = 5; 
    const cardWidth = (pageWidth - margin * 2) / cols;
    const cardHeight = (pageHeight - margin * 2) / rows;

    const codes = [];

    for (let i = 0; i < count; i++) {
        const serial = startSerial + i;
        const rawCode = nano();
        const formattedCode = rawCode.match(/.{1,4}/g)?.join(' ') || rawCode;
        
        codes.push({
            serial: serial.toString(),
            code: formattedCode,
            price: price,
            isUsed: false,
            addedDate: new Date().toLocaleString('en-US'),
            addedBy: 'Admin'
        });
    }

    const rgb = hexToRgb(color);

    for (let i = 0; i < codes.length; i++) {
        const indexOnPage = i % (cols * rows);
        if (indexOnPage === 0 && i !== 0) doc.addPage();

        const col = indexOnPage % cols;
        const row = Math.floor(indexOnPage / cols);
        const x = margin + col * cardWidth;
        const y = margin + row * cardHeight;
        const c = codes[i];

        drawImageContain(doc, background, x, y, cardWidth, cardHeight);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); 
        doc.text(c.price.toString(), x + (cardWidth * 0.13), y + (cardHeight * 0.17), { align: "center" });

        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(`${c.serial}`, x + (cardWidth * 0.49), y + (cardHeight * 0.67), { align: "center" });

        doc.setFontSize(11);
        doc.setTextColor(rgb.r, rgb.g, rgb.b); 
        doc.text(c.code, x + (cardWidth * 0.49), y + (cardHeight * 0.82), { align: "center" });
    }

    doc.save(`Codes_${title}_${count}.pdf`);
    return codes;
}