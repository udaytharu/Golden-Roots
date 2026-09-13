export default function PageHero({ title, subtitle }) {
  return (
    <section className="page-hero">
      <div className="page-hero-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}
