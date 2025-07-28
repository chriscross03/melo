export default function handleRating({
  category,
  selectedCard,
  selectedType,
  ratings,
  setRatings,
  setShowModal,
  setShowComparison,
  setComparisonTarget,
  setBinaryCompareQueue,
  setBinaryIndexRange,
  ratedAlbums,
  ratedTracks,
  ratedArtists,
  albums,
  tracks,
  artists,
  setRatedAlbums,
  setRatedTracks,
  setRatedArtists,
}) {
  if (!selectedCard?.id || !selectedType) return;

  const id = selectedCard.id;

  const setRatedFn =
    selectedType === "album"
      ? setRatedAlbums
      : selectedType === "track"
      ? setRatedTracks
      : setRatedArtists;

  setRatedFn((prev) => {
    if (prev.find((item) => item.id === id)) return prev;
    return [...prev, selectedCard];
  });

  const sameCategoryIds = Object.keys(ratings).filter(
    (rid) =>
      rid !== id &&
      ratings[rid].category === category &&
      ratings[rid].type === selectedType
  );

  if (sameCategoryIds.length === 0) {
    let startScore =
      category === "fine" ? 5.0 : category === "disliked" ? 1.0 : 10.0;

    setRatings((prev) => ({
      ...prev,
      [id]: { category, score: startScore, type: selectedType },
    }));
    setShowModal(false);
    return;
  }

  const sortedIds = sameCategoryIds
    .map((id) => ({ id, score: ratings[id].score }))
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.id);

  setBinaryCompareQueue(sortedIds);
  setBinaryIndexRange([0, sortedIds.length - 1]);

  const allRated =
    selectedType === "album"
      ? ratedAlbums
      : selectedType === "track"
      ? ratedTracks
      : ratedArtists;

  const mid = Math.floor((0 + sortedIds.length - 1) / 2);
  const target =
    (selectedType === "album"
      ? albums
      : selectedType === "track"
      ? tracks
      : artists
    ).find((a) => a.id === sortedIds[mid]) ||
    allRated.find((a) => a.id === sortedIds[mid]);

  setComparisonTarget(target);
  setShowComparison(true);
  setShowModal(false);
}
