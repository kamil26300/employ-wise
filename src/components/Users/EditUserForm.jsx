import React, { useState } from "react";
import { updateUser } from "../../services/api";
import toast from "react-hot-toast";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EditUserForm = ({ user, onClose, onUpdate }) => {
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await updateUser(user.id, {
        first_name: firstName,
        last_name: lastName,
        email,
      });

      const updatedUser = { ...user, ...response.data };

      onUpdate(updatedUser);
      toast.success("User updated successfully.");
    } catch (error) {
      toast.error("Failed to update user.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      {/* Close Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Edit User</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          required
          variant="outlined"
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          required
          variant="outlined"
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          variant="outlined"
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isUpdating}
            sx={{ flexGrow: 1, mr: 1 }}
          >
            {isUpdating ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update"
            )}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            sx={{ flexGrow: 1, ml: 1 }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditUserForm;
