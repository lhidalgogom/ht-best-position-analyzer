import fetch from "node-fetch";
import { makeOAuth } from "../lib/oauth.js";

const ACCESS_TOKEN_URL = "https://api.hattrick.org/oauth/access_token.ashx";

// En un proyecto real, guardarías los tokens en DB o sesión.
// Para la aprobación CHPP basta con demostrar el endpoint y el flujo.

export default async function handler(req, res) {
  const { oauth_token, oauth_verifier } = req.query;
  const { CHPP_CONSUMER_KEY, CHPP_CONSUMER_SECRET } = process.env;

  const oauth = makeOAuth(CHPP_CONSUMER_KEY, CHPP_CONSUMER_SECRET);
  const request_data = { url: ACCESS_TOKEN_URL, method: "POST" };
  const headers = oauth.toHeader(oauth.authorize(request_data));

  // oauth_verifier va en el body o query según el proveedor; CHPP acepta POST x-www-form-urlencoded
  const body = new URLSearchParams({ oauth_token, oauth_verifier }).toString();

  const resp = await fetch(ACCESS_TOKEN_URL, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  const text = await resp.text(); // oauth_token=...&oauth_token_secret=...
  // TODO: guardar tokens seguros

  // vuelve a la web pública (GitHub Pages)
  res.writeHead(302, { Location: "https://lhidalgogom.github.io/ht-best-position-analyzer/success.html" });
  res.end();
}
