# WEB 403 · Week 3 Day 1 Homework

React sign-in exercise with Bootstrap 4, a classroom demo form, and Facebook OAuth through the `react-facebook-login` component. The Facebook callback shows the user's returned profile on a home screen. The app keeps profile data in memory and does not store or display access tokens.

## Run locally

```sh
cd react-fb_login
npm ci
cp -n .env.example .env.local
npm start
```

Open the localhost URL printed by Vite. The classroom account is `student@example.com` with password `classroom-demo`. These are sample values for the local form and are separate from Facebook credentials.

## Enable Facebook login

1. In the [Meta App Dashboard](https://developers.facebook.com/apps/), configure an app with Facebook Login and add the website origin you will test from. Use an account assigned a role on the app while testing in development mode.
2. Set `VITE_FACEBOOK_APP_ID` in `react-fb_login/.env.local` to the App ID. Leave the app secret in the Meta dashboard. Set `VITE_FACEBOOK_GRAPH_VERSION` to the supported version you configured.
3. Enable Login with the JavaScript SDK and add your test domain to its allowed domains in the Facebook Login settings. Restart Vite. Open the approved HTTPS origin, select **Continue with Facebook**, and approve the request. The home screen should show the returned profile. Sign out clears the local app state.
4. Facebook Login requires HTTPS. To test on localhost, place a trusted localhost certificate and its key at `react-fb_login/.local-https/localhost.pem` and `react-fb_login/.local-https/localhost.key`. Then run `npm start` and open `https://localhost:4175/`. You can also deploy the production build over HTTPS and register that domain in Meta.

Run `npm run build` from `react-fb_login` to build the app for hosting. This classroom app displays a profile from the SDK callback. A service protecting private data would validate the provider token on its server before granting access.

[Course instructions](https://gap.westcliff.edu/mod/resource/view.php?id=2140029) · [Facebook login component](https://github.com/keppelen/react-facebook-login)

## Verification

The production build passes. Classroom sign-in and sign-out were checked in the browser, and a real Facebook login reached the home screen with the returned profile on November 12, 2026. The SDK is loaded before the required react-facebook-login component and explicitly selects the standard popup because Chrome FedCM failed on localhost.

This project uses Vite to run the React app; the course slides demonstrate Create React App. React, React Bootstrap, Bootstrap 4 and react-facebook-login remain the course libraries.
