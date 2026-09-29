import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Estoque() {
  const [produtos, setProdutos] = useState([])
  const [categoria, setCategoria] = useState('')
  const [busca, setBusca] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await fetch('http://localhost:5000/produtos')
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
    <section id="estoque">
      <h1>Estoque Atual</h1>

      <div>
        <input
          type="text"
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
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
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="3">Nenhum produto encontrado</td>
              </tr>
            ) : (
              produtosFiltrados.map((p) => (
                <tr key={p.id}>
                  <td>{p.nome}</td>
                  <td>{p.categoria}</td>
                  <td>{p.quantidade}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <Link to="/">Voltar</Link>
    </section>
  )
}

export default Estoque