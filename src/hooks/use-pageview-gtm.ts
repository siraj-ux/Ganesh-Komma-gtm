import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/utils/gtm";
import { GA_PRODUCT, PRODUCT } from "@/utils/product-info";


export const usePageViewGTM = () => {
    const location = useLocation();
    const GA_PAGE = location.pathname === "/"; // Assuming GA version is served on /ga route
    const Page = location.pathname === "/fb"
    const product = GA_PAGE ? GA_PRODUCT : PRODUCT;

    useEffect(() => {
        if (Page || GA_PAGE) {
            trackPageView({ location, title: document.title, product });
        }

    }, [location.pathname])

}