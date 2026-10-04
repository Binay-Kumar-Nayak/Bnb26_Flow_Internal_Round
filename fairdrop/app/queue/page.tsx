"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ShieldCheck,
  Lock,
  Activity,
  Wifi,
  ArrowLeft,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

export default function QueuePage() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [queueSize, setQueueSize] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  // =========================================================
  // JOIN QUEUE
  // =========================================================

  useEffect(() => {
    async function joinQueue() {
      try {
        const response = await fetch(
          `${API_URL}/queue/join`,
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to join queue");
        }

        const data = await response.json();

        setUserId(data.user_id);
        setPosition(data.position);
        setQueueSize(data.queue_size);

      } catch (error) {
        console.error(error);
        setError(
          "Could not connect to FairDrop server."
        );
      } finally {
        setLoading(false);
      }
    }

    joinQueue();
  }, []);


  // =========================================================
  // CHECK QUEUE
  // =========================================================

  useEffect(() => {
    if (!userId) return;

    let redirectTimer: NodeJS.Timeout | null = null;

    async function checkQueue() {
      try {
        const response = await fetch(
          `${API_URL}/queue/status/${userId}`
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        console.log("Queue status:", data);

        // Still waiting
        if (data.status === "waiting") {

          setPosition(data.position);
          setQueueSize(data.queue_size);

        }

        // Queue finished
        if (data.status === "ready") {

          setReady(true);

          redirectTimer = setTimeout(() => {
            router.push("/tickets");
          }, 1500);
        }

      } catch (error) {
        console.error(
          "Queue status error:",
          error
        );
      }
    }

    // Check immediately
    checkQueue();

    // Then check every 3 seconds
    const interval = setInterval(
      checkQueue,
      3000
    );

    return () => {
      clearInterval(interval);

      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };

  }, [userId, router]);


  // =========================================================
  // PROGRESS
  // =========================================================

  let progress = 5;

  if (
    position !== null &&
    queueSize !== null &&
    queueSize > 0
  ) {
    progress =
      ((queueSize - position + 1) /
        queueSize) *
      100;

    progress = Math.max(
      5,
      Math.min(95, progress)
    );
  }


  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">

      <div className="mx-auto max-w-3xl">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />

            FairDrop
          </Link>

          <div className="flex items-center gap-2 text-xs text-green-400">

            <Wifi className="h-4 w-4" />

            Connected

          </div>

        </div>


        {/* MAIN */}

        <div className="mt-16 text-center">

          <p className="text-sm font-medium tracking-widest text-zinc-500">
            VIRTUAL WAITING ROOM
          </p>


          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">

            {ready
              ? "You're next."
              : "Your place is secured."}

          </h1>


          <p className="mx-auto mt-4 max-w-xl text-zinc-400">

            {ready
              ? "You are being moved to ticket selection."
              : "FairDrop is processing visitors in order. Keep this page open while you wait."}

          </p>


          {/* QUEUE CARD */}

          <div className="mx-auto mt-12 max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

            {/* LOADING */}

            {loading && (

              <>
                <p className="text-sm text-zinc-500">
                  Joining FairDrop queue...
                </p>

                <div className="mx-auto mt-6 h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
              </>

            )}


            {/* ERROR */}

            {!loading && error && (

              <>
                <p className="text-red-400">
                  {error}
                </p>

                <button
                  onClick={() =>
                    window.location.reload()
                  }
                  className="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black"
                >
                  Retry
                </button>
              </>

            )}


            {/* READY */}

            {!loading &&
              !error &&
              ready && (

                <>

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">

                    <ShieldCheck className="h-8 w-8 text-green-400" />

                  </div>


                  <p className="mt-5 text-lg font-semibold text-green-400">
                    Queue cleared
                  </p>


                  <p className="mt-2 text-sm text-zinc-500">
                    Opening ticket selection...
                  </p>


                  <div className="mx-auto mt-6 h-1.5 w-32 overflow-hidden rounded-full bg-zinc-800">

                    <div className="h-full w-full animate-pulse rounded-full bg-green-400" />

                  </div>

                </>

              )}


            {/* WAITING */}

            {!loading &&
              !error &&
              !ready && (

                <>

                  <p className="text-sm text-zinc-500">
                    YOUR QUEUE POSITION
                  </p>


                  <div className="mt-3 text-7xl font-bold">
                    #{position}
                  </div>


                  <p className="mt-3 text-sm text-zinc-500">
                    {queueSize} people currently in queue
                  </p>


                  {/* PROGRESS */}

                  <div className="mt-8">

                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">

                      <div
                        className="h-full rounded-full bg-white transition-all duration-700"
                        style={{
                          width: `${progress}%`,
                        }}
                      />

                    </div>


                    <div className="mt-2 flex justify-between text-xs text-zinc-600">

                      <span>
                        Joined
                      </span>

                      <span>
                        Entry
                      </span>

                    </div>

                  </div>

                </>

              )}

          </div>


          {/* SECURITY */}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">

            <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4">

              <div className="flex items-center gap-3">

                <ShieldCheck className="h-5 w-5 text-zinc-500" />

                <span className="text-sm text-zinc-400">
                  Session verified
                </span>

              </div>

              <span className="text-xs text-green-400">
                Active
              </span>

            </div>


            <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4">

              <div className="flex items-center gap-3">

                <Lock className="h-5 w-5 text-zinc-500" />

                <span className="text-sm text-zinc-400">
                  Queue position
                </span>

              </div>

              <span className="text-xs text-green-400">
                Locked
              </span>

            </div>


            <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4">

              <div className="flex items-center gap-3">

                <Activity className="h-5 w-5 text-zinc-500" />

                <span className="text-sm text-zinc-400">
                  Rate limit
                </span>

              </div>

              <span className="text-xs text-green-400">
                Active
              </span>

            </div>


            <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4">

              <div className="flex items-center gap-3">

                <Wifi className="h-5 w-5 text-zinc-500" />

                <span className="text-sm text-zinc-400">
                  Connection
                </span>

              </div>

              <span className="text-xs text-green-400">
                Secure
              </span>

            </div>

          </div>


          {/* WARNING */}

          {!ready && (

            <div className="mt-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 text-sm text-yellow-400">

              Don&apos;t refresh this page.
              Your queue position is associated
              with your session.

            </div>

          )}


          {/* SESSION ID */}

          {userId && (

            <p className="mt-6 text-xs text-zinc-700">
              Session: {userId}
            </p>

          )}

        </div>

      </div>

    </main>
  );
}