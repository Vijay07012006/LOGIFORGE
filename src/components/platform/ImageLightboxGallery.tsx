'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import styles from './ImageLightboxGallery.module.css';

export interface ImageLightboxGalleryProps {
  templateName: string;
  previewImage: string;
  galleryImages: string[];
}

interface GalleryItem {
  url: string;
  title: string;
  category: string;
}

function resolveImageCategory(url: string, templateName: string): { title: string; category: string } {
  if (url.includes('screen-operations')) {
    return { title: `${templateName} Multimodal Operations Console`, category: 'Operations Matrix' };
  }
  if (url.includes('screen-analytics')) {
    return { title: `${templateName} Throughput & Efficiency Telemetry`, category: 'Live Analytics' };
  }
  if (url.includes('screen-mobile')) {
    return { title: `${templateName} Native Mobile Driver & Shipper Companion`, category: 'Mobile UI' };
  }
  if (url.includes('screen-tracking')) {
    return { title: `${templateName} Simulated Milestone Tracking Engine`, category: 'State Engine' };
  }
  if (url.includes('screen-telematics')) {
    return { title: `${templateName} ECM CAN-Bus Convoy Telematics`, category: 'Telematics' };
  }
  if (url.includes('screen-vessels')) {
    return { title: `${templateName} AIS Maritime Radar & Deepwater Berth Schedule`, category: 'Vessel AIS' };
  }
  if (url.includes('screen-calculator')) {
    return { title: `${templateName} Instant Quote & Dynamic Rate Estimator`, category: 'Rate Engine' };
  }
  if (url.includes('screen-services')) {
    return { title: `${templateName} Comprehensive Trade Corridors Matrix`, category: 'Trade Network' };
  }
  return { title: `${templateName} Architectural Presentation Preview`, category: 'Production Architecture' };
}

export function ImageLightboxGallery({
  templateName,
  previewImage,
  galleryImages,
}: ImageLightboxGalleryProps) {
  // Combine preview image and unique gallery images
  const allImages: GalleryItem[] = React.useMemo(() => {
    const list: string[] = [previewImage];
    for (const img of galleryImages) {
      if (img && !list.includes(img)) {
        list.push(img);
      }
    }
    return list.map((url) => {
      const { title, category } = resolveImageCategory(url, templateName);
      return { url, title, category };
    });
  }, [previewImage, galleryImages, templateName]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  }, []);

  const nextImage = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  // Keyboard navigation & body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeLightbox, nextImage, prevImage]);

  const activeItem = allImages[activeIndex] || allImages[0];

  return (
    <div className={styles.container}>
      {/* Hero Showcase Image */}
      <div className={styles.mediaFrame}>
        <button
          ref={triggerRef}
          type="button"
          className={styles.heroButton}
          onClick={() => openLightbox(0)}
          aria-label={`Open full-resolution lightbox preview for ${templateName}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={allImages[0].url}
            alt={`${templateName} Architecture Preview`}
            width={1600}
            height={900}
            fetchPriority="high"
            decoding="async"
            className={styles.mediaMainImg}
          />
          <div className={styles.heroHoverOverlay}>
            <div className={styles.zoomPill}>
              <Maximize2 size={16} />
              <span>Click to inspect High-DPI ({allImages.length} screens)</span>
            </div>
          </div>
        </button>

        <div className={styles.mediaBadgeOverlay}>
          <Badge variant="primary" size="sm">
            Production Preview
          </Badge>
          <span className={styles.mediaDimBadge}>1600 × 900 High-DPI</span>
        </div>
      </div>

      {/* Gallery Strip with Thumbnails */}
      {allImages.length > 1 && (
        <div className={styles.galleryStrip} role="region" aria-label="Template Screenshot Gallery">
          {allImages.map((item, idx) => (
            <button
              key={item.url}
              type="button"
              className={`${styles.galleryItem} ${idx === activeIndex && isOpen ? styles.galleryItemActive : ''}`}
              onClick={() => openLightbox(idx)}
              aria-label={`View ${item.category}: ${item.title}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.title}
                width={600}
                height={338}
                className={styles.galleryImg}
                loading="lazy"
                decoding="async"
              />
              <div className={styles.galleryMeta}>
                <span className={styles.galleryCategory}>{item.category}</span>
                <span className={styles.galleryZoomIcon}>
                  <Eye size={12} />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Full-Screen Lightbox Modal Dialog */}
      {isOpen && (
        <div
          className={styles.lightboxBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${templateName} Screenshot Lightbox Viewer`}
        >
          <div className={styles.lightboxContent}>
            {/* Header Bar */}
            <div className={styles.lightboxHeader}>
              <div className={styles.lightboxHeaderLeft}>
                <Badge variant="primary" size="sm">
                  {activeItem.category}
                </Badge>
                <div className={styles.lightboxTitleBlock}>
                  <h3 className={styles.lightboxTitle}>{activeItem.title}</h3>
                  <span className={styles.lightboxCounter}>
                    Screen {activeIndex + 1} of {allImages.length}
                  </span>
                </div>
              </div>

              <div className={styles.lightboxHeaderRight}>
                <button
                  ref={closeButtonRef}
                  type="button"
                  className={styles.iconButton}
                  onClick={closeLightbox}
                  aria-label="Close Lightbox (Esc)"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Main Stage Image */}
            <div className={styles.lightboxStage}>
              <button
                type="button"
                className={`${styles.navButton} ${styles.navButtonPrev}`}
                onClick={prevImage}
                aria-label="Previous image (Left Arrow)"
              >
                <ChevronLeft size={28} />
              </button>

              <div className={styles.stageImageWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeItem.url}
                  alt={activeItem.title}
                  className={styles.stageImage}
                  width={1600}
                  height={900}
                />
              </div>

              <button
                type="button"
                className={`${styles.navButton} ${styles.navButtonNext}`}
                onClick={nextImage}
                aria-label="Next image (Right Arrow)"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {/* Bottom Thumbnail Strip */}
            <div className={styles.lightboxThumbBar}>
              {allImages.map((thumb, idx) => (
                <button
                  key={thumb.url}
                  type="button"
                  className={`${styles.lightboxThumb} ${idx === activeIndex ? styles.lightboxThumbActive : ''}`}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Jump to image ${idx + 1}: ${thumb.category}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb.url}
                    alt={thumb.title}
                    width={160}
                    height={90}
                    className={styles.lightboxThumbImg}
                  />
                  <span className={styles.lightboxThumbLabel}>{thumb.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
