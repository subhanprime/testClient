import React, { useState, useEffect } from "react";
import axios from "axios";
import { URL, serverAdd } from "../config/index";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io(serverAdd);

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });
  }, []);

  const fetchUsers = async () => {
    try {
      setError("");
      setMessage("");
      const response = await axios.get(`${URL}/users`);
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again later.");
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async () => {
    if (newUser.name && newUser.email && newUser.password) {
      try {
        setError("");
        setMessage("");
        const response = await axios.post(`${URL}/users`, newUser);
        setUsers([...users, response.data.user]);
        setMessage(response.data.message || "User added successfully!");
        setNewUser({ name: "", email: "", password: "" });
        fetchUsers();
        toggleModal();
      } catch (error) {
        console.error("Error adding user:", error);
        setError("Failed to add user. Please check the inputs and try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-8 min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">User Management</h1>

      {message && (
        <p className="mb-4 text-green-600 text-center font-semibold bg-green-100 p-2 rounded-md">
          {message}
        </p>
      )}

      {error && (
        <p className="mb-4 text-red-600 text-center font-semibold bg-red-100 p-2 rounded-md">
          {error}
        </p>
      )}

      <button
        onClick={toggleModal}
        className="px-5 py-3 mb-4 text-lg font-semibold text-white transition-colors duration-300 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
      >
        + Add User
      </button>

      <button
        onClick={() => navigate("/chat")}
        className="px-5 py-3 mb-8 text-lg font-semibold text-white transition-colors duration-300 bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none"
      >
        Go to Chat
      </button>

      <button
        onClick={() => navigate("/fileupload")}
        className="px-5 py-3 mb-8 text-lg font-semibold text-white transition-colors duration-300 bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none"
      >
        Upload File
      </button>

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Users</h2>
        <ul>
          {users?.map((user) => (
            <li
              key={user?.id}
              className="flex justify-between items-center p-4 mb-3 bg-blue-50 rounded-lg shadow-sm hover:bg-blue-100 transition-colors"
            >
              <div>
                <p className="text-lg font-medium text-gray-800">
                  {user?.name}
                </p>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              Add New User
            </h2>
            <form className="space-y-5">
              <div>
                <label className="block mb-1 text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="px-4 py-2 mr-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddUser}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
