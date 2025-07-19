// Vite entry point
// Setup jQuery first
import './jquery-setup.js'

// Import jQuery UI CSS (but not theme.css as we have our own theme)
// import 'jquery-ui/dist/themes/base/jquery-ui.css'

// Import our CSS after jQuery UI to ensure our styles override theirs
import '../css/main.scss'

// Import jQuery UI after CSS is loaded
import 'jquery-ui/dist/jquery-ui.js'

// Import polyfills
import '@babel/polyfill'

import WebFont from 'webfontloader'

// Import Bootstrap after jQuery is available
import 'bootstrap'

// Configure webfont loader
WebFont.load({
  google: {
    families: ['Droid Sans', 'Droid Serif']
  }
})

// Import main application - wrap in setTimeout to ensure all dependencies are loaded
setTimeout(() => {
  import('./main.js')
}, 0)