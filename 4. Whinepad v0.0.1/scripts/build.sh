# transformação de js
babel --presets react,es2015 js/source -d js/build

# empacotamento de js
browserify js/build/app.js -o bundle.js

# empacotamento d css
cat css/*/* css/*.css | sed 's/..\/..\/images/images/g' > bundle.css

# pronto
date; echo;