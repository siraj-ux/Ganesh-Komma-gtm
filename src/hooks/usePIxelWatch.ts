// // src/hooks/useFacebookPixel.ts
// import { useEffect } from "react";

// const PIXEL_ID = "703866332721390";

// declare global {
//   interface Window {
//     fbq: any;
//     _fbq: any;
//   }
// }

// interface PixelOptions {
//   eventName?: string;
//   eventParams?: Record<string, any>;
// }

// export function useFacebookPixel({
//   eventName,
//   eventParams,
// }: PixelOptions = {}) {
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     // Load Pixel script only once
//     if (!window.fbq) {
//       (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
//         if (f.fbq) return;

//         n = f.fbq = function () {
//           n.callMethod
//             ? n.callMethod.apply(n, arguments)
//             : n.queue.push(arguments);
//         };

//         if (!f._fbq) f._fbq = n;
//         n.push = n;
//         n.loaded = true;
//         n.version = "2.0";
//         n.queue = [];

//         t = b.createElement(e);
//         t.async = true;
//         t.src = v;

//         s = b.getElementsByTagName(e)[0];
//         s.parentNode?.insertBefore(t, s);
//       })(
//         window,
//         document,
//         "script",
//         "https://connect.facebook.net/en_US/fbevents.js"
//       );

//       window.fbq("init", PIXEL_ID);
//       window.fbq("track", "PageView");
//     }

//     // Track custom event (Purchase, Lead, etc.)
//     if (eventName) {
//       window.fbq("track", eventName, eventParams || {});
//     }
//   }, []); // Run only once on mount
// }