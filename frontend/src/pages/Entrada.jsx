import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../lib/auth'
import SeletorProduto from '../components/SeletorProduto'

function Entrada() {
  const [produtos, setProdutos] = useState([])
  const [produtoId, setProdutoId] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await apiFetch('/produtos')
        if (!res.ok) throw new Error()
        setProdutos(await res.json())
      } catch {
        setMensagem('Não foi possível carregar os produtos')
      }
    }
    carregar()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await apiFetch('/entrada', {
        method: 'POST',
        body: JSON.stringify({ produto_id: produtoId, quantidade }),
      })
      const dados = await res.json()

      if (!res.ok) {
        setMensagem(dados.erro)
        return
      }

      setMensagem(`Entrada registrada! Estoque de ${dados.nome}: ${dados.quantidade}`)
      setProdutoId('')
      setQuantidade('')
    } catch {
      setMensagem('Não foi possível conectar ao servidor')
    }
  }

  return (
    <section id="entrada">
      <h1>Entrada de Produto</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="produto">Produto</label>
          <SeletorProduto
            produtos={produtos}
            valor={produtoId}
            onChange={setProdutoId}
          />
        </div>

        <div>
          <label htmlFor="quantidade">Quantidade</label>
          <input
            id="quantidade"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />
        </div>

        <div className="form-acoes">
          <button type="submit">Registrar Entrada</button>
          <Link to="/">Voltar</Link>
        </div>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </section>
  )
}

export default Entrada