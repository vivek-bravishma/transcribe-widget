const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src/Widget", "Widget.tsx"),
  output: {
    path: path.resolve(__dirname, "build/dist"),
    // path: path.resolve(__dirname, "build/elements"),
    filename: "Widget.js",
    // filename: "angular-widget-userdetails-exchangerate.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          compilerOptions: {
            noEmit: false,
          },
        },
        exclude: /node_modules/,
        include: path.resolve(__dirname, "src"),
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};