import skmeans from "skmeans";

const kmeans = (data: number[][], k: number) => {
  const result = skmeans(data, k);
  return result.centroids;
};

export default kmeans;
