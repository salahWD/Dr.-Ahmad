import { Activity, CalendarDays, ChevronDown, CircleHelp, Dumbbell, Footprints, MapPin, Menu, MessageCircle, Phone, Plus } from "lucide-react";
import { content, practice, services, type Locale } from "@/lib/content";
import { href } from "@/lib/routes";

const serviceIcons = [Activity, Dumbbell, Footprints];

function Mark() {
  return <span aria-hidden="true" className="brand-mark"><Activity size={23} strokeWidth={1.55} /></span>;
}

function Brand({ locale }: { locale: Locale }) {
  return (
    <a className="brand" href={href(locale)} aria-label={`${practice.name[locale]} · ${content[locale].home}`}>
      <Mark />
      <span><strong>{practice.name[locale]}</strong><small>{practice.specialty[locale]}</small></span>
    </a>
  );
}

function Photo({ kind, alt, hero = false }: { kind: "movement-assessment" | "first-visit"; alt: string; hero?: boolean }) {
  return (
    <div className="photo-frame visual" data-visual>
      {/* Static responsive sizes are pre-generated for the two editorial assets. */}
      <img src={`/images/${kind}-1200.webp`}
        srcSet={`/images/${kind}-640.webp 640w, /images/${kind}-1200.webp 1200w, /images/${kind}-1536.webp 1536w`}
        sizes="(min-width: 1200px) 640px, (min-width: 840px) 49vw, 100vw"
        width={1536} height={1024} alt={alt} loading={hero ? "eager" : "lazy"}
        fetchPriority={hero ? "high" : "auto"} decoding={hero ? "auto" : "async"} />
    </div>
  );
}

function PrimaryAction({ locale }: { locale: Locale }) {
  const copy = content[locale];
  const canBook = Boolean(practice.whatsapp || practice.phone);
  return (
    <a className="button button-primary" href={href(locale, canBook ? "contact" : "first-visit")}>
      <CalendarDays aria-hidden="true" size={18} /> {canBook ? copy.book : copy.prepare}
    </a>
  );
}

function Header({ locale, route }: { locale: Locale; route: string }) {
  const copy = content[locale];
  const en = locale === "en";
  const links = [
    ["services", copy.nav.services], ["about", copy.nav.about],
    ["first-visit", copy.nav.visit], ["contact", copy.nav.contact],
  ];
  const nav = links.map(([target, label]) => (
    <a key={target} href={href(locale, target)} aria-current={route === target ? "page" : undefined}>{label}</a>
  ));
  const language = (
    <a className="language-switch" href={href(en ? "ar" : "en", route)} lang={en ? "ar" : "en"}
      aria-label={en ? "العربية" : "Read in English"}>{en ? "العربية" : "English"}</a>
  );

  return (
    <header className="site-header nav-centre">
      <div className="wrap header-row">
        <Brand locale={locale} />
        <nav className="desktop-navigation" aria-label={copy.navLabel}>{nav}</nav>
        <div className="header-actions">{language}<PrimaryAction locale={locale} /></div>
        <div className="mobile-actions">
          {language}
          <details className="mobile-menu">
            <summary aria-label={copy.menu}><Menu size={24} aria-hidden="true" /></summary>
            <nav className="mobile-navigation" aria-label={copy.navLabel}>{nav}</nav>
          </details>
        </div>
      </div>
    </header>
  );
}

