declare global {
    interface Window {
        dataLayer: any[];
    }
}

import { CURRENCY, ORDER, PRODUCT } from "./product-info";

export const generateTxnId = () => {
  return `txn_${Date.now()}`;
};

export const pushEvent = (eventName, eventData ={}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: eventName,
        ...eventData
    })
}

export const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source : params.get('utm_source') || "direct",
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_term: params.get('utm_term') || '',
        utm_content: params.get('utm_content') || '',
        gclid: params.get('gclid') || '',
        fbclid: params.get('fbclid') || '',
    }
}

export const trackPageView = ({location, title, product} : { location : {pathname: string}; title: string; product: typeof PRODUCT }) => {
    pushEvent("view_item", {
        page_path: location.pathname,
        page_title: title,
        currency : CURRENCY,
        value : product.price,
        items: [{
            item_id: product.item_id,
            item_name: product.item_name,
            item_category: product.item_category,
            price: product.price,
            quantity: product.quantity || 1,
        }],
        ...getUTMParams(),

    })
}

export const trackFormSubmit = ({formName, formData }: {formName: string, formData: Record<string, any>}) => {
    pushEvent("_form_submit", {
        form_name : formName,
        form_fields: Object.values(formData).join(", "),
        page_path: window.location.pathname,
        page_url: window.location.href,
        lead_email: formData.email || '',
        ...getUTMParams(),
    })

}

export const trackFormError = ({formName, errorMessage } : {formName: string, errorMessage: string}) => {
    pushEvent('form_error', {
        form_name: formName,
        error_message: errorMessage,
        page_path: window.location.pathname,
        ...getUTMParams(),
    })

}

export const trackSubscribe = ({label, ctaLocation}: {label: string, ctaLocation: string}) => {
    pushEvent("subscribe", {
            cta_label: label,
            cta_location: ctaLocation,
            ...getUTMParams(),
        })
}

export const trackAddToCart = (product: typeof PRODUCT ) : void => {
    pushEvent("add_to_cart", {
        currency : CURRENCY,
        value : product.price,
        items: [{
            item_id: product.item_id,
            item_name: product.item_name,
            item_category: product.item_category,
            price: product.price,
            quantity: product.quantity || 1,
        }],
        ...getUTMParams(),
    })
}

export const trackPurchase = (order: typeof ORDER) => {
    pushEvent("purchase", {
        transaction_id : order.transaction_id,
        value : order.value,
        currency : CURRENCY,
        tax : order.tax || 0,
        shipping: order.shipping || 0,
        coupon: order.coupon || '',
        items: order.items.map((item : typeof PRODUCT) => ({
            item_id: item.item_id,
            item_name: item.item_name,
            item_category: item.item_category,
            price: item.price,
            quantity: item.quantity || 1,
        
        })), 
        ...getUTMParams(),
    })
}
