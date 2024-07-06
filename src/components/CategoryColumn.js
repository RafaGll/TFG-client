import React from "react";
import { IconButton, TextField, Box, Typography, Paper } from "@mui/material";
import { Edit, Save, Delete, Add } from "@mui/icons-material";

const CategoryColumn = ({
  title,
  categories,
  editCategoryId,
  editCategoryName,
  newCategoryName,
  newCategoryType,
  onEditClick,
  onSaveClick,
  onDeleteClick,
  onAddClick,
  onNewCategoryNameChange,
  onNewCategoryTypeChange,
  onEditCategoryNameChange,
  onAddSaveClick,
}) => (
  <Paper elevation={3} className="category-edit-column">
    <Box display="flex" alignItems="center"  marginBottom={1}>
      <Typography variant="h5">{title}</Typography>
      <IconButton color="primary" onClick={() => onAddClick(title)}>
        <Add />
      </IconButton>
    </Box>
    <ul style={{ listStyleType: "none", padding: 0 }}>
      {categories.map((category) => (
        <li key={category._id} style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
          {editCategoryId === category._id ? (
            <TextField
              value={editCategoryName}
              onChange={(e) => onEditCategoryNameChange(e.target.value)}
              onBlur={() => onSaveClick(category._id)}
              autoFocus
            />
          ) : (
            <Typography variant="body1">{category.name}</Typography>
          )}
          <IconButton
            color="primary"
            onClick={() => (editCategoryId === category._id ? onSaveClick(category._id) : onEditClick(category))}
            style={{ marginLeft: "10px" }}
          >
            {editCategoryId === category._id ? <Save /> : <Edit />}
          </IconButton>
          <IconButton
            color="error"
            onClick={() => onDeleteClick(category._id)}
          >
            <Delete />
          </IconButton>
        </li>
      ))}
      {newCategoryType === title && (
        <li style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
          <TextField
            value={newCategoryName}
            onChange={(e) => onNewCategoryNameChange(e.target.value)}
            placeholder="Nueva categoría"
            autoFocus
          />
          <IconButton color="primary" onClick={onAddSaveClick} style={{ marginLeft: "10px" }}>
            <Save />
          </IconButton>
        </li>
      )}
    </ul>
  </Paper>
);

export default CategoryColumn;