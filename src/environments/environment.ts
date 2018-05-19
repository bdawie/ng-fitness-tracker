// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBY7sa6WBhLiB5rMrVSAeu6lhSVhupKnZs',
    authDomain: 'ng-fitness-tracker-bdawie.firebaseapp.com',
    databaseURL: 'https://ng-fitness-tracker-bdawie.firebaseio.com',
    projectId: 'ng-fitness-tracker-bdawie',
    storageBucket: 'ng-fitness-tracker-bdawie.appspot.com',
    messagingSenderId: '765271904093'
  }
};
