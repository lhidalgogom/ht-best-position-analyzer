import OAuth from "oauth-1.0a";
import crypto from "crypto";

export function makeOAuth(consumerKey, consumerSecret) {
  return new OAuth({
    consumer: { key: consumerKey, secret: consumerSecret },
    signature_method: "HMAC-SHA1",
    hash_function(base_string, key) {
      return crypto.createHmac("sha1", key).update(base_string).digest("base64");
    }
  });
}
