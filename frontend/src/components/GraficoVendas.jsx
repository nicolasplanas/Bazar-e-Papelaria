import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

function chaveMes(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function nomeMes(chave) {
  const [ano, mes] = chave.split('-')
  return new Date(Number(ano), Number(mes) - 1, 1).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })
}

function GraficoVendas({ movimentacoes }) {
  const [mesEscolhido, setMesEscolhido] = useState('')

  const saidas = movimentacoes.filter((m) => m.tipo === 'saida')

  // Meses com saída, do mais recente para o mais antigo
  const mesesComSaida = [...new Set(saidas.map((m) => chaveMes(m.data)))].sort().reverse()

  // Sem nenhuma saída, o seletor mostra o mês atual
  const meses = mesesComSaida.length > 0 ? mesesComSaida : [chaveMes(new Date())]

  // Enquanto o usuário não escolhe, mostra o mês mais recente
  const mesAtual = mesEscolhido || meses[0]

  const totais = {}
  saidas
    .filter((m) => chaveMes(m.data) === mesAtual)
    .forEach((m) => {
      totais[m.produto] = (totais[m.produto] || 0) + m.quantidade
    })

  const dados = Object.entries(totais)
    .map(([produto, quantidade]) => ({ produto, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade)

  return (
    <section id="grafico-vendas">
      <h2>Produtos vendidos por mês</h2>

      <label htmlFor="mes">Mês</label>
      <select id="mes" value={mesAtual} onChange={(e) => setMesEscolhido(e.target.value)}>
        {meses.map((m) => (
          <option key={m} value={m}>{nomeMes(m)}</option>
        ))}
      </select>

      <div
        role="img"
        aria-label={`Gráfico de barras com a quantidade vendida de cada produto em ${nomeMes(mesAtual)}`}
      >
        <ResponsiveContainer width="100%" height={Math.max(250, dados.length * 45)}>
          <BarChart data={dados} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              allowDecimals={false}
              domain={[0, (max) => Math.max(5, max)]}
              tick={{ fill: 'currentColor' }}
            />
            <YAxis type="category" dataKey="produto" width={150} tick={{ fill: 'currentColor' }} />
            <Tooltip />
            <Bar dataKey="quantidade" name="Quantidade vendida" fill="#c62828" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {dados.length === 0 && <p>Nenhuma saída registrada neste mês.</p>}
    </section>
  )
}

export default GraficoVendas
