import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    address: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        setFormData({
          name: res.data.name,
          phone: res.data.phone,
          gender: res.data.gender,
          address: res.data.address,
        });
        toast.success("User details loaded");
      })
      .catch(() => toast.error("Failed to load user details"));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/update",
        formData,
        { withCredentials: true }
      );
      setUser(res.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) {
      return;
    }
    try {
      await axios.delete("http://localhost:5000/api/users/delete", {
        withCredentials: true,
      });
      toast.success("Account deleted successfully");
      navigate("/register");
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <form onSubmit={handleUpdate}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <button type="submit">Update</button>
        </form>
      ) : (
        <p>Loading user details...</p>
      )}
      <button
        onClick={handleDelete}
        style={{ backgroundColor: "red", color: "white" }}
      >
        Delete Account
      </button>
    </div>
  );
};

export default Dashboard;
