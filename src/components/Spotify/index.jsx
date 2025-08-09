import { lazy, Suspense, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";

const Style1 = lazy(() => import("./Styles/Style1"));
const SpotifyStyles = [Style1];
const spotifyApi = new SpotifyWebApi();

const Spotify = ({ style }) => {
  const RequestedStyle = SpotifyStyles[style - 1];
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const [currentSongDuration, setCurrentSongDuration] = useState(null);

  useEffect(() => {
    const token = Cookies.get("spotifyAuthToken");
    if (token) {
      spotifyApi.setAccessToken(token);

      const fetchSongDetails = () => {
        spotifyApi
          .getMyCurrentPlaybackState()
          .then((data) => {
            if (data && data.item) {
              setCurrentSongDuration(data.item.duration_ms);
            }
          })
          .catch((error) =>
            console.error("Error fetching playback state:", error)
          );
      };

      fetchSongDetails();

      const interval = setInterval(
        fetchSongDetails,
        currentSongDuration || 30000
      ); // Default to 30 seconds if duration is unavailable
      return () => clearInterval(interval);
    }
  }, [currentSongDuration]);

  useEffect(() => {
    const keydownCheck = (e) => {
      if (e.altKey && (e.key === "s" || e.key == "S")) setActive((e) => !e);
    };
    document.addEventListener("keydown", keydownCheck);
    return () => document.removeEventListener("keydown", keydownCheck);
  }, []);

  return (
    active && (
      <Suspense fallback={<div>Loading...</div>}>
        <RequestedStyle />
      </Suspense>
    )
  );
};

export default Spotify;
