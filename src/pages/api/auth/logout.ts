import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Clear the cookies by setting their Max-Age to 0
        res.setHeader('Set-Cookie', [
            serialize('access_token', '', { httpOnly: true, path: '/', maxAge: 0 }),
            serialize('refresh_token', '', { httpOnly: true, path: '/', maxAge: 0 }),
            serialize('id_token', '', { httpOnly: true, path: '/', maxAge: 0 }),
        ]);

        res.status(200).json({ message: 'Logged out successfully' });
    } else {
        // If not a POST request, send 405 - Method Not Allowed
        res.status(405).end('Method Not Allowed');
    }
}
