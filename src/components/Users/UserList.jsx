import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { fetchUsers, deleteUser } from "../../services/api";
import UserCard from "./UserCard";
import EditUserForm from "./EditUserForm";
import toast from "react-hot-toast";
import {
  CircularProgress,
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

Modal.setAppElement("#root");

const UserList = () => {
  const [usersResponse, setUsersResponse] = useState({
    page: 1,
    per_page: 6,
    total: 0,
    total_pages: 0,
    data: [],
  });
  const [loading, setLoading] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await fetchUsers(usersResponse.page);
        setUsersResponse(response.data);
      } catch (error) {
        toast.error("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [usersResponse.page]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [usersResponse.page]);

  const handleDelete = async (id) => {
    setDeletingUserId(id);
    try {
      await deleteUser(id);
      setUsersResponse((prev) => ({
        ...prev,
        data: prev.data.filter((user) => user.id !== id),
        total: prev.total - 1,
      }));
      toast.success("User deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete user.");
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsersResponse((prev) => ({
      ...prev,
      data: prev.data.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      ),
    }));
    handleCloseModal();
  };

  const modalStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(5px)",
    },
    content: {
      position: "relative",
      top: "auto",
      left: "auto",
      right: "auto",
      bottom: "auto",
      maxWidth: "500px",
      width: "90%",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      border: "none",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <AppBar
        position="sticky"
        sx={{
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: "white",
          color: "black",
          px: 12,
          py: 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h4">User Management</Typography>
          <Button
            color="error"
            onClick={handleLogout}
            variant="contained"
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          p: 4,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-4 container mx-auto">
          {usersResponse.data.map((user) => (
            <UserCard
              user={user}
              onEdit={() => handleEdit(user)}
              onDelete={() => handleDelete(user.id)}
              isDeleting={deletingUserId === user.id}
            />
          ))}
        </div>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {/* User Range Information */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {(usersResponse.page - 1) * usersResponse.per_page + 1} to{" "}
            {Math.min(
              (usersResponse.page - 1) * usersResponse.per_page + usersResponse.data.length,
              usersResponse.total
            )}{" "}
            of {usersResponse.total} users
          </Typography>
        </Box>

        {/* Pagination Controls */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              setUsersResponse((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            disabled={usersResponse.page === 1}
            sx={{ mr: 2 }}
          >
            Previous
          </Button>

          {[...Array(usersResponse.total_pages)].map((_, index) => (
            <Button
              key={index}
              variant={
                index + 1 === usersResponse.page ? "contained" : "outlined"
              }
              color="primary"
              onClick={() =>
                setUsersResponse((prev) => ({ ...prev, page: index + 1 }))
              }
              sx={{
                mx: 0.5,
                minWidth: "40px",
                ...(index + 1 === usersResponse.page && {
                  bgcolor: "primary.main",
                  color: "white",
                }),
              }}
            >
              {index + 1}
            </Button>
          ))}

          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              setUsersResponse((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={usersResponse.page === usersResponse.total_pages}
            sx={{ ml: 2 }}
          >
            Next
          </Button>
        </Box>
      </Box>

      {/* Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={modalStyles}
        contentLabel="Edit User"
      >
        {editingUser && (
          <EditUserForm
            user={editingUser}
            onClose={handleCloseModal}
            onUpdate={handleUpdateUser}
          />
        )}
      </Modal>
    </Box>
  );
};

export default UserList;
