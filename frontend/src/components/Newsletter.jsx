import { useState } from "react";
import { subscribeNewsletter } from "../services/api";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await subscribeNewsletter(email);
      setStatus({ type: "success", message: "You're subscribed. Welcome aboard." });
      setEmail("");
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Something went wrong." });
    }
  };

  return (
    <section className="bg-ink dark:bg-ink-soft text-paper py-12 px-6 my-12 rounded-sm text-center">
      <p className="section-eyebrow mb-2">Stay Informed</p>
      <h2 className="font-display font-bold text-2xl md:text-3xl mb-2">The Morning Dispatch</h2>
      <p className="text-paper-dim/70 mb-6 max-w-md mx-auto text-sm">
        One email, every morning — the headlines that matter, with none of the noise.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="[email protected]"
          className="flex-1 px-4 py-2.5 rounded-sm bg-white/10 border border-white/20 text-paper placeholder:text-paper/40 outline-none focus:border-crimson"
        />
        <button type="submit" className="btn-primary">Subscribe</button>
      </form>
      {status && (
        <p className={`mt-3 text-sm ${status.type === "success" ? "text-green-400" : "text-crimson"}`}>
          {status.message}
        </p>
      )}
    </section>
  );
};

export default Newsletter;
