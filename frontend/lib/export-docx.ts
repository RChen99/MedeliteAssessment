import {
  Document,
  ExternalHyperlink,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { FacilityReport, getReportRows, sanitizeFilename } from "@/lib/report-model";

function headerParagraph(text: string, bold = false, size = 22): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold,
        size,
        color: bold ? "0F2744" : "1A6B7A",
      }),
    ],
    spacing: { after: 120 },
  });
}

export async function generateDocxBlob(report: FacilityReport): Promise<Blob> {
  const rows = getReportRows(report);

  const doc = new Document({
    sections: [
      {
        children: [
          headerParagraph("INFINITE — Managed by MEDELITE", false, 18),
          headerParagraph("FACILITY ASSESSMENT SNAPSHOT", true, 28),
          headerParagraph(report.state, false, 22),
          ...rows.flatMap(({ label, value }) => [
            new Paragraph({
              children: [
                new TextRun({ text: `${label}: `, bold: true, size: 20 }),
                new TextRun({ text: value, size: 20 }),
              ],
              spacing: { after: 80 },
            }),
          ]),
          new Paragraph({
            children: [
              new TextRun({ text: "Medicare Care Compare: ", bold: true, size: 20 }),
              new ExternalHyperlink({
                link: report.medicareUrl,
                children: [
                  new TextRun({
                    text: report.medicareUrl,
                    style: "Hyperlink",
                    size: 20,
                  }),
                ],
              }),
            ],
            spacing: { before: 200 },
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBlob(doc);
  return buffer;
}

export function getExportFilename(report: FacilityReport, extension: "pdf" | "docx") {
  const base = sanitizeFilename(report.displayName || report.officialName);
  return `${base}-assessment-${report.ccn}.${extension}`;
}
