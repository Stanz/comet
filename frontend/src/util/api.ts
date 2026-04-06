import ky from "ky";
import * as v from "valibot";

export const apiClient = ky.create({
  timeout: 10000,
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          // Handle unauthorized, maybe redirect to login or throw specific error
          throw new Error("UNAUTHORIZED");
        }
      },
    ],
  },
});

/**
 * Performs a GET request and validates the JSON response against a Valibot schema.
 */
export async function validatedGet<T>(
  url: string,
  schema: v.GenericSchema<any, T>,
  options?: Parameters<typeof apiClient.get>[1],
): Promise<T> {
  const json = await apiClient.get(url, options).json();
  const result = v.safeParse(schema, json);
  if (result.success) {
    return result.output;
  }
  throw result.issues[0].message;
}

/**
 * Performs a POST request and validates the JSON response against a Valibot schema.
 */
export async function validatedPost<T>(
  url: string,
  schema: v.GenericSchema<any, T>,
  options?: Parameters<typeof apiClient.post>[1],
): Promise<T> {
  const json = await apiClient.post(url, options).json();
  return v.parse(schema, json);
}

/**
 * Performs a PATCH request and validates the JSON response against a Valibot schema.
 */
export async function validatedPatch<T>(
  url: string,
  schema: v.GenericSchema<any, T>,
  options?: Parameters<typeof apiClient.patch>[1],
): Promise<T> {
  const json = await apiClient.patch(url, options).json();
  return v.parse(schema, json);
}

/**
 * Performs a DELETE request and validates the JSON response against a Valibot schema.
 */
export async function validatedDelete<T>(
  url: string,
  schema: v.GenericSchema<any, T>,
  options?: Parameters<typeof apiClient.delete>[1],
): Promise<T> {
  const json = await apiClient.delete(url, options).json();
  return v.parse(schema, json);
}
