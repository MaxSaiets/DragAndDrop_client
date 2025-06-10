import { $host, $authHost } from "./index";
import {jwtDecode} from "jwt-decode";
import { handleAuthGoogle, handleAuthGitHub } from "../fireBase/authServices"

import type { IUser } from "../types";

export interface PartialUserData {
    name: string | null;
    photoURL: string | null;
  }

export const getOrsaveUserInDatabase = async (email: string, token: string, userData: PartialUserData) => {
    const {data} = await $host.post('api/user/getOrsaveNewUserInDatabase', {email, token, userData})
    return data;
}

export const getUserFromDatabase = async (firebaseToken: string): Promise<{user: IUser, token: string}> => {
    const {data} = await $host.post<{user: IUser, token: string}>('api/user/getUserFromDatabase', null, {
        headers: {
            authorization: `Bearer ${firebaseToken}`
        }
    })
    return data;
}

export const check = async (): Promise<IUser> => {
    const {data} = await $authHost.get<{user: IUser, token: string}>('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode<IUser>(data.token)
}

export const checkUserByEmail = async (email: string) => {
    const { data } = await $host.post('api/user/checkUserByEmail', { email: email.trim().toLowerCase() });
    return data;
}

export const loginWithGoogleApi = async () => {
    try {
        const userFireBase = await handleAuthGoogle();

        if (userFireBase) {
            return userFireBase;
        } else {
            console.log('No user data from Firebase (loginWithGoogleApi)');
            return null;
        }
    } catch (error) {
        return Promise.reject(error)
    }
}

export const loginWithGitHubApi = async () => {
    try {
        const userFireBase = await handleAuthGitHub();

        if (userFireBase) {
            return userFireBase;
        } else {
            console.log('No user data from Firebase (loginWithGitHubApi)');
            return null;
        }
    } catch (error) {
        return Promise.reject(error)
    }
}