import { Activity, ArrowDown, ArrowRight, CalendarDays, CircleHelp, Dumbbell, Footprints, MapPin, Menu, MessageCircle, Phone, Plus } from "lucide-react";
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

type PhotoKind = "movement-assessment" | "first-visit" | "demo-portrait" | "demo-entrance";

function Photo({ kind, alt, hero = false }: { kind: PhotoKind; alt: string; hero?: boolean }) {
  return (
    <div className={`photo-frame visual photo-${kind}`} data-visual>
      <img src={`/images/${kind}-1200.webp`}
        srcSet={`/images/${kind}-640.webp 640w, /images/${kind}-1200.webp 1200w, /images/${kind}-1536.webp 1536w`}
        sizes="(min-width: 1440px) 720px, (min-width: 840px) 55vw, 100vw"
        width={1536} height={1024} alt={alt} loading={hero ? "eager" : "lazy"}
        fetchPriority={hero ? "high" : "auto"} decoding={hero ? "auto" : "async"} />
    </div>
  );
}

function PrimaryAction({ locale }: { locale: Locale }) {
  const copy = content[locale];
  return (
    <a className="button button-primary" href={href(locale, "contact")}>
      <CalendarDays aria-hidden="true" size={18} /> {copy.book}
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
              <ArrowRight className="direction-arrow" size={19} aria-hidden="true" />
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
            <p className="section-label"><MapPin size={16} aria-hidden="true" />{practice.locationLabel[locale]}</p>
            <h1 id="hero-heading">{c.heroStart}{" "}<span>{c.heroEnd}</span></h1>
            <p className="hero-lead lead">{c.heroText}</p>
            <div className="button-row actions"><PrimaryAction locale={locale} /><a className="text-link" href={href(locale, "first-visit")}>{c.prepare}</a></div>
          </div>
          <Photo kind="movement-assessment" alt={c.heroAlt} hero />
        </div>
        <div className="wrap hero-bottom"><a className="text-link" href="#conditions">{c.browse} <ArrowDown aria-hidden="true" size={16} /></a></div>
      </section>
      <section className="chapter services-section" id="conditions" aria-labelledby="conditions-heading">
        <div className="wrap two-column">
          <div><p className="section-label">{c.servicesKicker}</p><h2 id="conditions-heading">{c.servicesTitle}</h2><p className="section-lead">{c.servicesIntro}</p></div>
          <ServicesList locale={locale} />
        </div>
      </section>
      <section className="chapter profile-section" aria-labelledby="profile-heading">
        <div className="wrap profile-grid">
          <div data-moment="picture-develops"><Photo kind="demo-portrait" alt={c.portraitAlt} /></div>
          <div><h2 id="profile-heading">{c.meet}</h2><p className="section-lead">{c.aboutIntro}</p>
            <p className="profile-detail">{practice.credentials[locale]}</p>
            <a className="text-link" href={href(locale, "about")}>{c.profile}</a>
            <p className="demo-note">{c.demoNote}</p>
          </div>
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
      <section className="clinic-section chapter" aria-labelledby="closing-heading">
        <div className="wrap visit-grid">
          <div><h2 id="closing-heading">{c.findClinic}</h2><Contact locale={locale} /></div>
          <Photo kind="demo-entrance" alt={c.entranceAlt} />
        </div>
      </section>
    </>
  );
}

function Contact({ locale }: { locale: Locale }) {
  const c = content[locale];
  return (
    <div className="contact-information">
      <p className="demo-note">{c.demo} · {c.demoNote}</p>
      <div className="booking-actions">
        {practice.whatsapp
          ? <a className="button button-primary" href={`https://wa.me/${practice.whatsapp}?text=${encodeURIComponent(c.message)}`}><MessageCircle aria-hidden="true" size={18} />{c.whatsapp}</a>
          : <details><summary className="button button-primary"><MessageCircle aria-hidden="true" size={18} />{c.previewWhatsApp}</summary>
              <div className="preview-panel"><strong>{c.previewMessage}</strong><p>{c.message}</p></div></details>}
        {practice.phone
          ? <a className="text-link" href={`tel:${practice.phone}`}><Phone aria-hidden="true" size={16} />{c.call}</a>
          : <details><summary className="text-link"><Phone aria-hidden="true" size={16} />{c.previewCall}</summary>
              <p className="preview-panel">{c.demoNumber} · <bdi dir="ltr">+961 1 XXX XXX</bdi></p></details>}
      </div>
      <p className="confirmation">{c.confirmation}</p>
      <dl className="clinic-facts">
        <dt>{c.contactHours}</dt><dd>{practice.hours[locale]}</dd>
        <dt>{c.contactAddress}</dt><dd>{practice.location[locale]}</dd>
        <dt>{c.access}</dt><dd>{c.findDoor}</dd>
        <dt>{c.samplePhone}</dt><dd><bdi dir="ltr">{practice.phone || "+961 1 XXX XXX"}</bdi></dd>
      </dl>
      {practice.mapUrl
        ? <a className="text-link" href={practice.mapUrl}><MapPin aria-hidden="true" size={17} />{c.directions}</a>
        : <details><summary className="text-link"><MapPin aria-hidden="true" size={17} />{c.demoDirections}</summary><p className="preview-panel">{c.directionsText}</p></details>}
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
  const photos: Record<string, [PhotoKind, string]> = {
    services: ["movement-assessment", c.heroAlt], about: ["demo-portrait", c.portraitAlt],
    contact: ["demo-entrance", c.entranceAlt], "first-visit": ["first-visit", c.visitAlt],
  };
  const [photo, alt] = photos[route] ?? photos.services;

  return (
    <>
      <section className="inner-hero hero" data-enter aria-labelledby="page-heading">
        <div className="wrap inner-grid">
          <div className="inner-content">
            {service && <a className="back-link" href={href(locale, "services")}>{c.another}</a>}
            <h1 id="page-heading">{title}</h1>
            <p className="section-lead">{intro}</p>
            {service && <div className="article-block">
              <h2>{c.assessment}</h2><p>{service.assessment}</p>
              <h2>{c.preparation}</h2><p>{service.preparation}</p>
              <div className="faq-list"><details><summary>{service.question}<Plus aria-hidden="true" size={18} /></summary><p>{service.answer}</p></details></div>
              <PrimaryAction locale={locale} />
            </div>}
            {route === "about" && <div className="article-block">
              <h2>{c.qualification}</h2><p>{practice.credentials[locale]}</p><p className="demo-note">{c.demoNote}</p>
              <h2>{c.approach}</h2><p>{c.aboutApproach}</p>
              <a className="text-link" href={href(locale, "first-visit")}>{c.prepare}</a></div>}
            {route === "services" && <><ServicesList locale={locale} /><p className="help-link">{c.unsure} <a className="text-link" href={href(locale, "contact")}>{c.nav.contact}</a></p></>}
            {route === "first-visit" && <>
              <VisitSteps locale={locale} />
              <div className="article-block"><h2>{c.preparation}</h2><p>{c.questions[0][1]}</p>
                <h2>{c.practical}</h2><dl className="clinic-facts"><dt>{c.durationLabel}</dt><dd>{c.duration}</dd><dt>{c.feeLabel}</dt><dd>{c.fee}</dd></dl>
                <PrimaryAction locale={locale} />
              </div></>}
            {route === "contact" && <Contact locale={locale} />}
          </div>
          <Photo kind={photo} alt={alt} hero />
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
