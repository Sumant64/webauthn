import { Request, Response } from 'express';
import User from '../../models/userModel';
import { generateRegistrationOptions } from '@simplewebauthn/server';

/**
 * @desc - initiation for the new user
 * @route - PUT - /api/auth/init-register
 * @access - public
 */
const initRegister = async (req: Request, res: Response): Promise<void> => {
    try {
        // user info
        const keys = Object.keys(req.body);
        const allowedKeys = ['name', 'phone', 'email'];
        const isValidOperation = allowedKeys.every((key) => keys.includes(key));

        if (!isValidOperation) {
            const missingKey = allowedKeys.filter((item) => {
                return !keys.includes(item);
            });

            res.status(400).send({ message: `${missingKey.toString()} keys are missing` });
            return;
        }

        // check the database for the phone number (user already exists)
        const user = await User.findOne({ phone: req.body.phone });

        if (user !== null) {
            res.status(400).send({ error: 'User already exists' });
            return;
        }

        const options = await generateRegistrationOptions({
            rpID: process.env.RP_ID || '',
            rpName: 'Fingerprint auth',
            userName: req.body.phone,
        });

        res.cookie(
            'regInfo',
            JSON.stringify({
                userId: options.user.id,
                phone: req.body['phone'],
                name: req.body['name'],
                email: req.body['email'],
                challenge: options.challenge,
            }),
            {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true,
                secure: true,
            }
        );

        res.status(200).send(options);
    } catch (error) {
        console.error('Error in initRegister:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};

export default initRegister;
