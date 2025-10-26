// server.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors'); // Essential dependency

const app = express();
const PORT = 3000;

app.use(cors()); // Use CORS middleware

// Healthcheck
app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

// URLs for the RenderZ players
const RENDERZ_PLAYERS_URL = 'https://renderz.app/24/players';
const RENDERZ_PLAYER_URL = 'https://renderz.app/24/player';

/**
 * @route GET /api/renderz-players
 * @description Scrapes player data from RenderZ and returns it as JSON.
 */
app.get('/api/renderz-players', async (req, res) => {
    try {
        const { data } = await axios.get(RENDERZ_PLAYERS_URL);
        const $ = cheerio.load(data);
        const players = [];

        // ✅ Parent Selector: Targets the <a> tag linking to the player's profile (most reliable anchor)
        $('a[href*="/player/"]').each((index, element) => {
            
            const player = {};
            
            // --- Core Details: Using robust attribute selectors for dynamic classes ---
            
            // 1. Name: Targets the span using the unique static class prefix found in the HTML
            player.name = $(element).find('span[class*="name"], span[class*="player-name"]').text().trim();
            
            // 2. Rating (OVR): Targets the div using the unique dynamic class prefix
            player.rating = $(element).find('div[class*="rating"], span[class*="rating"]').first().text().trim();
            
            // 3. Position: Targets the div using the unique dynamic class prefix
            player.position = $(element).find('div[class*="position"], span[class*="position"]').first().text().trim();
            
            // --- Enhanced Details ---
            
            // 4. Card / Image URL: Search for the <img> tag inside the card and get its 'src'
            player.card_url = $(element).find('img').attr('src'); 
            
            // 5. Alt Position & Pace: These are still placeholders—if data is missing, these are the culprit.
            player.alt_position = $(element).find('.alt-pos-label').text().trim(); 
            player.stat_pace = $(element).find('.stat-pace-value').text().trim();
            
            players.push(player);
        });

        res.json({
            status: 'success',
            count: players.length,
            data: players
        });

    } catch (error) {
        console.error('RenderZ Scraping Error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve or parse data from RenderZ.',
            details: error.message
        });
    }
});


// Local fallback endpoint to serve sample data
app.get('/api/local-players', (req, res) => {
	try {
		const fs = require('fs');
		const path = require('path');
		const dataPath = path.join(__dirname, 'data', 'players.json');
		const raw = fs.readFileSync(dataPath, 'utf-8');
		const json = JSON.parse(raw);
		res.json({ status: 'success', count: json.length, data: json });
	} catch (err) {
		res.status(500).json({ status: 'error', message: 'Failed to read local players.json', details: err.message });
	}
});


/**
 * @route GET /api/player-details/:id
 * @description Scrapes detailed data for a specific player from RenderZ.
 */
app.get('/api/player-details/:id', async (req, res) => {
    try {
        const playerId = req.params.id;
        const { data } = await axios.get(`${RENDERZ_PLAYER_URL}/${playerId}`);
        const $ = cheerio.load(data);
        
        const playerDetails = {
            id: playerId,
            name: '',
            rating: '',
            position: '',
            card_image: '',
            club: '',
            nation: '',
            stats: {}
        };
        
        // Extract player name (usually in the title or a prominent heading)
        playerDetails.name = $('h1, .player-name, .name').first().text().trim();
        
        // Extract rating
        playerDetails.rating = $('.rating, .ovr').first().text().trim();
        
        // Extract position
        playerDetails.position = $('.position').first().text().trim();
        
        // Extract card image
        playerDetails.card_image = $('.player-card img, .card img').attr('src') || '';
        
        // Extract club and nation
        playerDetails.club = $('.club, .team').first().text().trim();
        playerDetails.nation = $('.nation, .country').first().text().trim();
        
        // Extract stats
        const statNames = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];
        
        // Try to find stats in various formats
        $('.stat, [class*="stat"], .player-stat').each((i, el) => {
            const text = $(el).text().trim();
            
            // Try different stat formats: "PAC 90", "90 PAC", "Pace: 90", etc.
            for (const statName of statNames) {
                const shortName = statName.substring(0, 3).toUpperCase();
                
                if (
                    text.includes(statName.toUpperCase()) || 
                    text.includes(shortName) || 
                    text.includes(statName.charAt(0).toUpperCase() + statName.slice(1))
                ) {
                    const matches = text.match(/(\d+)/);
                    if (matches && matches[1]) {
                        playerDetails.stats[statName] = parseInt(matches[1]);
                    }
                }
            }
        });
        
        // Try to extract additional attributes if available
        const additionalAttributes = {
            height: $('.height, .player-height').text().trim(),
            weight: $('.weight, .player-weight').text().trim(),
            foot: $('.foot, .preferred-foot').text().trim(),
            age: $('.age, .player-age').text().trim(),
            workRates: $('.work-rates, .workrates').text().trim(),
            weakFoot: $('.weak-foot, .weakfoot').text().trim(),
            skillMoves: $('.skill-moves, .skills').text().trim()
        };
        
        // Add non-empty attributes
        Object.entries(additionalAttributes).forEach(([key, value]) => {
            if (value) {
                playerDetails[key] = value;
            }
        });
        
        res.json({
            status: 'success',
            data: playerDetails
        });
    } catch (error) {
        console.error('Player Details Scraping Error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve or parse player details from RenderZ.',
            details: error.message
        });
    }
});

