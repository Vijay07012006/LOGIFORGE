const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const BRAIN_DIR = 'C:\\Users\\lenovo\\.gemini\\antigravity-ide\\brain\\1668dba3-d0e4-47ae-be52-a60236e361ae';
const PUBLIC_DIR = path.resolve(__dirname, '../public');

const TEMPLATE_MAP = [
  {
    slug: 'cargo-nova',
    folder: 'cargonova',
    prefix: 'cargonova',
    filePattern: 'cargonova_hero',
    secondaryPattern: 'cargonova_terminal'
  },
  {
    slug: 'fleet-one',
    folder: 'fleetone',
    prefix: 'fleetone',
    filePattern: 'fleetone_hero'
  },
  {
    slug: 'ship-flow',
    folder: 'shipflow',
    prefix: 'shipflow',
    filePattern: 'shipflow_hero'
  },
  {
    slug: 'swift-drop',
    folder: 'swiftdrop',
    prefix: 'swiftdrop',
    filePattern: 'swiftdrop_hero'
  },
  {
    slug: 'aero-cargo',
    folder: 'aerocargo',
    prefix: 'aerocargo',
    filePattern: 'aerocargo_hero'
  },
  {
    slug: 'port-axis',
    folder: 'portaxis',
    prefix: 'portaxis',
    filePattern: 'portaxis_hero'
  },
  {
    slug: 'warehouse-x',
    folder: 'warehousex',
    prefix: 'warehousex',
    filePattern: 'warehousex_hero'
  },
  {
    slug: 'supply-core',
    folder: 'supplycore',
    prefix: 'supplycore',
    filePattern: 'supplycore_hero'
  },
  {
    slug: 'route-iq',
    folder: 'routeiq',
    prefix: 'routeiq',
    filePattern: 'routeiq_hero'
  },
  {
    slug: 'move-sphere',
    folder: 'movesphere',
    prefix: 'movesphere',
    filePattern: 'movesphere_hero'
  }
];

function findBrainFile(pattern) {
  const files = fs.readdirSync(BRAIN_DIR);
  const matched = files.find(f => f.startsWith(pattern) && f.endsWith('.jpg'));
  if (!matched) {
    throw new Error(`Could not find brain image matching pattern: ${pattern}`);
  }
  return path.join(BRAIN_DIR, matched);
}

