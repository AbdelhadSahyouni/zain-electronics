"use client";

import Image from "next/image";
import ImageUploader from "./ImageUploader";

interface MultiImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function MultiImageUploader({
  images,
  onChange,
  maxImages = 5,
}: MultiImageUploaderProps) {
  const addImage = (url: string) => {
    onChange([...images, url]);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <p className="text-sm font-medium text-text-primary mb-1.5">
        صور إضافية (اختياري)
      </p>
      <div className="flex flex-wrap gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group">
            <Image src={img} alt={`صورة ${idx + 1}`} fill className="object-cover" sizes="80px" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 left-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="حذف الصورة"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <div className="w-20 h-20">
            <ImageUploader value="" onChange={addImage} className="!max-w-[80px]" />
          </div>
        )}
      </div>
      <p className="text-xs text-text-muted mt-1.5">
        حتى {maxImages} صور إضافية ({images.length}/{maxImages})
      </p>
    </div>
  );
}
