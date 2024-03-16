import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUserData, setNewUserData] = useState({
    phone: "",
    email: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://client-admin-backend-jx3ada7jca-el.a.run.app/users/all"
        );
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateUser = async () => {
    try {
      if (
        !/^\d{10}$/.test(newUserData.phone) &&
        !/^\S+@\S+\.\S+$/.test(newUserData.phone)
      ) {
        setError(
          "Please enter a valid 10-digit phone number and a valid email."
        );
        return;
      }

      if (!/^\d{10}$/.test(newUserData.phone)) {
        setError("Please enter a valid 10-digit phone number.");
        return;
      }

      if (!/^\S+@\S+\.\S+$/.test(newUserData.email)) {
        setError("Please enter a valid email address.");
        return;
      }

      await fetch("https://client-admin-backend-jx3ada7jca-el.a.run.app/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      });

      const response = await fetch(
        "https://client-admin-backend-jx3ada7jca-el.a.run.app/users/all"
      );
      const data = await response.json();
      setUsers(data.users);
      setNewUserData({
        phone: "",
        email: "",
      });
      setError("");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await fetch(
        `https://client-admin-backend-jx3ada7jca-el.a.run.app/users/delete/${userId}`,
        {
          method: "DELETE",
        }
      );

      const response = await fetch(
        "https://client-admin-backend-jx3ada7jca-el.a.run.app/users/all"
      );
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUser = (phone) => {
    navigate(`/user/${phone}`, {
      state: { phone },
    });
  };

  return (
    <div className="users-container">
      <div className="users-left">
        <ul style={{ listStyle: "none" }}>
          {users.map((user, index) => (
            <li key={user._id} className="li-users">
              <div onClick={() => handleUser(user.phone)}>
                <span className="users-index">
                  {index}
                  {"->"}{" "}
                </span>
                <span className="users-ph-text">{user.phone}</span>
              </div>
              <button
                className="delete-btn-user"
                onClick={() => handleDeleteUser(user._id)}
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="users-right">
        <h1 className="user-text">Create User:</h1>
        <label>
          <span className="users-input-text">Phone:</span>
          <input
            type="text"
            name="phone"
            value={newUserData.phone}
            onChange={handleInputChange}
            className="users-input"
          />
        </label>
        <label>
          <span className="users-input-text users-email-padding">Email:</span>
          <input
            type="text"
            name="email"
            value={newUserData.email}
            onChange={handleInputChange}
            className="users-input"
          />
        </label>
        <span style={{ color: "red" }}>{error}</span>
        <button className="users-create-button" onClick={handleCreateUser}>
          <span className="users-create-button-text">Create User</span>
        </button>
      </div>
    </div>
  );
};

export default Users;
