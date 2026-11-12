const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
const version = "v" + (import.meta.env.VITE_FACEBOOK_GRAPH_VERSION || "24.0").replace(/^v/, "");
let sdkPromise;

function loadFacebookSdk() {
  if (!appId) {
    return Promise.reject(new Error("Facebook login needs an App ID in .env.local."));
  }
  if (window.location.protocol !== "https:") {
    return Promise.reject(new Error("Open the app over HTTPS to use Facebook login."));
  }
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    let timer;

    function fail() {
      window.clearTimeout(timer);
      script.remove();
      sdkPromise = undefined;
      reject(new Error("Facebook could not load. Check your connection and try again."));
    }

    window.fbAsyncInit = () => {
      try {
        window.FB.init({ appId, version, cookie: false, xfbml: false, fedCM: false });
        window.clearTimeout(timer);
        resolve(window.FB);
      } catch (error) {
        fail();
      }
    };
    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.onerror = fail;
    timer = window.setTimeout(fail, 15000);
    document.head.appendChild(script);
  });
  return sdkPromise;
}

export function prepareFacebookLogin() {
  return loadFacebookSdk();
}
