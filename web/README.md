# **Getting Started with Create React App**

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## **Yarn**

Yarn is an alternative to npm. You do not have to use it, it will all work just the same if you replace the word "yarn" with "npm run", it's up to preferrence.
If you do want to use yarn, it can be globally installed with npm using:

```bash
npm install -g yarn
```

## **Environmental variables**

Create a file at the root of the project, called ```.env```.\
Fill in the following variables (The values need to match the ones on the server):

```bash
SERVER_ADDRESS=http://<SERVER_HOST>:<SERVER_PORT>    # http://127.0.0.1:<BACKEND_PORT> in dev
PUBLIC_URL=http://<HOST>:<PORT>                      # http://127.0.0.1:8080 in dev
NODE_ENV="production" || "development"
```

## **Troubleshooting**

- Make sure that your project is always up to date
- Git: If you have saved but uncommited changes but need to pull, stash the changes, pull and then apply the latest stash
- If the project does not launch after a pull, try deleting the ```node_modules``` directory, and re-install all packages:

```bash
npm i
```

## **Available Scripts**

In the project directory, you can run:

### `yarn web` or `yarn dev`

Runs the app in the development mode, bundled with Webpack.\
Open [http://localhost:8080](http://localhost:8080) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn serve`

Serves the application in production mode, using Webpack.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## **Learn More**

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
