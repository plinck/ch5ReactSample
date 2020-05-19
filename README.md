# ch5ReactSample - 

## This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This project used the cra-template-ch5-typescript starter template by Chris Poole, AVSP Ltd.  Many thanks to Chris for doing the heavy lifting on getting started with react and ch5

This project has been updated to change the file structure around a but to more fit the structure I typically used.  I have also copied the react-ch5 code into my project so I can manipualet it on my own and inetgrate it based on my style.  I also got rid of yarn since I dont use it and I had issues with it messing up my gcloud CLI and firebase CLI.  Certainly ths is my issue but I am not in the mood to switch to yarn yet.

This is meant to be a way to start learning ch5 with react and typescript using simulator vs real ive env with touchpanel and processor.  This is to allow isloated learning and testing primarily using the emulator.

## Available Scripts

In the project `client` directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm run build`

Builds the react app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Crestron CH5 Specific Scripts - when using live processor

`npm build` will compile the code in src to the build directory.
`npm build:archive` will build a ch5z file from the most recently built build and output to the dist folder.
`npm build:deploy` will deploy the ch5z from the dist folder to a touchpanel "panel".

`npm build:onestep` will execute the above three steps in sequence.

Once the panel is deployed, you can use `npm start` then click the link to your development machine to get live reloading.

Any questions on all this? Drop Chris a line on github or chris@avsp.co.uk
