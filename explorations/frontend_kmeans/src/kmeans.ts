import skmeans from "skmeans";

function samplePixels(data: number[][], sampleSize = 250_000) {
  if (data.length <= sampleSize) return data;
  const sampled: number[][] = [];
  for (let i = 0; i < sampleSize; i++) {
    sampled.push(data[Math.floor(Math.random() * data.length)]);
  }
  return sampled;
}

const kmeans = (data: number[][], k: number, sampleSize = 250_000) => {
  const sampled = samplePixels(data, sampleSize);
  const result = skmeans(sampled, k);
  return result.centroids;
};

export default kmeans;
