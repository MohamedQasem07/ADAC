'use client';

import { useRef, useState } from 'react';
import { Clipboard, Copy, Download, Upload } from 'lucide-react';
import { useOverrides } from '@/context/PresentationOverridesContext';
import { exportFilename } from '@/lib/overrides';

export function ImportExportTab() {
  const { overrides, importOverrides } = useOverrides();
  const [pasteText, setPasteText] = useState('');
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportJson = JSON.stringify(overrides, null, 2);

  const triggerDownload = () => {
    const blob = new Blob([exportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportFilename();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setFeedback({ kind: 'ok', msg: `Exported as ${exportFilename()}` });
  };

  const triggerCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportJson);
      setFeedback({ kind: 'ok', msg: 'Overrides copied to clipboard.' });
    } catch {
      setFeedback({ kind: 'err', msg: 'Clipboard unavailable — use the download button.' });
    }
  };

  const onFileSelected = async (file: File) => {
    try {
      const text = await file.text();
      applyImport(text, `Imported from ${file.name}`);
    } catch (err) {
      setFeedback({
        kind: 'err',
        msg: err instanceof Error ? err.message : 'Could not read file.',
      });
    }
  };

  const applyPaste = () => {
    if (!pasteText.trim()) {
      setFeedback({ kind: 'err', msg: 'Nothing to import — paste JSON first.' });
      return;
    }
    applyImport(pasteText, 'Imported from pasted JSON.');
  };

  const applyImport = (raw: string, okMsg: string) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      setFeedback({
        kind: 'err',
        msg: `Invalid JSON: ${err instanceof Error ? err.message : 'parse error'}`,
      });
      return;
    }
    const result = importOverrides(parsed);
    if (!result.ok) {
      setFeedback({ kind: 'err', msg: result.error ?? 'Invalid overrides shape.' });
      return;
    }
    setFeedback({ kind: 'ok', msg: okMsg });
    setPasteText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Export */}
      <section className="rounded-sm border border-white/10 bg-navy/40 p-5">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold">
          Export overrides
        </h3>
        <p className="mt-2 text-sm text-ice/80">
          Download or copy the current set of local overrides. Use this to move approved edits
          between rehearsal browser and the meeting laptop.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={triggerDownload}
            className="inline-flex items-center gap-2 rounded-sm border border-gold/60 bg-gold/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/25"
          >
            <Download size={13} />
            Download JSON
          </button>
          <button
            type="button"
            onClick={triggerCopy}
            className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-ice/80 transition-colors hover:border-gold/40 hover:text-gold"
          >
            <Copy size={13} />
            Copy to clipboard
          </button>
        </div>
        <details className="mt-4 group">
          <summary className="cursor-pointer text-[10px] uppercase tracking-[0.3em] text-ice/60 hover:text-gold">
            Preview JSON
          </summary>
          <pre className="mt-2 max-h-64 overflow-auto rounded-sm border border-white/5 bg-navy-deep/60 p-3 font-mono text-[11px] leading-relaxed text-ice/85">
            {exportJson}
          </pre>
        </details>
      </section>

      {/* Import */}
      <section className="rounded-sm border border-white/10 bg-navy/40 p-5">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold">
          Import overrides
        </h3>
        <p className="mt-2 text-sm text-ice/80">
          Upload a JSON file or paste the JSON content directly. The file must be from this app
          (version 1). Original bundled data stays intact regardless.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-gold/60 bg-gold/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/25">
            <Upload size={13} />
            Choose file
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileSelected(file);
              }}
            />
          </label>
        </div>

        <div className="mt-4 space-y-2">
          <label className="block text-[10px] uppercase tracking-[0.3em] text-ice/60">
            Or paste JSON
          </label>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={6}
            placeholder='{ "version": 1, "text": {...}, "packages": {...}, "pricing": {...} }'
            className="block w-full resize-vertical rounded-sm border border-white/10 bg-navy-deep/60 px-3 py-2 font-mono text-[11px] leading-relaxed text-ice/90 placeholder-ice/30 focus:border-gold/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={applyPaste}
            className="inline-flex items-center gap-2 rounded-sm border border-gold/60 bg-gold/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/25"
          >
            <Clipboard size={13} />
            Apply pasted JSON
          </button>
        </div>
      </section>

      {feedback && (
        <p
          className={`rounded-sm border px-4 py-2.5 text-sm ${
            feedback.kind === 'ok'
              ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-100'
              : 'border-rose-400/40 bg-rose-400/10 text-rose-100'
          }`}
        >
          {feedback.msg}
        </p>
      )}
    </div>
  );
}
