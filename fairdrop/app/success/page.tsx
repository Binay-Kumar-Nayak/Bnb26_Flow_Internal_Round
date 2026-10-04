"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Download,
  Home,
  MapPin,
  CalendarDays,
  Ticket,
  QrCode,
} from "lucide-react";

export default function SuccessPage() {
  const bookingId = "FD-2026-A24X91";

  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-10">
      <div className="mx-auto max-w-3xl">

        {/* Success Header */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-12 w-12 text-green-400" />
          </div>

          <h1 className="text-4xl font-bold">
            Booking Confirmed
          </h1>

          <p className="mt-3 text-zinc-400">
            Your seat has been successfully reserved.
          </p>
        </div>

        {/* Ticket */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">

          {/* Ticket Header */}
          <div className="border-b border-zinc-800 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-500">
                  EVENT
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Night Shift / 001
                </h2>

                <p className="mt-1 text-zinc-400">
                  Mumbai
                </p>
              </div>

              <div className="rounded-lg bg-green-500/10 px-3 py-2 text-sm font-medium text-green-400">
                CONFIRMED
              </div>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="grid gap-6 p-6 sm:grid-cols-2">

            <div className="space-y-5">

              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-zinc-500" />

                <div>
                  <p className="text-xs text-zinc-500">
                    DATE
                  </p>

                  <p className="font-medium">
                    14 September 2026
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-zinc-500" />

                <div>
                  <p className="text-xs text-zinc-500">
                    LOCATION
                  </p>

                  <p className="font-medium">
                    Mumbai, Maharashtra
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Ticket className="h-5 w-5 text-zinc-500" />

                <div>
                  <p className="text-xs text-zinc-500">
                    SEAT
                  </p>

                  <p className="font-medium">
                    A24 · Premium
                  </p>
                </div>
              </div>

            </div>

            {/* QR */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-xl bg-white">
                <QrCode className="h-32 w-32 text-black" />
              </div>

              <p className="mt-3 text-xs text-zinc-500">
                Scan at the entrance
              </p>
            </div>

          </div>

          {/* Booking ID */}
          <div className="border-t border-zinc-800 px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">
                Booking ID
              </span>

              <span className="font-mono text-sm">
                {bookingId}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="border-t border-zinc-800 px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">
                Total paid
              </span>

              <span className="text-xl font-bold">
                ₹2,098
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">

          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-medium transition hover:bg-zinc-800"
          >
            <Download className="h-4 w-4" />
            Download Ticket
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-zinc-200"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>

        </div>

        {/* FairDrop message */}
        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-center">
          <p className="text-sm text-zinc-400">
            Your place was secured through the FairDrop queue.
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            Fair access · Protected inventory · Verified booking
          </p>
        </div>

      </div>
    </main>
  );
}