import { Link } from 'react-router-dom'

function Entrada() {
  return (
    <section id="entrada">
      <h1>Entrada de Produto</h1>

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
          <label htmlFor="categoria">Categoria</label>
          <select id="categoria">
            <option value="">Selecione...</option>
            <option value="papelaria">Papelaria</option>
            <option value="bomboniere">Bomboniere</option>
            <option value="sorvetes">Sorvetes</option>
            <option value="presentes">Presentes</option>
          </select>
        </div>

        <div>
          <button type="submit">Registrar Entrada</button>
          <Link to="/">Voltar</Link>
        </div>
      </form>
    </section>
  )
}

export default Entrada