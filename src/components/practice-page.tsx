import type { ReactNode } from "react";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  Droplet,
  Dumbbell,
  Landmark,
  LibraryBig,
  Microscope,
  Phone,
  Plus,
  Quote,
  ShieldPlus,
  Syringe,
} from "lucide-react";
import {
  articles,
  bookingHref,
  conditions,
  content,
  institutions,
  practice,
  stats,
  treatments,
  type Locale,
} from "@/lib/content";
import { href } from "@/lib/routes";
import { LanguageLink, MobileMenu } from "./landing-navigation";

type Props = { locale: Locale };
type PhotoKind =
  | "blue-portrait"
  | "demo-portrait"
  | "movement-assessment"
  | "first-visit"
  | "demo-entrance";

function Photo({
  kind,
  alt = "",
  hero = false,
}: {
  kind: PhotoKind;
  alt?: string;
  hero?: boolean;
}) {
  return (
    <img
      className="photo"
      src={`/images/${kind}-1200.webp`}
      srcSet={`/images/${kind}-640.webp 640w, /images/${kind}-1200.webp 1200w, /images/${kind}-1536.webp 1536w`}
      sizes="(max-width: 760px) 92vw, (max-width: 1440px) 50vw, 730px"
      alt={alt}
      width="1536"
      height="1024"
      loading={hero ? "eager" : "lazy"}
      fetchPriority={hero ? "high" : "auto"}
    />
  );
}

function Brand({ locale }: Props) {
  return (
    <a className="brand" href="#home">
      <span className="brand-mark" aria-hidden="true">
        <Activity size={26} strokeWidth={2} />
      </span>
      <span>
        {practice.name[locale]}
        <small>{practice.specialty[locale]}</small>
      </span>
    </a>
  );
}

function Book({ locale, direct = false }: Props & { direct?: boolean }) {
  return (
    <a className="button" href={direct ? bookingHref(locale) : "#booking"}>
      <CalendarDays size={18} aria-hidden="true" />
      {content[locale].book}
    </a>
  );
}

function PageLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <a className="page-link" href={to}>
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </a>
  );
}

function Header({ locale }: Props) {
  const c = content[locale];
  const other = locale === "ar" ? "en" : "ar";
  const nav = [
    ["about-me", c.about],
    ["services", c.services],
    ["articles", c.articles],
    ["faq", c.faq],
  ].map(([to, label]) => (
    <a key={to} href={`#${to}`}>
      {label}
    </a>
  ));
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Brand locale={locale} />
        <nav aria-label={c.menu} className="desktop-nav">
          {nav}
        </nav>
        <div className="header-tools">
          <LanguageLink locale={other} base={href(other)} />
          <div className="header-book">
            <Book locale={locale} />
          </div>
          <MobileMenu label={c.menu}>
            {nav}
            <Book locale={locale} />
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}

function PhoneLink({ locale }: Props) {
  const display =
    practice.phone === "+96176937274" ? "76 937 274" : practice.phone;
  return (
    <a
      className="phone-link"
      aria-label={`${content[locale].call} ${display}`}
      href={`tel:${practice.phone}`}
    >
      <bdi dir="ltr">{display}</bdi>
    </a>
  );
}

function FloatingWhatsApp({ locale }: Props) {
  return (
    <a
      className="whatsapp"
      href={`https://wa.me/${practice.whatsapp}`}
      aria-label={content[locale].chat}
      title={content[locale].chat}
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        width="29"
        height="29"
        fill="none"
      >
        <path
          d="M27.7 15.7a11.6 11.6 0 0 1-17.3 10.1l-6.1 1.6 1.6-5.9a11.6 11.6 0 1 1 21.8-5.8Z"
          stroke="currentColor"
          strokeWidth="2.1"
        />
        <path
          d="M11.3 9.4c-.6 0-1.8 1.1-1.8 2.7 0 3.2 5.2 9.1 9.8 9.1 1.7 0 2.8-1.3 2.8-2.3 0-.5-.4-.7-.8-.9l-2.3-1.1c-.3-.1-.6 0-.8.3l-1 1.2c-1.9-.8-3.5-2.2-4.4-3.8l.9-1.2c.2-.3.3-.6.1-1l-1.2-2.6c-.2-.4-.7-.4-1.3-.4Z"
          fill="currentColor"
        />
      </svg>
    </a>
  );
}

