// Logotipo de Taganga One: el mismo ícono de la app instalable
export default function BrandLogo({ size }) {
  return (
    <div className="brand-logo" aria-hidden="true">
      <img src="/icons/icon-192.png" alt="" width={size} height={size} decoding="async" />
    </div>
  )
}
