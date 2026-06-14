"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Spinner } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUploader({ value, onChange, label, className }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "فشل رفع الصورة");
        setUploading(false);
        return;
      }

      onChange(data.url);
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && <p className="text-sm font-medium text-text-primary mb-1.5">{label}</p>}

      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative aspect-square w-full max-w-[180px] rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-colors",
          value ? "border-slate-200" : "border-slate-300 hover:border-primary bg-slate-50",
          className
        )}
      >
        {uploading ? (
          <Spinner className="w-6 h-6 text-primary" />
        ) : value ? (
          <>
            <Image src={value} alt="معاينة" fill className="object-cover" sizes="180px" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <span className="text-white text-xs font-semibold">تغيير الصورة</span>
            </div>
          </>
        ) : (
          <div className="text-center px-2">
            <svg className="w-8 h-8 text-slate-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-text-muted">اضغط لرفع صورة</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
