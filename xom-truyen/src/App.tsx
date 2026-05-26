import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
// import Footer from "./components/Layout/Footer";
import HomePage from "./pages/HomePage";
import { BG } from "./constants";

export default function App() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: BG,
        fontFamily: "'Be Vietnam Pro', 'Segoe UI', Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        <Header />
        <HomePage />
        {/* <Footer /> */}
      </div>
    </div>
  );
}