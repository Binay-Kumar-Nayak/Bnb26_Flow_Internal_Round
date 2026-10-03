"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  MapPin,
  Ticket,
  ArrowRight,
} from "lucide-react";

type Booking = {
  booking_id: string;
  seat: string;
  status: string;
};

export default function DashboardPage() {
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const storedBooking = localStorage.getItem("fairdrop_booking");

    if (storedBooking) {
      try {
        setBooking(JSON.parse(storedBooking));
      } catch (error) {
        console.error("Invalid booking data:", error);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Header */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-zinc-500">
              FAIRDROP
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              My Dashboard
            </h1>

            <p className="mt-2 text-zinc-400">
              Manage your tickets and bookings.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-zinc-800 px-4 py-2 text-sm transition hover:bg-zinc-900"
          >
            Back to Home
          </Link>
        </div>

        {/* Stats */}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">

          <Stat
            icon={<Ticket className="h-5 w-5" />}
            label="Active Tickets"
            value={booking ? "1" : "0"}
          />

          <Stat
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Confirmed Bookings"
            value={booking ? "1" : "0"}
          />

          <Stat
            icon={<Clock3 className="h-5 w-5" />}
            label="Booking Status"
            value={
              booking
                ? booking.status.toUpperCase()
                : "None"
            }
          />

        </div>

        {/* Active Booking */}

        <section className="mt-10">

          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Active Booking
            </h2>

            <p className="text-sm text-zinc-500">
              Your upcoming FairDrop ticket
            </p>
          </div>

          {!booking ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center">

              <Ticket className="mx-auto h-8 w-8 text-zinc-600" />

              <h3 className="mt-4 text-lg font-semibold">
                No active booking
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                You haven't completed a FairDrop booking yet.
              </p>

              <Link
                href="/tickets"
                className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-medium text-black hover:bg-zinc-200"
              >
                Browse Tickets
              </Link>

            </div>
          ) : (

            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">

              {/* Event */}

              <div className="border-b border-zinc-800 p-6">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                  <div>

                    <div className="flex items-center gap-3">

                      <h3 className="text-2xl font-bold">
                        Night Shift / 001
                      </h3>

                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                        {booking.status.toUpperCase()}
                      </span>

                    </div>

                    <p className="mt-2 text-zinc-400">
                      Your ticket has been successfully secured.
                    </p>

                  </div>

                  <div className="text-left sm:text-right">

                    <p className="text-xs text-zinc-500">
                      BOOKING ID
                    </p>

                    <p className="mt-1 font-mono text-sm">
                      {booking.booking_id}
                    </p>

                  </div>

                </div>

              </div>

              {/* Details */}

              <div className="grid gap-6 p-6 sm:grid-cols-3">

                <Detail
                  icon={<CalendarDays className="h-5 w-5" />}
                  label="DATE"
                  value="14 September 2026"
                />

                <Detail
                  icon={<MapPin className="h-5 w-5" />}
                  label="LOCATION"
                  value="Mumbai, Maharashtra"
                />

                <Detail
                  icon={<Ticket className="h-5 w-5" />}
                  label="SEAT"
                  value={`${booking.seat} · Premium`}
                />

              </div>

              {/* Price */}

              <div className="border-t border-zinc-800 p-6">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                  <div>

                    <p className="text-sm text-zinc-500">
                      TOTAL PAID
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      ₹2,098
                    </p>

                  </div>

                  <div className="flex gap-3">

                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-900"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>

                    <Link
                      href={`/success?booking=${booking.booking_id}&seat=${booking.seat}`}
                      className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
                    >
                      View Ticket
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                  </div>

                </div>

              </div>

            </div>

          )}

        </section>

        {/* Booking History */}

        <section className="mt-10">

          <div className="mb-4">

            <h2 className="text-xl font-semibold">
              Booking History
            </h2>

            <p className="text-sm text-zinc-500">
              Your previous FairDrop activity
            </p>

          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-800">

            {booking ? (
              <BookingRow
                event="Night Shift / 001"
                date="14 Sep 2026"
                seat={booking.seat}
                price="₹2,098"
                status="Confirmed"
              />
            ) : (
              <div className="p-6 text-center text-sm text-zinc-600">
                No booking history yet.
              </div>
            )}

          </div>

        </section>

        {/* Bottom Info */}

        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

          <div className="flex items-start gap-4">

            <div className="rounded-xl bg-green-500/10 p-3">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            </div>

            <div>

              <h3 className="font-semibold">
                Your booking is protected
              </h3>

              <p className="mt-1 text-sm leading-6 text-zinc-500">
                This ticket was issued after passing through the
                FairDrop queue and inventory protection system.
              </p>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}

/* ---------- Components ---------- */

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">

      <div className="flex items-center gap-3 text-zinc-500">
        {icon}

        <span className="text-sm">
          {label}
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="text-zinc-500">
        {icon}
      </div>

      <div>

        <p className="text-xs text-zinc-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium">
          {value}
        </p>

      </div>

    </div>
  );
}

function BookingRow({
  event,
  date,
  seat,
  price,
  status,
}: {
  event: string;
  date: string;
  seat: string;
  price: string;
  status: string;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-zinc-800 p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">

      <div>

        <p className="font-medium">
          {event}
        </p>

        <p className="mt-1 text-sm text-zinc-500">
          {date} · Seat {seat}
        </p>

      </div>

      <div className="flex items-center justify-between gap-6 sm:justify-end">

        <div>

          <p className="text-sm font-medium">
            {price}
          </p>

          <p className="mt-1 text-xs text-green-400">
            {status}
          </p>

        </div>

        <ArrowRight className="h-4 w-4 text-zinc-600" />

      </div>

    </div>
  );
}