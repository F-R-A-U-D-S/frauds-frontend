interface LoginResponse {
  access_token: string; // adjust this based on your backend response
}

const API_URL = "http://127.0.0.1:8000/auth";

export const login = async (username: string, password: string): Promise<void> => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data: LoginResponse = await response.json();
  localStorage.setItem("access_token", data.access_token); // store JWT or session access_token
};

export async function registerUser(username: string, password: string) {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("User registration failed");
  }

  return response.json();
}
