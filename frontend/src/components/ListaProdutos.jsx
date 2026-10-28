import { useState } from 'react'
import Paginacao from './Paginacao'

const POR_PAGINA = 5

function ListaProdutos({ produtos, onEditar, onExcluir }) {
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [pagina, setPagina] = useState(0)

  const termo = busca.trim().toLowerCase()

  const filtrados = produtos.filter(
    (p) =>
      (categoria === '' || p.categoria === categoria) &&
      `${p.nome} ${p.codigo ?? ''}`.toLowerCase().includes(termo)
  )

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  // se a lista encolher (ex.: exclusão), não fica numa página que não existe
  const paginaAtual = Math.min(pagina, totalPaginas - 1)
  const inicio = paginaAtual * POR_PAGINA
  const visiveis = filtrados.slice(inicio, inicio + POR_PAGINA)

  // ao mudar a busca ou o filtro, volta para a primeira página
  const mudarBusca = (valor) => {
    setBusca(valor)
    setPagina(0)
  }

  const mudarCategoria = (valor) => {
    setCategoria(valor)
    setPagina(0)
  }

  return (
    <>
      <div className="estoque-filtros">
        <input
          className="estoque-busca"
          type="text"
          placeholder="Pesquisar por nome ou código..."
          value={busca}
          onChange={(e) => mudarBusca(e.target.value)}
        />

        <select
          className="estoque-select"
          value={categoria}
          onChange={(e) => mudarCategoria(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          <option value="papelaria">Papelaria</option>
          <option value="bomboniere">Bomboniere</option>
          <option value="sorvetes">Sorvetes</option>
          <option value="presentes">Presentes</option>
        </select>
      </div>

      <ul className="registro-lista">
        {visiveis.length === 0 && (
          <li className="registro-vazio">Nenhum produto encontrado</li>
        )}

        {visiveis.map((p) => (
          <li key={p.id} className="registro-item">
            <div>
              <strong>{p.nome}</strong>
              <span>
                {p.codigo} · {p.categoria} · {p.quantidade} un.
              </span>
            </div>

            <div className="registro-item-acoes">
              <button type="button" onClick={() => onEditar(p)}>
                Editar
              </button>
              <button
                type="button"
                className="registro-excluir"
                onClick={() => onExcluir(p)}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Paginacao
        pagina={paginaAtual}
        totalPaginas={totalPaginas}
        onMudar={setPagina}
      />
    </>
  )
}

export default ListaProdutos