async function run() {
  console.log('Starting Media Processing Pipeline...');

  // Ensure directories exist
  const dirs = [
    'images/platform',
    'images/collections',
    'images/showcase',
    ...TEMPLATE_MAP.map(t => `images/${t.folder}`),
    ...TEMPLATE_MAP.map(t => `images/templates/${t.slug}`)
  ];

  for (const dir of dirs) {
    const fullPath = path.join(PUBLIC_DIR, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  }

  // 1. Process Platform Hero
  console.log('Processing Platform Hero...');
  const platformSrc = findBrainFile('platform_hero');
  await sharp(platformSrc)
    .resize(1920, 1080, { fit: 'cover' })
    .webp({ quality: 84 })
    .toFile(path.join(PUBLIC_DIR, 'images/platform/hero-ambient-logistics.webp'));

  await sharp(platformSrc)
    .resize(1200, 675, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(path.join(PUBLIC_DIR, 'images/platform/enterprise-corridors.webp'));

  // 2. Process Each Template Hero, Preview, and Thumbnail
  for (const t of TEMPLATE_MAP) {
    console.log(`Processing template ${t.slug} (${t.folder})...`);
    const src = findBrainFile(t.filePattern);

    // Full hero (1600x900)
    const heroDest = path.join(PUBLIC_DIR, `images/${t.folder}/${t.prefix}-hero.webp`);
    await sharp(src)
      .resize(1600, 900, { fit: 'cover' })
      .webp({ quality: 84 })
      .toFile(heroDest);

    // Preview (1200x675)
    const prevDest = path.join(PUBLIC_DIR, `images/${t.folder}/${t.prefix}-preview.webp`);
    await sharp(src)
      .resize(1200, 675, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(prevDest);

    // Thumbnail (600x338)
    const thumbDest = path.join(PUBLIC_DIR, `images/${t.folder}/${t.prefix}-thumb.webp`);
    await sharp(src)
      .resize(600, 338, { fit: 'cover' })
      .webp({ quality: 78 })
      .toFile(thumbDest);

    // Populate templates/<slug> for manifests.ts backward compatibility
    const tmplDir = path.join(PUBLIC_DIR, `images/templates/${t.slug}`);
    await sharp(src)
      .resize(1200, 675, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(path.join(tmplDir, 'preview.webp'));

    await sharp(src)
      .resize(600, 338, { fit: 'cover' })
      .webp({ quality: 78 })
      .toFile(path.join(tmplDir, 'thumbnail.webp'));

    // If secondary image exists (e.g. cargonova terminal)
    if (t.secondaryPattern) {
      const secSrc = findBrainFile(t.secondaryPattern);
      await sharp(secSrc)
        .resize(1600, 900, { fit: 'cover' })
        .webp({ quality: 84 })
        .toFile(path.join(PUBLIC_DIR, `images/${t.folder}/${t.prefix}-port-terminal.webp`));

      await sharp(secSrc)
        .resize(1200, 675, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(path.join(tmplDir, 'screen-services.webp'));
    }

    // Ensure mock sub-screens referenced in manifests also exist
    await sharp(src)
      .resize(1200, 675, { fit: 'cover' })
      .webp({ quality: 75 })
      .toFile(path.join(tmplDir, 'screen-tracking.webp'));
    await sharp(src)
      .resize(1200, 675, { fit: 'cover' })
      .webp({ quality: 75 })
      .toFile(path.join(tmplDir, 'screen-telematics.webp'));
    await sharp(src)
      .resize(1200, 675, { fit: 'cover' })
      .webp({ quality: 75 })
      .toFile(path.join(tmplDir, 'screen-vessels.webp'));
    await sharp(src)
      .resize(1200, 675, { fit: 'cover' })
      .webp({ quality: 75 })
      .toFile(path.join(tmplDir, 'screen-calculator.webp'));
  }

  // 3. Process Collections
  console.log('Processing Collections...');
  const cargoSrc = findBrainFile('cargonova_hero');
  const swiftSrc = findBrainFile('swiftdrop_hero');
  const moveSrc = findBrainFile('movesphere_hero');
  const portSrc = findBrainFile('portaxis_hero');

  await sharp(cargoSrc).resize(800, 450, { fit: 'cover' }).webp({ quality: 80 })
    .toFile(path.join(PUBLIC_DIR, 'images/collections/enterprise-freight.webp'));
  await sharp(swiftSrc).resize(800, 450, { fit: 'cover' }).webp({ quality: 80 })
    .toFile(path.join(PUBLIC_DIR, 'images/collections/urban-delivery.webp'));
  await sharp(moveSrc).resize(800, 450, { fit: 'cover' }).webp({ quality: 80 })
    .toFile(path.join(PUBLIC_DIR, 'images/collections/smart-logistics.webp'));
  await sharp(portSrc).resize(800, 450, { fit: 'cover' }).webp({ quality: 80 })
    .toFile(path.join(PUBLIC_DIR, 'images/collections/ocean-ports.webp'));

  // 4. Optimize demo_preview.webp into platform directory
  const demoPreviewPath = path.join(PUBLIC_DIR, 'media/demo_preview.webp');
  const demoPreviewDest = path.join(PUBLIC_DIR, 'images/platform/demo-studio-preview.webp');
  if (fs.existsSync(demoPreviewPath)) {
    console.log('Optimizing demo_preview.webp -> images/platform/demo-studio-preview.webp...');
    const demoStat = fs.statSync(demoPreviewPath);
    console.log(`Original demo_preview.webp size: ${(demoStat.size / 1024 / 1024).toFixed(2)} MB`);

    await sharp(demoPreviewPath)
      .resize(1280, 720, { fit: 'cover' })
      .webp({ quality: 78, effort: 6 })
      .toFile(demoPreviewDest);
    
    const newStat = fs.statSync(demoPreviewDest);
    console.log(`Optimized demo-studio-preview.webp size: ${(newStat.size / 1024).toFixed(2)} KB (Reduced by ${((1 - newStat.size / demoStat.size) * 100).toFixed(1)}%)`);
  }

  // 5. Optimize showcase images into WebP
  console.log('Optimizing showcase images to WebP...');
  const showcaseDir = path.join(PUBLIC_DIR, 'images/showcase');
  const showcaseFiles = fs.readdirSync(showcaseDir).filter(f => f.endsWith('.jpg'));
  for (const f of showcaseFiles) {
    const src = path.join(showcaseDir, f);
    const dest = path.join(showcaseDir, f.replace('.jpg', '.webp'));
    await sharp(src)
      .resize(1200, 675, { fit: 'cover' })
      .webp({ quality: 82 })
      .toFile(dest);
    console.log(`Converted showcase: ${f} -> ${path.basename(dest)}`);
  }

  console.log('Media Pipeline Complete!');
}

run().catch(err => {
  console.error('Pipeline error:', err);
  process.exit(1);
});
