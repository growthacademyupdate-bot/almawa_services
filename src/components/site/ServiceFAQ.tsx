"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  q: string;
  a: string;
}

interface ServiceFAQProps {
  faqs: FAQ[];
}

export function ServiceFAQ({ faqs }: ServiceFAQProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-20 bg-background border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-foreground">Frequently Asked Questions</h2>
          <p className="mt-4 text-muted-foreground">Everything you need to know about this service.</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base font-semibold">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
