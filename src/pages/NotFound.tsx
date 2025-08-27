import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("404 – Not Found");
  return (
    <div style={{minHeight:"60vh",display:"grid",placeItems:"center"}}>
      <div style={{textAlign:"center"}}>
        <h1 style={{fontSize:28,fontWeight:800,marginBottom:8}}>404 – Page not found</h1>
        <p style={{color:"#6b7280",marginBottom:16}}>
          The page you’re looking for doesn’t exist.
        </p>
        <Link to="/dashboard" style={{
          background:"#111827",color:"#fff",padding:"10px 14px",
          borderRadius:12,fontWeight:700,textDecoration:"none"
        }}>Go to Dashboard</Link>
      </div>
    </div>
  );
}