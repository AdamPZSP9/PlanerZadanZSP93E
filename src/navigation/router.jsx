import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Test from '../pages/test.jsx'
import Home from '../pages/home.jsx'

function Router() {
  return (
    <BrowserRouter>
      {/* Navigation 
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/about">About</Link> |{" "}
        <Link to="/contact">Contact</Link>
      </nav>
      */}
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Router;