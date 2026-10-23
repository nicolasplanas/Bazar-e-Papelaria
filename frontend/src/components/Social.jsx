import { FaInstagram } from 'react-icons/fa'

function Social() {
  return (
    <div className="redes">
      <h2>Rede Social</h2>
      <ul className="redes-lista">
        <li>
          <a
            href="https://www.instagram.com/bazarwindow?exln=MTJ3Z25nNTYydTZzcw=="
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram (abre em nova aba)"
            className="botao-rede"
          >
            <FaInstagram className="icone-rede" aria-hidden="true" />
            Instagram
          </a>
        </li>
      </ul>
    </div>
  )
}

export default Social