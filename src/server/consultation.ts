export type ConsultationInput = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  phone: string;
  country: string;
  subject: string;
  service: string;
  stage: string;
  message: string;
  company?: string;
};

export async function createConsultation({
  data,
}: {
  data: ConsultationInput;
}) {
  const response = await fetch("/api/consultations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? `Consultation request failed (${response.status})`);
  }

  return response.json() as Promise<{ id: string }>;
}

export async function getConsultations() {
  const response = await fetch("/api/consultations");

  if (!response.ok) {
    throw new Error("Unable to load consultations");
  }

  return response.json();
}