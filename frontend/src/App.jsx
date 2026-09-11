import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { FaInstagram, FaWhatsapp, FaFacebook } from 'react-icons/fa'
import Entrada from './pages/Entrada'
import Saida from './pages/Saida'
import logo from './assets/logo.png'
import Bazarlogo from './assets/Bazarlogo.png'
import './App.css'

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

       <div id="social-redes">
             <h2>Redes Sociais</h2>
          <ul>
            <li>
      
       <a href="https://www.instagram.com/sua_empresa"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram (abre em nova aba)"
      >
        <FaInstagram className="button-icon" aria-hidden="true" />
        Instagram
      </a>
    </li>
   <li>
      
       <a href="https://www.facebook.com/sua_empresa"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook (abre em nova aba)"
      >
        <FaFacebook className="button-icon" aria-hidden="true" />
        Facebook
      </a>
    </li>
     <li>
      
       <a href="https://wa.me/sua_empresa"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp (abre em nova aba)"
      >
        <FaWhatsapp className="button-icon" aria-hidden="true" />
        WhatsApp
      </a>
    </li>
          </ul>
        </div>
        <div id="social">
         
          <h2>Portal de Notícias</h2>
          <ul>
            <li>
              <a href="https://mercadoeconsumo.com.br/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#documentation-icon"></use>
                </svg>
                Mercado e Consumo
              </a>
            </li>
            <li>
              <a href="https://gironews.com/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#documentation-icon"></use>
                </svg>
                Giro News
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
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
