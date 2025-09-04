import { Navbar, Container, Button } from "react-bootstrap";
import { getUser, removeToken } from "../auth/auth";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>ChatApp</Navbar.Brand>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white">{user?.name}</span>
          <Button variant="danger" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}
