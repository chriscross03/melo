export default async function searchSpotify({
  accessToken,
  searchInput,
  setAlbums,
  setTracks,
  setArtists,
  setTopResults,
}) {
  console.log("Search for " + searchInput);

  const searchParameters = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  };

  const data = await fetch(
    "https://api.spotify.com/v1/search?q=" +
      searchInput +
      "&type=artist,track,album&limit=10",
    searchParameters
  ).then((response) => response.json());

  console.log("Spotify API Response:", data);

  setArtists(
    data.artists?.items?.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.images?.[0]?.url || null,
    })) || []
  );

  setAlbums(
    data.albums?.items?.map((item) => ({
      id: item.id,
      name: item.name,
      artist: item.artists?.[0]?.name || "Unknown",
      images: item.images || [],
    })) || []
  );

  setTracks(
    data.tracks?.items?.map((item) => ({
      id: item.id,
      name: item.name,
      artist: item.artists?.[0]?.name || "Unknown",
      image: item.album?.images?.[0]?.url || null,
    })) || []
  );

  const topAlbum = data.albums?.items?.[0];
  const topTrack = data.tracks?.items?.[0];
  const topArtist = data.artists?.items?.[0];

  const topResult = topAlbum
    ? { type: "album", item: topAlbum }
    : topTrack
    ? { type: "track", item: topTrack }
    : topArtist
    ? { type: "artist", item: topArtist }
    : null;

  setTopResults(topResult ? [topResult] : []);
}
