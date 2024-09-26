import "./login.css";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase.js";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Notification from "../notification/notification";

const Login = () => {

    const [loading, setLoading] = useState(false);


    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const { username, email, password } = Object.fromEntries(formData);

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);

            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                id: res.user.uid,
                blocked: [],
            });

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: [],
            });
            toast.success("Account Created!")
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                console.error("Email already in use. Please try another.");
            } else {
                console.error(err);
                toast.error(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async(e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const { email, password } = Object.fromEntries(formData);

        try{
            const res = await signInWithEmailAndPassword(auth, email, password);
            console.log("User is signed in: ", res.user);
        }
        catch(err){
            console.log(err)
            toast.error(err.message)
        }
        finally{
            setLoading(false)
        }
    };

    return (
        <div className="login">
            <div className="item">
                <h2>Welcome back,</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Password" name="password" />
                    <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
                </form>
            </div>
            <div className="seperator"></div>
            <div className="item">
                <h2>Create Account</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file"></label>
                
                    <input type="text" placeholder="Username" name="username" />
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Password" name="password" />
                    <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
                </form>
            </div>
        </div>
    );
};

export default Login;


