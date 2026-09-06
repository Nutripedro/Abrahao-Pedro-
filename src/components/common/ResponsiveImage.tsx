import React from 'react';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  widths?: number[];
  sizes?: string;
}

/**
 * Componente de imagem responsiva que implementa a estratégia de srcset.
 * Para imagens do Unsplash, gera automaticamente diferentes resoluções.
 * Para outras imagens, provê uma estrutura baseada em melhores práticas de performance (PWA).
 */
export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  widths = [320, 640, 960, 1280, 1920],
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  className,
  ...props
}) => {
  // Verifica se a imagem é do Unsplash para aplicar redimensionamento via query params
  const isUnsplash = src.includes('images.unsplash.com');
  const isQrServer = src.includes('api.qrserver.com');

  let srcset = '';
  if (isUnsplash) {
    srcset = widths
      .map((w) => {
        const url = new URL(src);
        url.searchParams.set('w', w.toString());
        if (!url.searchParams.has('auto')) url.searchParams.set('auto', 'format');
        if (!url.searchParams.has('q')) url.searchParams.set('q', '75');
        return `${url.toString()} ${w}w`;
      })
      .join(', ');
  } else if (isQrServer) {
    srcset = widths
      .map((w) => {
        const url = new URL(src);
        url.searchParams.set('size', `${w}x${w}`);
        return `${url.toString()} ${w}w`;
      })
      .join(', ');
  }

  return (
    <img
      src={src}
      srcSet={srcset || undefined}
      sizes={srcset ? sizes : undefined}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      {...props}
    />
  );
};
