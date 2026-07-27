import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="py-24 text-center">
    <h1 className="font-display font-extrabold text-6xl text-crimson mb-4">404</h1>
    <p className="text-lg mb-6">This page has been archived, moved, or never existed.</p>
    <Link to="/" className="btn-primary">Back to Home</Link>
  </div>
);

export default NotFound;
