import { useState } from "react";
import { Helmet } from "react-helmet-async";
import SectionHeader from "../components/SectionHeader";

const Contact = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire this up to a backend /api/contact route or an email service (e.g. Resend, EmailJS) as needed.
    setSent(true);
  };

  return (
    <div className="py-8 max-w-xl mx-auto">
      <Helmet><title>Contact Us — The Daily Wire Desk</title></Helmet>
      <SectionHeader eyebrow="Get In Touch" title="Contact Us" />
      {sent ? (
        <p className="text-crimson font-semibold">Thanks — your message has been sent. We'll get back to you soon.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Your name" className="input-field" />
          <input required type="email" placeholder="Your email" className="input-field" />
          <input placeholder="Subject" className="input-field" />
          <textarea required placeholder="Your message" rows={5} className="input-field" />
          <button type="submit" className="btn-primary">Send Message</button>
        </form>
      )}
    </div>
  );
};

export default Contact;
