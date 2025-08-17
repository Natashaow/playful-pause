# Audio Files for Logo Easter Egg

This directory contains audio files for the Playful Pause logo easter egg feature.

## Required Files

To make the music easter egg work, add these audio files:

- `calm-background.mp3` - Main audio file (MP3 format)
- `calm-background.ogg` - Alternative audio file (OGG format for better browser compatibility)

## Audio Recommendations

For the best user experience, use:
- **Duration**: 2-5 minutes (will loop seamlessly)
- **Format**: MP3 (primary) and OGG (fallback)
- **Quality**: 128-192 kbps for good balance of quality and file size
- **Style**: Calming, ambient, or gentle instrumental music
- **Volume**: Normalized audio (not too loud, as the app sets volume to 30%)

## Where to Find Audio

### Free Music Sources:
- [Free Music Archive](https://freemusicarchive.org/)
- [Incompetech](https://incompetech.com/) (Kevin MacLeod's royalty-free music)
- [Bensound](https://www.bensound.com/)
- [Pixabay Music](https://pixabay.com/music/)

### Creative Commons Licensed:
- [ccMixter](http://ccmixter.org/)
- [Jamendo](https://www.jamendo.com/)

## File Naming

Keep the exact filenames:
- `calm-background.mp3`
- `calm-background.ogg`

## Testing

After adding the audio files:
1. Restart your development server
2. Click the logo (play button) in the top-left corner
3. Music should start playing and loop
4. Click again to stop

## Troubleshooting

If music doesn't play:
- Check browser console for errors
- Ensure audio files are in the correct location
- Verify file formats are supported
- Check browser autoplay policies
- Make sure audio files aren't corrupted

## Note

The audio files are not included in the git repository to avoid copyright issues. Each developer needs to add their own audio files.
