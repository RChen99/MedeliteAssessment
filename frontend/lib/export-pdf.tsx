import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { FacilityReport, getReportRows } from "@/lib/report-model";
import { BRAND_COLORS } from "@/lib/brand-colors";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: BRAND_COLORS.text,
  },
  brandLine: {
    fontSize: 8,
    letterSpacing: 2,
    color: BRAND_COLORS.blue,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  state: {
    fontSize: 12,
    color: BRAND_COLORS.muted,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 6,
  },
  label: {
    width: "45%",
    color: BRAND_COLORS.muted,
  },
  value: {
    width: "55%",
    fontWeight: "bold",
  },
  linkSection: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  link: {
    color: BRAND_COLORS.blue,
    textDecoration: "underline",
  },
});

export function AssessmentPdfDocument({ report }: { report: FacilityReport }) {
  const rows = getReportRows(report);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.brandLine}>INFINITE — Managed by MEDELITE</Text>
        <Text style={styles.title}>FACILITY ASSESSMENT SNAPSHOT</Text>
        <Text style={styles.state}>{report.state}</Text>

        {rows.map(({ label, value }) => (
          <View key={label} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}

        <View style={styles.linkSection}>
          <Link src={report.medicareUrl} style={styles.link}>
            View on Medicare Care Compare ({report.medicareUrl})
          </Link>
        </View>
      </Page>
    </Document>
  );
}
