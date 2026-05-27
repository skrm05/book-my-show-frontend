import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export const usePaymentHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const paymentId = searchParams.get("paymentId");
    const payerId = searchParams.get("PayerID");
    const bookingId = searchParams.get("bookingId");

    if (paymentId && bookingId && !hasProcessed.current) {
      hasProcessed.current = true;

      const processPayment = async () => {
        const toastId = toast.loading("Verifying payment status...");

        try {
          if (payerId) {
            await axiosClient.get(ENDPOINTS.PAYMENT.PAYMENT_SUCCESS, {
              params: { paymentId, PayerID: payerId, bookingId },
            });
            toast.success("Payment successful! Your tickets are confirmed.", {
              id: toastId,
            });
          } else {
            await axiosClient.get(ENDPOINTS.PAYMENT.PAYMENT_CANCEL, {
              params: { paymentId, bookingId },
            });
            toast.error(
              "Payment was cancelled. Your booking was not completed.",
              { id: toastId },
            );
          }
        } catch (error: any) {
          toast.error(
            error.response?.data?.message ||
              "Failed to verify payment with server.",
            { id: toastId },
          );
        } finally {
          navigate("/", { replace: true });
        }
      };

      processPayment();
    }
  }, [searchParams, navigate]);
};
