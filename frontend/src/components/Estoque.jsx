import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../Auth'

function Estoque() {
  const [produtos, setProdutos] = useState([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

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

  // copia a lista antes de ordenar e pega só os 5 maiores
  const principais = [...produtos]
    .sort((a, b) => b.quantidade - a.quantidade || a.nome.localeCompare(b.nome))
    .slice(0, 5)

  return (
    <section id="estoque-layout">
      <h1>Principais Itens</h1>

      {carregando && <p>Carregando...</p>}
      {erro && <p>{erro}</p>}

      {!carregando && !erro && (
        <div className="estoque-lista">
          <div className="estoque-cabecalho">
            <span>Produto</span>
            <span>Categoria</span>
            <span>Quantidade</span>
          </div>

          {principais.length === 0 ? (
            <div className="estoque-vazio">Nenhum produto cadastrado</div>
          ) : (
            principais.map((p) => (
              <div className="estoque-linha" key={p.id}>
                <span>{p.nome}</span>
                <span>{p.categoria}</span>
                <span>{p.quantidade}</span>
              </div>
            ))
          )}
        </div>
      )}

      <Link to="/estoque" className="botao-logs" translate="no">
        Estoque completo
      </Link>

      <Link to="/logs" className="botao-logs" translate="no">
        Movimentações
      </Link>

    </section>
  )
}

export default Estoque