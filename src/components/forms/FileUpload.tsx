import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

type FileUploadProps = {
  label?: string;
  onChange: (files: FileList | null | File[]) => void;
};

export default function FileUpload({ label, onChange }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    onChange(acceptedFiles);
  }, [onChange]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #bbb',
          borderRadius: 8,
          padding: 16,
          background: isDragActive ? '#f0f8ff' : '#fafbfc',
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Lepaskan file di sini ...</p>
        ) : (
          <p>Drag & drop file di sini, atau klik untuk memilih file</p>
        )}
      </div>
      {files.length > 0 && (
        <ul style={{ marginTop: 8 }}>
          {files.map((file, idx) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
} 