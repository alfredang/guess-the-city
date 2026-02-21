# 🌍 Guess the City

<div align="center">

![Guess the City](https://img.shields.io/badge/Guess%20the-City-6c5ce7?style=for-the-badge&logo=globe&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/ES%20Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Unsplash](https://img.shields.io/badge/Unsplash-API-000?style=for-the-badge&logo=unsplash&logoColor=white)

**A geography quiz game — identify world cities from stunning Unsplash photos!**

[▶ Play Now](https://alfredang.github.io/guess-the-city/)

</div>

---

## 📸 Screenshots

<div align="center">

| Start Screen | Gameplay | Results |
|:---:|:---:|:---:|
| ![Start](screenshots/start-screen.png) | ![Gameplay](screenshots/gameplay.png) | ![Results](screenshots/results.png) |

</div>

## ✨ Features

- **30 iconic cities** — Paris, Tokyo, New York, Dubai, Santorini, Havana, and more
- **Unsplash-powered photos** — stunning real photography with proper attribution
- **Smart distractors** — answer options include same-region cities to keep it challenging
- **5 rounds per game** — quick, replayable sessions with randomized cities
- **Score tracking** — see your results with round-by-round breakdown
- **Photo caching** — sessionStorage cache for fast replays
- **Dark theme** — sleek purple-accented UI
- **Mobile responsive** — works on any screen size
- **Zero dependencies** — vanilla JavaScript with ES modules

## 🎮 How to Play

1. Click **Start Game**
2. Enter your free [Unsplash API key](https://unsplash.com/developers) (one-time setup)
3. Look at the city photo
4. Pick the correct city from 4 options
5. After 5 rounds, see your score!

## 🏙️ Cities Included

| Region | Cities |
|--------|--------|
| 🇪🇺 Europe | Paris, London, Rome, Barcelona, Istanbul, Moscow, Lisbon, Prague, Amsterdam, Santorini |
| 🌏 East Asia | Tokyo, Shanghai, Seoul, Kyoto |
| 🌏 Southeast Asia | Bangkok, Singapore |
| 🌏 South Asia | Mumbai, Jaipur |
| 🇺🇸 Americas | New York, San Francisco, Rio de Janeiro, Buenos Aires, Cusco, Havana |
| 🌍 Africa | Cairo, Cape Town, Marrakech |
| 🌍 Middle East | Dubai, Petra |
| 🌏 Oceania | Sydney |

## 🖼️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| HTML5 | Structure & semantics |
| CSS3 | Dark theme UI with animations |
| Vanilla JavaScript | Game logic (ES modules) |
| Unsplash API | City photo search |
| GitHub Pages | Hosting |

## 🏗️ Architecture

```
guess-the-city/
├── index.html          # Main HTML with all screens
├── css/
│   └── style.css       # Dark theme styling
├── js/
│   ├── config.js       # Game configuration
│   ├── cities.js       # 30 cities with regions & queries
│   ├── game.js         # Game state, rounds, scoring
│   ├── api.js          # Unsplash API + caching
│   └── ui.js           # DOM rendering & events
├── assets/
│   └── fallback.svg    # Photo fallback image
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
└── README.md
```

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/alfredang/guess-the-city.git

# Serve locally (ES modules require a server)
npx serve .
# or
python -m http.server 8000
```

### Unsplash API Key

1. Create a free account at [unsplash.com/developers](https://unsplash.com/developers)
2. Create a new application
3. Copy your **Access Key**
4. Paste it in the game's setup screen (stored in localStorage)

## 📝 License

MIT
