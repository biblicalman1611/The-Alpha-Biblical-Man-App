import React from 'react';
import { Product } from '../types';

interface ProductSectionProps {
  products: Product[];
}

const ProductSection: React.FC<ProductSectionProps> = ({ products }) => {
  const featuredProduct = products.find(p => p.isFeatured);
  const otherProducts = products.filter(p => !p.isFeatured);

  return (
    <div className="py-24 bg-stone-100 border-t border-stone-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.2em] text-brand-gold uppercase mb-2 block">
            The Armory
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-4">Curated Resources</h2>
          <p className="text-stone-600 max-w-xl mx-auto font-light leading-relaxed">
            Tools, courses, and guides designed to deepen your understanding and practice.
          </p>
        </div>

        {/* Featured Product */}
        {featuredProduct && (
          <div className="mb-12 md:mb-16">
            <div className="bg-stone-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[400px]">
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
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-left">
                <h3 className="text-2xl md:text-4xl font-serif text-white mb-4 leading-tight">{featuredProduct.name}</h3>
                <p className="text-stone-400 text-base md:text-lg leading-relaxed mb-8 border-l-2 border-brand-gold pl-4">
                  {featuredProduct.description}
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <span className="text-2xl font-light text-white">{featuredProduct.price}</span>
                  <a 
                    href={featuredProduct.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-white text-stone-900 font-bold rounded hover:bg-stone-200 transition-colors uppercase text-sm tracking-widest text-center w-full sm:w-auto"
                  >
                    {featuredProduct.cta}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {otherProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200 flex flex-col">
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
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                   <h3 className="text-xl md:text-2xl font-serif text-stone-900 group-hover:text-stone-600 transition-colors">{product.name}</h3>
                </div>
                <p className="text-stone-600 mb-8 flex-1 leading-relaxed text-sm">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-stone-100">
                  <span className="text-lg font-bold text-stone-900">{product.price}</span>
                  <a 
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-stone-900 font-bold uppercase text-xs tracking-wider hover:text-brand-gold transition-colors"
                  >
                    {product.cta} &rarr;
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