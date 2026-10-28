import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../lib/auth'
import Paginacao from '../components/Paginacao'

function formatarData(iso) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function Logs() {
  const [movimentacoes, setMovimentacoes] = useState([])
  const [tipo, setTipo] = useState('')
  const [busca, setBusca] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [pagina, setPagina] = useState(0)
  const POR_PAGINA = 10

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await apiFetch('/movimentacoes')
        if (!res.ok) throw new Error()
        setMovimentacoes(await res.json())
      } catch {
        setErro('Não foi possível carregar as movimentações')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  const filtradas = movimentacoes.filter(
    (m) =>
      (tipo === '' || m.tipo === tipo) &&
      m.produto.toLowerCase().includes(busca.toLowerCase())
  )

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas - 1)
  const visiveis = filtradas.slice(
    paginaAtual * POR_PAGINA,
    paginaAtual * POR_PAGINA + POR_PAGINA
  )

  return (
    <section id="logs">
      <h1>Movimentações</h1>

      <div className="logs-filtros">
        <input
          className="logs-busca"
          type="text"
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => { setBusca(e.target.value); setPagina(0) }}
        />

        <select
          className="logs-select"
          value={tipo}
          onChange={(e) => { setTipo(e.target.value); setPagina(0) }}
        >
          <option value="">Entradas e saídas</option>
          <option value="entrada">Entradas</option>
          <option value="saida">Saídas</option>
        </select>
      </div>

      {carregando && <p>Carregando...</p>}
      {erro && <p>{erro}</p>}

      {!carregando && !erro && (
        <div className="logs-lista">
          <div className="logs-linha logs-cabecalho">
            <span>Data e hora</span>
            <span>Produto</span>
            <span>Tipo</span>
            <span>Qtd</span>
          </div>

          {filtradas.length === 0 ? (
            <div className="logs-vazio">Nenhuma movimentação encontrada</div>
          ) : (
            visiveis.map((m) => (
              <div className="logs-linha" key={m.id}>
                <span>{formatarData(m.data)}</span>
                <span>{m.produto}</span>
                <span className={m.tipo === 'entrada' ? 'tag-entrada' : 'tag-saida'}>
                  {m.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                </span>
                <span>{m.quantidade}</span>
              </div>
            ))
          )}
          <Paginacao pagina={paginaAtual} totalPaginas={totalPaginas} onMudar={setPagina} />
        </div>
      )}

      <Link to="/" className="botao-voltar" translate="no">Voltar</Link>
    </section>
  )
}

export default Logs