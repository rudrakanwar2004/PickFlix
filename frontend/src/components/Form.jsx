import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../css/Form.css";
import LoadingIndicator from "./LoadingIndicator.jsx";
import logo from "../assets/logo.png";
import { useMovieContext } from "../contexts/MovieContext";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { fetchFavorites } = useMovieContext();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const normalizedUsername = username.toLowerCase();
        const payload = method === "login"
            ? { username: normalizedUsername, password }
            : { username: normalizedUsername, password };        

        try {
            const res = await api.post(route, payload);
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                localStorage.setItem("username", normalizedUsername); // <--- Add this
                await fetchFavorites(); // Fetch favorites after login
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            alert("Invalid credentials.");
        } finally {
            setLoading(false)
        }
    };
    
    return (
        <div className="logos">
            <br />
            <center><img src={logo} alt="Logo" className="logo" width={140} height={140} /></center>
            <form onSubmit={handleSubmit} className="form-container">
                <h1>{name}</h1>
                <input
                    className="form-input"
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Email"
                />




                <input
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                {loading && <LoadingIndicator />}
                <button className="form-button" type="submit">
                    {name}
                </button>
                
                {method === "login" && (
                    <p style={{ marginTop: "10px" }}>
                        Don’t have an account? <a href="/register">Sign Up</a>
                    </p>
                )}

                {method === "register" && (
                    <p style={{ marginTop: "10px" }}>
                        Already have an account? <a href="/login">Sign In</a>
                    </p>
                )}
            </form>
        </div>
    );
}

export default Form;