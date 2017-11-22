# Memory N Back
## React Native and mobile

[![Build Status][travis-image]][travis-url] [![Production Web App][web-app-image]][web-app-url] [![Staging Web App][web-staging-app-image]][web-staging-app-url] [![dependencies][dependencies-image]][dependencies-url] [![devDependencies][dev-dependencies-image]][dev-dependencies-url] [![GPLv3][license-image]][license-url]

<p align='center'>
  <a href='https://play.google.com/store/apps/details?id=com.memoryNback'>
    <img src='http://res.cloudinary.com/goldylucks/image/upload/v1483476725/google_play_dd9daq.png'>
  </a>
</p>

This project shares (almost) 100% of the logic (redux) between native and web, leaving only specific render implementations to different clients.

## Use
[Google store][google-store-url] (stable, latest release)  
[Production Web App][web-app-url] (stable, latest release)  
[Staging Web App][web-staging-app-url] (latest master)  
Memory N Back web version is kindly hosted on [surge](https://surge.sh/)

### Install
```bash
$ git clone git@github.com:goldylucks/memory-n-back.git
$ cd memory-n-back
$ npm install
$ react-native run-android # for android devices
$ react-native run-ios # for ios device
```

### Develop Web
```bash
$ npm start # starts webpack-dev-server at port 3000
$ npm run server # starts nodemon server at port 3001
```

### Develop Native
make sure to connect your device or run your emulator first
```bash
$ react-native start
$ npm run server # starts nodemon server at port 3001
```

## Test
```bash
# unit tests
$ npm test # web and native
# e2e web
$ npm run start:e2e
$ npm run e2e # Runs nightwatch against a selenium chrome driver
```

## Lint
```bash
$ npm run lint # lints javascript
$ npm run lint:fix # lints javascript and fixes errors automagically
$ npm run lintstyle # lints css
$ npm run lintstyle:fix # lints css and fixes errors automagically
```

## Contact
Issues, features (and PRs!) are always [welcomed][issues-url] :)  

## License
The code is available under the [GPL v3 license][license-url].

[travis-image]: https://travis-ci.org/goldylucks/memory-n-back.svg?branch=master
[travis-url]: https://travis-ci.org/goldylucks/memory-n-back

[google-store-url]: https://play.google.com/store/apps/details?id=com.memoryNback
[google-store-image]: ./android/app/src/main/res/mipmap-hdpi/icon.png

[web-app-url]: https://memory-n-back.surge.sh/
[web-app-image]: https://img.shields.io/website-up-down-green-red/https://memory-n-back.surge.sh/.svg?label=web%20app

[web-staging-app-url]: https://memory-n-back-staging.surge.sh/
[web-staging-app-image]: https://img.shields.io/website-up-down-green-red/https://memory-n-back-staging.surge.sh/.svg?label=web%20staging%20app

[dependencies-image]: https://img.shields.io/david/goldylucks/memory-n-back.svg
[dependencies-url]: https://david-dm.org/goldylucks/memory-n-back

[dev-dependencies-image]: https://img.shields.io/david/dev/goldylucks/memory-n-back.svg
[dev-dependencies-url]: https://david-dm.org/goldylucks/memory-n-back?type=dev

[license-image]: https://img.shields.io/badge/license-GPL%20v3-brightgreen.svg
[license-url]: http://www.gnu.org/licenses/gpl-3.0.en.html

[issues-url]: https://github.com/goldylucks/memory-n-back/issues
