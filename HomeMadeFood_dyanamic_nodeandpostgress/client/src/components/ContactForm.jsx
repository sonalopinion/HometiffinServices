"use client";

import { useState } from "react";
import { sendContact } from "../lib/api";

const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);

  const update = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setStatus({ type: "", text: "" });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setErrors({});
    setStatus({ type: "", text: "" });

    try {
      await sendContact({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        message: form.message,
      });
      setForm({ name: "", email: "", phone: "", message: "" });
      setStatus({ type: "success", text: "Thank you! We have received your enquiry and will contact you soon." });
    } catch (err) {
      setErrors(err.fieldErrors || {});
      setStatus({ type: "error", text: err.message });
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div>
        <input name="name" type="text" placeholder="Your Name" value={form.name} onChange={update} className={inputClass} />
        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
      </div>

      <div>
        <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={update} className={inputClass} />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
      </div>

      <div>
        <input name="phone" type="tel" placeholder="Mobile Number" value={form.phone} onChange={update} className={inputClass} />
        {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
      </div>

      <div>
        <textarea name="message" rows="5" placeholder="Write Your Message..." value={form.message} onChange={update} className={inputClass} />
        {errors.message && <p className="text-sm text-red-600 mt-1">{errors.message}</p>}
      </div>

      {status.text && (
        <p role="status" className={status.type === "success" ? "text-green-700" : "text-red-600"}>
          {status.text}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-3 rounded-lg font-semibold"
      >
        {sending ? "Sending..." : "Send Enquiry"}
      </button>
    </form>
  );
}
