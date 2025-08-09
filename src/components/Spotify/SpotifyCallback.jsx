import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    console.log("Spotify Callback Hash:", hash);
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const expiresInSeconds = parseInt(params.get("expires_in"), 10);

      if (accessToken && expiresInSeconds) {
        console.log("Spotify Access Token stored in cookie:", accessToken);

        const expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + expiresInSeconds);

        Cookies.set("spotifyAuthToken", accessToken, { expires: expirationDate });

        // Example of using correct endpoints
        fetch("https://api.spotify.com/v1/me/player/devices", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            accessToken: accessToken
          },
        })
          .then((response) => response.json())
          .then((data) => console.log("Devices:", data))
          .catch((error) => console.error("Error fetching devices:", error));

        navigate("/");
      }
    }
  }, [navigate]);

  return <div></div>;
}

export default SpotifyCallback;