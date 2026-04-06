import React from "react";
import { trackSubscribe } from "@/utils/gtm";
import {
  CURRENCY_SYMBOL,
  OG_PRICE,
  DISCOUNTED_PRICE,
} from "@/utils/product-info";

interface SubscribeButtonProps {
  ogPrice?: string;
  price?: string;
  label?: React.ReactNode; // Changed from string to React.ReactNode
  ctaLocation?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties; // Added style prop support
}

const SubscribeButton = ({
  ogPrice = `${CURRENCY_SYMBOL}${OG_PRICE}`,
  price = `${CURRENCY_SYMBOL}${DISCOUNTED_PRICE}`,
  label = "Book Your Seat @",
  ctaLocation = "unknown",
  href = "#checkout",
  onClick,
  className = "",
  style,
}: SubscribeButtonProps) => {

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Extract text for GTM if label is an object, otherwise use as is
    const trackingLabel = typeof label === 'string' ? label : "Register Now & Get Access";

    // ✅ GTM tracking
    trackSubscribe({
      label: trackingLabel,
      ctaLocation,
      price,
    });

    // optional custom handler
    if (onClick) onClick();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      style={style}
      className={`inline-block text-center ${className}`}
    >
      <span>{label}</span>
    </a>
  );
};

export default SubscribeButton;