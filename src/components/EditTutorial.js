import React, { useState, useEffect } from "react";
import api from "../api"; 
import "../styles/AddTutorial.css";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import "@mdxeditor/editor/style.css";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  UndoRedo,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  linkPlugin,
  linkDialogPlugin,
  CreateLink,
  InsertImage,
  imagePlugin,
  tablePlugin,
  InsertTable,
  markdownShortcutPlugin,
  Separator,
  BlockTypeSelect,
  CodeToggle,
} from "@mdxeditor/editor";

const EditTutorial = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const res = await api.get(`${baseURL}/tutorials/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
        setCategory(res.data.category);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tutorial:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get(`${baseURL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchTutorial();
    fetchCategories();
  }, [id, baseURL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.patch(`${baseURL}/tutorials/${id}`, {
      title,
      content,
      category,
    });
    navigate("/tutorials");
  };

  useEffect(() => {
    if (title && category && content) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [title, category, content]);

  if (isLoading) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Container maxWidth="lg" className="add-tutorial-container">
      <Paper elevation={3} className="add-tutorial-paper">
        <Box display="flex" justifyContent="space-between" marginBottom={2}>
          <TextField
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            style={{ marginRight: "1rem" }}
          />
          <TextField
            select
            label="Categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            margin="normal"
            style={{ marginLeft: "1rem" }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box className="add-tutorial-editor">
          <MDXEditor
            markdown={content}
            onChange={setContent}
            plugins={[
              tablePlugin(),
              imagePlugin({
                imageUploadHandler: async (file) => {
                  const formData = new FormData();
                  formData.append("image", file);

                  try {
                    const response = await api.post(`${baseURL}/upload`, formData, {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    });

                    const imageUrl = response.data.imageUrl;
                    return imageUrl;
                  } catch (error) {
                    console.error("Error uploading image:", error);
                    throw error;
                  }
                },
              }),
              linkPlugin(),
              linkDialogPlugin(),
              headingsPlugin(),
              listsPlugin(),
              linkPlugin(),
              quotePlugin(),
              markdownShortcutPlugin(),
              toolbarPlugin({
                toolbarContents: () => (
                  <>
                    <UndoRedo />
                    <Separator />
                    <BoldItalicUnderlineToggles />
                    <BlockTypeSelect />
                    <Separator />
                    <CreateLink />
                    <InsertTable />
                    <InsertImage />
                    <Separator />
                    <CodeToggle />
                  </>
                ),
              }),
            ]}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          className="add-tutorial-button"
          disabled={isButtonDisabled}
        >
          Guardar
        </Button>
      </Paper>
    </Container>
  );
};

export default EditTutorial;