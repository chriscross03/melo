// src/utils/finishComparison.js

export default function finishComparison({
  preferred,
  selectedCard,
  selectedType,
  comparisonTarget,
  binaryCompareQueue,
  binaryIndexRange,
  ratings,
  setRatings,
  setShowComparison,
  setBinaryCompareQueue,
  setBinaryIndexRange,
  setComparisonTarget,
  albums,
  tracks,
  artists,
  ratedAlbums,
  ratedTracks,
  ratedArtists,
}) {
  if (!comparisonTarget || !selectedCard) return;

  const id = selectedCard.id;
  const category = ratings[comparisonTarget.id].category;
  const type = selectedType;

  const sortedEntries = binaryCompareQueue
    .map((id) => ({
      id,
      score: ratings[id].score,
    }))
    .sort((a, b) => b.score - a.score);

  let [min, max] = binaryIndexRange;
  const mid = Math.floor((min + max) / 2);
  const midId = sortedEntries[mid].id;

  if (preferred.id === id) {
    max = mid - 1;
  } else {
    min = mid + 1;
  }

  if (min > max) {
    const newList = [...sortedEntries];
    newList.splice(min, 0, { id });

    let startScore =
      category === "fine" ? 5.0 : category === "disliked" ? 1.0 : 10.0;
    const newRatings = { ...ratings };

    for (let i = 0; i < newList.length; i++) {
      const itemId = newList[i].id;
      newRatings[itemId] = {
        category,
        score: parseFloat((startScore - i * 0.1).toFixed(2)),
        type,
      };
    }

    setRatings(newRatings);
    setShowComparison(false);
    setBinaryCompareQueue([]);
    return;
  }

  const nextMid = Math.floor((min + max) / 2);
  const nextId = sortedEntries[nextMid].id;

  const allRated =
    type === "album"
      ? ratedAlbums
      : type === "track"
      ? ratedTracks
      : ratedArtists;

  const nextTarget =
    (type === "album" ? albums : type === "track" ? tracks : artists).find(
      (a) => a.id === nextId
    ) || allRated.find((a) => a.id === nextId);

  setComparisonTarget(nextTarget);
  setBinaryIndexRange([min, max]);
}
