"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeIn } from "@/components/FadeIn";

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "What happens if the IndexHomes website closes down?",
    a: (
      <div className="space-y-3">
        <p>
          Every plot purchase creates a unique, verifiable ownership record that is securely
          backed-up on a separate independent system — not only stored on our main website servers.
        </p>
        <p>If the business ever stops operating:</p>
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>
            All customer ownership records will be transferred to an independent trusted third-party
            record-keeper.
          </li>
          <li>You will keep your official proof of ownership certificate for your plot.</li>
          <li>
            There is no guarantee another trading platform will pick up these plots, or that you will
            be able to sell your plot at its previous value.
          </li>
        </ol>
        <p className="text-white/55">
          Important reminder: Virtual plot values can go down as well as up, and there is no
          guarantee you will find a buyer at any time.
        </p>
      </div>
    ),
  },
  {
    q: "How does the platform index work?",
    a: (
      <p>
        IndexHomes uses one shared index for every plot. It starts at 10.0 and is calculated from
        completed paid sales only: Total Platform Value ÷ Total Units Issued. Your plot display
        price is Base Price × (Current Index ÷ 10.0).
      </p>
    ),
  },
  {
    q: "Is this crypto or blockchain?",
    a: (
      <p>
        No. Ownership stays in our secure database. Payments are by card, Apple Pay, and Google Pay
        via Stripe — no wallets or tokens.
      </p>
    ),
  },
  {
    q: "Who creates the plots?",
    a: (
      <p>
        For launch, plots are seeded by IndexHomes admin only. Seller-created listings may be added
        in a later version.
      </p>
    ),
  },
  {
    q: "Can I sell my plot later?",
    a: (
      <p>
        Yes — you will be able to list when you choose. Sale timing depends on marketplace demand.
        There is no promise of an immediate buyer, and values can rise or fall with activity.
      </p>
    ),
  },
];

const panelTransition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="space-y-8">
      <FadeIn className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-soft">
          FAQ
        </span>
        <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Frequently asked <span className="text-aurora">questions</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-mist">
          Clear answers about the index, ownership, and how IndexHomes works.
        </p>
      </FadeIn>

      <div className="mx-auto max-w-3xl space-y-3">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <FadeIn key={item.q} delay={0.04 * i}>
              <div className="glass overflow-hidden rounded-2xl">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.03] sm:px-6"
                >
                  <span className="font-display text-base font-semibold tracking-tight sm:text-lg">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{
                      rotate: isOpen ? 45 : 0,
                      backgroundColor: isOpen ? "rgba(56, 189, 180, 0.2)" : "rgba(255, 255, 255, 0.04)",
                      color: isOpen ? "rgb(153, 246, 228)" : "rgba(255, 255, 255, 0.7)",
                    }}
                    transition={panelTransition}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15"
                    aria-hidden
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={panelTransition}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={{ y: -6 }}
                        animate={{ y: 0 }}
                        exit={{ y: -4 }}
                        transition={panelTransition}
                        className="border-t border-white/10 px-5 py-4 text-sm leading-relaxed text-mist sm:px-6 sm:text-[15px]"
                      >
                        {item.a}
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
