import { useState, useEffect } from 'react'
import axios from 'axios'

function formatarDia(dataISO) {
  const data = new Date(dataISO + 'T00:00:00')
  return data.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
}

function iconeClima(temp) {
  if (temp >= 30) return '☀️'
  if (temp >= 20) return '🌤️'
  return '☁️'
}

function PrevisaoTempo() {
  const [previsao, setPrevisao] = useState([])
  const [erro, setErro] = useState(false)

  useEffect(() => {
    const latitude = -22.12
    const longitude = -51.39
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max&timezone=America/Sao_Paulo`

    axios.get(url)
      .then((resposta) => {
        const dias = resposta.data.daily.time
        const temperaturas = resposta.data.daily.temperature_2m_max

        const dados = dias.map((dia, index) => ({
          data: dia,
          temperaturaMax: temperaturas[index],
        }))

        setPrevisao(dados)
      })
      .catch(() => setErro(true))
  }, [])

  if (erro) return <p>Não foi possível carregar a previsão.</p>
  if (previsao.length === 0) return <p>Carregando previsão...</p>

  return (
    <div className="previsao-tempo">
      <h2>Previsão do tempo</h2>
      <ul className="previsao-lista">
        {previsao.map((dia) => (
          <li key={dia.data} className="previsao-item">
            <span className="previsao-dia">{formatarDia(dia.data)}</span>
            <span className="previsao-icone">{iconeClima(dia.temperaturaMax)}</span>
            <span className="previsao-temp">{Math.round(dia.temperaturaMax)}°C</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PrevisaoTempo