import { Link } from 'react-router-dom'

function Saida() {
  return (
    <section id="saida">
      <h1>Saída de Produto</h1>
      
      <form>
        <div>
          <label htmlFor="nome">Produto</label>
          <input id="nome" type="text" />
        </div>

        <div>
          <label htmlFor="quantidade">Quantidade</label>
          <input
            id="quantidade"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>

        <div>
          <button type="submit">Registrar Saída</button>
          <Link to="/">Voltar</Link>
        </div>
      </form>
    </section>
  )
}

export default Saida