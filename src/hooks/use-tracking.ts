import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import googleAnalyticsConfig from "analytics-config";

const useTracking = () => {
  // const { pathname, search } = useLocation();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!window.gtag) return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    window.gtag("config", googleAnalyticsConfig.trackingId, {
      page_path: pathname,
    });
  }, [pathname]);
};

export default useTracking;
