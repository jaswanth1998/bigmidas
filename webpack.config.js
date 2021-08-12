module: {
  loaders: [
    {
      test: /\app.js?$/,
      exclude: /(node_modules|bower_components)/,
      loaders: [
        'react-hot',
        'babel?presets[]=react,presets[]=es2015,presets[]=stage-0'
      ]
    }
  ]
}