function ServicesList({ locale }: { locale: Locale }) {
  return (
    <ul className="services-list">
      {services.map(({ slug, copy }, index) => {
        const Icon = serviceIcons[index];
        return (
          <li key={slug}>
            <a href={href(locale, `services/${slug}`)} className="service-link">
              <span className="service-icon"><Icon aria-hidden="true" size={24} strokeWidth={1.6} /></span>
              <span><strong>{copy[locale].title}</strong><small>{copy[locale].summary}</small></span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function Faq({ locale }: { locale: Locale }) {
  const copy = content[locale];
  return (
    <section className="faq-section chapter" aria-labelledby="questions">
      <div className="wrap faq-grid">
        <h2 id="questions"><CircleHelp aria-hidden="true" size={24} />{copy.questionsTitle}</h2>
        <div className="faq-list">
          {copy.questions.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}<Plus aria-hidden="true" size={21} /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisitSteps({ locale }: { locale: Locale }) {
  return (
    <ol className="visit-steps">
      {content[locale].steps.map(([title, text], index) => (
        <li key={title}>
          <span className="step-number" aria-hidden="true">{new Intl.NumberFormat(locale).format(index + 1)}</span>
          <div><strong>{title}</strong><p>{text}</p></div>
        </li>
      ))}
    </ol>
  );
}

function Home({ locale }: { locale: Locale }) {
  const c = content[locale];
  return (
    <>
      <section className="hero" data-enter aria-labelledby="hero-heading">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="section-label"><span aria-hidden="true" />{practice.name[locale]} <span className="label-divider" aria-hidden="true" /> {practice.specialty[locale]}</p>
            <h1 id="hero-heading">{c.heroStart}{" "}<span>{c.heroEnd}</span></h1>
            <p className="hero-lead lead">{c.heroText}</p>
            <div className="button-row actions"><PrimaryAction locale={locale} /><a className="button button-secondary" href="#conditions">{c.browse}</a></div>
          </div>
          <Photo kind="movement-assessment" alt={c.heroAlt} hero />
        </div>
        <div className="wrap hero-bottom" aria-hidden="true"><span /><span><ChevronDown size={17} /></span><span /></div>
      </section>
      <section className="chapter services-section" id="conditions" aria-labelledby="conditions-heading">
        <div className="wrap two-column">
          <div><p className="section-label">{c.servicesKicker}</p><h2 id="conditions-heading">{c.servicesTitle}</h2><p className="section-lead">{c.servicesIntro}</p></div>
          <ServicesList locale={locale} />
        </div>
      </section>
      <section className="chapter visit-section" aria-labelledby="visit-heading">
        <div className="wrap visit-grid">
          <div className="visit-content">
            <h2 id="visit-heading">{c.firstVisitTitle}</h2>
            <p className="section-lead">{c.firstVisitIntro}</p>
            <VisitSteps locale={locale} />
            <a className="button button-secondary" href={href(locale, "first-visit")}>{c.prepare}</a>
          </div>
          <Photo kind="first-visit" alt={c.visitAlt} />
        </div>
      </section>
      <Faq locale={locale} />
      <section className="statement-section chapter" aria-labelledby="closing-heading">
        <div className="wrap statement" data-moment="word-highlight">
          <h2 id="closing-heading">{c.statement.map((part) => <span key={part}>{part}{" "}</span>)}</h2>
          <a className="button button-primary" href={href(locale, "contact")}>{c.nav.contact}</a>
        </div>
      </section>
    </>
  );
}

function Contact({ locale }: { locale: Locale }) {
  const copy = content[locale];
  const hasContact = Boolean(practice.whatsapp || practice.phone);
  const address = practice.location[locale];
  const hours = practice.hours[locale];
  return (
    <div className="contact-information">
      {(address || hours) && <dl>
        {address && <><dt>{copy.contactAddress}</dt><dd>{address}</dd></>}
        {hours && <><dt>{copy.contactHours}</dt><dd>{hours}</dd></>}
      </dl>}
      {hasContact ? <div className="button-row">
        {practice.whatsapp && <a className="button button-primary" href={`https://wa.me/${practice.whatsapp}?text=${encodeURIComponent(copy.message)}`} rel="noreferrer"><MessageCircle aria-hidden="true" size={18} />{copy.whatsapp}</a>}
        {practice.phone && <a className="button button-secondary" href={`tel:${practice.phone}`}><Phone aria-hidden="true" size={18} />{copy.call}</a>}
      </div> : <p className="pending-contact">{copy.contactPending}</p>}
      {practice.mapUrl && <a className="button button-secondary" href={practice.mapUrl}><MapPin aria-hidden="true" size={18} />{copy.directions}</a>}
    </div>
  );
}

function InnerPage({ locale, route }: { locale: Locale; route: string }) {
  const c = content[locale];
  const service = services.find(({ slug }) => route === `services/${slug}`)?.copy[locale];
  const pages: Partial<Record<string, [string, string]>> = {
    services: [c.servicesTitle, c.servicesIntro],
    about: [practice.name[locale], c.aboutIntro],
    "first-visit": [c.firstVisitTitle, c.firstVisitIntro],
    contact: [c.contactTitle, c.contactIntro],
  };
  const basic = pages[route];
  const [title, intro] = service ? [service.title, service.intro] : basic ?? [c.title, c.description];

  return (
    <>
      <section className="inner-hero hero" data-enter aria-labelledby="page-heading">
        <div className="wrap inner-grid">
          <div className="inner-content">
            {service && <a className="back-link" href={href(locale, "services")}>{c.another}</a>}
            <h1 id="page-heading">{title}</h1>
            <p className="section-lead">{intro}</p>
            {service && <div className="article-block"><h2>{c.assessment}</h2><p>{service.assessment}</p><PrimaryAction locale={locale} /></div>}
            {route === "about" && <div className="article-block"><p>{c.aboutApproach}</p>{practice.credentials[locale] && <p>{practice.credentials[locale]}</p>}<PrimaryAction locale={locale} /></div>}
            {route === "services" && <ServicesList locale={locale} />}
            {route === "first-visit" && <VisitSteps locale={locale} />}
            {route === "contact" && <Contact locale={locale} />}
          </div>
          <Photo kind={route === "services" ? "movement-assessment" : "first-visit"} alt={route === "services" ? c.heroAlt : c.visitAlt} hero />
        </div>
      </section>
      {route === "first-visit" && <Faq locale={locale} />}
    </>
  );
}

export function PracticePage({ locale, route = "" }: { locale: Locale; route?: string }) {
  const c = content[locale];
  const person = {
    "@context": "https://schema.org", "@type": "Person", name: practice.name[locale],
    jobTitle: practice.specialty[locale],
    url: practice.siteUrl && new URL(href(locale), practice.siteUrl).href,
    telephone: practice.phone,
  };

  return (
    <>
      <a className="skip-link" href="#main-content">{c.skip}</a>
      <Header locale={locale} route={route} />
      <main id="main-content">
        {route ? <InnerPage locale={locale} route={route} /> : <Home locale={locale} />}
      </main>
      <footer className="site-footer">
        <div className="wrap footer-row">
          <Brand locale={locale} />
          <a className="footer-link" href={href(locale, "contact")}>{c.nav.contact}</a>
          <p>{c.photos}</p>
        </div>
      </footer>
      {!route && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }} />}
    </>
  );
}
