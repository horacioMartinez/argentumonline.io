# ArgentumOnline.io

![](imagenes/logo.png?raw=true "Argentum Online")

### [Play it now](http://argentumonline.io/)

.io spin-off of the popular argentinian MMORPG [Argentum Online](https://es.wikipedia.org/wiki/Argentum_Online)

[Server code](https://github.com/horacioMartinez/dakara-server/tree/io)

## Development Setup

The project has been migrated from RequireJS to ES modules and now uses Vite for development and building.

### Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

### Key changes:

- RequireJS has been removed
- All modules now use ES6 import/export syntax
- Vite handles bundling and development server
- SCSS files are processed automatically
- jQuery UI dialog system with custom styling

### Project Structure:

- `/js` - JavaScript source files
- `/css` - SCSS styles
- `/imagenes` - Game graphics and images
- `/audio` - Sound files
- `/fonts` - Font files
- `/menus` - HTML templates for popup dialogs

### License

This content is released under the (http://opensource.org/licenses/MIT) MIT License.
