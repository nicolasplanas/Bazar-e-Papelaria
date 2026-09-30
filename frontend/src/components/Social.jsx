import { FaInstagram, FaWhatsapp, FaFacebook } from 'react-icons/fa'

function Social() {

    return  (
        <>
            <h2>Redes Sociais</h2>
            <ul>
                <li>

                    <a href="https://www.instagram.com/sua_empresa"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram (abre em nova aba)"
                    >
                    <FaInstagram className="button-icon" aria-hidden="true" />
                    Instagram
                    </a>
                </li>
                <li>

                    <a href="https://www.facebook.com/sua_empresa"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook (abre em nova aba)"
                    >
                    <FaFacebook className="button-icon" aria-hidden="true" />
                    Facebook
                    </a>
                </li>
                <li>

                    <a href="https://wa.me/sua_empresa"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp (abre em nova aba)"
                    >
                    <FaWhatsapp className="button-icon" aria-hidden="true" />
                    WhatsApp
                    </a>
                </li>
            </ul>
        </>
    )
}

export default Social;