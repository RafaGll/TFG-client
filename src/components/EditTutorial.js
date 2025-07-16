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
  codeBlockPlugin,
  InsertCodeBlock,
  sandpackPlugin,
  codeMirrorPlugin,
  StrikeThroughSupSubToggles,
  ListsToggle,
} from "@mdxeditor/editor";

const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

// Configuración de Sandpack para el editor de código
const simpleSandpackConfig = {
  defaultPreset: "react",
  presets: [
    {
      label: "React",
      name: "react",
      meta: "live react",
      sandpackTemplate: "react",
      sandpackTheme: "light",
      snippetFileName: "/App.js",
      snippetLanguage: "jsx",
      initialSnippetContent: defaultSnippetContent,
    },
  ],
};

// Componente principal
const EditTutorial = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [type, setType] = useState(""); // Nuevo estado para el tipo
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL;

  // Hook para cargar el tutorial y las categorías al iniciar el componente
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

    // Función para obtener todas las categorías del backend
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

  // Establecer el tipo inicial basado en la categoría cuando se cargan categorías y tutorial
  useEffect(() => {
    if (category && categories.length && !type) {
      const selectedCat = categories.find((cat) => cat._id === category);
      if (selectedCat) {
        setType(selectedCat.type);
      }
    }
  }, [category, categories, type]);

  // Restablecer la categoría cuando cambia el tipo
  useEffect(() => {
    if (type && category) {
      const selectedCat = categories.find((cat) => cat._id === category);
      if (selectedCat && selectedCat.type !== type) {
        setCategory("");
      }
    }
  }, [type, category, categories]);

  // Función para enviar el formulario al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.patch(`${baseURL}/tutorials/${id}`, {
      title,
      content,
      category,
    });
    navigate("/tutorials");
  };

  // Hook para habilitar/deshabilitar el botón de guardar
  useEffect(() => {
    if (title && type && category && content) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [title, type, category, content]);

  if (isLoading) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Container maxWidth="lg" className="add-tutorial-container">
      <Paper elevation={3} className="add-tutorial-paper">
        <hr></hr>
        <Box
          className="add-tutorial-editor"
          marginBottom={"-20px"}
          marginTop={"-20px"}
        >
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
                    const response = await api.post(
                      `${baseURL}/upload`,
                      formData,
                      {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );

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
              quotePlugin(),
              markdownShortcutPlugin(),
              codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
              sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
              codeMirrorPlugin({
                codeBlockLanguages: {
                  js: "JavaScript",
                  css: "CSS",
                  html: "HTML",
                  python: "Python",
                  java: "Java",
                  cpp: "C++",
                },
              }),
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
                    <ListsToggle />
                    <Separator />
                    <StrikeThroughSupSubToggles />
                    <Separator />
                    <CodeToggle />
                    <InsertCodeBlock />
                  </>
                ),
              }),
            ]}
          />
        </Box>
        <hr></hr>
        <Box className="info-tutorial">
          <TextField
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          {/* Nuevo campo para seleccionar el tipo */}
          <TextField
            select
            label="Tipo"
            value={type}
            onChange={(e) => setType(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Estructura de datos">Estructura de datos</MenuItem>
            <MenuItem value="Algoritmo">Algoritmo</MenuItem>
          </TextField>
          <TextField
            select
            label="Categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            margin="normal"
            disabled={!type} // Deshabilita el campo si no se ha seleccionado un tipo
          >
            {type ? (
              categories
                .filter((cat) => cat.type === type)
                .map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))
            ) : (
              <MenuItem disabled value="">
                Primero seleccione un tipo
              </MenuItem>
            )}
          </TextField>
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
