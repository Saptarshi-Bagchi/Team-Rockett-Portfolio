# 🚀 Team Rocket - Portfolio

> A student team building real-world solutions through technology, creativity and collaboration.

The official portfolio website of **Team Rockett**: a cinematic, dark-first single-page app showcasing our projects and the people behind them.

---

## ✨ Features

- **Three pages:** Home, Projects, Members (in that order)
- **Expanded Home page:** Hero, About, Journey timeline, and Stats
- **Full-screen project presentation:** Two projects, one screen-height section each
- **Alternating Members layout:** one full-width section per member, with the photo alternating right, left, right, and so on
- **Light / Dark mode:** follows your OS by default, remembers your choice, and avoids a flash on load
- **Responsive and accessible:** mobile hamburger menu, keyboard navigation, `prefers-reduced-motion` support

## 🛠️ Tech Stack

| Area | Tools |
| --- | --- |
| Framework | React + Vite |
| Routing | React Router |
| Styling | Plain CSS with CSS variables (theming via `data-theme`) |
| Fonts | Inter, JetBrains Mono, Caveat |

> If your repo uses a different stack, update this table to match.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm (bundled with Node)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open the URL printed in the terminal (usually `http://localhost:5173`).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## 📁 Project Structure

```
.
├── public/                 # Static files (favicon, etc.)
├── src/
│   ├── assets/
│   ├── logo.png            # Team logo (navbar, footer, favicon)
│   ├── components/         # Navbar, Footer, Reveal, ThemeToggle, cards...
│   ├── data/
│   │   ├── projects.js     # Project list
│   │   └── members.js      # Member list
│   ├── pages/              # Home, Projects, Members
│   ├── styles/             # Global styles and theme variables
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── README.md
```

## ✏️ Customising Content

### Add or edit a project

Edit `src/data/projects.js`:

```js
{
  title: "Project Name",
  description: "One or two lines about what it does.",
  tags: ["React", "Python"],
  image: "/path/to/image.png",
}
```

### Add or edit a member

Edit `src/data/members.js`:

The team currently has 6 placeholder members. Replace their names, roles, bios, skills, images, and links in that file.

```js
{
  name: "Full Name",
  role: "Your Role",
  bio: "A short bio.",
  skills: ["Skill 1", "Skill 2"],
  image: "/path/to/photo.jpg",
  links: { github: "", linkedin: "", x: "" },
}
```

The Members page alternates the image side automatically, so just add or remove entries in order.

### Change the logo

Replace `public/logo.png` with your new logo (keep the filename). It is used in the navbar, footer, and as the favicon.

### Change colours

Theme colours live as CSS variables in `src/styles/`. Adjust the `:root` (light) and `[data-theme="dark"]` blocks to restyle the whole site.

## 🎨 Design Notes

- Dark theme: black background with a flat orange accent
- Light theme: soft off-white background, dark text, same orange accent
- Theme is stored in `localStorage` under the `theme` key

## 🌐 Deployment

The site is a static build, so it works on any static host (Vercel, Netlify, GitHub Pages).

```bash
npm run build
```

Deploy the generated `dist/` folder. Since the app uses client-side routing, configure your host to redirect all routes to `index.html`. On Netlify, add a `public/_redirects` file containing `/* /index.html 200`. On Vercel, this is handled automatically for Vite projects.

## 👥 Team

**Team Rockett**: *Same Dream. Different Skills. One Team.*

See the Members page of the site for the full crew.

## 📄 License

This project is licensed under the [MIT License](LICENSE). Add a `LICENSE` file if you'd like to use this.

---

<p align="center">Made with ☕ and ambition by Team Rockett</p>
