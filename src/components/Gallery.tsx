
import { motion } from 'framer-motion';

export const Gallery = () => {
    const images = [
        { src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80', camera: 'Sony A7III', lens: '35mm f/1.4', iso: '100', aperture: 'f/2.8' },
        { src: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80', camera: 'Canon R5', lens: '85mm f/1.2', iso: '200', aperture: 'f/1.8' },
        { src: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?auto=format&fit=crop&q=80', camera: 'Leica Q2', lens: '28mm f/1.7', iso: '400', aperture: 'f/4' },
        { src: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&q=80', camera: 'Fujifilm X-T4', lens: '16-55mm', iso: '160', aperture: 'f/5.6' },
    ];

    return (
        <section id="gallery" className="py-24 bg-stone-900 text-stone-300">
            <div className="container mx-auto px-6 md:px-12">
                <motion.h2
                    className="text-4xl md:text-5xl font-serif font-bold mb-12 text-center text-stone-100"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Perspective
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            className="relative aspect-square overflow-hidden group rounded-lg cursor-pointer"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <img
                                src={img.src}
                                alt="Gallery"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* EXIF Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-xs text-stone-300 p-4 text-center">
                                <div className="font-bold text-white mb-1">{img.camera}</div>
                                <div>{img.lens}</div>
                                <div className="flex gap-2 mt-2 opacity-70">
                                    <span>ISO {img.iso}</span>
                                    <span>{img.aperture}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
