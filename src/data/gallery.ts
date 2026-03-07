export interface GalleryItem {
  src: string;
  alt: string;
  camera?: string;
  lens?: string;
  iso?: string;
  aperture?: string;
}

export const gallery: GalleryItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80',
    alt: 'Camera on wooden surface',
    camera: 'Sony A7III', lens: '35mm f/1.4', iso: '100', aperture: 'f/2.8',
  },
  {
    src: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80',
    alt: 'Landscape at golden hour',
    camera: 'Canon R5', lens: '85mm f/1.2', iso: '200', aperture: 'f/1.8',
  },
  {
    src: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?auto=format&fit=crop&q=80',
    alt: 'Architecture detail',
    camera: 'Leica Q2', lens: '28mm f/1.7', iso: '400', aperture: 'f/4',
  },
  {
    src: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&q=80',
    alt: 'Desert landscape',
    camera: 'Fujifilm X-T4', lens: '16-55mm', iso: '160', aperture: 'f/5.6',
  },
];
