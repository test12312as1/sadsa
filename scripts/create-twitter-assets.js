const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputFile = '/Users/robertgoroan/Downloads/1фывфыв.png';
const outputDir = path.join(__dirname, '../public/twitter-assets');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function createTwitterAssets() {
  try {
    // Get original image metadata
    const metadata = await sharp(inputFile).metadata();
    console.log('Original image dimensions:', metadata.width, 'x', metadata.height);

    // 1. Create Twitter Profile Picture (400x400px) - Extract just the circle eye (pupil)
    // The circle eye is at the very center of the logo
    const profileSize = 400;
    
    // Calculate center crop region - extract just the central circle
    const centerX = Math.floor(metadata.width / 2);
    const centerY = Math.floor(metadata.height / 2);
    
    // Crop a smaller square region from center - just enough to capture the circle eye
    // The circle is roughly 15-20% of the image height based on typical logo proportions
    const cropSize = Math.floor(metadata.height * 0.25); // Crop ~25% of height to get just the circle
    
    const left = Math.max(0, centerX - Math.floor(cropSize / 2));
    const top = Math.max(0, centerY - Math.floor(cropSize / 2));
    
    console.log(`Extracting circle eye from center: ${cropSize}x${cropSize} at position (${left}, ${top})`);
    
    await sharp(inputFile)
      .extract({
        left: left,
        top: top,
        width: cropSize,
        height: cropSize
      })
      .resize(profileSize, profileSize, {
        fit: 'contain',
        background: { r: 15, g: 16, b: 20 } // Dark charcoal background matching the original
      })
      .toFile(path.join(outputDir, 'twitter-profile.png'));
    
    console.log('✅ Created Twitter profile picture (400x400px) - Eye icon only');

    // 2. Create Twitter Banner (1500x500px)
    // Maintain horizontal layout, fit to banner dimensions
    const bannerWidth = 1500;
    const bannerHeight = 500;
    
    await sharp(inputFile)
      .resize(bannerWidth, bannerHeight, {
        fit: 'contain',
        background: { r: 15, g: 16, b: 20 } // Dark charcoal background
      })
      .toFile(path.join(outputDir, 'twitter-banner.png'));
    
    console.log('✅ Created Twitter banner (1500x500px)');

    console.log('\n📁 Files saved to:', outputDir);
    console.log('   - twitter-profile.png (400x400px)');
    console.log('   - twitter-banner.png (1500x500px)');

  } catch (error) {
    console.error('Error processing images:', error);
    process.exit(1);
  }
}

createTwitterAssets();
