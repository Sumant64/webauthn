import { Request, Response } from 'express';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import User from '../../models/userModel';

/**
 * @desc - verify the authentication and challenge
 * @route - POST - /api/auth/verify-auth
 * @access - public
 */
const verifyAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        const authInfo = JSON.parse(req.cookies.authInfo);

        if (!authInfo) {
            res.status(400).send({ error: 'Authentication info not found' });
            return;
        }

        const user = await User.findById(authInfo.id);

        if (user === null || user.credentials.id != req.body.id) {
            res.status(400).send({ error: 'Invalid user' });
            return;
        }

        const verification = await verifyAuthenticationResponse({
            response: req.body,
            expectedChallenge: authInfo.challenge,
            expectedOrigin: process.env.CLIENT_URL || '',
            expectedRPID: process.env.RP_ID || '',
            authenticator: {
                credentialID: user.credentials.id
                    ? (Buffer.from(user.credentials.id).toString('base64url') as unknown as string)
                    : '',
                credentialPublicKey: user.credentials.publicKey
                    ? new Uint8Array(user.credentials.publicKey.buffer)
                    : new Uint8Array(), // convert mongodb buffer
                counter: user.credentials.counter || 0,
                // transports: user.credentials.transports,
            },
        });

        console.log(verification, 'verification 000000000000000');

        if (verification.verified) {
            const obj = new User(user);
            obj.credentials['counter'] = verification.authenticationInfo.newCounter;
            await obj.save();

            res.clearCookie('authInfo');
            res.status(200).send({ verified: verification.verified });
        } else {
            res.status(400).send({ error: 'Authentication verification failed' });
        }
    } catch (error) {
        console.error('Error in verifyAuth:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};

export default verifyAuth;
