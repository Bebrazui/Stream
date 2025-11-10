
'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  label: string;
  onUpload: (base64: string) => void;
  initialImage?: string;
  className?: string;
}

export function ImageUploader({ label, onUpload, initialImage, className }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPreview(base64);
        onUpload(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
    multiple: false,
  });

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening file dialog
    setPreview(null);
    onUpload('');
  };

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-8 text-center transition-colors",
          { 'border-primary bg-primary/10': isDragActive },
          { 'aspect-video': !preview, 'w-full': !preview, 'h-auto': preview }
        )}
      >
        <input {...getInputProps()} />
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Preview"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-black/75"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <UploadCloud className="h-12 w-12" />
            <p className="font-semibold">Drag & drop or click to upload</p>
            <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
