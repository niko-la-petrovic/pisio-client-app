import envVars from "./envVars";

function isErrorStatusCode(statusCode: number) {
  return statusCode >= 400;
}

export async function relativeApiMethodExecute(
  route: string,
  method: string,
): Promise<void> {
  const res = await fetch(`${envVars.API_URL.value}/${route}`, {
    method,
  });
  if (isErrorStatusCode(res.status)) throw await res.json();
}

export async function apiJsonSender<T>({
  route,
  method,
  body,
}: {
  route: string;
  method: string;
  body: any;
}): Promise<T> {
  const res = await fetch(`${envVars.API_URL.value}/${route}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (isErrorStatusCode(res.status)) throw await res.json();

  return await res.json();
}

export async function relativeApiQueryFetcher<T>(
  route: string,
  query: string,
): Promise<T> {
  if (route.startsWith("/")) throw new Error("Route must not start with /");
  const res = await fetch(`${envVars.API_URL.value}/${route}?${query}`, {});

  if (isErrorStatusCode(res.status)) throw await res.json();
  return await res.json();
}

export async function relativeApiFetcher<T>(route: string): Promise<T> {
  if (route.startsWith("/")) throw new Error("Route must not start with /");
  const res = await fetch(`${envVars.API_URL.value}/${route}`);
  if (isErrorStatusCode(res.status)) throw await res.json();
  return await res.json();
}

export async function apiFetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (isErrorStatusCode(res.status)) throw await res.json();
  return await res.json();
}
