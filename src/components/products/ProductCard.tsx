import React from 'react';
import { Product } from '../../types/product';
import { formatPrice } from '../../utils/formatters';
import { Edit2, Trash2, Barcode as BarcodeIcon } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  return (
    <div className="product-card fade-in">
      <div className="product-img-wrapper">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-img"
          loading="lazy"
          onError={(e) => {
            // Fallback in case image fails to load
            (e.target as HTMLElement).setAttribute('src', 'https://via.placeholder.com/300x200?text=بدون+صورة');
          }}
        />
      </div>

      <div className="product-content">
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        <div className="product-barcode">
          <span>{product.barcode}</span>
          <BarcodeIcon size={16} />
        </div>

        <div className="product-price">
          {formatPrice(product.price)}
        </div>

        {(onEdit || onDelete) && (
          <div className="product-actions">
            {onEdit && (
              <button
                onClick={() => onEdit(product)}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
              >
                <Edit2 size={16} />
                تعديل
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(product)}
                className="btn btn-danger"
                style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
              >
                <Trash2 size={16} />
                حذف
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
