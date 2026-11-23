import type { ReactNode } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Landmark,
  LibraryBig,
  Microscope,
  Phone,
  Plus,
  Quote,
  ShieldPlus,
} from "lucide-react";
import type { Article, Case, Service, Testimonial } from "@/db/schema";
import {
  bookingHref,
  conditions,
  content,
  institutions,
  practice,
  stats,
  values,
  type Locale,
} from "@/lib/content";
import { getPublicAvailability, getSiteContent, pick } from "@/lib/data";
import { Photo, serviceIcons } from "@/lib/media";
import { href } from "@/lib/routes";
import { BookingWidget } from "./booking-widget";
import { FixedHeader, LanguageLink, MobileMenu } from "./landing-navigation";
import { MotionMain } from "./page-motion";

type Props = { locale: Locale };

function Brand({ locale }: Props) {
  return (
    <a className="brand" href="#home">
      <img className="brand-mark" src="/mark.svg" width={48} height={48} alt="" />
      <span>
        {practice.name[locale]}
        <small>{practice.specialty[locale]}</small>
      </span>
    </a>
  );
}

function Book({ locale, hero = false }: Props & { hero?: boolean }) {
  return (
    <a className="button" href="#booking" data-hero={hero || undefined} data-hero-tail={hero || undefined}>
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
    ["values", c.values],
    ["services", c.services],
    ["cases", c.cases],
    ["articles", c.articles],
    ["faq", c.faq],
  ].map(([to, label]) => (
    <a key={to} href={`#${to}`}>
      {label}
    </a>
  ));
  return (
    <FixedHeader>
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
    </FixedHeader>
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
      <svg viewBox="0 0 32 32" aria-hidden="true" width="29" height="29" fill="none">
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
          <a href="#values">{c.values}</a>
          <a href="#services">{c.services}</a>
          <a href="#cases">{c.cases}</a>
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
    <section id="certifications" className="cert-strip" aria-labelledby="cert-heading">
      <div className="wrap cert-row">
        <div data-reveal>
          <h2 id="cert-heading">{c.certifications}</h2>
          <small>{c.demoLogos}</small>
        </div>
        <ul>
          {institutions.map((school, i) => {
            const Icon = institutionIcons[i];
            return (
              <li key={school.en} data-reveal>
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

function TreatmentList({ locale, services }: Props & { services: Service[] }) {
  return (
    <ul className="treatments">
      {services.map((s) => {
        const Icon = serviceIcons[s.icon] ?? serviceIcons.activity;
        return (
          <li key={s.id} data-reveal>
            <Icon aria-hidden="true" size={29} strokeWidth={1.5} />
            <h3>{pick(s, "title", locale)}</h3>
            <p>{pick(s, "summary", locale)}</p>
          </li>
        );
      })}
    </ul>
  );
}

/** Article bodies use blank lines between paragraphs and "## " for subheadings. */
function ArticleBody({ text }: { text: string }) {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, i) =>
      block.startsWith("## ") ? (
        <h4 key={i}>{block.slice(3)}</h4>
      ) : (
        <p key={i}>{block.replace(/\s*\n\s*/g, " ")}</p>
      ),
    );
}

function Articles({ locale, articles }: Props & { articles: Article[] }) {
  const c = content[locale];
  if (!articles.length) return null;
  return (
    <section id="articles" className="block">
      <div className="wrap">
        <div className="section-top">
          <h2 data-reveal>{c.featured}</h2>
          <PageLink to="#article-library">{c.allArticles}</PageLink>
        </div>
        <div className="article-cards">
          {articles.map((a) => (
            <a key={a.id} href={`#${a.slug}`} data-reveal>
              <div className="card-image">
                <Photo src={a.image} />
              </div>
              <small>{pick(a, "category", locale)}</small>
              <h3>
                {pick(a, "title", locale)}
                <ArrowUpRight size={19} aria-hidden="true" />
              </h3>
            </a>
          ))}
        </div>
        <div id="article-library" tabIndex={-1}>
          {articles.map((a) => (
            <article className="article-body" key={a.id} id={a.slug} tabIndex={-1}>
              <h3>{pick(a, "title", locale)}</h3>
              <p>{pick(a, "intro", locale)}</p>
              <ArticleBody text={pick(a, "body", locale)} />
              <PageLink to="#articles">{c.featured}</PageLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ locale, testimonials }: Props & { testimonials: Testimonial[] }) {
  const c = content[locale];
  if (!testimonials.length) return null;
  return (
    <section id="testimonials" className="block testimonials">
      <div className="wrap">
        <h2 data-reveal>{c.testimonials}</h2>
        {testimonials.some((q) => q.illustrative) && <p className="demo-label">{c.sampleQuotes}</p>}
        <div className="quotes">
          {testimonials.map((q) => (
            <figure key={q.id} data-reveal>
              <Quote aria-hidden="true" size={24} />
              <blockquote>{pick(q, "quote", locale)}</blockquote>
              <figcaption>{pick(q, "subject", locale)}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cases({ locale, cases }: Props & { cases: Case[] }) {
  const c = content[locale];
  if (!cases.length) return null;
  return (
    <section id="cases" className="block cases" aria-labelledby="cases-heading">
      <div className="wrap">
        <div className="cases-top" data-reveal>
          <h2 id="cases-heading">{c.casesTitle}</h2>
          <p className="lead">{c.casesLead}</p>
          {cases.some((k) => k.illustrative) && <p className="demo-label">{c.illustrativeCases}</p>}
        </div>
        <ul className="case-list">
          {cases.map((k) => {
            const treatment = pick(k, "treatment", locale);
            const outcome = pick(k, "outcome", locale);
            return (
              <li key={k.id} data-reveal>
                <article className="case-card">
                  {k.image && (
                    <div className="card-image">
                      <Photo src={k.image} sizes="(max-width: 760px) 92vw, 33vw" />
                    </div>
                  )}
                  <small>{pick(k, "condition", locale)}</small>
                  <h3>{pick(k, "title", locale)}</h3>
                  <p>{pick(k, "summary", locale)}</p>
                  {(treatment || outcome || k.sessions) && (
                    <details className="case-more">
                      <summary>
                        {c.caseMore}
                        <Plus size={18} aria-hidden="true" />
                      </summary>
                      <dl>
                        {treatment && (
                          <div>
                            <dt>{c.caseTreatment}</dt>
                            <dd>{treatment}</dd>
                          </div>
                        )}
                        {outcome && (
                          <div>
                            <dt>{c.caseOutcome}</dt>
                            <dd>{outcome}</dd>
                          </div>
                        )}
                        {k.sessions ? (
                          <div>
                            <dt>{c.caseSessions}</dt>
                            <dd>
                              <bdi dir="ltr">{k.sessions}</bdi>
                            </dd>
                          </div>
                        ) : null}
                      </dl>
                    </details>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Faq({ locale }: Props) {
  const c = content[locale];
  return (
    <section id="faq" className="block faq">
      <div className="wrap faq-layout">
        <h2 data-reveal>{c.questions}</h2>
        <div>
          {c.faqItems.map(([q, a], i) => (
            <details key={q} data-reveal>
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
          <div id="cancellation-policy" tabIndex={-1} className="fragment-panel">
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

function Values({ locale }: Props) {
  return (
    <section id="values" className="block values" aria-labelledby="values-heading">
      <div className="wrap">
        <h2 id="values-heading" data-reveal>
          {content[locale].values}
        </h2>
        <ul className="values-list">
          {values.map((value) => (
            <li key={value.ar.title} data-reveal>
              <h3>{value[locale].title}</h3>
              <div>
                {value.quote && (
                  <blockquote lang="ar" dir="rtl">
                    {value.quote}
                  </blockquote>
                )}
                <p>{value[locale].description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

async function Booking({ locale, services }: Props & { services: Service[] }) {
  const c = content[locale];
  const { days, settings } = await getPublicAvailability(locale);
  return (
    <section id="booking" className="block booking" aria-labelledby="booking-heading">
      <div className="wrap booking-layout">
        <div className="booking-intro" data-reveal>
          <h2 id="booking-heading">{c.bookingTitle}</h2>
          <p className="lead">{c.bookingNote}</p>
          <p className="booking-talk">
            {c.talkFirst}{" "}
            <a className="page-link" href={bookingHref(locale)}>
              {c.chat}
            </a>
          </p>
          <p className="booking-talk">
            <Phone size={16} aria-hidden="true" /> <PhoneLink locale={locale} />
          </p>
        </div>
        <div data-reveal>
          <BookingWidget
            locale={locale}
            days={days}
            enabled={settings.bookingEnabled}
            services={services.map((s) => ({ id: s.id, title: pick(s, "title", locale) }))}
            whatsappHref={bookingHref(locale)}
            copy={{
              chooseDay: c.chooseDay,
              chooseTime: c.chooseTime,
              yourDetails: c.yourDetails,
              stepDay: c.stepDay,
              stepTime: c.stepTime,
              stepDetails: c.stepDetails,
              earlier: c.earlier,
              later: c.later,
              dayClosed: c.dayClosed,
              dayFull: c.dayFull,
              noSlots: c.noSlots,
              noDays: c.noDays,
              bookingPaused: c.bookingPaused,
              fieldName: c.fieldName,
              fieldPhone: c.fieldPhone,
              fieldService: c.fieldService,
              anyService: c.anyService,
              fieldNote: c.fieldNote,
              change: c.change,
              privacy: c.privacy,
              submit: c.submit,
              sending: c.sending,
              successTitle: c.successTitle,
              successText: c.successText,
              another: c.another,
              chat: c.chat,
              errors: c.errors,
            }}
          />
        </div>
      </div>
    </section>
  );
}

async function Home({ locale }: Props) {
  const c = content[locale];
  const site = await getSiteContent();
  return (
    <>
      <section className="hero" id="home">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="specialty" data-hero>
              <span aria-hidden="true" />
              {c.specialty}
            </p>
            <h1>
              <span data-hero>{locale === "en" ? "Dr. Ahmad" : "د. أحمد"}</span>{" "}
              <span data-hero>{locale === "en" ? "Bakhach" : "بخاش"}</span>
            </h1>
            <p className="tagline" data-hero data-hero-tail>
              {c.heroLine}
            </p>
            <Book locale={locale} hero />
          </div>
          <div className="hero-art">
            <span className="hero-arch" data-hero aria-hidden="true" />
            <div className="portrait-window" data-hero>
              <Photo src="photo:blue-portrait" alt={c.portrait} hero />
            </div>
          </div>
        </div>
      </section>
      <Certifications locale={locale} />
      <section id="about-me" className="block about">
        <div className="wrap about-layout">
          <div className="about-photo">
            <Photo src="photo:demo-portrait" alt={c.portrait} />
          </div>
          <div>
            <h2 data-reveal>{c.hello}</h2>
            <p className="lead" data-reveal>
              {c.bio}
            </p>
            <PageLink to="#approach">{c.about}</PageLink>
            <div id="approach" tabIndex={-1} className="fragment-panel">
              <h3>{c.approach}</h3>
              <p>{c.approachText}</p>
            </div>
          </div>
        </div>
      </section>
      <Values locale={locale} />
      <section id="numbers" className="numbers" aria-label={c.numbers}>
        <dl className="wrap metric-list">
          {stats.map((s) => {
            const [, prefix = "", digits = s.value] = s.value.match(/^(\D*)(\d+)$/) ?? [];
            return (
              <div key={s.en}>
                <dt>{s[locale]}</dt>
                <dd>
                  <bdi dir="ltr" data-count={digits} data-prefix={prefix}>
                    {s.value}
                  </bdi>
                </dd>
              </div>
            );
          })}
        </dl>
      </section>
      <Testimonials locale={locale} testimonials={site.testimonials} />
      <section id="services" className="block service-band">
        <div className="wrap">
          <div className="section-top">
            <h2 data-reveal>{c.services}</h2>
            <PageLink to="#related-concerns">{c.learn}</PageLink>
          </div>
          <TreatmentList locale={locale} services={site.services} />
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
      <Cases locale={locale} cases={site.cases} />
      <Articles locale={locale} articles={site.articles} />
      <Faq locale={locale} />
      <Booking locale={locale} services={site.services} />
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
      <MotionMain>
        <Home locale={locale} />
      </MotionMain>
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
