export async function fetchWithTimeout<T>(
  duration: number,
  promise: Promise<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timerId = setTimeout(() => {
      reject(new Error("An error occurred on fetchWithTimeout function"));
    }, duration);

    promise
      .then((data) => resolve(data))
      .catch((err) => {
        console.error(err);
        reject(err);
      })
      .finally(() => clearTimeout(timerId));
  });
}
