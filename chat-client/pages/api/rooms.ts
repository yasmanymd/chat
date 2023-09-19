import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { getToken } from "next-auth/jwt"

export default async function rooms(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    const { method } = req;
    const accessToken = await getToken({ req })
    const url = process.env.CHAT_API_URL;
    const baseUrl = url?.indexOf('http') === 0 ? url : `https://${url}`;
    let response, result;

    switch (method) {
      case 'GET':
        response = await fetch(encodeURI(baseUrl + '/rooms'), {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          method: 'GET'
        });
        result = await response.json();
        res.status(200).json(result);
        break;
      case 'POST':
        response = await fetch(encodeURI(baseUrl + '/rooms'), {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          method: 'POST',
          body: JSON.stringify(req.body)
        });
        result = await response.json();
        res.status(200).json(result);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({
          status: 405,
          message: 'Method not allowed'
        });
        break;
    }
  } else {
    // Not Signed in
    res.status(401)
  }
  res.end()
};