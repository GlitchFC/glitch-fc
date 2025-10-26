# Glitch FC - FC Mobile YouTube Channel Website

A modern, responsive website for the Glitch FC YouTube channel featuring pack opening videos, tips & guides, and redeem codes for FC Mobile.

## Features

- **Pack Opening Videos**: Showcase your latest pack opening content from your YouTube channel
- **Tips & Guides**: Organized sections for gems, coins, tokens, shards, and event guides
- **Redeem Codes**: Easy copy-paste functionality for FC Mobile redeem codes
- **About & Feedback**: Information about the channel and ways for viewers to provide feedback
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Project Structure

```
glitch-fc-website/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Stylesheet with FC Mobile gaming theme
├── js/
│   └── script.js      # JavaScript for interactivity
├── images/            # Directory for images and thumbnails
└── README.md          # This file
```

## Getting Started

1. Open `index.html` in any modern web browser
2. The website is ready to use with placeholder content
3. To add your YouTube videos, update the placeholder content in the HTML
4. To add new redeem codes, use the `addRedeemCode()` function in JavaScript

## Customization

### Adding YouTube Videos
Replace the placeholder video content in `index.html` with your actual YouTube video embeds or links.

### Adding New Redeem Codes
Use the JavaScript function to add new codes:
```javascript
addRedeemCode('YOUR_CODE_HERE', 'Description of what this code gives');
```

### Updating Branding
- Channel name: Update in the HTML `<title>` and navigation brand
- Colors: Modify the CSS color variables to match your brand
- YouTube channel link: Update the href in the "Visit YouTube Channel" button

## Technical Details

- **HTML5**: Semantic markup with proper SEO structure
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **Vanilla JavaScript**: No external dependencies, fast loading
- **Mobile-First**: Responsive design that works on all devices

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- YouTube API integration for automatic video loading
- Admin panel for managing redeem codes
- User authentication for exclusive content
- Comments system integration
- Social media integration

## Contact

For questions about this website, visit the Glitch FC YouTube channel or use the feedback section on the site.

---

**Note**: This website is not affiliated with EA Sports or FC Mobile. It's a fan-created site for the Glitch FC YouTube channel.
