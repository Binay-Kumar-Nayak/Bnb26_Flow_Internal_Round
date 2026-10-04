"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  Ticket,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08090c] text-white">

      {/* Navbar */}

      <nav className="flex items-center justify-between border-b border-white/10 px-6 py-5 lg:px-12">

        <div className="text-xl font-bold tracking-tight">
          Fair<span className="text-violet-400">Drop</span>
        </div>

        <div className="hidden items-center gap-8 text-sm text-gray-400 md:flex">

          <a
            href="#how-it-works"
            className="hover:text-white"
          >
            How it works
          </a>

          <a
            href="#security"
            className="hover:text-white"
          >
            Security
          </a>

          <Link
            href="/queue"
            className="hover:text-white"
          >
            Queue
          </Link>

          <Link
            href="/dashboard"
            className="hover:text-white"
          >
            Dashboard
          </Link>

        </div>

        <Link
          href="/queue"
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200"
        >
          Enter Queue
        </Link>

      </nav>

      {/* Hero */}

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-12 lg:pt-32">

        <div className="max-w-4xl">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-sm text-violet-300">

            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />

            Flash sale opens soon

          </div>

          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-8xl">

            A fair shot at

            <br />

            <span className="text-violet-400">
              500 seats.
            </span>

          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-400">
            FairDrop protects limited ticket sales from traffic spikes and
            automated bots by giving every user a controlled place in the
            queue.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              href="/queue"
              className="group flex items-center gap-2 rounded-xl bg-violet-500 px-6 py-3.5 font-medium transition hover:bg-violet-400"
            >
              Enter Waiting Room

              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#how-it-works"
              className="rounded-xl border border-white/10 px-6 py-3.5 font-medium text-gray-300 transition hover:bg-white/5"
            >
              How it works
            </a>

          </div>

        </div>

        {/* Live statistics */}

        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">

          <Stat
            icon={<Users size={18} />}
            value="50,000"
            label="Potential users"
          />

          <Stat
            icon={<Ticket size={18} />}
            value="500"
            label="Total seats"
          />

          <Stat
            icon={<Zap size={18} />}
            value="2,431"
            label="Currently waiting"
          />

          <Stat
            icon={<ShieldCheck size={18} />}
            value="98.7%"
            label="Traffic classified"
          />

        </div>

      </section>

      {/* Event */}

      <section className="border-y border-white/10 bg-white/[0.02]">

        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-12">

          <div>

            <p className="text-sm uppercase tracking-[0.25em] text-violet-400">
              Event / 001
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight">
              Night Shift
            </h2>

            <p className="mt-4 text-gray-400">
              A limited-capacity live event in Mumbai. 500 seats. Thousands of
              people. One fair queue.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">

              <Info
                label="Date"
                value="14 September 2026"
              />

              <Info
                label="Location"
                value="Mumbai, India"
              />

              <Info
                label="Capacity"
                value="500 seats"
              />

              <Info
                label="Status"
                value="Opening soon"
              />

            </div>

          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0d0f14] p-8">

            <p className="text-sm text-gray-500">
              Sale begins in
            </p>

            <div className="mt-4 text-5xl font-semibold tracking-tight">
              00:14:32
            </div>

            <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10">

              <div className="h-full w-[68%] rounded-full bg-violet-500" />

            </div>

            <div className="mt-3 flex justify-between text-sm text-gray-500">

              <span>
                Waiting room open
              </span>

              <span>
                68%
              </span>

            </div>

            <Link
              href="/queue"
              className="mt-8 block rounded-xl bg-white px-5 py-3 text-center font-medium text-black transition hover:bg-gray-200"
            >
              Join Waiting Room
            </Link>

          </div>

        </div>

      </section>

      {/* How it works */}

      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-12"
      >

        <div className="max-w-2xl">

          <p className="text-sm uppercase tracking-[0.25em] text-violet-400">
            How FairDrop works
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            Built for high-demand drops.
          </h2>

          <p className="mt-4 text-gray-400">
            Instead of letting thousands of users race against automated
            scripts, FairDrop controls access through a fair queue.
          </p>

        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">

          <Feature
            number="01"
            icon={<Users />}
            title="Fair Queue"
            description="Users receive a queue position instead of competing through endless refreshes and requests."
          />

          <Feature
            number="02"
            icon={<ShieldCheck />}
            title="Bot Protection"
            description="Suspicious traffic can be detected, rate-limited and challenged before reaching inventory."
          />

          <Feature
            number="03"
            icon={<Ticket />}
            title="Protected Inventory"
            description="Temporary seat reservations prevent multiple users from claiming the same inventory."
          />

        </div>

      </section>

      {/* Footer */}

      <footer className="border-t border-white/10 px-6 py-8 lg:px-12">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-gray-500 md:flex-row">

          <p>
            Fair<span className="text-violet-400">Drop</span> — fair access to
            limited drops.
          </p>

          <p>
            Prototype • Simulated inventory
          </p>

        </div>

      </footer>

    </main>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-[#0d0f14] p-6">

      <div className="flex items-center gap-2 text-gray-500">
        {icon}
      </div>

      <div className="mt-4 text-3xl font-semibold tracking-tight">
        {value}
      </div>

      <div className="mt-1 text-sm text-gray-500">
        {label}
      </div>

    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">

      <p className="text-xs uppercase tracking-wider text-gray-600">
        {label}
      </p>

      <p className="mt-2 text-sm text-gray-300">
        {value}
      </p>

    </div>
  );
}

function Feature({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-[#0d0f14] p-7 transition hover:border-violet-400/30">

      <div className="flex items-center justify-between">

        <div className="text-violet-400">
          {icon}
        </div>

        <span className="text-sm text-gray-600">
          {number}
        </span>

      </div>

      <h3 className="mt-8 text-xl font-medium">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        {description}
      </p>

    </div>
  );
}

