import React from 'react';
import Link from 'next/link';
import { getFeaturedTemplates } from '@/lib/templates';
import { getAllCategories } from '@/lib/categories';
import { getAllCollections } from '@/lib/collections';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TemplateCard } from '@/components/platform/TemplateCard';
import {
  Compass,
  Play,
  ArrowRight,
  Zap,
  Globe,
  Truck,
  Ship,
  Plane,
  Warehouse,
  Network,
  Cpu,
  Layers,
  Activity,
  Code2,
  Palette,
  Briefcase,
  Users,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import styles from './page.module.css';

export default function HomePage() {
  const featuredTemplates = getFeaturedTemplates();
  const allCategories = getAllCategories();
  const collections = getAllCollections();

  // Category Icon Resolver
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe size={22} />;
      case 'Ship': return <Ship size={22} />;
      case 'Zap': return <Zap size={22} />;
      case 'Truck': return <Truck size={22} />;
      case 'Cpu': return <Cpu size={22} />;
      case 'Warehouse': return <Warehouse size={22} />;
      case 'Network': return <Network size={22} />;
      case 'Plane': return <Plane size={22} />;
      case 'Layers': return <Layers size={22} />;
      case 'Activity': return <Activity size={22} />;
      case 'Anchor': return <Ship size={22} />;
      default: return <Compass size={22} />;
    }
  };

  return (
    <div className={styles.page}>
      {/* =========================================================================
       * 1. EDITORIAL LOGISTICS HERO SECTION
       * ========================================================================= */}
      <section className={styles.heroSection}>
        <div className={styles.heroAtmosphere}>
          <div className={styles.radarRing} />
          <div className={styles.radarRingOuter} />
          <div className={styles.vectorLineOne} />
          <div className={styles.vectorLineTwo} />
          <div className={styles.glowSpot} />
        </div>

        <Container size="lg" className={styles.heroContainer}>
          {/* Signal Indicator */}
          <div className={styles.heroSignal}>
            <span className={styles.signalBeacon}>
              <span className={styles.beaconPing} />
              <span className={styles.beaconDot} />
            </span>
            <span className={styles.signalText}>LOGISTICS TEMPLATE PLATFORM &amp; STUDIO</span>
            <span className={styles.signalVersion}>v0.3.0 READY</span>
          </div>

          {/* Headline & Subtitle */}
          <h1 className={styles.heroHeadline}>
            The Architecture of Modern <br />
            <span className={styles.headlineHighlight}>Logistics Web Platforms</span>
          </h1>

          <p className={styles.heroSubtitle}>
            LOGIFORGE is a premium logistics website template platform, live device studio, and developer starter ecosystem. Discover 10 independent website architectures engineered for international freight forwarders, maritime shipping lines, air cargo fleets, and supply chain enterprises.
          </p>

          {/* CTAs */}
          <div className={styles.heroActions}>
            <Link href="/templates">
              <Button variant="primary" size="lg" className={styles.mainCta}>
                <Compass size={18} />
                <span>Explore 10 Flagship Templates</span>
              </Button>
            </Link>
            <Link href="/demo/cargo-nova">
              <Button variant="secondary" size="lg">
                <Play size={18} />
                <span>Launch Live Demo Studio</span>
              </Button>
            </Link>
          </div>

          {/* Simulated Waybill Transit Ribbon */}
          <div className={styles.telemetryTicker} role="region" aria-label="Simulated Logistics Telemetry Feed">
            <div className={styles.tickerHeader}>
              <Terminal size={14} className={styles.tickerIcon} />
              <span>SIMULATED WAYBILL FEED:</span>
            </div>
            <div className={styles.tickerList}>
              <span className={styles.tickerItem}>
                <strong>CN-8924-US</strong> CNSHA → USLGB [Ocean 19.4 kts]
              </span>
              <span className={styles.tickerDivider}>•</span>
              <span className={styles.tickerItem}>
                <strong>AC-9901-FRA</strong> DEFRA → USORD [FL340 Airborne]
              </span>
              <span className={styles.tickerDivider}>•</span>
              <span className={styles.tickerItem}>
                <strong>FO-4091-TX</strong> I-20 Eastbound Mile 114 [Telemetry Optimal]
              </span>
              <span className={styles.tickerDivider}>•</span>
              <span className={styles.tickerItem}>
                <strong>SD-4421-EU</strong> Berlin Urban Dispatch [Out for Delivery]
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
       * 2. PLATFORM SIGNALS & DETERMINISTIC METRICS
       * ========================================================================= */}
      <section className={styles.metricsSection}>
        <Container size="lg">
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricVal}>10</span>
              <span className={styles.metricLabel}>Flagship Templates</span>
              <p className={styles.metricDesc}>Every template possesses an independent typographic, aesthetic, and layout identity.</p>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricVal}>11</span>
              <span className={styles.metricLabel}>Logistics Disciplines</span>
              <p className={styles.metricDesc}>From maritime ocean lines and air cargo to urban couriers and automated 3PL fulfillment.</p>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricVal}>100%</span>
              <span className={styles.metricLabel}>Type-Safe Contracts</span>
              <p className={styles.metricDesc}>Strict TypeScript schemas ensuring complete data coherence across catalog and runtime.</p>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricVal}>0ms</span>
              <span className={styles.metricLabel}>Style Leakage</span>
              <p className={styles.metricDesc}>Two-tier token separation (--lf-* vs --tmpl-*) isolating the platform shell from templates.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
       * 3. FEATURED FLAGSHIP TEMPLATES SHOWCASE
       * ========================================================================= */}
      <section className={styles.showcaseSection}>
        <Container size="lg">
          <SectionHeading
            eyebrow="CURATED DIRECTORY"
            title="Flagship Logistics Website Templates"
            subtitle="Explore our flagship website architectures. Each template includes responsive page layouts, interactive logistics widgets, and clean starter code."
            action={
              <Link href="/templates">
                <Button variant="outline" size="sm">
                  <span>Browse All 10 Templates</span>
                  <ArrowRight size={14} />
                </Button>
              </Link>
            }
          />

          <div className={styles.templateCardsGrid}>
            {featuredTemplates.slice(0, 6).map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </Container>
      </section>

      {/* =========================================================================
       * 4. 11 LOGISTICS CATEGORIES EXPLORER
       * ========================================================================= */}
      <section className={styles.categoriesSection}>
        <Container size="lg">
          <SectionHeading
            eyebrow="INDUSTRY TAXONOMY"
            title="Specialized Logistics Disciplines"
            subtitle="Navigate directly to specialized template collections filtered by transport mode and supply chain domain."
            align="center"
          />

          <div className={styles.categoriesGrid}>
            {allCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/templates?category=${cat.slug}`}
                className={styles.categoryCard}
                style={{ '--cat-accent': cat.accentColor } as React.CSSProperties}
              >
                <div className={styles.catIconBox}>
                  {getCategoryIcon(cat.iconName)}
                </div>
                <div className={styles.catHeader}>
                  <h3 className={styles.catName}>{cat.name}</h3>
                  <Badge variant="secondary" size="sm">
                    {cat.templateCount} {cat.templateCount === 1 ? 'Template' : 'Templates'}
                  </Badge>
                </div>
                <p className={styles.catDesc}>{cat.description}</p>
                <div className={styles.catTags}>
                  {cat.popularTags.slice(0, 3).map((tag) => (
                    <span key={tag} className={styles.catTag}>
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className={styles.catFooter}>
                  <span className={styles.catExploreText}>Explore Category</span>
                  <ArrowRight size={14} className={styles.catArrow} />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* =========================================================================
       * 5. VALUE PROPOSITION: 4 PERSPECTIVES
       * ========================================================================= */}
      <section className={styles.valueSection}>
        <Container size="lg">
          <SectionHeading
            eyebrow="BUILT FOR TEAMS"
            title="Tailored for Four Essential Roles"
            subtitle="How LogiForge transforms delivery workflows for technical teams, designers, digital agencies, and enterprise clients."
          />

          <div className={styles.personaGrid}>
            {/* Persona 1: Developers */}
            <div className={styles.personaCard}>
              <div className={styles.personaHeader}>
                <div className={styles.personaIcon}>
                  <Code2 size={22} />
                </div>
                <div>
                  <span className={styles.personaRole}>For Developers</span>
                  <h3 className={styles.personaTitle}>Clean Architecture &amp; Zero Bloat</h3>
                </div>
              </div>
              <p className={styles.personaDesc}>
                Jumpstart client projects with clean Next.js App Router, strict TypeScript models, and scoped CSS modules. Zero spaghetti CSS or hidden dependencies.
              </p>
              <ul className={styles.personaPoints}>
                <li><CheckCircle2 size={15} /> 100% typed domain entities and filter query contracts</li>
                <li><CheckCircle2 size={15} /> Independent template modules that never pollute the host</li>
                <li><CheckCircle2 size={15} /> Ready-to-use simulated waybill state machines</li>
              </ul>
            </div>

            {/* Persona 2: Designers */}
            <div className={styles.personaCard}>
              <div className={styles.personaHeader}>
                <div className={styles.personaIcon}>
                  <Palette size={22} />
                </div>
                <div>
                  <span className={styles.personaRole}>For Designers</span>
                  <h3 className={styles.personaTitle}>Distinct Visual Identities</h3>
                </div>
              </div>
              <p className={styles.personaDesc}>
                Break free from generic SaaS templates. Every template features custom font pairings (Cormorant, Space Grotesk, Syne, Sora) and authentic industry data densities.
              </p>
              <ul className={styles.personaPoints}>
                <li><CheckCircle2 size={15} /> 9 distinct aesthetic directions from Editorial to High-Tech</li>
                <li><CheckCircle2 size={15} /> Authentic logistics schematics, port matrices, and route maps</li>
                <li><CheckCircle2 size={15} /> WCAG 2.1 AA accessible contrast and visible focus tokens</li>
              </ul>
            </div>

            {/* Persona 3: Digital Agencies */}
            <div className={styles.personaCard}>
              <div className={styles.personaHeader}>
                <div className={styles.personaIcon}>
                  <Briefcase size={22} />
                </div>
                <div>
                  <span className={styles.personaRole}>For Agencies</span>
                  <h3 className={styles.personaTitle}>Turnkey Pitch Presentations</h3>
                </div>
              </div>
              <p className={styles.personaDesc}>
                Pitch logistics clients with interactive live demos. Switch into <strong>Client Presentation Mode</strong> with a single keypress (`P`) to hide developer jargon.
              </p>
              <ul className={styles.personaPoints}>
                <li><CheckCircle2 size={15} /> Multi-device frame controls (Desktop, Tablet, Mobile)</li>
                <li><CheckCircle2 size={15} /> Simulated waybill milestone lookup to demonstrate real UX</li>
                <li><CheckCircle2 size={15} /> Commercial developer licensing for client delivery</li>
              </ul>
            </div>

            {/* Persona 4: Clients */}
            <div className={styles.personaCard}>
              <div className={styles.personaHeader}>
                <div className={styles.personaIcon}>
                  <Users size={22} />
                </div>
                <div>
                  <span className={styles.personaRole}>For Logistics Clients</span>
                  <h3 className={styles.personaTitle}>Enterprise Trust &amp; Conversion</h3>
                </div>
              </div>
              <p className={styles.personaDesc}>
                Logistics customers judge transport brands by their digital precision. LogiForge templates inspire confidence with clear sailing schedules and booking forms.
              </p>
              <ul className={styles.personaPoints}>
                <li><CheckCircle2 size={15} /> Fast load times and zero layout shift</li>
                <li><CheckCircle2 size={15} /> Intuitive mobile booking and tracking flows</li>
                <li><CheckCircle2 size={15} /> Institutional aesthetic that commands credibility</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
       * 6. CURATED COLLECTIONS SHOWCASE
       * ========================================================================= */}
      <section className={styles.collectionsSection}>
        <Container size="lg">
          <SectionHeading
            eyebrow="CURATED PACKS"
            title="Industry-Specific Collections"
            subtitle="Curated suites designed for cross-border freight alliances, urban couriers, and automated ports."
          />

          <div className={styles.collectionsGrid}>
            {collections.map((col) => (
              <div key={col.id} className={styles.collectionCard}>
                <div className={styles.colHeader}>
                  <Badge variant="primary" size="sm">
                    {col.curator}
                  </Badge>
                  <span className={styles.colCount}>{col.featuredTemplateSlugs.length} Templates</span>
                </div>
                <h3 className={styles.colTitle}>{col.title}</h3>
                <p className={styles.colSubtitle}>{col.subtitle}</p>
                <p className={styles.colDesc}>{col.description}</p>
                <div className={styles.colFooter}>
                  <Link href={`/templates?collection=${col.slug}`} className={styles.colLink}>
                    <span>View Collection Templates</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* =========================================================================
       * 7. FINAL CONVERSION SECTION
       * ========================================================================= */}
      <section className={styles.ctaSection}>
        <Container size="md">
          <div className={styles.ctaCard}>
            <span className={styles.ctaEyebrow}>START BUILDING TODAY</span>
            <h2 className={styles.ctaTitle}>Accelerate Your Logistics Digital Presence</h2>
            <p className={styles.ctaSubtitle}>
              Explore all 10 flagship website templates, test interactive device sandboxes, and download production-grade starter code.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/templates">
                <Button variant="primary" size="lg">
                  <Compass size={18} />
                  <span>Browse Templates Catalog</span>
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary" size="lg">
                  <span>Read Platform Architecture</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
