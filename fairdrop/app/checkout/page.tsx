"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  Lock,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const seatFromUrl = searchParams.get("seat");
  const reservationFromUrl = searchParams.get("reservation");

  const [seat, setSeat] = useState<string | null>(seatFromUrl);
  const [reservationId, setReservationId] =
    useState<string | null>(reservationFromUrl);

  const [activeMethod, setActiveMethod] = useState("upi");
  const [verifying, setVerifying] = useState(true);
  const [validReservation, setValidReservation] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function verifyReservation() {
      if (!seatFromUrl || !reservationFromUrl) {
        setError("No valid seat reservation found.");
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/reservations/verify/${reservationFromUrl}`
        );

        const data = await response.json();

        if (!data.valid) {
          setError("Your seat reservation has expired.");
          setValidReservation(false);
          return;
        }

        setSeat(data.seat);
        setReservationId(data.reservation_id);
        setValidReservation(true);
      } catch (error) {
        console.error(error);
        setError("Could not connect to FairDrop server.");
      } finally {
        setVerifying(false);
      }
    }

    verifyReservation();
  }, [seatFromUrl, reservationFromUrl]);

  async function handlePayment() {
    if (!seat || !reservationId) {
      setError("Invalid reservation.");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/bookings?seat_id=${seat}&reservation_id=${reservationId}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        setProcessing(false);
        return;
      }

      const booking = data.booking;

      localStorage.setItem(
        "fairdrop_booking",
        JSON.stringify(booking)
      );

      router.push(
        `/success?booking=${booking.booking_id}&seat=${booking.seat}`
      );
    } catch (error) {
      console.error(error);
      setError("Payment failed. Please try again.");
      setProcessing(false);
    }
  }

  if (verifying) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />

            <p className="mt-5 text-sm text-zinc-500">
              Verifying your seat reservation...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!validReservation) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
        <div className="mx-auto max-w-xl pt-20 text-center">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
            <h1 className="text-2xl font-bold">
              Reservation expired
            </h1>

            <p className="mt-3 text-sm text-zinc-500">
              {error || "This seat is no longer reserved for you."}
            </p>

            <Link
              href="/tickets"
              className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-medium text-black"
            >
              Choose another seat
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-8 text-white">
      <div className="mx-auto max-w-5xl">

        <div className="flex items-center justify-between">
          <Link
            href="/tickets"
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Seats
          </Link>

          <div className="flex items-center gap-2 text-xs text-green-400">
            <ShieldCheck className="h-4 w-4" />
            Reservation verified
          </div>
        </div>

        <div className="mt-12">
          <p className="text-sm tracking-widest text-zinc-500">
            SECURE CHECKOUT
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Complete your booking
          </h1>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* PAYMENT */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

            <h2 className="text-lg font-semibold">
              Payment method
            </h2>

            <div className="mt-6 grid grid-cols-3 gap-2">

              <button
                onClick={() => setActiveMethod("upi")}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-xs transition ${
                  activeMethod === "upi"
                    ? "border-white bg-white text-black"
                    : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
                }`}
              >
                <Smartphone className="h-5 w-5" />
                UPI
              </button>

              <button
                onClick={() => setActiveMethod("card")}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-xs transition ${
                  activeMethod === "card"
                    ? "border-white bg-white text-black"
                    : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
                }`}
              >
                <CreditCard className="h-5 w-5" />
                Card
              </button>

              <button
                onClick={() => setActiveMethod("netbanking")}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-xs transition ${
                  activeMethod === "netbanking"
                    ? "border-white bg-white text-black"
                    : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
                }`}
              >
                <Building2 className="h-5 w-5" />
                Net Banking
              </button>

            </div>

            <div className="mt-8">

              {activeMethod === "upi" && (
                <div>
                  <label className="text-sm text-zinc-400">
                    UPI ID
                  </label>

                  <input
                    type="text"
                    placeholder="yourname@upi"
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                  />
                </div>
              )}

              {activeMethod === "card" && (
                <div className="space-y-4">

                  <div>
                    <label className="text-sm text-zinc-400">
                      Card number
                    </label>

                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none"
                    />

                    <input
                      type="text"
                      placeholder="CVV"
                      className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none"
                    />

                  </div>
                </div>
              )}

              {activeMethod === "netbanking" && (
                <div>

                  <label className="text-sm text-zinc-400">
                    Select bank
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none">
                    <option>Select your bank</option>
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                  </select>

                </div>
              )}

            </div>

            <div className="mt-8 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">

              <Lock className="h-4 w-4 text-green-400" />

              <p className="text-xs text-zinc-500">
                Your payment details are encrypted.
              </p>

            </div>

          </div>

          {/* ORDER SUMMARY */}

          <div className="h-fit rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

            <h2 className="font-semibold">
              Order summary
            </h2>

            <div className="mt-6">
              <p className="text-sm text-zinc-500">
                NIGHT SHIFT / 001
              </p>

              <p className="mt-1 text-lg font-semibold">
                Premium Ticket
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Mumbai • 14 Sep 2026
              </p>
            </div>

            <div className="mt-6 space-y-4 border-t border-zinc-800 pt-5">

              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">
                  Seat
                </span>

                <span className="font-medium">
                  {seat}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">
                  Ticket
                </span>

                <span>
                  ₹1,999
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">
                  Booking fee
                </span>

                <span>
                  ₹99
                </span>
              </div>

              <div className="border-t border-zinc-800 pt-4">

                <div className="flex justify-between">

                  <span className="font-semibold">
                    Total
                  </span>

                  <span className="text-xl font-bold">
                    ₹2,098
                  </span>

                </div>

              </div>

            </div>

            <button
              onClick={handlePayment}
              disabled={processing}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing
                ? "Confirming booking..."
                : "Pay ₹2,098"}
            </button>

            {error && (
              <p className="mt-4 text-center text-sm text-red-400">
                {error}
              </p>
            )}

            <p className="mt-4 text-center text-xs text-zinc-600">
              Demo payment — no real money is charged.
            </p>

          </div>

        </div>
      </div>
    </main>
  );
}