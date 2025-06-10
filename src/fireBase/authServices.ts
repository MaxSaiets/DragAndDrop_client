import { signInWithPopup, fetchSignInMethodsForEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, type User } from "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserFromDatabase } from "../services/user"

export const registerUserWithEmailAndPassFireBase = async (email: string, password: string) => {
    const auth = getAuth();

    try {
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.length > 0) {
            const message = `The user with the email address ${email} already has an account. Please log in to your account.`;
            throw new Error(message);
        }  else {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userFireBase = userCredential.user;

            const token = await userFireBase.getIdToken();

            return {
                userData: {
                    name: userFireBase.displayName,
                    photoURL: userFireBase.photoURL,
                },
                email: userFireBase.email,
                token: token,
            };
        }
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};


export const loginUserWithEmailAndPassFireBase = async (email: string, password: string) => {
    try {
        const auth = getAuth();
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.length > 0) {
            const message = `The user with the email address ${email} already has an account. Please log in to your account.`;
            throw new Error(message);
        }  else {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userFireBase = userCredential.user;

            const token = await userFireBase.getIdToken();

            return {
                userData: {
                    name: userFireBase.displayName,
                    photoURL: userFireBase.photoURL,
                },
                email: userFireBase.email,
                token: token,
            };
        }
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const handleAuthGoogle = async () => {
    try {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        const result = await signInWithPopup(auth, provider);

        const userFireBase = result.user;
        const email = userFireBase.email || '';

        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods && methods.length > 0) {
            const message = "You are already registered with other credentials. Please sign in with an existing login method or merge your accounts.";
            throw new Error(message);
        }

        const token = await userFireBase.getIdToken();

        return {
            userData: {
                name: userFireBase.displayName,
                photoURL: userFireBase.photoURL,
            },
            email: userFireBase.email,
            token: token,
        };
    } catch (error) {
        console.error('Error during Google authentication:', error);
        throw error;
    }
};

export const handleAuthGitHub = async () => {
    try {
        const auth = getAuth();
        const provider = new GithubAuthProvider();

        const result = await signInWithPopup(auth, provider);
        const userFireBase = result.user;
        const email = userFireBase.email || '';

        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods && methods.length > 0) {
            const message = "You are already registered with other credentials. Please sign in with an existing login method or merge your accounts.";
            throw new Error(message);
        }
        const token = await userFireBase.getIdToken();

        return {
            userData: {
                name: userFireBase.displayName,
                photoURL: userFireBase.photoURL,
            },
            email: userFireBase.email,
            token: token,
        };
    } catch (error) {
        console.error('Error during GitHub authentication:', error);
        throw error;
    }
};

export const checkAuth = async (loginStatus: string, logout: () => Promise<void>): Promise<boolean> => {
    if(loginStatus === "succeeded"){
        const confirmMerge = window.confirm("You are already in system. Exit?");
        if(confirmMerge){
            await logout();
            return true;
        } else{
            return false;
        }
    }
    return true;
}

export const checkUserAuth = async() => {
    try {
        const auth = getAuth();
        
        const userFireBase: User | null = await new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                // console.log('Firebase auth state changed:', user);
                unsubscribe();
                resolve(user);
            }, reject);
        });

        if (userFireBase) {
            const token: string = await userFireBase.getIdToken();

            const response = await getUserFromDatabase(token);
            
            return {token, response};
        } else {
            console.log('No Firebase user found');
            return null;
        }
    } catch (error) {
        console.error("Error checking authentication:", error);
    }
}
