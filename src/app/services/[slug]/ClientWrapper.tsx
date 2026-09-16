"use client";

import { useApp } from "@/context/AppContext";
import { CtaBand } from "@/components/site/primitives";

export default function ClientServiceDetailWrapper({ serviceName, isCtaBand = false }: { serviceName: string, isCtaBand?: boolean }) {
  const { openConsultation } = useApp();

  if (isCtaBand) {
    return (
      <CtaBand
        title={`Ready to start with ${serviceName}?`}
        subtitle="Book a free consultation with an Almawa expert."
        onCta={() => openConsultation(serviceName)}
        ctaLabel="Apply Now"
      />
    );
  }

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <button
        onClick={() => openConsultation(serviceName)}
        className="rounded-full bg-[#ff5a1f] text-white px-7 py-4 text-sm font-bold shadow-lg hover:shadow-xl hover:bg-[#e04d1a] transition"
      >
        Apply Now
      </button>

      <button
        onClick={() => openConsultation(serviceName)}
        className="rounded-full glass text-white px-7 py-4 text-sm font-bold hover:bg-white/20"
      >
        Get Consultation
      </button>
    </div>
  );
}
