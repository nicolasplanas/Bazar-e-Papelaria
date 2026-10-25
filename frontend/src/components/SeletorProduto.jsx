import { useState } from 'react'

function SeletorProduto({ produtos, valor, onChange }) {
  const [busca, setBusca] = useState('')
  const [aberto, setAberto] = useState(false)

  const selecionado = produtos.find((p) => String(p.id) === String(valor))

  const termo = busca.trim().toLowerCase()
  const filtrados = produtos.filter((p) =>
    `${p.nome} ${p.codigo ?? ''}`.toLowerCase().includes(termo)
  )

  const escolher = (p) => {
    onChange(p.id)
    setBusca('')
    setAberto(false)
  }

  const trocar = () => {
    onChange('')
    setAberto(true)
  }

  if (selecionado && !aberto) {
    return (
      <div className="seletor-escolhido">
        <span>{selecionado.nome} ({selecionado.codigo})</span>
        <button type="button" onClick={trocar}>Trocar</button>
      </div>
    )
  }

  return (
    <div className="seletor-produto">
      <input
        type="text"
        placeholder="Pesquisar por nome ou código..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        onFocus={() => setAberto(true)}
        // pequeno atraso para o clique no item da lista acontecer antes de fechar
        onBlur={() => setTimeout(() => setAberto(false), 150)}
      />

      {aberto && (
        <ul className="seletor-lista">
          {filtrados.length === 0 ? (
            <li className="seletor-vazio">Nenhum produto encontrado</li>
          ) : (
            filtrados.map((p) => (
              <li key={p.id}>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => escolher(p)}>
                  {p.nome} ({p.codigo})
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

export default SeletorProduto