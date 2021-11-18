import './App.css';
import { Routes, Route } from "react-router-dom";
import Header from './components/header';
import Footer from './components/footer';
import Home from './pages/Home';
import About from './pages/About';
function App() {
  return (
    <div>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="about" element={<About />} />
    </Routes>
    <Footer />
    </div>
  );
}

export default App;
