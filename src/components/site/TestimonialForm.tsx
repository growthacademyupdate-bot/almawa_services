"use client";

import { useState } from "react";
import { CheckCircle2, Send, Star } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function TestimonialForm() {
  const { addTestimonial } = useApp();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    const cleanName = name.trim();
    const cleanCompany = company.trim();
    const cleanComment = comment.trim();

    if (!cleanName) {
      setError("Please enter your name.");
      return;
    }

    if (!cleanCompany) {
      setError("Please enter your company name.");
      return;
    }

    if (!cleanComment) {
      setError("Please enter your testimonial.");
      return;
    }

    if (cleanComment.length < 10) {
      setError(
        "Please enter at least 10 characters in your testimonial.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      addTestimonial({
        name: cleanName,
        company: cleanCompany,
        rating,
        comment: cleanComment,
        image: "",
      });

      setName("");
      setCompany("");
      setRating(5);
      setComment("");

      setSubmitted(true);
    } catch (submitError) {
      console.error(
        "Failed to submit testimonial:",
        submitError,
      );

      setError(
        "Unable to submit your testimonial. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
        </div>

        <h3 className="mt-5 text-2xl font-bold text-foreground">
          Thank You!
        </h3>

        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Your testimonial has been submitted successfully.
          It will be published after our team reviews and
          approves it.
        </p>

        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 rounded-full gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:scale-105"
        >
          Submit Another Testimonial
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Star className="h-7 w-7 fill-primary" />
        </div>

        <h2 className="mt-5 text-3xl font-bold text-foreground">
          Share Your Experience
        </h2>

        <p className="mt-2 text-muted-foreground">
          Tell us about your experience with Almawa Services.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        {/* Name + Company */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Your Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter your name"
              maxLength={100}
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Company
            </label>

            <input
              type="text"
              value={company}
              onChange={(event) =>
                setCompany(event.target.value)
              }
              placeholder="Enter your company"
              maxLength={150}
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-foreground">
            Your Rating
          </label>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                aria-label={`Give ${star} star${
                  star === 1 ? "" : "s"
                }`}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-7 w-7 ${
                    star <= rating
                      ? "fill-primary text-primary"
                      : "text-muted-foreground/25"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Testimonial
          </label>

          <textarea
            value={comment}
            onChange={(event) =>
              setComment(event.target.value)
            }
            placeholder="Tell us about your experience with Almawa Services..."
            rows={6}
            maxLength={1000}
            required
            className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
          />

          <div className="mt-1 text-right text-xs text-muted-foreground">
            {comment.length}/1000
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-full gradient-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />

            {isSubmitting
              ? "Submitting..."
              : "Submit Testimonial"}
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Your testimonial will appear publicly only after admin
          approval.
        </p>
      </form>
    </div>
  );
}