#!/usr/bin/env node

/**
 * Audio Setup Helper Script
 * 
 * This script helps you set up audio files for the Playful Pause logo easter egg.
 * Run this script to get guidance on adding audio files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('🎵 Playful Pause Audio Setup Helper\n');

// Check if audio directory exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const audioDir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(audioDir)) {
  console.log('❌ Audio directory not found. Creating...');
  fs.mkdirSync(audioDir, { recursive: true });
  console.log('✅ Audio directory created at:', audioDir);
}

console.log('\n📁 Audio directory location:', audioDir);
console.log('\n📋 Required audio files:');
console.log('   - calm-background.mp3 (MP3 format)');
console.log('   - calm-background.ogg (OGG format)');

console.log('\n🎼 Where to find free music:');
console.log('   1. Free Music Archive: https://freemusicarchive.org/');
console.log('   2. Incompetech: https://incompetech.com/');
console.log('   3. Bensound: https://www.bensound.com/');
console.log('   4. Pixabay Music: https://pixabay.com/music/');

console.log('\n📝 Steps to add audio:');
console.log('   1. Download a calming, ambient track (2-5 minutes)');
console.log('   2. Convert to both MP3 and OGG formats');
console.log('   3. Rename to "calm-background.mp3" and "calm-background.ogg"');
console.log('   4. Place both files in the audio directory above');
console.log('   5. Restart your development server');
console.log('   6. Click the logo to test the easter egg!');

console.log('\n🔧 Audio conversion tools:');
console.log('   - Online: https://convertio.co/audio-converter/');
console.log('   - Desktop: Audacity (free), FFmpeg (command line)');
console.log('   - Mobile: Audio Converter apps');

console.log('\n⚠️  Important notes:');
console.log('   - Use royalty-free or Creative Commons licensed music');
console.log('   - Keep file sizes reasonable (under 10MB each)');
console.log('   - Test that files loop seamlessly');
console.log('   - Audio files are not committed to git (copyright protection)');

console.log('\n✨ Happy listening!');