function Footer({ locale }: Props) {
  const c = content[locale];
  return (
    <footer>
      <div className="wrap footer-main">
        <Brand locale={locale} />
        <nav aria-label={c.menu}>
          <a href="#about-me">{c.about}</a>
          <a href="#services">{c.services}</a>
          <a href="#articles">{c.articles}</a>
          <a href="#cancellation-policy">{c.policy}</a>
        </nav>
        <span className="footer-phone">
          <Phone size={16} aria-hidden="true" />
          <PhoneLink locale={locale} />
        </span>
      </div>
      <div className="wrap footer-note">{c.demo}</div>
    </footer>
  );
}

const institutionIcons = [Landmark, ShieldPlus, LibraryBig, Microscope];
function Certifications({ locale }: Props) {
  const c = content[locale];
  return (
    <section
      id="certifications"
      className="cert-strip"
      aria-labelledby="cert-heading"
    >
      <div className="wrap cert-row">
        <div>
          <h2 id="cert-heading">{c.certifications}</h2>
          <small>{c.demoLogos}</small>
        </div>
        <ul>
          {institutions.map((school, i) => {
            const Icon = institutionIcons[i];
            return (
              <li key={school.en}>
                <Icon size={33} strokeWidth={1.5} aria-hidden="true" />
                <span>{school[locale]}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const treatmentIcons = [Activity, Syringe, Droplet, Dumbbell];
function TreatmentList({ locale }: Props) {
  return (
    <ul className="treatments">
      {treatments.map((t, i) => {
        const Icon = treatmentIcons[i];
        return (
          <li key={t.slug}>
            <Icon aria-hidden="true" size={29} strokeWidth={1.5} />
            <h3>{t[locale][0]}</h3>
            <p>{t[locale][1]}</p>
          </li>
        );
      })}
    </ul>
  );
}

function ArticleCards({ locale }: Props) {
  return (
    <div className="article-cards">
      {articles.map((a) => (
        <a key={a.slug} href={`#${a.slug}`}>
          <div className="card-image">
            <Photo kind={a.photo} />
          </div>
          <small>{a[locale].category}</small>
          <h3>
            {a[locale].title}
            <ArrowUpRight size={19} aria-hidden="true" />
          </h3>
        </a>
      ))}
    </div>
  );
}

function Faq({ locale }: Props) {
  const c = content[locale];
  return (
    <section id="faq" className="block faq">
      <div className="wrap faq-layout">
        <h2>{c.questions}</h2>
        <div>
          {c.faqItems.map(([q, a], i) => (
            <details key={q}>
              <summary>
                {q}
                <Plus size={19} aria-hidden="true" />
              </summary>
              <p>
                {a}
                {i === 1 && (
                  <>
                    {" "}
                    <PhoneLink locale={locale} />
                  </>
                )}
                {i === 2 && (
                  <>
                    {" "}
                    <a href="#cancellation-policy">{c.policy}</a>
                  </>
                )}
              </p>
            </details>
          ))}
          <div
            id="cancellation-policy"
            tabIndex={-1}
            className="fragment-panel"
          >
            <h3>{c.policy}</h3>
            <p>
              {c.policyText} <PhoneLink locale={locale} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Home({ locale }: Props) {
  const c = content[locale];
  return (
    <>
      <section className="hero" id="home">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="specialty">
              <span aria-hidden="true" />
              {c.specialty}
            </p>
            <h1>
              {locale === "en" ? "Dr. Ahmad" : "د. أحمد"}{" "}
              <span>{locale === "en" ? "Bakhach" : "بخاش"}</span>
            </h1>
            <p className="tagline">{c.heroLine}</p>
            <Book locale={locale} />
          </div>
          <div className="hero-art">
            <div className="portrait-window">
              <Photo kind="blue-portrait" alt={c.portrait} hero />
            </div>
          </div>
        </div>
      </section>
      <Certifications locale={locale} />
      <section id="about-me" className="block about">
        <div className="wrap about-layout">
          <div className="about-photo">
            <Photo kind="demo-portrait" alt={c.portrait} />
          </div>
          <div>
            <h2>{c.hello}</h2>
            <p className="lead">{c.bio}</p>
            <PageLink to="#approach">{c.about}</PageLink>
            <div id="approach" tabIndex={-1} className="fragment-panel">
              <h3>{c.approach}</h3>
              <p>{c.approachText}</p>
            </div>
          </div>
        </div>
      </section>
      <section id="numbers" className="numbers" aria-label={c.numbers}>
        <dl className="wrap metric-list">
          {stats.map((s) => (
            <div key={s.en}>
              <dt>{s[locale]}</dt>
              <dd>
                <bdi dir="ltr">{s.value}</bdi>
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section id="testimonials" className="block testimonials">
        <div className="wrap">
          <h2>{c.testimonials}</h2>
          <p className="demo-label">{c.sampleQuotes}</p>
          <div className="quotes">
            {c.quotes.map(([quote, subject]) => (
              <figure key={subject}>
                <Quote aria-hidden="true" size={24} />
                <blockquote>{quote}</blockquote>
                <figcaption>{subject}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <section id="services" className="block service-band">
        <div className="wrap">
          <div className="section-top">
            <h2>{c.services}</h2>
            <PageLink to="#related-concerns">{c.learn}</PageLink>
          </div>
          <TreatmentList locale={locale} />
          <div id="related-concerns" className="fragment-panel" tabIndex={-1}>
            <h3>{c.conditions}</h3>
            {conditions.map(({ slug, copy }) => {
              const item = copy[locale];
              return (
                <details key={slug} className="condition">
                  <summary>
                    {item.title}
                    <Plus size={18} aria-hidden="true" />
                  </summary>
                  <p>{item.intro}</p>
                  <h4>{c.assessment}</h4>
                  <p>{item.assessment}</p>
                  <h4>{c.bring}</h4>
                  <p>{item.preparation}</p>
                  <h4>{item.question}</h4>
                  <p>{item.answer}</p>
                </details>
              );
            })}
          </div>
        </div>
      </section>
      <section id="articles" className="block">
        <div className="wrap">
          <div className="section-top">
            <h2>{c.featured}</h2>
            <PageLink to="#article-library">{c.allArticles}</PageLink>
          </div>
          <ArticleCards locale={locale} />
          <div id="article-library" tabIndex={-1}>
            {articles.map((a) => (
              <article
                className="article-body"
                key={a.slug}
                id={a.slug}
                tabIndex={-1}
              >
                <h3>{a[locale].title}</h3>
                <p>{a[locale].intro}</p>
                {a[locale].sections.map(([heading, body]) => (
                  <div key={heading}>
                    <h4>{heading}</h4>
                    <p>{body}</p>
                  </div>
                ))}
                <PageLink to="#articles">{c.featured}</PageLink>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Faq locale={locale} />
      <section id="booking" className="cta">
        <div className="wrap cta-row">
          <div>
            <h2>{c.priority}</h2>
            <p>
              {c.bookingNote} <PhoneLink locale={locale} />
            </p>
          </div>
          <Book locale={locale} direct />
        </div>
      </section>
    </>
  );
}

export function PracticePage({ locale }: Props) {
  const practitioner = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: practice.name[locale],
    jobTitle: practice.specialty[locale],
    telephone: practice.phone,
    url: practice.siteUrl && new URL(href(locale), practice.siteUrl).href,
  };
  return (
    <>
      <a className="skip-link" href="#main">
        {content[locale].skip}
      </a>
      <Header locale={locale} />
      <main id="main">
        <Home locale={locale} />
      </main>
      <Footer locale={locale} />
      <FloatingWhatsApp locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(practitioner).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
