"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

interface FormValues {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.message.trim()) errors.message = "Message is required.";
  return errors;
}

/**
 * Accessible contact form: client-side validation, inline error messages
 * tied to fields via `aria-describedby`, and a `role="status"` live region
 * for submit/loading/success/error system messages.
 *
 * NOTE: this repo has no backend yet (see README — "Backend: none"), so
 * submission is simulated client-side rather than calling a real API or
 * hardcoding any credential. Wire this up to a real endpoint (e.g. an
 * Azure Function or email service) when one exists.
 */
export function ContactForm() {
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      // Placeholder transmission — no backend exists yet. Replace with a
      // real submission call when one is available.
      await new Promise((resolve) => setTimeout(resolve, 900));
      setStatus("success");
      setValues({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const systemMessage: Record<Status, string> = {
    idle: "",
    submitting: "> VALIDATING MESSAGE\n> CONNECTION SECURE",
    success: "> TRANSMISSION COMPLETE",
    error:
      Object.keys(errors).length > 0
        ? "> TRANSMISSION FAILED\n> CHECK REQUIRED FIELDS"
        : "> TRANSMISSION FAILED\n> RETRY CONNECTION",
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="border-border-dim bg-surface/60 w-full max-w-md border p-6 text-left"
      aria-label="Contact form"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="contact-name"
            className="font-mono text-fg-dim text-xs tracking-[0.2em] uppercase"
          >
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(event) =>
              setValues((v) => ({ ...v, name: event.target.value }))
            }
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className="border-border-dim bg-black-glass text-fg focus-visible:outline-neon-cyan border px-3 py-2 font-mono text-sm focus-visible:outline focus-visible:outline-2"
          />
          {errors.name && (
            <p id="contact-name-error" className="text-glow-magenta font-mono text-xs">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="contact-email"
            className="font-mono text-fg-dim text-xs tracking-[0.2em] uppercase"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) =>
              setValues((v) => ({ ...v, email: event.target.value }))
            }
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className="border-border-dim bg-black-glass text-fg focus-visible:outline-neon-cyan border px-3 py-2 font-mono text-sm focus-visible:outline focus-visible:outline-2"
          />
          {errors.email && (
            <p id="contact-email-error" className="text-glow-magenta font-mono text-xs">
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="contact-message"
            className="font-mono text-fg-dim text-xs tracking-[0.2em] uppercase"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            value={values.message}
            onChange={(event) =>
              setValues((v) => ({ ...v, message: event.target.value }))
            }
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            className="border-border-dim bg-black-glass text-fg focus-visible:outline-neon-cyan border px-3 py-2 font-mono text-sm focus-visible:outline focus-visible:outline-2"
          />
          {errors.message && (
            <p id="contact-message-error" className="text-glow-magenta font-mono text-xs">
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="border-glow-cyan text-glow-cyan focus-visible:outline-neon-cyan mt-2 border px-4 py-3 font-mono text-sm tracking-[0.2em] uppercase transition-opacity focus-visible:outline focus-visible:outline-2 disabled:cursor-wait disabled:opacity-60"
        >
          {status === "submitting" ? "Transmitting..." : "Transmit Message"}
        </button>

        <p role="status" aria-live="polite" className="font-mono text-xs whitespace-pre-line text-fg-dim min-h-[2.5rem]">
          {systemMessage[status]}
        </p>
      </div>
    </form>
  );
}
