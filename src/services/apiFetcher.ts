import envVars from "./envVars";

export async function relativeApiQueryFetcher<T>(
  route: string,
  query: string,
): Promise<T> {
  if (route.startsWith("/")) throw new Error("Route must not start with /");
  const res = await fetch(`${envVars.API_URL.value}/${route}?${query}`, {});
  return await res.json();
}

export async function relativeApiFetcher<T>(route: string): Promise<T> {
  if (route.startsWith("/")) throw new Error("Route must not start with /");
  const res = await fetch(`${envVars.API_URL.value}/${route}`);
  return await res.json();
}

export async function apiFetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  return await res.json();
}
