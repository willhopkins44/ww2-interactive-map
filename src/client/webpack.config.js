const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'src/.webpack'),
        filename: 'bundle.js'
    }
};