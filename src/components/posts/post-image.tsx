import { useState } from 'react';
import { ImageLightbox } from '@/components/image-lightbox';

interface PostImageProps {
  src: string;
  alt: string;
}

export function PostImage({ src, alt }: PostImageProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-black cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
        <img src={src} alt={alt} className="w-full h-auto max-h-[70vh] object-contain rounded-t-lg" />
      </div>
      {isLightboxOpen && <ImageLightbox src={src} onClose={() => setIsLightboxOpen(false)} />}
    </>
  );
}
