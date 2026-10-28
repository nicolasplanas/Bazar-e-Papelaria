function Paginacao({ pagina, totalPaginas, onMudar }) {
  if (totalPaginas <= 1) return null

  return (
    <div className="paginacao">
      <button
        type="button"
        onClick={() => onMudar(pagina - 1)}
        disabled={pagina === 0}
        aria-label="Página anterior"
      >
        ◀
      </button>

      <span>
        Página {pagina + 1} de {totalPaginas}
      </span>

      <button
        type="button"
        onClick={() => onMudar(pagina + 1)}
        disabled={pagina >= totalPaginas - 1}
        aria-label="Próxima página"
      >
        ▶
      </button>
    </div>
  )
}

export default Paginacao