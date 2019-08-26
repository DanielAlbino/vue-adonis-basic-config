# vue-adonis-basic-config
Basic configuration of the vue.js + adonis.js

# Install Adonis CLI
```bash
npm install -g @adonisjs/cli
```
# Create Adonis Project
```bash
adonis new fullstack-app
cd fullstack-app
```
# Webpack
We want to create all our frontend JavaScript and Vue files inside resources/assets/js. 
Webpack will transpile these and place them inside **public/js**.

```bash
mkdir resources/assets/js
touch resources/assets/js/main.js
```

Write inside **main.js**

```bash
// resources/assets/js/main.js

const test = 1
console.log(test)
```

**Get Webpack Rolling**

People who come from a Laravel background might be familiar with Laravel-Mix. 
The good thing is that we can use Laravel Mix for our Adonis project as well. 
It takes away much of the configuration hell of webpack and is great for the 80/20 use case.

Start by installing the dependency and copy to the root directory of the project.

```bash
npm install laravel-mix --save
cp node_modules/laravel-mix/setup/webpack.mix.js .
```
v is where all our configuration takes place. Let's configure it

```bash
// webpack.mix.js

let mix = require('laravel-mix');

// setting the public directory to public (this is where the mix-manifest.json gets created)
mix.setPublicPath('public')
// transpiling, babelling, minifying and creating the public/js/main.js out of our assets
    .js('resources/assets/js/main.js', 'public/js')



// aliases so instead of e.g. '../../components/test' we can import files like '@/components/test'
mix.webpackConfig({
    resolve: {
        alias: {
            "@": path.resolve(
                __dirname,
                "resources/assets/js"
            ),
            "@sass": path.resolve(
                __dirname,
                "resources/assets/sass"
            ),
        }
    }
 });
```

Also, be sure to remove the existing example to avoid crashes

```bash
mix.js('src/app.js', 'dist/').sass('src/app.scss', 'dist/');
```

**Adding the necessary scripts**

Let's add some scripts to our package.json that let us transpile our assets. 
Add the following lines inside scripts.

```bash
// package.json

"assets-dev": "node node_modules/cross-env/dist/bin/cross-env.js NODE_ENV=development webpack --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js",
"assets-watch": "node node_modules/cross-env/dist/bin/cross-env.js NODE_ENV=development webpack --watch --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js",
"assets-hot": "node node_modules/cross-env/dist/bin/cross-env.js NODE_ENV=development webpack-dev-server --inline --hot --config=node_modules/laravel-mix/setup/webpack.config.js",
"assets-production": "node node_modules/cross-env/dist/bin/cross-env.js NODE_ENV=production webpack --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js"
```

We can execute **npm run assets-watch** to keep a watch over our files during development. 
Running the command should create two files: **public/mix-manifest.json** and **public/js/main.js**.
It is best to gitignore these generated files as they can cause a lot of merge conflicts when working in teams...

# Routing
Since we are building a SPA, Adonis should only handle routes that are prefixed with **/api**. 
All other routes will get forwarded to vue, which will then take care of the routing on the client side.
Go inside **start/routes.js** and add the snippet below to it.

```bash
// start/routes.js

// all api routes (for real endpoints make sure to use controllers)
Route.get("hello", () => {
    return { greeting: "Hello from the backend" };
}).prefix("api")
Route.post("post-example", () => {
    return { greeting: "Nice post!" };
}).prefix("api")

// This has to be the last route
Route.any('*', ({view}) =>  view.render('app'))
```
Let's take a look at this line: ** Route.any('*', ({view}) => view.render('app'))**
The asterisk means everything that has not been declared before. Therefore it is crucial that this is the last route to be declared.

The argument inside view.render app is the starting point for our SPA, where we will load the **main.js** file we created earlier. 
Adonis uses the Edge template engine which is quite similar to blade. Let's create our view.

```bash
touch resources/views/app.edge
```
```bash
// resources/views/app.edge

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Adonis & Vue App</title>
</head>
<body>
    <div id="app"></div>
    {{ script('/js/main.js') }}
</body>
</html>
```

The global script function looks for files inside **resources/assets** and automatically creates the script tag for us.

# Vue Setup

Let's install vue and vue router

```bash
npm install vue vue-router --save-dev
```
Now we initialize vue in resources/assets/js/main.js

```bash
// resources/assets/js/main.js

import Vue from 'vue'
import router from './router'
import App from '@/components/layout/App'

Vue.config.productionTip = false


new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
```
In order to make this work we have to create **App.vue**. 
All layout related things go here, we just keep it super simple for now and just include the router.

```bash
mkdir resources/assets/js/components/layout
touch resources/assets/js/components/layout/App.vue
```
```bash
// /resources/assets/js/components/layout/App.vue

<template>
    <router-view></router-view>
</template>

<script>
export default {
  name: 'App'
}
</script>
```
We have to create the client side router configuration

```bash
mkdir resources/assets/js/router
touch resources/assets/js/router/index.js
```
```bash
// resources/assets/js/router/index.js

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history', // use HTML5 history instead of hashes
    routes: [
        // all routes
    ]
})
````

# launch
Let's launch our application and see what we've got. 
Be sure to have **npm run assets-watch** running, then launch the Adonis server using

```bash
adonis serve --dev
```
By default Adonis uses **port 3333**, so head over to **localhost:3333** and you should be able to navigate between the index and about page.
