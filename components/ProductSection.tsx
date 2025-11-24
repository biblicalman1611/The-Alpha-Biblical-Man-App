
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductSectionProps {
  products: Product[];
}

const ProductSection: React.FC<ProductSectionProps> = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPrice, setSelectedPrice] = useState<string>('All');

  const featuredProduct = products.find(p => p.isFeatured);
  
  // Get unique categories for filter
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const priceRanges = ['All', 'Under $50', '$50 - $100', '$100+'];

  const getPriceValue = (priceStr: string) => parseFloat(priceStr.replace(/[^0-9.]/g, ''));

  // Filter ONLY non-featured products for the grid
  const filteredProducts = products.filter(p => {
    if (p.isFeatured) return false;

    // Category Filter
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

    // Price Filter
    const val = getPriceValue(p.price);
    if (selectedPrice === 'Under $50' && val >= 50) return false;
    if (selectedPrice === '$50 - $100' && (val < 50 || val > 100)) return false;
    if (selectedPrice === '$100+' && val <= 100) return false;

    return true;
  });

  const handleTrackClick = (productName: string) => {
    console.log(`[Analytics] Event: 'buy_now_click' | Product: '${productName}' | Section: 'Products'`);
  };

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

        {/* Featured Product - Always Visible */}
        {featuredProduct && (
          <div className="mb-16">
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
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <a 
                      href={featuredProduct.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleTrackClick(featuredProduct.name)}
                      className="px-8 py-3 bg-white text-stone-900 font-bold rounded hover:bg-stone-200 transition-colors uppercase text-sm tracking-widest text-center w-full sm:w-auto"
                    >
                      {featuredProduct.cta}
                    </a>
                    <a 
                      href={featuredProduct.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleTrackClick(featuredProduct.name)}
                      className="px-8 py-3 bg-transparent border border-brand-gold text-brand-gold font-bold rounded hover:bg-brand-gold hover:text-stone-900 transition-colors uppercase text-sm tracking-widest text-center w-full sm:w-auto"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-stone-200">
           {/* Category Filters */}
           <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
                    selectedCategory === cat 
                      ? 'bg-stone-900 text-white' 
                      : 'bg-white text-stone-500 hover:text-stone-900 border border-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
           
           {/* Price Filters */}
           <div className="flex items-center gap-3">
             <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Price:</span>
             <div className="flex gap-2">
                {priceRanges.map(price => (
                   <button
                     key={price}
                     onClick={() => setSelectedPrice(price)}
                     className={`text-xs font-bold uppercase tracking-wider px-2 py-1 transition-colors ${
                       selectedPrice === price
                         ? 'text-brand-gold border-b-2 border-brand-gold'
                         : 'text-stone-500 hover:text-stone-900'
                     }`}
                   >
                     {price}
                   </button>
                ))}
             </div>
           </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-fadeIn">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200 flex flex-col">
                <div className="h-64 sm:h-72 overflow-hidden bg-stone-200 relative">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  {product.category && (
                    <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                      {product.category}
                    </div>
                  )}
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
                      onClick={() => handleTrackClick(product.name)}
                      className="flex items-center gap-2 text-stone-900 font-bold uppercase text-xs tracking-wider hover:text-brand-gold transition-colors"
                    >
                      {product.cta} &rarr;
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-stone-200 border-dashed mb-16">
            <h3 className="text-lg font-serif text-stone-400">No products found matching your criteria.</h3>
            <button 
              onClick={() => { setSelectedCategory('All'); setSelectedPrice('All'); }}
              className="mt-4 text-xs font-bold uppercase tracking-wider text-stone-900 underline"
            >
              Clear Filters
            </button>
          </div>
        )}

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
