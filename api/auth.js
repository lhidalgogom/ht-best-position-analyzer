import fetch from "node-fetch";
import { makeOAuth } from "../lib/oauth.js";

const REQUEST_TOKEN_URL = "https://api.hattrick.org/oauth/request_token.ashx";
const AUTHORIZE_URL     = "https://chpp.hattrick.org/oauth/authorize.aspx";

export default async function handler(req, res) {
  const { CHPP_CONSUMER_KEY, CHPP_CONSUMER_SECRET, PUBLIC_BASE_URL } = process.env;
  // PUBLIC_BASE_URL debe ser el dominio de Vercel, p.ej.: https://ht-best-position-analyzer.vercel.app
  const CALLBACK = `${PUBLIC_BASE_URL}/api/callback`;

  const oauth = makeOAuth(CHPP_CONSUMER_KEY, CHPP_CONSUMER_SECRET);

  const request_data = { url: REQUEST_TOKEN_URL, method: "POST", data: { oauth_callback: CALLBACK } };
  const headers = oauth.toHeader(oauth.authorize(request_data));

  const resp = await fetch(REQUEST_TOKEN_URL, { method: "POST", headers });
  const text = await resp.text(); // viene como querystring
  // ejemplo: oauth_token=...&oauth_token_secret=...&oauth_callback_confirmed=true
  const params = Object.fromEntries(new URLSearchParams(text));

  // redirigimos al consent de Hattrick
  const redirect = `${AUTHORIZE_URL}?oauth_token=${encodeURIComponent(params.oauth_token)}`;
  res.writeHead(302, { Location: redirect });
  res.end();
}
