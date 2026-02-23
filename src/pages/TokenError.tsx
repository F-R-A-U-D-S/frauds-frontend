
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./TokenError.css"; // Create this css file next

export default function TokenError() {
    const location = useLocation();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("Unknown error");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const error = params.get("error");
        if (error) {
            setErrorMessage(error);
        }
    }, [location]);

    return (
        <div className="token-error-container">
            <div className="token-error-card">
                <h1 className="error-title">Export Failed</h1>
                <p className="error-description">
                    Masked ID: {errorMessage === "Token expired" ? "The download link has expired." : errorMessage}
                </p>
                <p className="error-detail">
                    {errorMessage === "Token expired" && "For security reasons, download links are only valid for 30 minutes."}
                </p>

                <div className="error-actions">
                    <button className="btn-primary" onClick={() => navigate("/")}>
                        Return to Dashboard
                    </button>
                    {/* Optional: Add a 'Request New Export' button if we can link it easily */}
                </div>
            </div>
        </div>
    );
}
