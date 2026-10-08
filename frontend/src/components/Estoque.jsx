import { useEffect, useState } from 'react'
import { API_URL } from '../api'

function Estoque() {
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

  const produtosFiltrados = produtos.filter(
    (p) =>
      (categoria === '' || p.categoria === categoria) &&
      p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <section id="estoque-layout">
      <h1>Estoque Atual</h1>

      <div className="estoque-filtros">
        <input className="estoque-busca"
          type="text"
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <select className="estoque-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Todas as categorias</option>
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
    </section>
  )
}

export default Estoque