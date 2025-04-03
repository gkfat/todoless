import { Account } from '../types/account';
import { request } from './util/agent';

const agent = request('/api/v1/auth');

interface SignUpRequest {
    email: string;
    name: string;
    password: string;
}

interface SignInRequest {
    type: 'password'|'google',
    email: string;
    password: string;
    code?: string;
}

interface SignInResponse {
    account: Account;
    token: string;
}

interface SendVerificationCodeRequest {
    email: string;
}

interface VerifyCodeRequest {
    email: string;
    verificationCode: string;
}

export const AuthApi = {
    signUp: async (data: SignUpRequest) => {
        return agent({
            method: 'POST',
            url: '/sign-up',
            data,
        });
    },

    signIn: async (data: SignInRequest): Promise<SignInResponse> => {
        return agent({
            method: 'POST',
            url: '/login',
            data,
        });
    },

    sendVerificationCode(data: SendVerificationCodeRequest): Promise<void> {
        return agent({
            method: 'POST',
            url: '/send-verification-code',
            data,
        });
    },

    verifyCode(data: VerifyCodeRequest): Promise<void> {
        return agent({
            method: 'POST',
            url: '/verify-code',
            data,
        });
    },
};