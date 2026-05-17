import { jsPDF } from "jspdf";
import fs from "fs";

const doc = new jsPDF();
doc.text("Hello world!", 10, 10);
const pdfData = doc.output('datauristring');

// Mock what route.ts does
const base64String = pdfData.split('base64,')[1];
const pdfBuffer = Buffer.from(base64String, 'base64');

fs.writeFileSync('test-output.pdf', pdfBuffer);
console.log("PDF saved. Size:", pdfBuffer.length);
