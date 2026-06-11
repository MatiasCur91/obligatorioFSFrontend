import { Link } from "react-router"

const NotFoundPage = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <span className="notfound-icon">📭</span>
        <h1 className="notfound-title">404</h1>
        <p className="notfound-subtitle">Esta página no existe</p>
        <Link to="/" className="dash-btn dash-btn--primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage