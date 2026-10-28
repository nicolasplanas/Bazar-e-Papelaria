import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../lib/auth'
import { formatarData } from '../lib/formatar'
import Paginacao from '../components/Paginacao'

function Campo({ rotulo, valor, largo = false }) {
  return (
    <div className={`detalhes-campo ${largo ? 'largo' : ''}`}>
      <span className="detalhes-rotulo">{rotulo}</span>
      <span className="detalhes-valor">{valor ?? '—'}</span>
    </div>
  )
}

function ProdutoDetalhes() {
  const { id } = useParams()
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [pagina, setPagina] = useState(0)
  const POR_PAGINA = 5

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await apiFetch(`/produtos/${id}`)
        const texto = await res.text()

        let json
        try {
          json = JSON.parse(texto)
        } catch {
          throw new Error(`Resposta inválida do servidor (código ${res.status})`)
        }

        if (!res.ok) throw new Error(json.erro || 'Não foi possível carregar o produto')

        setDados(json)
      } catch (e) {
        setErro(e.message)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [id])

  if (carregando) {
    return (
      <section id="detalhes">
        <p>Carregando...</p>
      </section>
    )
  }

  if (erro) {
    return (
      <section id="detalhes">
        <p className="detalhes-erro">{erro}</p>
        <Link to="/estoque" className="botao-voltar">Voltar ao estoque</Link>
      </section>
    )
  }

  const { produto, movimentacoes } = dados
  const totalPaginas = Math.max(1, Math.ceil(movimentacoes.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas - 1)
  const visiveis = movimentacoes.slice(
    paginaAtual * POR_PAGINA,
    paginaAtual * POR_PAGINA + POR_PAGINA
  )

  return (
    <section id="detalhes">
      <h1>{produto.nome}</h1>

      <div className="detalhes-card">
        <Campo rotulo="Código do item" valor={produto.codigo} />
        <Campo rotulo="Categoria" valor={produto.categoria} />
        <Campo rotulo="Em estoque" valor={produto.quantidade} />
        <Campo rotulo="Descrição" valor={produto.descricao} largo />
      </div>

      <h2 className="detalhes-titulo">Movimentações</h2>

      <div className="detalhes-movs">
        {movimentacoes.length === 0 ? (
          <div className="logs-vazio">Nenhuma movimentação registrada</div>
        ) : (
          visiveis.map((m) => (
            <div className="detalhes-mov" key={m.id}>
              <span>{formatarData(m.data)}</span>
              <span className={m.tipo === 'entrada' ? 'tag-entrada' : 'tag-saida'}>
                {m.tipo === 'entrada' ? 'Entrada' : 'Saída'}
              </span>
              <span>{m.quantidade}</span>
            </div>
          ))
        )}
      </div>

      <Paginacao
        pagina={paginaAtual}
        totalPaginas={totalPaginas}
        onMudar={setPagina}
      />

      <Link to="/estoque" className="botao-voltar">Voltar ao estoque</Link>
    </section>
  )
}

export default ProdutoDetalhes