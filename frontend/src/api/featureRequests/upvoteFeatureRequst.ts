import { z } from "zod";
import config from "../../config";
import { getToken } from "../../services/supabase";

const zodSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    featureRequestId: z.string(),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
]);

const upvoteFeatureRequest = async (featureRequestId: string) => {
  const tokenResponse = await getToken();

  if (!tokenResponse) {
    return {
      success: false,
      error: "No token",
    } as const;
  }

  const response = await fetch(`${config.apiUrl}/feature_requests/upvote`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenResponse.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feature_request_id: featureRequestId }),
  });

  const data = await response.json();
  return zodSchema.parse(data);
};

export default upvoteFeatureRequest;
