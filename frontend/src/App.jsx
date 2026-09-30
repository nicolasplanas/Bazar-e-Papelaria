import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Entrada from './pages/Entrada'
import Saida from './pages/Saida'
import logo from './assets/logo.png'
import Bazarlogo from './assets/Bazarlogo.png'
import './App.css'
import WeatherForecast from './components/WeatherForecast';
import Estoque from './components/Estoque'
import Social from './components/Social'

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <>

              <section id="center">
                <div className="hero">
                  <img src={logo} className="logo" width="170" height="179" alt="Logo" />
                </div>
                <div>
                  <h1>Sistema de Estoque e Vendas</h1>
                </div>

              </section>

              <div className="ticks"></div>

              <section id="next-steps">
                <div id="docs">
                  <svg className="icon" role="presentation" aria-hidden="true">
                  </svg>
                  <img src={Bazarlogo} className="logo" width="185" height="140" alt="Bazar Logo" />
                  <h2>Bazar Window</h2>
                  <div className="btn-group">
                    <Link to="/Entrada" className="btn btn-entrada">Entrada</Link>
                    <Link to="/Saida" className="btn btn-saida">Saída</Link>
                  </div>
                </div>

                <div id="estoque">
                  <Estoque />
                </div>
                  

                <div id="clima">
                  <WeatherForecast />
                </div>


              </section>

              <section id="next-steps">
                <div id="social-rede">
                  <Social />
                </div>
              </section>
            </>
          }
        />

        <Route path="/Entrada" element={<Entrada />} />

        <Route path="/Saida" element={<Saida />} />


      </Routes>
    </BrowserRouter>
  )
}
export default App
