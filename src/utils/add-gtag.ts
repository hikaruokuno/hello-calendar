import googleAnalyticsConfig from "analytics-config";

const addGtag = () => {
  if (window.gtag !== undefined) {
    return;
  }
  const { trackingId } = googleAnalyticsConfig;
  const script1 = document.createElement("script");
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
  document.body.appendChild(script1);

  const script2 = document.createElement("script");
  script2.text = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', "${trackingId}")`;

  document.body.appendChild(script2);
};

export default addGtag;
