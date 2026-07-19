import React from 'react';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  

  const navigateHome = () => {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="min-h-screen bg-hero-radial text-ink">
      <header className="section-shell py-8">
        <h1 className="text-4xl font-extrabold">Contact</h1>
        <p className="mt-3 text-sm text-slate-600">Get in touch — we'd love to hear about your trip plans.</p>
        <button onClick={navigateHome} className="button-secondary mt-4" > ← Back Home </button>
      </header>

      <main className="section-shell grid gap-12 pb-24 md:grid-cols-2">
        <section className="rounded-[18px] border border-white/80 bg-white/60 p-6">
          <h2 className="text-xl font-semibold">Contact details</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-semibold">Headquarters</p>
                <p className="text-sm text-slate-500">Ahmedabad, India</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-sm text-slate-500">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-sm text-slate-500">hello@travelplanner.ai</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700">Office hours</h3>
            <p className="mt-2 text-sm text-slate-500">Mon–Fri · 9:00 AM — 6:00 PM (local time)</p>
          </div>
        </section>

        <section className="rounded-[18px] border border-white/80 bg-white/60 p-6">
          <h2 className="text-xl font-semibold">Send us a message</h2>
          <form className="mt-4 grid gap-3">
            <input placeholder="Your name" className="w-full rounded-lg border px-3 py-2" />
            <input placeholder="Email" className="w-full rounded-lg border px-3 py-2" />
            <input placeholder="Subject" className="w-full rounded-lg border px-3 py-2" />
            <textarea placeholder="Tell us about your trip" rows={6} className="w-full rounded-lg border px-3 py-2" />
            <div className="flex justify-end">
              <button type="button" onClick={() => alert('Message sent (demo)')} className="button-primary inline-flex items-center gap-2">
                Send message <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
