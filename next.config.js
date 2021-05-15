module.exports = {
  // Workaround for a wrong export error due to [Image] optimization.
  images: {
    loader: "imgix",
    path: "https://noop/",
  },
};
