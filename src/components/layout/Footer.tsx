import { ArrowUp } from 'lucide-react'
import { Monogram } from '../ui/Monogram'
export function Footer() {
  return (
    <footer className="site-footer">
      <a className="footer-brand" href="#inicio">
        <Monogram />
        <span>
          Andson Rocha<span>Tecnologia, design & código.</span>
        </span>
      </a>
      <p className="footer-location">Pau dos Ferros, RN</p>
      <p>
        Feito com intenção.
        <br />© {new Date().getFullYear()} Andson Rocha.
      </p>
      <a className="back-top" href="#inicio">
        De volta ao topo
        <ArrowUp size={18} />
      </a>
    </footer>
  )
}
