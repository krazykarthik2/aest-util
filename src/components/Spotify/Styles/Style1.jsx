import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import Cookies from "js-cookie";
const spotifyApi = new SpotifyWebApi();

function Style1() {
  const [songDetails, setSongDetails] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const token = Cookies.get("spotifyAuthToken");
    console.log("Spotify Access Token:", token);
    if (token) {
      spotifyApi.setAccessToken(token);
      setAccessToken(token);

      // Fetch currently playing song
      spotifyApi
        .getMyCurrentPlaybackState()
        .then((data) => {
          if (data && data.item) {
            const songId = data.item.id;
            setSongDetails({
              title: data.item.name,
              artist: data.item.artists
                .map((artist) => artist.name)
                .join(", "),
              album: data.item.album.name,
              image: data.item.album.images[0].url,
              id: songId,
            });
            setCurrentTime(data.progress_ms / 1000);
            setDuration(data.item.duration_ms / 1000);

            // Check if the song is liked
            spotifyApi
              .containsMySavedTracks([songId])
              .then((response) => {
                setIsLiked(response[0]);
              })
              .catch((error) =>
                console.error("Error checking like status:", error)
              );
          }
        })
        .catch((error) => console.error("Error fetching song details:", error));
    } else {
      // Redirect to Spotify login
      const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
      const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
      const scopes =
        "user-read-playback-state user-modify-playback-state user-library-read";
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}`;
      window.location.href = authUrl;
    }
  }, []);

  const handlePlaybackControl = (action) => {
    const token = Cookies.get("spotifyAuthToken");
    if (token) {
      spotifyApi[action]().catch((error) =>
        console.error(`Error performing ${action}:`, error)
      );
    }
  };

  const handleNextTrack = () => {
    if (accessToken) {
      spotifyApi
        .skipToNext()
        .then(() => console.log("Skipped to next track"))
        .catch((error) =>
          console.error("Error skipping to next track:", error)
        );
    }
  };

  return (
    <div className="center">
      <div className="left"></div>
      <div className="middle d-center stack gap-4">
        {songDetails ? (
          <>
            <div className="photo d-center">
              <img
                className="rounded-2xl"
                src={songDetails.image}
                alt={songDetails.title}
                width={400}
                height={400}
              />
            </div>
            <div className="song-info">
              <h2>{songDetails.title}</h2>
              <p>{songDetails.artist}</p>
              <p>{songDetails.album}</p>
            </div>
          </>
        ) : (
          <p>Loading song details...</p>
        )}
        {isLiked && <p>You liked this song!</p>}
        <button onClick={handleNextTrack}>Next</button>
      </div>
      <div className="right"></div>
    </div>
  );
}

export default Style1;
