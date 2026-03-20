import { Request, Response } from 'express';
import User from '../../models/userModel';
import { generateAuthenticationOptions } from '@simplewebauthn/server';

/**
 * @desc - generate the challenge
 * @route - GET - /api/auth/init-auth
 * @access - public
 */
const initAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        // user info
        const phone = req.query.phone as string;
        console.log(phone, 'phone ==========');

        if (!phone) {
            res.status(400).send({ error: 'Phone is required' });
            return;
        }

        // check the database for the phone number (user already exists)
        const user = await User.findOne({ phone: phone });

        if (user === null) {
            res.status(400).send({ error: 'User does not exists' });
            return;
        }

        // ensure credentials exist
        if (!user.credentials || !user.credentials.id) {
            res.status(500).send({ error: 'User credentials missing' });
            return;
        }

        

        const options = await generateAuthenticationOptions({
            rpID: process.env.RP_ID || '',
            allowCredentials: [
                {
                    id: user.credentials.id as unknown as string,
                    // type: "public-key",
                    // transports: user.passKey.transports,
                },
            ],
        });

        res.cookie(
            'authInfo',
            JSON.stringify({
                userId: user.userId,
                id: user._id,
                challenge: options.challenge,
            }),
            { 
                httpOnly: true,
                secure: true,
                sameSite: "none"
             }
        );

        res.status(200).send(options);
    } catch (error) {
        console.error('Error in initAuth:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};

export default initAuth;
