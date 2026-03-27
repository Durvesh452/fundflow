import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchCampaignInfo, fetchEvents } from '../utils/stellar';
import { CONFIG } from '../config';

const MAX_ACTIVITY_ITEMS = 10;

export const useContract = () => {
  const [campaignData, setCampaignData] = useState(null);
  const [activity, setActivity] = useState([]); // [{address, amount, time}]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastDonorRef = useRef(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchCampaignInfo();
      setCampaignData(data);
      setError(null);

      // Fetch latest events
      const events = await fetchEvents();
      if (events && events.length > 0) {
        setActivity(events.slice(0, MAX_ACTIVITY_ITEMS));
      }
    } catch (err) {
      setError(err.message);
      console.error('Refresh error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount + polling
  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, CONFIG.POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  return { campaignData, activity, loading, error, refresh };
};
