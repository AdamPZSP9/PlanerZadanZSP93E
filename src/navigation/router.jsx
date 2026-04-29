import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Test from '../pages/test.jsx'
import Home from '../pages/home.jsx'
import Styczeń from '../pages/styczen/styczen.jsx'
import Luty from '../pages/luty/luty.jsx'
import Marzec from '../pages/marzec/marzec.jsx'
import Kwiecień from '../pages/kwiecien/kwiecien.jsx'
import Maj from '../pages/maj/maj.jsx'
import Czerwiec from '../pages/czerwiec/czerwiec.jsx'
import Lipiec from '../pages/lipiec/lipiec.jsx'
import Sierpień from '../pages/sierpien/sierpien.jsx'
import Wrzesień from '../pages/wrzesien/wrzesien.jsx'
import Październik from '../pages/pazdziernik/pazdziernik.jsx'
import Listopad from '../pages/listopad/listopad.jsx'
import Grudzień from '../pages/grudzien/grudzien.jsx'

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
        <Route path="/styczen" element={<Styczeń />} />
        <Route path="/luty" element={<Luty />} />
        <Route path="/marzec" element={<Marzec />} />
        <Route path="/kwiecien" element={<Kwiecień />} />
        <Route path="/maj" element={<Maj />} />
        <Route path="/czerwiec" element={<Czerwiec />} />
        <Route path="/lipiec" element={<Lipiec />} />
        <Route path="/sierpien" element={<Sierpień />} />
        <Route path="/wrzesien" element={<Wrzesień />} />
        <Route path="/pazdziernik" element={<Październik />} />
        <Route path="/listopad" element={<Listopad />} />
        <Route path="/grudzien" element={<Grudzień />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Router;