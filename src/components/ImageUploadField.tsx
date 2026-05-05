"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface Props {
  defaultUrl?: string;
}

export default function ImageUploadField({ defaultUrl }: Props) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [preview, setPreview] = useState(defaultUrl ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "업로드 실패");
      setUrl(data.url);
      setPreview(data.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleRemove() {
    setUrl("");
    setPreview("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      {/* 히든 필드 — 폼 제출 시 URL 전달 */}
      <input type="hidden" name="imageUrl" value={url} />

      {preview ? (
        <div className="relative w-full h-52 rounded-xl overflow-hidden border border-gray-200 group">
          <Image src={preview} alt="캠페인 이미지" fill className="object-cover" sizes="600px" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-white text-gray-800 text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              이미지 교체
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors"
            >
              삭제
            </button>
          </div>
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="w-full h-52 rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-indigo-500"
        >
          {loading ? (
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">클릭 또는 드래그해서 이미지 업로드</span>
              <span className="text-xs">JPG · PNG · WEBP · GIF · 최대 5MB</span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleChange}
      />

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
