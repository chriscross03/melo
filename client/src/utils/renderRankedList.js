import React from "react";

export default function renderRankedList({
  type,
  ratings,
  ratedAlbums,
  ratedTracks,
  ratedArtists,
}) {
  const allRated =
    type === "album"
      ? ratedAlbums
      : type === "track"
      ? ratedTracks
      : ratedArtists;

  // Filter ratings only for this type
  const ratedItems = Object.entries(ratings)
    .filter(([id, data]) => data.type === type)
    .sort((a, b) => b[1].score - a[1].score)
    .map(([id]) => allRated.find((item) => item.id === id))
    .filter(Boolean);

  if (ratedItems.length === 0) {
    return <p>No {type}s rated yet.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {ratedItems.map((item, index) => {
        const scoreData = ratings[item.id];
        let scoreColor = "#81C784"; // green for liked

        if (scoreData.category === "fine") scoreColor = "#FFD54F"; // yellow
        if (scoreData.category === "disliked") scoreColor = "#E57373"; // red

        return (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "8px",
              borderColor: "black",
              border: "1px solid #1e1e1e",
            }}
          >
            {/* Left: Index, Image, Info */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "20px", color: "#aaa" }}>{index + 1}</div>
              <img
                src={
                  item.image ||
                  item.images?.[2]?.url ||
                  item.images?.[0]?.url ||
                  item.album?.images?.[0]?.url
                }
                alt={item.name}
                style={{ width: "50px", height: "50px", borderRadius: "4px" }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#1e1e1e",
                    lineHeight: "1.2",
                  }}
                >
                  {item.name}
                </div>

                {(type === "album" || type === "track") && item.artist && (
                  <div
                    style={{
                      color: "#bbb",
                      fontSize: "0.9em",
                      marginTop: "2px",
                    }}
                  >
                    {item.artist}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Score Badge */}
            <div
              style={{
                backgroundColor: scoreColor,
                color: "#000",
                padding: "4px 8px",
                borderRadius: "12px",
                minWidth: "40px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {scoreData.score.toFixed(1)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
