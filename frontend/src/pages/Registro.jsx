import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../lib/auth'
import ListaProdutos from '../components/ListaProdutos'

const FORM_VAZIO = { nome: '', descricao: '', categoria: '' }

function Registro() {
  const [produtos, setProdutos] = useState([])
  const [form, setForm] = useState(FORM_VAZIO)
  const [editandoId, setEditandoId] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [categoriaOriginal, setCategoriaOriginal] = useState(null)

  const editando = editandoId !== null

  const carregarProdutos = async () => {
    try {
      const res = await apiFetch('/produtos')
      if (!res.ok) throw new Error()
      setProdutos(await res.json())
    } catch {
      setMensagem('Não foi possível carregar os produtos')
    }
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  const atualizarCampo = (campo, valor) => {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  const cancelarEdicao = () => {
    setEditandoId(null)
    setForm(FORM_VAZIO)
    setCategoriaOriginal(null)
  }

  const iniciarEdicao = (p) => {
    setEditandoId(p.id)
    setForm({ nome: p.nome, descricao: p.descricao || '', categoria: p.categoria })
    setMensagem(`Editando ${p.nome} (${p.codigo})`)
    setCategoriaOriginal(p.categoria)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const mudouCategoria = editando && form.categoria !== categoriaOriginal

    if (mudouCategoria) {
      const continuar = window.confirm(
        'Ao trocar a categoria, o item recebe um novo código. ' +
        'Etiquetas já impressas com o código antigo ficarão desatualizadas. Continuar?'
      )
      if (!continuar) return
    }
    setEnviando(true)

    try {
      const res = await apiFetch(editando ? `/produtos/${editandoId}` : '/produtos', {
        method: editando ? 'PUT' : 'POST',
        body: JSON.stringify(form),
      })
      const dados = await res.json()

      if (!res.ok) {
        setMensagem(dados.erro)
        return
      }

      setMensagem(
        editando
          ? `Produto atualizado: ${dados.nome} (${dados.codigo})`
          : `Produto cadastrado: ${dados.nome} (código ${dados.codigo})`
      )
      cancelarEdicao()
      carregarProdutos()
    } catch {
      setMensagem('Não foi possível conectar ao servidor')
    } finally {
      setEnviando(false)
    }
  }

  const excluir = async (p) => {
    const confirmou = window.confirm(
      `Excluir ${p.nome} (${p.codigo})? Essa ação não pode ser desfeita.`
    )
    if (!confirmou) return

    try {
      const res = await apiFetch(`/produtos/${p.id}`, { method: 'DELETE' })
      const dados = await res.json()

      if (!res.ok) {
        setMensagem(dados.erro)
        return
      }

      if (editandoId === p.id) cancelarEdicao()
      setMensagem(`Produto excluído: ${p.nome}`)
      carregarProdutos()
    } catch {
      setMensagem('Não foi possível conectar ao servidor')
    }
  }

  return (
    <section id="registro">
      <h1>{editando ? 'Editar Produto' : 'Registro de Produto'}</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            value={form.nome}
            onChange={(e) => atualizarCampo('nome', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            rows={3}
            value={form.descricao}
            onChange={(e) => atualizarCampo('descricao', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="categoria">Categoria</label>
          <select
            id="categoria"
            value={form.categoria}
            onChange={(e) => atualizarCampo('categoria', e.target.value)}
          >
            <option value="">Selecione...</option>
            <option value="papelaria">Papelaria</option>
            <option value="bomboniere">Bomboniere</option>
            <option value="sorvetes">Sorvetes</option>
            <option value="presentes">Presentes</option>
          </select>
        </div>

        {!editando && (
          <p className="registro-dica">
            O número do item é gerado automaticamente pela categoria.
          </p>
        )}

        <div className="form-acoes">
          <button type="submit" disabled={enviando}>
            {enviando
              ? 'Salvando...'
              : editando
                ? 'Salvar alterações'
                : 'Cadastrar Produto'}
          </button>

          {editando && (
            <button type="button" className="registro-cancelar" onClick={cancelarEdicao}>
              Cancelar edição
            </button>
          )}

          <Link to="/">Voltar</Link>
        </div>
      </form>

      {mensagem && <p>{mensagem}</p>}

      <h2 className="registro-titulo-lista">Produtos cadastrados</h2>

      <ListaProdutos
        produtos={produtos}
        onEditar={iniciarEdicao}
        onExcluir={excluir}
      />

    </section>
  )
}

export default Registro