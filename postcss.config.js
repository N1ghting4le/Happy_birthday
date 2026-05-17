module.exports = {
  plugins: [
    [
      "postcss-preset-env",
      {
        autoprefixer: { grid: "autoplace" },
        stage: 2,
      },
    ],
  ],
};
