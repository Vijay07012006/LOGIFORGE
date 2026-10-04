import React from 'react';
import type { Template, TemplateProductMetadata } from '@/types/template';
import { CopySnippetButton } from './CopySnippetButton';
import { Terminal } from 'lucide-react';
import styles from './DeveloperQuickstart.module.css';

export interface DeveloperQuickstartProps {
  template: Template;
  product: TemplateProductMetadata;
}

export function DeveloperQuickstart({ template, product }: DeveloperQuickstartProps) {
  const packageDir = `${template.slug}-starter`;
  const zipFile = product.packageUrl.split('/').pop() || `${template.slug}-v1.0.0.zip`;

  const terminalCommands = `# 1. Extract the downloaded starter package
unzip ${zipFile} -d ${packageDir}
cd ${packageDir}

# 2. Install dependencies (Node.js ${product.requirements.node})
npm install

# 3. Start local development server
npm run dev

# 4. Create production build
npm run build`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrapper}>
            <Terminal size={18} />
          </div>
          <div>
            <h2 className={styles.title}>Developer Quickstart</h2>
            <p className={styles.subtitle}>
              Zero-to-development workflow for the standalone {template.name} starter package.
            </p>
          </div>
        </div>

        <div className={styles.headerRight}>
          <CopySnippetButton
            text={terminalCommands}
            label="Copy Terminal Commands"
            copiedLabel="Commands Copied!"
            variant="button"
            ariaLabel={`Copy quickstart shell commands for ${template.name}`}
          />
        </div>
      </div>

      <div className={styles.terminalWindow}>
        <div className={styles.terminalBar}>
          <div className={styles.terminalDots}>
            <span className={`${styles.dot} ${styles.dotRed}`} />
            <span className={`${styles.dot} ${styles.dotYellow}`} />
            <span className={`${styles.dot} ${styles.dotGreen}`} />
          </div>
          <span className={styles.terminalTitle}>bash — 80×24</span>
        </div>

        <pre className={styles.codeBlock}>
          <code>
            <span className={styles.comment}># 1. Extract the downloaded starter package</span>{'\n'}
            <span className={styles.command}>unzip</span> {zipFile} <span className={styles.flag}>-d</span> {packageDir}{'\n'}
            <span className={styles.command}>cd</span> {packageDir}{'\n\n'}
            <span className={styles.comment}># 2. Install dependencies (Requires Node.js {product.requirements.node})</span>{'\n'}
            <span className={styles.command}>npm</span> install{'\n\n'}
            <span className={styles.comment}># 3. Start local development server on port 3000</span>{'\n'}
            <span className={styles.command}>npm</span> run dev{'\n\n'}
            <span className={styles.comment}># 4. Create optimized standalone production build</span>{'\n'}
            <span className={styles.command}>npm</span> run build
          </code>
        </pre>
      </div>

      <div className={styles.stepsGrid}>
        <div className={styles.stepCard}>
          <div className={styles.stepNum}>01</div>
          <h3 className={styles.stepTitle}>Node.js Engine</h3>
          <p className={styles.stepDesc}>Requires Node.js {product.requirements.node} and npm {product.requirements.npm}. Strictly pre-configured for modern ESM.</p>
        </div>
        <div className={styles.stepCard}>
          <div className={styles.stepNum}>02</div>
          <h3 className={styles.stepTitle}>Isolated Assets</h3>
          <p className={styles.stepDesc}>All mock imagery, SVGs, and fonts reside in public/ and local CSS tokens with zero external asset dependencies.</p>
        </div>
        <div className={styles.stepCard}>
          <div className={styles.stepNum}>03</div>
          <h3 className={styles.stepTitle}>Next.js App Router</h3>
          <p className={styles.stepDesc}>Pure React 19 / Next.js 15 architecture. Pre-configured with Tailwind CSS, TypeScript strict, and ESLint.</p>
        </div>
      </div>
    </div>
  );
}
