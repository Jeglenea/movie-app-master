import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/Home.jsx";
import CategoryMovies from "./pages/CategoryMovies";

import { routePath } from './constants/route';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path={routePath.home} element={<Home />} />
          <Route path={routePath.categories} element={<CategoryMovies />} />
          {/* <Route path={`${routePath.movies}/:type`} element={<Movies />} /> */}
          {/* <Route path={`${routePath.movie}/:id`} element={<Movie />} /> */}
          <Route path={routePath.invalid} element={<Home />} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
