import { useState } from 'react';
import { SvgIllustration } from './svgIllustrations';

interface Props {
  src: string | null | undefined;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  priority?: boolean;
}

export default function ProductImage({ src, alt, className = '', size = 'md', priority = false }: Props) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // If it's a demo stock photo (Pexels / Unsplash), use our local high-fidelity SVG illustration
  // to avoid blocked domains and slow down on corporate laptops.
  const isStockPhoto = src && (src.includes('pexels.com') || src.includes('unsplash.com'));

  if (isStockPhoto || error || !src) {
    return (
      <div className={`relative bg-gray-50 overflow-hidden ${className} flex items-center justify-center`}>
        <SvgIllustration name={alt} className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-100 overflow-hidden ${className}`}>
      {/* Skeleton while loading */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-amber-500 rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

