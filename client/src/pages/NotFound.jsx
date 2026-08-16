import { Link } from "react-router-dom";
export default function NotFound() {
  return <section className="page center"><h1>404</h1><p>That page does not exist.</p><Link to="/" className="dark-btn">Go home</Link></section>;
}
