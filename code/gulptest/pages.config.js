module.exports = {
  build: {
    src: 'src',
    dist: 'release',
    temp: '.temp',
    public: 'public',
    paths: {
      styles: 'style/**.scss',
      scripts: 'js/**.js',
      pages: 'html/**.html',
      images: 'images/**',
      fonts: 'fonts/**'
    }
  }
}