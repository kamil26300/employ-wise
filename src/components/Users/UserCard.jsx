import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const UserCard = ({ user, onEdit, onDelete, isDeleting }) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={user.avatar}
        alt={`${user.first_name} ${user.last_name}`}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
      </CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: 2,
          pt: 0,
          gap: 4,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={onEdit}
          startIcon={<EditIcon />}
          sx={{ flexGrow: 1 }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onDelete}
          startIcon={<DeleteOutlineIcon />}
          disabled={isDeleting}
          sx={{ flexGrow: 1 }}
        >
          {isDeleting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Delete"
          )}
        </Button>
      </Box>
    </Card>
  );
};

export default UserCard;
