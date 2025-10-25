import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">O'n English</h1>
      <nav className="flex gap-4">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/voice" className="hover:text-blue-600">Voice Chat</Link>
        <Link to="/signup" className="hover:text-blue-600">Sign Up</Link>
      </nav>
    </header>
  );
}
