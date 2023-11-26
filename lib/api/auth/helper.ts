import { jwtDecode } from "jwt-decode";

export function isAuthenticated() {
  const token = localStorage.getItem('access_token');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const exp = decoded.exp;
    let valid = false;

    if (exp) {
        valid = exp > Date.now() / 1000;
    }
    return valid;
  } catch (error) {
    return false;
  }
}
