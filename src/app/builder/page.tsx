'use client';

import FormComponentPalette from '@/components/forms/FormComponentPalette';
import FormLivePreview from '@/components/forms/FormLivePreview';
import FormComponentProperties from '@/components/forms/FormComponentProperties';
import { useFormStore } from '@/stores/useFormStore';
import { useState, useEffect } from 'react';
import dynamic from "next/dynamic";

const ChatInterface = dynamic(() => import("@/components/ai/ChatInterface"), { ssr: false });
const ThemeGenerator = dynamic(() => import("@/components/theme/ThemeGenerator"), { ssr: false });

function SpreadsheetMappingPanel() {
  const { components } = useFormStore();
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [sheetName, setSheetName] = useState('Sheet1');
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sheetRows, setSheetRows] = useState<Record<string, string | number | boolean | string[] | undefined>[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // OAuth login
  const handleLogin = () => {
    window.location.href = '/api/auth/google/init';
  };

  // Cek koneksi Google Sheets (cookie ada)
  useEffect(() => {
    fetch('/api/forms/sync-sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spreadsheetId: 'dummy', sheetName: 'dummy', mode: 'ping' }),
    })
      .then(res => res.status !== 401 && setIsConnected(true))
      .catch(() => setIsConnected(false));
  }, []);

  // Polling real-time fetch data sheet
  useEffect(() => {
    if (!isConnected || !spreadsheetId || !sheetName) return;
    const fetchRows = async () => {
      try {
        const res = await fetch('/api/forms/sync-sheet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ spreadsheetId, sheetName, fieldMapping, formData: {}, mode: 'get' }),
        });
        const data = await res.json();
        if (Array.isArray(data.rows)) setSheetRows(data.rows);
      } catch {}
    };
    fetchRows();
    const timer = setInterval(fetchRows, 30000);
    return () => clearInterval(timer);
  }, [isConnected, spreadsheetId, sheetName]);

  const handleMapChange = (field: string, value: string) => {
    setFieldMapping((prev) => ({ ...prev, [field]: value }));
  };

  const handleTestSync = async () => {
    setLoading(true);
    setResult(null);
    try {
      const formData: Record<string, string | number | boolean | string[] | undefined> = {};
      components.forEach((c) => {
        formData[c.id] = `Contoh data untuk ${c.type}`;
      });
      const res = await fetch('/api/forms/sync-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheetId, sheetName, fieldMapping, formData }),
      });
      const data = await res.json();
      if (res.ok) setResult('✅ Sync berhasil!');
      else setResult('❌ ' + (data.error || 'Gagal sync'));
    } catch (e: any) {
      setResult('❌ Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f4f8fb', borderRadius: 12, padding: 16, margin: 16 }}>
      <h4>Spreadsheet Mapping</h4>
      {!isConnected && <button onClick={handleLogin} style={{ background: '#4285f4', color: '#fff', border: 0, borderRadius: 8, padding: '8px 16px', marginBottom: 8 }}>Login Google</button>}
      {isConnected && <div style={{ color: '#388e3c', marginBottom: 8 }}>Google Sheets Connected</div>}
      <label>ID Spreadsheet Google Sheets
        <input value={spreadsheetId} onChange={e => setSpreadsheetId(e.target.value)} style={{ width: '100%' }} />
      </label>
      <label>Nama Sheet
        <input value={sheetName} onChange={e => setSheetName(e.target.value)} style={{ width: '100%' }} />
      </label>
      <div style={{ marginTop: 8 }}>
        <b>Mapping Field Form ke Kolom Sheet:</b>
        {components.map((c) => (
          <div key={c.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
            <span>{c.type} ({c.id})</span>
            <input placeholder="Kolom Sheet" value={fieldMapping[c.id] || ''} onChange={e => handleMapChange(c.id, e.target.value)} />
          </div>
        ))}
      </div>
      <button onClick={handleTestSync} disabled={loading || !isConnected} style={{ marginTop: 8, background: '#0070f3', color: '#fff', border: 0, borderRadius: 8, padding: '8px 16px' }}>Test Sync</button>
      {result && <div style={{ marginTop: 8 }}>{result}</div>}
      {sheetRows.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <b>Data Sheet (Real-time):</b>
          <pre style={{ background: '#fff', borderRadius: 8, padding: 8, maxHeight: 200, overflow: 'auto' }}>{JSON.stringify(sheetRows, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default function BuilderPage() {
  const components = useFormStore(s => s.components);
  const setComponents = useFormStore.setState;
  const [notif, setNotif] = useState('');
  const [name, setName] = useState('');
  const [showList, setShowList] = useState(false);
  const [formsList, setFormsList] = useState<Form[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  async function handleSave() {
    try {
      let res;
      if (editId) {
        // Update form
        res = await fetch('/api/forms/list', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editId, name, components }),
        });
      } else {
        // Insert form
        res = await fetch('/api/forms/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, components }),
        });
      }
      if (res.ok) {
        setNotif(editId ? 'Form berhasil diupdate!' : 'Form berhasil disimpan ke backend!');
        setEditId(null);
      } else {
        setNotif('Gagal menyimpan ke backend.');
      }
    } catch {
      setNotif('Gagal menyimpan ke backend.');
    }
    setTimeout(() => setNotif(''), 2000);
  }

  function handleLoad() {
    const data = localStorage.getItem('formy_builder');
    if (data) {
      setComponents({ components: JSON.parse(data) });
      setNotif('Form berhasil dimuat!');
      setTimeout(() => setNotif(''), 2000);
    } else {
      setNotif('Tidak ada data form tersimpan.');
      setTimeout(() => setNotif(''), 2000);
    }
  }

  async function handleShowList() {
    setShowList(v => !v);
    if (!showList) {
      await refreshFormsList();
    }
  }

  async function refreshFormsList() {
    try {
      const res = await fetch('/api/forms/list');
      const data = await res.json();
      setFormsList(data.forms || []);
    } catch {
      setNotif('Gagal mengambil daftar form.');
      setTimeout(() => setNotif(''), 2000);
    }
  }

  function handleLoadFromBackend(form: Form) {
    setComponents({ components: form.config });
    setName(form.name || '');
    setNotif('Form berhasil dimuat dari backend!');
    setTimeout(() => setNotif(''), 2000);
    setShowList(false);
    setEditId(null);
  }

  function handleEditForm(form: Form) {
    setComponents({ components: form.config });
    setName(form.name || '');
    setEditId(form.id);
    setNotif('Edit mode: Anda sedang mengedit form. Klik Simpan untuk update.');
    setTimeout(() => setNotif(''), 2500);
    setShowList(false);
  }

  async function handleDeleteForm(id: string) {
    if (!window.confirm('Yakin ingin menghapus form ini?')) return;
    await fetch('/api/forms/list', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setNotif('Form berhasil dihapus.');
    setTimeout(() => setNotif(''), 2000);
    await refreshFormsList();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <div style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', gap: 8, alignItems: 'center', background: '#fafbfc' }}>
        <input
          type="text"
          placeholder="Nama Form"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', minWidth: 180 }}
        />
        <button onClick={handleSave} style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid #ddd', background: '#f0f8ff', cursor: 'pointer' }}>{editId ? 'Update' : 'Simpan'}</button>
        <button onClick={handleLoad} style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid #ddd', background: '#f0f8ff', cursor: 'pointer' }}>Muat</button>
        <button onClick={handleShowList} style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid #ddd', background: '#f0f8ff', cursor: 'pointer' }}>Daftar Form</button>
        {notif && <span style={{ marginLeft: 16, color: '#0070f3', fontWeight: 500 }}>{notif}</span>}
      </div>
      {showList && (
        <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: 16 }}>
          <h4>Daftar Form Tersimpan</h4>
          {formsList.length === 0 ? (
            <div style={{ color: '#bbb' }}>Belum ada form tersimpan.</div>
          ) : (
            <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
              {formsList.map(form => (
                <li key={form.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 500 }}>{form.name || '(Tanpa Nama)'}</span>
                  <span style={{ color: '#888', fontSize: 12 }}>ID: {form.id}</span>
                  <button onClick={() => handleLoadFromBackend(form)} style={{ padding: '2px 10px', borderRadius: 4, border: '1px solid #ddd', background: '#f0f8ff', cursor: 'pointer', fontSize: 13 }}>Muat</button>
                  <button onClick={() => handleEditForm(form)} style={{ padding: '2px 10px', borderRadius: 4, border: '1px solid #ddd', background: '#fffbe6', cursor: 'pointer', fontSize: 13 }}>Edit</button>
                  <button onClick={() => handleDeleteForm(form.id)} style={{ padding: '2px 10px', borderRadius: 4, border: '1px solid #ddd', background: '#ffeaea', color: '#d00', cursor: 'pointer', fontSize: 13 }}>Hapus</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Panel Kiri */}
        <aside style={{ width: 260, borderRight: '1px solid #eee', padding: 16 }}>
          <FormComponentPalette />
        </aside>
        {/* Panel Tengah */}
        <main style={{ flex: 1, padding: 24, overflow: 'auto' }}>
          <FormLivePreview />
        </main>
        {/* Panel Kanan */}
        <aside style={{ width: 320, borderLeft: '1px solid #eee', padding: 16 }}>
          <FormComponentProperties />
        </aside>
      </div>
      <SpreadsheetMappingPanel />
      <div style={{ position: "fixed", bottom: 24, left: 24, zIndex: 1000 }}>
        <ThemeGenerator />
      </div>
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}>
        <ChatInterface />
      </div>
    </div>
  );
} 