/**
 * @route GET /api/search-players
 * @description Search players with filters
 */
app.get('/api/search-players', async (req, res) => {
    try {
        // Get filter params from query string
        const { name, position, minRating, maxRating, club, nation } = req.query;
        
        // Fetch all players first
        const { data } = await axios.get(RENDERZ_PLAYERS_URL);
        const $ = cheerio.load(data);
        const players = [];
        
        // Extract players using same selector as before
        $('a[href*="/player/"]').each((index, element) => {
            const player = {};
            
            player.name = $(element).find('span[class*="name"], span[class*="player-name"]').text().trim();
            player.rating = $(element).find('div[class*="rating"], span[class*="rating"]').first().text().trim();
            player.position = $(element).find('div[class*="position"], span[class*="position"]').first().text().trim();
            player.card_url = $(element).find('img').attr('src'); 
            
            // Extract player ID from href attribute
            const href = $(element).attr('href');
            if (href) {
                const idMatch = href.match(/\/player\/([\w-]+)/);
                if (idMatch && idMatch[1]) {
                    player.id = idMatch[1];
                }
            }
            
            // Try to get club and nation if available
            player.club = $(element).find('[class*="club"], [class*="team"]').first().text().trim();
            player.nation = $(element).find('[class*="nation"], [class*="country"]').first().text().trim();
            
            players.push(player);
        });
        
        // Apply filters
        const filteredPlayers = players.filter(player => {
            // Filter by name
            if (name && !player.name.toLowerCase().includes(name.toLowerCase())) {
                return false;
            }
            
            // Filter by position
            if (position && player.position !== position) {
                return false;
            }
            
            // Filter by rating range
            const playerRating = parseInt(player.rating);
            if (minRating && (!playerRating || playerRating < parseInt(minRating))) {
                return false;
            }
            if (maxRating && (!playerRating || playerRating > parseInt(maxRating))) {
                return false;
            }
            
            // Filter by club
            if (club && player.club && !player.club.toLowerCase().includes(club.toLowerCase())) {
                return false;
            }
            
            // Filter by nation
            if (nation && player.nation && !player.nation.toLowerCase().includes(nation.toLowerCase())) {
                return false;
            }
            
            return true;
        });
        
        res.json({
            status: 'success',
            count: filteredPlayers.length,
            data: filteredPlayers
        });
        
    } catch (error) {
        console.error('Player Search Error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to search players.',
            details: error.message
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Player list: http://localhost:${PORT}/api/renderz-players`);
    console.log(`Player details: http://localhost:${PORT}/api/player-details/:id`);
    console.log(`Search players: http://localhost:${PORT}/api/search-players?name=messi`);
    console.log(`Healthcheck: http://localhost:${PORT}/health`);
    console.log(`Local players: http://localhost:${PORT}/api/local-players`);
});
