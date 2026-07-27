import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from "react-icons/fi";

const Footer = () => (
  <footer className="bg-ink text-paper-dim/70 mt-16">
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
      <div className="col-span-2">
        <h3 className="font-display font-bold text-2xl text-paper mb-2">
          The Daily <span className="text-crimson">Wire Desk</span>
        </h3>
        <p className="text-sm max-w-xs">
          Independent reporting on politics, business, technology, and the world — filed fast, checked twice.
        </p>
        <div className="flex gap-4 mt-4">
          <FiFacebook className="hover:text-crimson cursor-pointer" />
          <FiTwitter className="hover:text-crimson cursor-pointer" />
          <FiInstagram className="hover:text-crimson cursor-pointer" />
          <FiYoutube className="hover:text-crimson cursor-pointer" />
        </div>
      </div>

      <div>
        <h4 className="text-paper font-semibold mb-3 text-sm uppercase tracking-wide">Sections</h4>
        <ul className="space-y-2 text-sm">
          {["Technology", "Politics", "Business", "Sports"].map((c) => (
            <li key={c}>
              <Link to={`/category/${c.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-crimson">{c}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-paper font-semibold mb-3 text-sm uppercase tracking-wide">Company</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/about" className="hover:text-crimson">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-crimson">Contact</Link></li>
          <li><Link to="/admin/login" className="hover:text-crimson">Admin Login</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-paper font-semibold mb-3 text-sm uppercase tracking-wide">Legal</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/privacy-policy" className="hover:text-crimson">Privacy Policy</Link></li>
          <li><Link to="/terms" className="hover:text-crimson">Terms of Service</Link></li>
        </ul>
      </div>
    </div>
    <div className="hairline border-white/10 text-center text-xs py-4">
      © {new Date().getFullYear()} The Daily Wire Desk. All rights reserved.
    </div>
  </footer>
);

export default Footer;
