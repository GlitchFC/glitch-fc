# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a static website for the "Glitch FC" YouTube channel focused on FC Mobile gaming content. It's a vanilla HTML/CSS/JavaScript website with no build system or external dependencies.

## Common Development Commands

### Running the Website
```powershell
# Open the website in your default browser (Windows)
Start-Process index.html

# Or serve with Python (if available)
python -m http.server 8000

# Or serve with Node.js (if live-server is installed)
npx live-server
```

### File Structure Validation
```powershell
# Check all files are present
Get-ChildItem -Recurse -Include "*.html", "*.js", "*.css" | Select-Object Name, DirectoryName

# Check file sizes for unexpected changes
Get-ChildItem -Recurse -Include "*.html", "*.js", "*.css" | Select-Object Name, Length
```

## Architecture and Code Structure

### Project Layout
- **`index.html`**: Single-page application with all content sections
- **`css/style.css`**: Comprehensive styling with FC Mobile gaming theme
- **`js/script.js`**: Vanilla JavaScript for interactivity and functionality
- **`images/`**: Directory for thumbnails and assets
- **`README.md`**: Project documentation

### Key Architectural Patterns

#### Single-Page Application Structure
The website uses a single HTML file with multiple sections:
- `#home` - Hero section with channel introduction
- `#pack-opening` - Pack opening video showcase
- `#tips` - Categorized tip videos (gems, coins, tokens, events)
- `#redeem-codes` - Copy-paste redeem codes functionality
- `#about` - Channel information
- `#feedback` - Contact options

#### JavaScript Module Pattern
The JavaScript is organized into functional modules:

**Navigation System:**
- Mobile hamburger menu toggle
- Smooth scrolling between sections
- Active section highlighting on scroll

**Copy Functionality:**
- `copyCode(code)` - Main copy function with fallback support
- `fallbackCopyTextToClipboard(text)` - Browser compatibility fallback
- `showCopySuccess(code)` - User feedback with animated notifications

**Content Management:**
- `addRedeemCode(code, description)` - Dynamic code addition
- `loadPackOpeningVideos()` - Placeholder for YouTube integration
- `loadTipVideos(category)` - Category-specific video loading

**Animation System:**
- Intersection Observer for section animations
- CSS transforms and opacity transitions

#### CSS Architecture
- **Reset and base styles** - Consistent cross-browser styling
- **Component-based styling** - Reusable classes for video grids, buttons, sections
- **Responsive design** - Mobile-first approach with breakpoints
- **Theme consistency** - FC Mobile gaming color palette throughout

### Content Integration Points

#### YouTube Video Integration
The codebase includes placeholder functions ready for YouTube API integration:
- Video grid containers in HTML (`#pack-videos`, `#gems-videos`, etc.)
- JavaScript loading functions for each content category
- Thumbnail placeholder structure with play buttons

#### Redeem Code System
- Static codes in HTML with copy functionality
- Dynamic addition via `addRedeemCode()` function
- Integration with EA's redeem portal (redeem.fcm.ea.com)

### Responsive Design Strategy
- Mobile-first CSS approach
- Hamburger navigation for small screens
- Grid layouts that adapt to screen size
- Touch-friendly button sizes and interactions

### Performance Considerations
- No external dependencies or frameworks
- Optimized for fast loading
- Minimal JavaScript for core functionality
- CSS animations using transforms for smooth performance

## Important Implementation Notes

### Copy-to-Clipboard Functionality
The website implements robust clipboard functionality with fallbacks:
- Modern `navigator.clipboard.writeText()` for newer browsers
- `document.execCommand('copy')` fallback for older browsers
- Visual feedback with animated success messages

### Navigation Behavior
- Fixed navbar with scroll-based active section highlighting
- Smooth scrolling with offset compensation for fixed header (70px offset)
- Mobile menu automatically closes when navigation links are clicked

### Content Categories
The tips section is organized into four main categories:
1. **Gems** - Premium currency guides
2. **Coins** - In-game currency farming
3. **Tokens & Shards** - Special resources strategies
4. **Event Guides** - Time-limited event walkthroughs

### External Links and Integration
- YouTube channel: `https://www.youtube.com/@GlitchFCGamer`
- Redeem portal: `https://redeem.fcm.ea.com`
- Contact email: `contact@glitchfc.com`

When making changes to this website, maintain the gaming theme consistency, ensure mobile responsiveness, and test copy functionality across different browsers.
