import React from 'react';
import { Product } from '../types';

interface ProductSectionProps {
  products: Product[];
}

const ProductSection: React.FC<ProductSectionProps> = ({ products }) => {
  return (
    <div className="py-24 bg-stone-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Curated Resources</h2>
          <p className="text-stone-600 max-w-xl mx-auto">
            Tools, courses, and guides designed to deepen your understanding and practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="h-64 overflow-hidden bg-stone-200 relative">
                 <img 
                   src={product.imageUrl} 
                   alt={product.name}
                   className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                 />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-2xl font-serif text-stone-900">{product.name}</h3>
                   <span className="text-lg font-medium text-stone-600">{product.price}</span>
                </div>
                <p className="text-stone-600 mb-8 flex-1 leading-relaxed">
                  {product.description}
                </p>
                <a 
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center py-3 bg-stone-900 text-white rounded hover:bg-stone-700 transition-colors font-medium"
                >
                  {product.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSection;