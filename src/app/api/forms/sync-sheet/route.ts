import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const GOOGLE_SERVICE_ACCOUNT = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
const GOOGLE_SHEETS_SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function getSheetsClient({ accessToken }: { accessToken?: string } = {}) {
  if (accessToken) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    return google.sheets({ version: "v4", auth });
  }
  if (!GOOGLE_SERVICE_ACCOUNT) throw new Error("Service account belum di-setup");
  const creds = JSON.parse(GOOGLE_SERVICE_ACCOUNT);
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: GOOGLE_SHEETS_SCOPES,
  });
  return google.sheets({ version: "v4", auth });
}

export async function POST(req: NextRequest) {
  try {
    const { spreadsheetId, sheetName, fieldMapping, formData, mode } = await req.json();
    // Ambil token dari cookie
    const tokenCookie = req.cookies.get("google_token");
    let accessToken: string | undefined = undefined;
    if (tokenCookie) {
      try {
        const tokens = JSON.parse(tokenCookie.value);
        accessToken = tokens.access_token;
      } catch {}
    }
    if (mode === 'ping') {
      if (!accessToken) return NextResponse.json({ error: 'Not connected' }, { status: 401 });
      return NextResponse.json({ ok: true });
    }
    if (!spreadsheetId || !sheetName) {
      return NextResponse.json({ error: "Parameter tidak lengkap" }, { status: 400 });
    }
    const sheets = getSheetsClient({ accessToken });
    if (mode === 'get') {
      // Real-time fetch rows
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A1:Z1000`,
      });
      return NextResponse.json({ rows: res.data.values || [] });
    }
    if (!fieldMapping || !formData) {
      return NextResponse.json({ error: "Parameter tidak lengkap" }, { status: 400 });
    }
    // Hapus validasi dan mapping yang tidak diperlukan untuk sementara
    const values = [Object.values(formData)];
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
} 