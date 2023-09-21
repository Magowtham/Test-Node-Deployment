const pdfDocument = require("pdfkit");
const pdfTable = require("voilab-pdf-table");
const fs = require("fs");

const document = new pdfDocument({ size: "A4" });
const table = new pdfTable(document, {
  bottomMargin: 30,
});
document.pipe(fs.createWriteStream("./tet.pdf"));
document
  .fontSize(20)
  .fillColor("red")
  .text("Telephone Transaction Management System", {
    align: "center",
  })
  .fillColor("blue")
  .moveDown(0.1)
  .fontSize(10)
  .text("For Secure Data And Management", 105);
document.moveDown(10);
document.image("./PDF-Media/alvas.png", 50, 50, { width: 40, height: 60 });
document.moveTo(30, 130).lineTo(530, 130).stroke("black");
table
  // add some plugins (here, a 'fit-to-width' for a column)
  .addPlugin(
    new (require("voilab-pdf-table/plugins/fitcolumn"))({
      column: "description",
    })
  )
  // set defaults to your columns
  .setColumnsDefaults({
    headerBorder: "B", // Set header border to bottom only
    headerPadding: [10, 5, 5, 5], // Set header cell padding
    cellBorder: "B", // Set cell border to bottom only
    cellPadding: [5, 5, 5, 5], // Set cell padding
  })
  .addColumns([
    {
      id: "sl",
      header: "SL.NO.",
      width: 50,
      align: "center",
    },
    {
      id: "date",
      header: "Date",
      width: 60,
      align: "center",
    },
  ]);
table.addBody([
  { sl: 1, date: "12/2/2023" },
  { sl: 2, date: "12/2/2023" },
  { sl: 3, date: "12/2/2023" },
]);
table.onPageAdded(function (tb) {
  tb.addHeader();
});
document.addPage();
document.end();
