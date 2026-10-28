import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../lib/auth'
import Paginacao from '../components/Paginacao'

function EstoqueCompleto() {
  const [produtos, setProdutos] = useState([])
  const [categoria, setCategoria] = useState('')
  const [busca, setBusca] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [pagina, setPagina] = useState(0)
  const POR_PAGINA = 10

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await apiFetch('/produtos')
        if (!res.ok) throw new Error()
        setProdutos(await res.json())
      } catch {
        setErro('Não foi possível carregar o estoque')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  // filtra primeiro, depois ordena do maior para o menor
  const produtosFiltrados = produtos
    .filter(
      (p) =>
        (categoria === '' || p.categoria === categoria) &&
        p.nome.toLowerCase().includes(busca.toLowerCase())
    )
    .sort((a, b) => b.quantidade - a.quantidade || a.nome.localeCompare(b.nome))

  const totalPaginas = Math.max(1, Math.ceil(produtosFiltrados.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas - 1)
  const visiveis = produtosFiltrados.slice(
    paginaAtual * POR_PAGINA,
    paginaAtual * POR_PAGINA + POR_PAGINA
  )

  return (
    <section id="estoque-completo">
      <h1>Estoque Completo</h1>

      <div className="estoque-filtros">
        <input
          className="estoque-busca"
          type="text"
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => { setBusca(e.target.value); setPagina(0) }}
        />

        <select
          className="estoque-select"
          value={categoria}
          onChange={(e) => { setCategoria(e.target.value); setPagina(0) }}
        >
          <option value="">Todos</option>
          <option value="papelaria">Papelaria</option>
          <option value="bomboniere">Bomboniere</option>
          <option value="sorvetes">Sorvetes</option>
          <option value="presentes">Presentes</option>
        </select>
      </div>

      {carregando && <p>Carregando...</p>}
      {erro && <p>{erro}</p>}

      {!carregando && !erro && (
        <div className="estoque-lista">
          <div className="estoque-cabecalho">
            <span>Produto</span>
            <span>Categoria</span>
            <span>Quantidade</span>
            <span aria-hidden="true"></span>
          </div>

          {produtosFiltrados.length === 0 ? (
            <div className="estoque-vazio">Nenhum produto encontrado</div>
          ) : (
            visiveis.map((p) => (
              <div className="estoque-linha" key={p.id}>
                <span>{p.nome}</span>
                <span>{p.categoria}</span>
                <span>{p.quantidade}</span>
                <Link to={`/produtos/${p.id}`} className="estoque-detalhes">
                  Detalhes
                </Link>
              </div>
            ))
          )}
        </div>

)}

      <Paginacao pagina={paginaAtual} totalPaginas={totalPaginas} onMudar={setPagina} />

      <Link to="/" className="botao-voltar" translate="no">
        Voltar
      </Link>
    </section>
  )
}

export default EstoqueCompleto