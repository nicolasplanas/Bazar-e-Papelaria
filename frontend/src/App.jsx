import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import RotaProtegida from './components/RotaProtegida'
import Login from './pages/Login'
import Entrada from './pages/Entrada'
import Saida from './pages/Saida'
import Logs from './pages/Logs'
import EstoqueCompleto from './pages/EstoqueCompleto'
import logo from './assets/logo.png'
import Bazarlogo from './assets/Bazarlogo.png'
import WeatherForecast from './components/WeatherForecast'
import Estoque from './components/Estoque'
import Social from './components/Social'

// Página inicial: só o conteúdo, sem rotas dentro
function Home() {
  return (
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
          <img src={Bazarlogo} className="logo" width="185" height="140" alt="Bazar Logo" />
          <h2>Bazar Window</h2>
          <div className="btn-group">
            <Link to="/entrada" className="btn btn-entrada">Entrada</Link>
            <Link to="/saida" className="btn btn-saida">Saída</Link>
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
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<RotaProtegida><Home /></RotaProtegida>} />
        <Route path="/entrada" element={<RotaProtegida><Entrada /></RotaProtegida>} />
        <Route path="/saida" element={<RotaProtegida><Saida /></RotaProtegida>} />
        <Route path="/estoque" element={<RotaProtegida><EstoqueCompleto /></RotaProtegida>} />
        <Route path="/logs" element={<RotaProtegida><Logs /></RotaProtegida>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App