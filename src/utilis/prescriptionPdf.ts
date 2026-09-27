// @ts-ignore - package ships no types
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { calendarDay } from './format';

/** Doctor-entered text is escaped before it goes into the PDF's HTML. */
const esc = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Renders one prescription as a printable document and writes it to the app's own
 * Documents folder (no storage permission needed). Returns the file path.
 */
export const makePrescriptionPdf = async (p: any, brand: { primary: string; accent: string }) => {
  const date = p.date ? calendarDay(p.date).format('D MMMM YYYY') : '';
  const meds = (p.medications ?? [])
    .map(
      (m: any, i: number) => `
      <tr>
        <td class="n">${i + 1}</td>
        <td><b>${esc(m.name)}</b></td>
        <td>${esc(m.dosage)}</td>
        <td>${esc(m.frequency)}</td>
        <td>${esc(m.duration)}</td>
      </tr>`,
    )
    .join('');
  const symptoms = (p.symptoms ?? []).filter(Boolean).map(esc).join(', ');

  const html = `
  <html><head><meta charset="utf-8"/><style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #0E1330; margin: 0; }
    .band { background: linear-gradient(135deg, ${brand.primary}, ${brand.accent}); color: #fff; padding: 28px 36px; }
    .band h1 { margin: 0; font-size: 26px; letter-spacing: -0.5px; }
    .band p { margin: 4px 0 0; opacity: .85; font-size: 13px; }
    .wrap { padding: 28px 36px; }
    .grid { display: flex; gap: 24px; margin-bottom: 22px; }
    .cell { flex: 1; background: #F5F6FC; border-radius: 12px; padding: 12px 14px; }
    .label { font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase; color: #6A7099; margin-bottom: 4px; }
    .value { font-size: 14px; font-weight: 600; }
    h2 { font-size: 13px; letter-spacing: 1.2px; text-transform: uppercase; color: #6A7099; margin: 22px 0 8px; }
    .dx { font-size: 18px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #6A7099; padding: 8px; border-bottom: 1px solid #E1E4F5; }
    td { padding: 10px 8px; border-bottom: 1px solid #EEF0FB; }
    td.n { color: #9AA0BE; width: 24px; }
    .notes { background: #F5F6FC; border-radius: 12px; padding: 14px; font-size: 13px; line-height: 1.5; }
    .foot { margin-top: 36px; font-size: 10px; color: #9AA0BE; border-top: 1px solid #EEF0FB; padding-top: 12px; }
  </style></head><body>
    <div class="band">
      <h1>Prescription</h1>
      <p>TeleMedicine · ${esc(date)}</p>
    </div>
    <div class="wrap">
      <div class="grid">
        <div class="cell"><div class="label">Patient</div><div class="value">${esc(p.patientName || '-')}${p.age ? `, ${esc(p.age)} yrs` : ''}</div></div>
        <div class="cell"><div class="label">Prescribed by</div><div class="value">${esc(p.doctorName || '-')}</div></div>
      </div>
      <h2>Diagnosis</h2>
      <div class="dx">${esc(p.diagnosis || '-')}</div>
      ${symptoms ? `<p style="color:#5B6285;font-size:13px;margin-top:6px">Symptoms: ${symptoms}</p>` : ''}
      <h2>Medication</h2>
      ${meds
        ? `<table><thead><tr><th></th><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th></tr></thead><tbody>${meds}</tbody></table>`
        : '<p>No medication prescribed.</p>'}
      ${p.notes ? `<h2>Treatment notes</h2><div class="notes">${esc(p.notes)}</div>` : ''}
      <div class="foot">Issued through TeleMedicine. Follow your doctor's instructions and contact them if symptoms change.</div>
    </div>
  </body></html>`;

  const safeDate = p.date ? calendarDay(p.date).format('YYYY-MM-DD') : 'undated';
  const file = await RNHTMLtoPDF.convert({ html, fileName: `prescription-${safeDate}-${String(p.id ?? p._id ?? '').slice(-6)}`, directory: 'Documents' });
  return file.filePath as string;
};
