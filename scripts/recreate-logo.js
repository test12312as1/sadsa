const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../public/twitter-assets');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Colors
const darkBg = '#0f1014'; // Dark charcoal background
const gold = '#d4af37'; // Metallic gold
const goldLight = '#f4d03f'; // Lighter gold for highlights
const goldDark = '#b8941f'; // Darker gold for shadows
const black = '#000000'; // For pupil

function createGradient(ctx, x, y, radius) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, goldLight);
  gradient.addColorStop(0.5, gold);
  gradient.addColorStop(1, goldDark);
  return gradient;
}

function drawEyeIcon(ctx, centerX, centerY, size) {
  const iconSize = size * 0.6; // Size of the main circular icon
  const eyeSize = iconSize * 0.3; // Size of the eye
  const circleSize = eyeSize * 0.4; // Size of the central circle (pupil)
  
  // Draw 8 petal-like segments (outer gear/flower shape)
  ctx.save();
  ctx.translate(centerX, centerY);
  
  const numSegments = 8;
  const segmentAngle = (Math.PI * 2) / numSegments;
  const outerRadius = iconSize / 2;
  const innerRadius = outerRadius * 0.7;
  
  for (let i = 0; i < numSegments; i++) {
    ctx.save();
    ctx.rotate(i * segmentAngle);
    
    const gradient = createGradient(ctx, 0, 0, outerRadius);
    ctx.fillStyle = gradient;
    
    ctx.beginPath();
    ctx.moveTo(0, -innerRadius);
    ctx.lineTo(outerRadius * 0.3, -outerRadius * 0.2);
    ctx.arc(0, 0, outerRadius, -segmentAngle / 2, segmentAngle / 2);
    ctx.lineTo(outerRadius * 0.3, outerRadius * 0.2);
    ctx.closePath();
    ctx.fill();
    
    // Add subtle shadow/depth
    ctx.strokeStyle = goldDark;
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.restore();
  }
  
  // Draw the eye shape (almond/oval)
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.ellipse(0, 0, eyeSize * 0.6, eyeSize * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw iris (slightly darker gold)
  ctx.fillStyle = goldDark;
  ctx.beginPath();
  ctx.ellipse(0, 0, eyeSize * 0.5, eyeSize * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw the central circle (pupil) - this is the "circle eye"
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.arc(0, 0, circleSize, 0, Math.PI * 2);
  ctx.fill();
  
  // Add highlight to circle
  ctx.fillStyle = goldLight;
  ctx.beginPath();
  ctx.arc(-circleSize * 0.3, -circleSize * 0.3, circleSize * 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw the upward triangle/arrowhead above
  const triangleSize = iconSize * 0.15;
  ctx.fillStyle = goldLight;
  ctx.beginPath();
  ctx.moveTo(0, -outerRadius - triangleSize);
  ctx.lineTo(-triangleSize, -outerRadius);
  ctx.lineTo(triangleSize, -outerRadius);
  ctx.closePath();
  ctx.fill();
  
  // Add glow effect to triangle
  ctx.shadowColor = goldLight;
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;
  
  ctx.restore();
}

function createTwitterProfile() {
  const size = 400;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Dark background
  ctx.fillStyle = darkBg;
  ctx.fillRect(0, 0, size, size);
  
  // Draw just the circle eye (central golden circle) - solid golden circle
  const circleSize = size * 0.35;
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Create metallic gold gradient for the circle
  const gradient = ctx.createRadialGradient(
    centerX - circleSize * 0.3, 
    centerY - circleSize * 0.3, 
    0,
    centerX, 
    centerY, 
    circleSize
  );
  gradient.addColorStop(0, '#f4d03f'); // Light gold highlight
  gradient.addColorStop(0.4, '#d4af37'); // Main gold
  gradient.addColorStop(1, '#b8941f'); // Dark gold shadow
  
  ctx.fillStyle = gradient;
  
  // Draw the main circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleSize, 0, Math.PI * 2);
  ctx.fill();
  
  // Add subtle inner highlight for 3D effect
  ctx.fillStyle = 'rgba(244, 208, 63, 0.4)';
  ctx.beginPath();
  ctx.arc(centerX - circleSize * 0.25, centerY - circleSize * 0.25, circleSize * 0.4, 0, Math.PI * 2);
  ctx.fill();
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'twitter-profile.png'), buffer);
  console.log('✅ Created Twitter profile picture (400x400px) - Circle eye');
}

function createTwitterBanner() {
  const width = 1500;
  const height = 500;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Dark background
  ctx.fillStyle = darkBg;
  ctx.fillRect(0, 0, width, height);
  
  const centerX = width / 2;
  const centerY = height / 2;
  const iconSize = height * 0.65;
  
  // Draw the full eye icon (replaces the "O" in LOCK)
  drawEyeIcon(ctx, centerX, centerY, iconSize);
  
  // Draw "L" + "CK" text on the left (icon replaces the "O")
  ctx.fillStyle = gold;
  ctx.font = 'bold 90px "Arial Black", Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  
  // Measure text to position correctly
  const lockText = 'L';
  const ckText = 'CK';
  const lockWidth = ctx.measureText(lockText).width;
  const ckWidth = ctx.measureText(ckText).width;
  
  // Draw "L"
  ctx.fillText(lockText, centerX - iconSize * 0.55, centerY);
  
  // Draw "CK" on the right side of icon
  ctx.textAlign = 'left';
  ctx.fillText(ckText, centerX + iconSize * 0.55, centerY);
  
  // Draw "ARENA" text on the right
  ctx.fillText('ARENA', centerX + iconSize * 0.55 + ckWidth + 20, centerY);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'twitter-banner.png'), buffer);
  console.log('✅ Created Twitter banner (1500x500px) - Full logo');
}

// Create both assets
createTwitterProfile();
createTwitterBanner();

console.log('\n📁 Files saved to:', outputDir);
console.log('   - twitter-profile.png (400x400px)');
console.log('   - twitter-banner.png (1500x500px)');
