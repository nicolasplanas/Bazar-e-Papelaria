import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../api'

function EstoqueCompleto() {
  const [produtos, setProdutos] = useState([])
  const [categoria, setCategoria] = useState('')
  const [busca, setBusca] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await fetch(`${API_URL}/produtos`)
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

  return (
    <section id="estoque-completo">
      <h1>Estoque Completo</h1>

      <div className="estoque-filtros">
        <input
          className="estoque-busca"
          type="text"
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <select
          className="estoque-select"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
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
          </div>

          {produtosFiltrados.length === 0 ? (
            <div className="estoque-vazio">Nenhum produto encontrado</div>
          ) : (
            produtosFiltrados.map((p) => (
              <div className="estoque-linha" key={p.id}>
                <span>{p.nome}</span>
                <span>{p.categoria}</span>
                <span>{p.quantidade}</span>
              </div>
            ))
          )}
        </div>
      )}

      <Link to="/" className="botao-voltar" translate="no">
        Voltar
      </Link>
    </section>
  )
}

export default EstoqueCompleto