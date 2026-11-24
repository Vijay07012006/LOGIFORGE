'use client';

import React, { useState, useId } from 'react';
import { Calculator, ArrowRight, DollarSign, Clock, Rocket, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import styles from './RoiCalculator.module.css';

export function RoiCalculator() {
  const [projectsCount, setProjectsCount] = useState<number>(4);
  const [teamSize, setTeamSize] = useState<number>(3);
  const [hourlyRate, setHourlyRate] = useState<number>(95);

  const projectsId = useId();
  const teamSizeId = useId();
  const hourlyRateId = useId();

  // Metrics calculation
  const HOURS_SAVED_PER_PROJECT = 180;
  const totalHoursSaved = projectsCount * HOURS_SAVED_PER_PROJECT;
  const totalDollarsSaved = totalHoursSaved * hourlyRate;
  const daysToMarketReductionPercent = 88; // e.g. 10 weeks down to ~1.2 weeks

  return (
    <div className={styles.calculatorCard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerBadgeRow}>
          <div className={styles.badgeWrapper}>
            <Calculator size={16} />
            <span>Interactive ROI &amp; Velocity Estimator</span>
          </div>
          <Badge variant="accent" size="sm">
            Commercial Yield Calculator
          </Badge>
        </div>
        <h3 className={styles.title}>Estimate Your Agency &amp; Team Development Savings</h3>
        <p className={styles.subtitle}>
          Custom logistics web architectures traditionally consume 140–220 hours of design token definition, stateful milestone tracking, and responsive QA. See how much LogiForge saves your team.
        </p>
      </div>

      <div className={styles.mainLayout}>
        {/* Sliders Input Column */}
        <div className={styles.inputsCol}>
          {/* Slider 1: Projects Per Year */}
          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <label htmlFor={projectsId} className={styles.sliderLabel}>
                Client Builds / Projects per Year
              </label>
              <span className={styles.sliderValueBadge}>{projectsCount} {projectsCount === 1 ? 'Project' : 'Projects'}</span>
            </div>
            <input
              id={projectsId}
              type="range"
              min="1"
              max="20"
              step="1"
              value={projectsCount}
              onChange={(e) => setProjectsCount(Number(e.target.value))}
              className={styles.rangeInput}
              aria-label="Client builds or projects per year"
            />
            <div className={styles.sliderTicks}>
              <span>1 build</span>
              <span>10 builds</span>
              <span>20 builds</span>
            </div>
          </div>

          {/* Slider 2: Team Size */}
          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <label htmlFor={teamSizeId} className={styles.sliderLabel}>
                Frontend / Fullstack Team Size
              </label>
              <span className={styles.sliderValueBadge}>{teamSize} {teamSize === 1 ? 'Engineer' : 'Engineers'}</span>
            </div>
            <input
              id={teamSizeId}
              type="range"
              min="1"
              max="12"
              step="1"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className={styles.rangeInput}
              aria-label="Frontend or Fullstack engineering team size"
            />
            <div className={styles.sliderTicks}>
              <span>1 dev</span>
              <span>6 devs</span>
              <span>12 devs</span>
            </div>
          </div>

          {/* Slider 3: Hourly Rate */}
          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <label htmlFor={hourlyRateId} className={styles.sliderLabel}>
                Loaded Engineering Hourly Rate (USD)
              </label>
              <span className={styles.sliderValueBadge}>${hourlyRate} / hr</span>
            </div>
            <input
              id={hourlyRateId}
              type="range"
              min="45"
              max="220"
              step="5"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className={styles.rangeInput}
              aria-label="Loaded engineering rate in dollars per hour"
            />
            <div className={styles.sliderTicks}>
              <span>$45/hr</span>
              <span>$130/hr</span>
              <span>$220/hr</span>
            </div>
          </div>

          {/* Work Breakdown Micro-cards */}
          <div className={styles.breakdownGrid}>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownHours}>~45 hrs</span>
              <span className={styles.breakdownTitle}>Editorial &amp; Luxury Logistics Typography</span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownHours}>~65 hrs</span>
              <span className={styles.breakdownTitle}>Stateful Waybill &amp; Telematics Engines</span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownHours}>~40 hrs</span>
              <span className={styles.breakdownTitle}>Multi-Device Viewport QA &amp; Isolation</span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownHours}>~30 hrs</span>
              <span className={styles.breakdownTitle}>Strict TypeScript &amp; Token Architecture</span>
            </div>
          </div>
        </div>

        {/* Results Output Column */}
        <div className={styles.resultsCol}>
          <div className={styles.resultsCard}>
            <div className={styles.resultsHeader}>
              <span className={styles.resultsEyebrow}>ESTIMATED ANNUAL VALUE RECLAIMED</span>
              <div className={styles.headlineSavings}>
                <DollarSign size={36} className={styles.dollarIcon} />
                <span>{totalDollarsSaved.toLocaleString()}</span>
              </div>
              <span className={styles.savingsSubtext}>in direct developer capacity saved</span>
            </div>

            <div className={styles.metricsSummaryGrid}>
              <div className={styles.summaryItem}>
                <div className={styles.summaryIcon}>
                  <Clock size={18} />
                </div>
                <div>
                  <div className={styles.summaryValue}>{totalHoursSaved.toLocaleString()} hrs</div>
                  <div className={styles.summaryLabel}>Engineering Time Saved</div>
                </div>
              </div>

              <div className={styles.summaryItem}>
                <div className={styles.summaryIcon}>
                  <Rocket size={18} />
                </div>
                <div>
                  <div className={styles.summaryValue}>{daysToMarketReductionPercent}% Faster</div>
                  <div className={styles.summaryLabel}>Time-to-Market Velocity</div>
                </div>
              </div>
            </div>

            <div className={styles.comparisonCallout}>
              <Sparkles size={16} className={styles.sparkleIcon} />
              <p className={styles.calloutText}>
                Ship client-ready logistics portals in <strong>1 to 2 weeks</strong> instead of 8 to 12 weeks of ground-up development.
              </p>
            </div>

            <div className={styles.resultsCtaRow}>
              <Button href="/templates" variant="primary" size="lg" className={styles.calcCta}>
                <span>Explore All 10 Starter Kits</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
