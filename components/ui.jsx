import Link from "next/link";

export function PageHeader({
  eyebrow,
  title,
  description,
  action
}) {
  return (
    <header className="page-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="header-action">{action}</div> : null}
    </header>
  );
}

export function PrimaryLink({ href, children }) {
  return (
    <Link href={href} className="btn btn-primary">
      <span aria-hidden="true">+</span>
      {children}
    </Link>
  );
}

export function StatCard({
  label,
  value,
  accent
}) {
  return (
    <div className="stat-card" style={accent ? { borderColor: accent } : undefined}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
