import { useState, useEffect } from 'react'
import axios from 'axios'

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
    <div>
      <h2>Previsão do tempo</h2>
      <ul>
        {previsao.map((dia) => (
          <li key={dia.data}>
            {dia.data} — {dia.temperaturaMax}°C
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PrevisaoTempo