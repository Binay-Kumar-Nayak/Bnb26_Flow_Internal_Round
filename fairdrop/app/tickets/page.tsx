"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  ShieldCheck,
  Ticket,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

type Seat = {
  seat: string;
  status: "available" | "reserved";
};

export default function TicketsPage() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState(300);

  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [message, setMessage] = useState("");

  // --------------------------------------------------
  // LOAD SEATS
  // --------------------------------------------------

  useEffect(() => {
    loadSeats();
  }, []);

  async function loadSeats() {
    try {
      const response = await fetch(`${API_URL}/seats`);

      if (!response.ok) {
        throw new Error("Failed to load seats");
      }

      const data = await response.json();

      setSeats(data.seats);
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to FairDrop server.");
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // RESERVE SEAT
  // --------------------------------------------------

  async function selectSeat(seatId: string) {
    // Don't allow another seat while one is locked
    if (selectedSeat) {
      setMessage(
        `You already reserved ${selectedSeat}. Complete checkout first.`
      );
      return;
    }

    if (reserving) return;

    setReserving(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/seats/reserve/${seatId}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!data.success) {
        setMessage(data.message);

        await loadSeats();

        return;
      }

      // Save seat
      setSelectedSeat(data.seat);

      // Save reservation ID
      setReservationId(data.reservation_id);

      // Start 5 minute timer
      setTimeLeft(300);

      // Save in browser
      localStorage.setItem(
        "fairdrop_seat",
        data.seat
      );

      localStorage.setItem(
        "fairdrop_reservation_id",
        data.reservation_id
      );

      // Update UI immediately
      setSeats((previous) =>
        previous.map((seat) =>
          seat.seat === data.seat
            ? {
                ...seat,
                status: "reserved",
              }
            : seat
        )
      );

      setMessage(
        `Seat ${data.seat} reserved for 5 minutes.`
      );

    } catch (error) {
      console.error(error);

      setMessage(
        "Could not reserve this seat."
      );
    } finally {
      setReserving(false);
    }
  }

  // --------------------------------------------------
  // COUNTDOWN
  // --------------------------------------------------

  useEffect(() => {
    if (!selectedSeat) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => {

        if (previous <= 1) {

          setSelectedSeat(null);
          setReservationId(null);

          localStorage.removeItem(
            "fairdrop_seat"
          );

          localStorage.removeItem(
            "fairdrop_reservation_id"
          );

          loadSeats();

          setMessage(
            "Your seat reservation expired."
          );

          return 300;
        }

        return previous - 1;
      });

    }, 1000);

    return () => clearInterval(timer);

  }, [selectedSeat]);

  // --------------------------------------------------
  // FORMAT TIMER
  // --------------------------------------------------

  function formatTime(seconds: number) {

    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  // --------------------------------------------------
  // STATS
  // --------------------------------------------------

  const availableSeats =
    seats.filter(
      (seat) =>
        seat.status === "available"
    ).length;

  const reservedSeats =
    seats.filter(
      (seat) =>
        seat.status === "reserved"
    ).length;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-8 text-white">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <Link
            href="/queue"
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Queue
          </Link>

          <div className="flex items-center gap-2 text-sm text-green-400">

            <ShieldCheck className="h-4 w-4" />

            Protected Inventory

          </div>

        </div>


        {/* HEADING */}

        <div className="mt-12">

          <p className="text-sm tracking-widest text-zinc-500">
            NIGHT SHIFT / 001
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Choose your seat
          </h1>

          <p className="mt-2 text-zinc-400">
            Your selected seat will be locked for 5 minutes.
          </p>

        </div>


        {/* STATS */}

        <div className="mt-8 flex flex-wrap gap-3">

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">

            <span className="text-xs text-zinc-500">
              AVAILABLE
            </span>

            <p className="mt-1 font-semibold text-green-400">
              {availableSeats}
            </p>

          </div>


          <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">

            <span className="text-xs text-zinc-500">
              RESERVED
            </span>

            <p className="mt-1 font-semibold text-yellow-400">
              {reservedSeats}
            </p>

          </div>

        </div>


        {/* MAIN GRID */}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">


          {/* SEAT MAP */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

            <div className="mb-8 rounded-lg border border-zinc-800 bg-zinc-900 py-3 text-center text-sm text-zinc-500">
              STAGE
            </div>


            {loading ? (

              <div className="py-20 text-center text-zinc-500">
                Loading seats...
              </div>

            ) : (

              <div className="space-y-3">

                {"ABCDEFGH".split("").map((row) => (

                  <div
                    key={row}
                    className="flex items-center gap-2"
                  >

                    <span className="w-5 text-xs text-zinc-600">
                      {row}
                    </span>


                    <div className="grid flex-1 grid-cols-12 gap-1.5">

                      {seats
                        .filter((seat) =>
                          seat.seat.startsWith(row)
                        )
                        .map((seat) => {

                          const isSelected =
                            selectedSeat ===
                            seat.seat;

                          const isReserved =
                            seat.status ===
                            "reserved";

                          return (

                            <button
                              key={seat.seat}
                              disabled={
                                isReserved ||
                                reserving ||
                                !!selectedSeat
                              }
                              onClick={() =>
                                selectSeat(
                                  seat.seat
                                )
                              }
                              className={`
                                aspect-square rounded-md text-[10px]
                                transition
                                ${
                                  isSelected
                                    ? "bg-white text-black"
                                    : isReserved
                                    ? "cursor-not-allowed bg-zinc-800 text-zinc-600"
                                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                }
                              `}
                            >

                              {seat.seat.replace(
                                row,
                                ""
                              )}

                            </button>

                          );
                        })}

                    </div>

                  </div>

                ))}

              </div>

            )}


            {/* LEGEND */}

            <div className="mt-8 flex flex-wrap gap-5 text-xs text-zinc-500">

              <div className="flex items-center gap-2">

                <span className="h-3 w-3 rounded bg-zinc-900" />

                Available

              </div>


              <div className="flex items-center gap-2">

                <span className="h-3 w-3 rounded bg-white" />

                Selected

              </div>


              <div className="flex items-center gap-2">

                <span className="h-3 w-3 rounded bg-zinc-800" />

                Reserved

              </div>

            </div>

          </div>


          {/* SUMMARY */}

          <div className="h-fit rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

            <div className="flex items-center gap-3">

              <Ticket className="h-5 w-5 text-zinc-400" />

              <h2 className="font-semibold">
                Your Ticket
              </h2>

            </div>


            <div className="mt-6 space-y-4">


              <div className="flex justify-between">

                <span className="text-sm text-zinc-500">
                  Seat
                </span>

                <span className="font-medium">
                  {selectedSeat ||
                    "Not selected"}
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-sm text-zinc-500">
                  Ticket
                </span>

                <span className="font-medium">
                  Premium
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-sm text-zinc-500">
                  Price
                </span>

                <span>
                  ₹1,999
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-sm text-zinc-500">
                  Fee
                </span>

                <span>
                  ₹99
                </span>

              </div>


              <div className="border-t border-zinc-800 pt-4">

                <div className="flex justify-between">

                  <span className="font-medium">
                    Total
                  </span>

                  <span className="text-xl font-bold">
                    ₹2,098
                  </span>

                </div>

              </div>

            </div>


            {/* TIMER */}

            {selectedSeat && (

              <div className="mt-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">

                <div className="flex items-center gap-2 text-yellow-400">

                  <Clock className="h-4 w-4" />

                  <span className="text-sm">
                    Seat locked
                  </span>

                </div>


                <p className="mt-2 text-2xl font-bold text-yellow-400">
                  {formatTime(timeLeft)}
                </p>


                <p className="mt-1 text-xs text-zinc-500">
                  Complete checkout before the reservation expires.
                </p>

              </div>

            )}


            {/* MESSAGE */}

            {message && (

              <p className="mt-4 text-sm text-zinc-400">
                {message}
              </p>

            )}


            {/* CHECKOUT */}

            <Link
              href={
                selectedSeat &&
                reservationId
                  ? `/checkout?seat=${selectedSeat}&reservation=${reservationId}`
                  : "#"
              }
              onClick={(event) => {

                if (
                  !selectedSeat ||
                  !reservationId
                ) {

                  event.preventDefault();

                  setMessage(
                    "Please select a seat first."
                  );

                }

              }}
              className={`
                mt-6 flex w-full items-center justify-center
                rounded-xl px-4 py-3 font-medium transition
                ${
                  selectedSeat &&
                  reservationId
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "cursor-not-allowed bg-zinc-800 text-zinc-600"
                }
              `}
            >

              Continue to Checkout

            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}