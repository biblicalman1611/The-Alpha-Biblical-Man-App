
import React from 'react';
import { Product } from '../types';

interface ProductSectionProps {
  products: Product[];
}

const ProductSection: React.FC<ProductSectionProps> = ({ products }) => {
  const featuredProduct = products.find(p => p.isFeatured);
  const otherProducts = products.filter(p => !p.isFeatured);

  return (
    <div className="py-28 lg:py-36 bg-gradient-to-b from-white via-stone-50 to-white border-t border-stone-200/50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-20 lg:mb-28">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-brand-gold/10 backdrop-blur-sm rounded-full border border-brand-gold/20 shadow-sm mb-6">
            <span className="text-xs lg:text-sm font-bold tracking-[0.25em] text-brand-gold uppercase">
              The Armory
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-stone-900 mb-6 lg:mb-8 tracking-tight">Curated Resources</h2>
          <p className="text-stone-600 text-lg lg:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
            Tools, courses, and guides designed to deepen your understanding and practice.
          </p>
        </div>

        {/* Featured Product */}
        {featuredProduct && (
          <div className="mb-16 md:mb-24">
            <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 flex flex-col md:flex-row min-h-[500px] border border-stone-700/50">
              <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                <img
                  src={featuredProduct.imageUrl}
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-brand-gold text-stone-900 text-xs font-bold uppercase px-3 py-1 rounded-full">
                  Featured Collection
                </div>
              </div>
              <div className="md:w-1/2 p-10 md:p-14 lg:p-20 flex flex-col justify-center text-left">
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white mb-6 lg:mb-8 leading-[1.1] tracking-tight">{featuredProduct.name}</h3>
                <p className="text-stone-300 text-lg md:text-xl lg:text-2xl leading-relaxed mb-10 lg:mb-12 border-l-4 border-brand-gold pl-6 lg:pl-8 font-light">
                  {featuredProduct.description}
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                  <span className="text-3xl lg:text-4xl font-serif text-white">{featuredProduct.price}</span>
                  <a
                    href={featuredProduct.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group px-10 py-4 bg-white text-stone-900 font-bold rounded-xl hover:bg-stone-100 transition-all duration-300 uppercase text-sm tracking-widest text-center w-full sm:w-auto shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {featuredProduct.cta}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 mb-20 lg:mb-28">
          {otherProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-stone-200/80 hover:border-stone-300 flex flex-col hover:-translate-y-1">
              <div className="h-64 sm:h-72 overflow-hidden bg-stone-200 relative">
                 <img
                   src={product.imageUrl}
                   alt={product.name}
                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                 />
                 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-stone-900 text-xs font-bold px-3 py-1 rounded shadow-sm">
                   New Arrival
                 </div>
              </div>
              <div className="p-10 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                   <h3 className="text-2xl md:text-3xl font-serif text-stone-900 group-hover:text-stone-700 transition-colors tracking-tight leading-tight">{product.name}</h3>
                </div>
                <p className="text-stone-600 mb-10 flex-1 leading-relaxed text-base lg:text-lg font-light">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-8 border-t border-stone-200">
                  <span className="text-2xl font-serif text-stone-900">{product.price}</span>
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link flex items-center gap-2 text-stone-900 font-bold uppercase text-xs tracking-widest hover:text-brand-gold transition-all"
                  >
                    {product.cta}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover/link:translate-x-1 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://biblicalman.gumroad.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-stone-500 hover:text-stone-900 border-b border-stone-300 hover:border-stone-900 pb-1 transition-all text-sm font-medium uppercase tracking-widest"
          >
            View All Products on Gumroad
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
