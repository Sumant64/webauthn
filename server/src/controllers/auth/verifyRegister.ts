import { Request, Response } from 'express';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import User from '../../models/userModel';

/**
 * @desc - verify the new user and register it to the db
 * @route - POST - /api/auth/verify-register
 * @access - public
 */
const verifyRegister = async (req: Request, res: Response): Promise<void> => {
    try {
        const regInfo = JSON.parse(req.cookies.regInfo);
        console.log(regInfo, 'regInfo, 99999999999999');

        if (!regInfo) {
            res.status(400).send({ error: 'Registration info not found' });
            return;
        }

        const verification = await verifyRegistrationResponse({
            response: req.body,
            expectedChallenge: regInfo.challenge,
            expectedOrigin: process.env.CLIENT_URL || '',
            expectedRPID: process.env.RP_ID || '',
        });

        if (verification.registrationInfo) {
            console.log(verification.registrationInfo.credentialPublicKey, 'public key 888888888888');
        }

        if (verification.verified && verification.registrationInfo) {
            // create the user in db
            const obj = {
                name: regInfo.name,
                phone: regInfo.phone,
                email: regInfo.email,
                userId: regInfo.userId,
                credentials: {
                    id: verification.registrationInfo.credentialID,
                    publicKey: verification.registrationInfo.credentialPublicKey,
                    counter: verification.registrationInfo.counter,
                    deviceType: verification.registrationInfo.credentialDeviceType,
                    backedUp: verification.registrationInfo.credentialBackedUp,
                    transport: req.body.transports,
                },
            };

            const user = new User(obj);
            const result = await user.save();
            res.clearCookie('regInfo');
            res.status(201).send({ result, message: 'New user signed up successfully!' });
        } else {
            res.status(400).send({ verified: false, error: 'Verification failed' });
        }
    } catch (error) {
        console.error('Error in verifyRegister:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};

export default verifyRegister;
