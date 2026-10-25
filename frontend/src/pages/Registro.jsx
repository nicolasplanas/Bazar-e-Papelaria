import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../lib/auth'

function Registro() {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)

    try {
      const res = await apiFetch('/produtos', {
        method: 'POST',
        body: JSON.stringify({ nome, descricao, categoria }),
      })
      const dados = await res.json()

      if (!res.ok) {
        setMensagem(dados.erro)
        return
      }

      setMensagem(`Produto cadastrado: ${dados.nome} \n(Código ${dados.codigo})`)
      setNome('')
      setDescricao('')
      setCategoria('')
    } catch {
      setMensagem('Não foi possível conectar ao servidor')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section id="registro">
      <h1>Registro de Produto</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="categoria">Categoria</label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Selecione...</option>
            <option value="papelaria">Papelaria</option>
            <option value="bomboniere">Bomboniere</option>
            <option value="sorvetes">Sorvetes</option>
            <option value="presentes">Presentes</option>
          </select>
        </div>

        <p className="registro-dica">
          O código do item é gerado automaticamente pela categoria.
        </p>

        <div className="form-acoes">
          <button type="submit" disabled={enviando}>
            {enviando ? 'Cadastrando...' : 'Cadastrar Produto'}
          </button>
          <Link to="/">Voltar</Link>
        </div>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </section>
  )
}

export default Registro