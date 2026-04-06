import { trackAddToCart } from "@/utils/gtm";
import { PRODUCT as DEFAULT_PRODUCT } from "@/utils/product-info"; // Rename import to avoid conflict

interface AddToCartButtonProps {
  product?: any; // ✅ Added to support different products (like GA_PRODUCT)
  label?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  style?: React.CSSProperties; // ✅ Added to support background color styles
}

const AddToCartButton = ({
  product = DEFAULT_PRODUCT, // ✅ Default to standard product if none provided
  label = "Book Your Seat",
  onClick,
  className = "",
  type = "button",
  disabled = false,
  style,
}: AddToCartButtonProps) => {

  const handleClick = (e: React.MouseEvent) => {
    // ✅ Triggers tracking for the specific product passed (e.g., GA_PRODUCT)
    trackAddToCart(product);

    if (onClick) onClick();
  };

  return (
    <button
      type={type}
      style={style}
      disabled={disabled}
      onClick={handleClick}
      className={`
        flex items-center justify-center gap-2
        font-heading font-bold transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {label}
    </button>
  );
};

export default AddToCartButton;