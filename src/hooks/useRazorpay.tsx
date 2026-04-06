// src/hooks/useRazorpay.ts
//
// Drop-in hook for any Vite/React landing page.
// Works with the multi-tenant Next.js backend.
//
// SETUP in your Vite .env:
//   VITE_API_BASE_URL=http://localhost:3000     (Next.js dev server)
//   VITE_TENANT_ID=acme-corp                    (your client's tenant ID)
//
// NOTE: You no longer need VITE_RAZORPAY_KEY_ID — the backend
// returns the correct public key for your tenant automatically.

import { useState, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const TENANT_ID = import.meta.env.VITE_TENANT_ID;

interface PaymentOptions {
  amount: number;
  currency?: string;
  productName?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  themeColor?: string;
}

interface PaymentResult {
  status: "success" | "failure";
  paymentId?: string;
  orderId?: string;
  error?: string;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/** Shared headers for all API calls — includes tenant identification */
function apiHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "x-tenant-id": TENANT_ID,
  };
}

export function useRazorpay() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = useCallback(
    async (options: PaymentOptions): Promise<PaymentResult> => {
      setLoading(true);
      setError(null);

      if (!TENANT_ID) {
        const msg = "VITE_TENANT_ID is not set. Add it to your .env file.";
        setError(msg);
        setLoading(false);
        return { status: "failure", error: msg };
      }

      try {
        // 1. Load Razorpay checkout script
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) throw new Error("Failed to load Razorpay SDK");

        // 2. Create order via the multi-tenant backend
        const orderRes = await fetch(`${API_BASE_URL}/api/razorpay/create-order`, {
          method: "POST",
          headers: apiHeaders(),
          body: JSON.stringify({
            amount: options.amount,
            currency: options.currency || "INR",
            notes: options.notes,
          }),
        });

        if (!orderRes.ok) {
          const err = await orderRes.json().catch(() => ({ error: "Request failed" }));
          throw new Error(err.error || err.message || `HTTP ${orderRes.status}`);
        }

        const order = await orderRes.json();

        // 3. Open Razorpay Checkout
        //    The backend returns keyId per tenant — no need to hardcode it
        return new Promise<PaymentResult>((resolve) => {
          const rzpOptions = {
            key: order.keyId, // Public key from backend (tenant-specific)
            amount: order.amount,
            currency: order.currency,
            name: options.productName || "Payment",
            description: options.description || "",
            order_id: order.id,
            handler: async (response: any) => {
              try {
                // 4. Verify payment signature via backend
                const verifyRes = await fetch(
                  `${API_BASE_URL}/api/razorpay/verify-payment`,
                  {
                    method: "POST",
                    headers: apiHeaders(),
                    body: JSON.stringify({
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_signature: response.razorpay_signature,
                    }),
                  }
                );

                const result = await verifyRes.json();

                if (result.status === "success") {
                  resolve({
                    status: "success",
                    paymentId: result.paymentId,
                    orderId: result.orderId,
                  });
                } else {
                  resolve({
                    status: "failure",
                    error: result.error || "Verification failed",
                  });
                }
              } catch (err: any) {
                resolve({
                  status: "failure",
                  error: err.message || "Verification request failed",
                });
              } finally {
                setLoading(false);
              }
            },
            prefill: options.prefill || {},
            theme: { color: options.themeColor || "#6366f1" },
            modal: {
              ondismiss: () => {
                setLoading(false);
                resolve({
                  status: "failure",
                  error: "Payment cancelled by user",
                });
              },
            },
          };

          const rzp = new (window as any).Razorpay(rzpOptions);
          rzp.on("payment.failed", (response: any) => {
            setLoading(false);
            resolve({
              status: "failure",
              error: response.error?.description || "Payment failed",
            });
          });
          rzp.open();
        });
      } catch (err: any) {
        setLoading(false);
        const errorMsg = err.message || "Payment initiation failed";
        setError(errorMsg);
        return { status: "failure", error: errorMsg };
      }
    },
    []
  );

  return { initiatePayment, loading, error };
}