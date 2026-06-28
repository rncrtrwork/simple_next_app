const links = [
  { href: "https://nextjs.org/docs", label: "Docs" },
  { href: "https://nextjs.org/learn", label: "Learn" },
  { href: "https://vercel.com/new", label: "Deploy" },
];

export default function Home() {
  return (
    <main className="shell">
      <section className="hero" aria-labelledby="home-title">
        <p className="eyebrow">Simple Next.js app</p>
        <h1 id="home-title">Hello, world. Your Next.js app is running.</h1>
        <p className="lede">
          Start editing <code>app/page.tsx</code> to shape this into your app.
          The starter includes TypeScript, the App Router, and a clean responsive
          layout.
        </p>
        <div className="actions" aria-label="Helpful links">
          {links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
