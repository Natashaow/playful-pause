# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d7f42e1c-e138-47b7-ada7-b50a41334c95

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d7f42e1c-e138-47b7-ada7-b50a41334c95) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Emotion Icons

This project includes a collection of 9 animated SVG emotion icons with subtle, loopable animations:

- **JoyIcon**: Sun with rays and sparkles
- **SadnessIcon**: Droplet with fall animation
- **LoveIcon**: Heart with breathing and glow
- **GrowthIcon**: Stem with growing leaves
- **FearIcon**: Eye with darting pupil and shiver
- **PeaceIcon**: Peace symbol with gentle rotation
- **HopeIcon**: Horizon with rising sun
- **GentleIcon**: Feather with sway and float
- **AnxietyIcon**: Irregular pulse with scribble

### Testing the Emotion Icons

1. Start the development server: `npm run dev`
2. Navigate to `/emotions` to see all icons in action
3. The icons respect `prefers-reduced-motion` and will pause animations when users have motion sensitivity enabled
4. Each icon can be customized with different sizes and colors via props

### Building and Testing

```sh
# TypeScript compilation check
npm run build

# Development server with hot reload
npm run dev

# Visual testing
# Visit http://localhost:5173/emotions to see all emotion icons
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d7f42e1c-e138-47b7-ada7-b50a41334c95) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
