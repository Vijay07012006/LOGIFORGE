'use client';

import React, { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { X, CheckCircle2, BookOpen } from 'lucide-react';
import styles from './GuideModal.module.css';

export interface Guide {
  id: string;
  title: string;
  category: string;
  description: string;
  readTime: string;
  sections: {
    heading: string;
    content: string;
    bulletPoints?: string[];
  }[];
}

interface GuideModalProps {
  guide: Guide | null;
  onClose: () => void;
}

export function GuideModal({ guide, onClose }: GuideModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!guide) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [guide, onClose]);

  if (!guide) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div ref={modalRef} className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.headerMeta}>
            <Badge variant="accent" size="sm">
              {guide.category}
            </Badge>
            <span className={styles.readTime}>{guide.readTime}</span>
          </div>

          <h2 id="modal-title" className={styles.title}>
            {guide.title}
          </h2>
          <p className={styles.desc}>{guide.description}</p>

          <button ref={closeBtnRef} onClick={onClose} className={styles.closeBtn} aria-label="Close guide modal">
            <X size={18} />
          </button>
        </header>

        <div className={styles.content}>
          {guide.sections.map((sec, idx) => (
            <section key={idx} className={styles.section}>
              <h3 className={styles.sectionHeading}>{sec.heading}</h3>
              <p className={styles.sectionContent}>{sec.content}</p>

              {sec.bulletPoints && (
                <ul className={styles.bulletList}>
                  {sec.bulletPoints.map((pt, pIdx) => (
                    <li key={pIdx} className={styles.bulletItem}>
                      <CheckCircle2 size={15} className={styles.bulletIcon} />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <BookOpen size={16} className={styles.bookIcon} />
            <span>LOGIFORGE Technical Documentation • Local-First Architecture</span>
          </div>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done Reading
          </Button>
        </footer>
      </div>
    </div>
  );
}
