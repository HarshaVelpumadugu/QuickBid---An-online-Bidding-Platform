// AuthContext.js
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await axios.get("https://quickbid-backend.onrender.com/api/users/check-auth", {
          withCredentials: true,
        });
        setIsAuthenticated(res.status === 200);
      } catch {
        setIsAuthenticated(false);
      }
    };
    check();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
