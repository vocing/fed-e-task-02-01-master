module.exports = {
  presets: [
    "@vue/app",
    [
      "@vue/babel-preset-jsx",
      {
        injectH: false
      }
    ]
  ],
  plugins: [
    [
      "import",
      {
        libraryName: "mand-mobile",
        libraryDirectory: "lib"
      }
    ]
  ]
};
