import WeatherComponent from "./components/Forecast";
import TableComponent from "./components/table";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
const App = (): JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TableComponent />} />
        <Route path="/forecast/:cityName" element={<WeatherComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
