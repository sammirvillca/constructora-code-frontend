import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Table,
  IconButton,
  Modal,
  Form,
  Schema,
  Message,
  toaster,
  Input,
  SelectPicker,
} from "rsuite";
import { FileUpload } from "rsuite";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import FileDownloadIcon from "@rsuite/icons/FileDownload";
import PlusIcon from "@rsuite/icons/Plus";
import VisibleIcon from '@rsuite/icons/Visible';
import { API_BASE_URL } from "../../Config/Config";


const { Column, HeaderCell, Cell } = Table;
const { StringType, NumberType } = Schema.Types;
const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));

const ContratoConstruccion = () => {
  const [contratoConstrucciones, setContratoConstrucciones] = useState([]);
  const [proyectosNoVinculados, setProyectosNoVinculados] = useState([]);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [formValues, setFormValues] = useState({
    constructionDoc: null,
    proyectoId: "",
    codContConstruccion: "",
  });
  const [selectedContrato, setSelectedContrato] = useState(null);

  useEffect(() => {
    loadContratoConstrucciones();
    loadProyectosNoVinculados();
    loadProyectos();
  }, []);

  const handlePreview = (rowData) => {
    setSelectedDocument(rowData.constructionDoc);
  };

  const loadProyectos = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v2/proyectos`
      );
      setProyectos(response.data);
    } catch (error) {
      console.error("Error fetching proyectos:", error);
    }
  };

  const loadContratoConstrucciones = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v2/contratos-construcciones`
      );
      const contratosData = response.data;

      // Obtener los detalles de los proyectos vinculados a cada contrato
      const contratosConProyectos = await Promise.all(
        contratosData.map(async (contrato) => {
          const proyectoResponse = await axios.get(
            `${API_BASE_URL}/api/v2/proyecto/${contrato.proyectoId}`
          );
          const proyecto = proyectoResponse.data;
          return { ...contrato, proyecto };
        })
      );

      setContratoConstrucciones(contratosConProyectos);
    } catch (error) {
      console.error("Error fetching contratos de construcción:", error);
    }
  };

  const loadProyectosNoVinculados = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v2/proyectos-no-vinculados`
      );
      setProyectosNoVinculados(response.data);
    } catch (error) {
      console.error("Error fetching proyectos no vinculados:", error);
    }
  };

  const handleInputChange = (value, field) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormValues({ ...formValues, [name]: files[0] });
  };

  const handleProyectoChange = (value) => {
    setFormValues((formValues) => ({
      ...formValues,
      proyectoId: value,
    }));
  };

  const model = Schema.Model({
    proyectoId: NumberType().isRequired("El proyecto es requerido"),
    codContConstruccion: StringType().isRequired(
      "El código de contrato es requerido"
    ),
  });

  const handleCreateContratoConstruccion = async () => {
    try {
      const formData = new FormData();
      formData.append("constructionDoc", formValues.constructionDoc);
      formData.append("proyectoId", formValues.proyectoId);
      formData.append("codContConstruccion", formValues.codContConstruccion);

      await axios.post(
        `${API_BASE_URL}/api/v2/contrato-construccion`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowModalCreate(false);
      loadContratoConstrucciones();
      resetForm();
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Contrato de construcción creado con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error creating contrato de construcción:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al crear el contrato de construcción.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const handleUpdateContratoConstruccion = async () => {
    try {
      const formData = new FormData();
      formData.append("constructionDoc", formValues.constructionDoc);
      formData.append("proyectoId", formValues.proyectoId);
      formData.append("codContConstruccion", formValues.codContConstruccion);

      await axios.put(
        `${API_BASE_URL}/api/v2/contrato-construcciones/${selectedContrato.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowModalEdit(false);
      loadContratoConstrucciones();
      resetForm();
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Contrato de construcción actualizado con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error updating contrato de construcción:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al actualizar el contrato de construcción.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este contrato de construcción?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `${API_BASE_URL}/api/v2/contrato-construcciones/${id}`
        );
        loadContratoConstrucciones();
      } catch (error) {
        console.error("Error deleting contrato de construcción:", error);
      }
    }
  };

  const resetForm = () => {
    setFormValues({
      constructionDoc: null,
      proyectoId: "",
      codContConstruccion: "",
    });
  };

  const handleCloseModalCreate = () => {
    resetForm();
    setShowModalCreate(false);
  };

  const handleCloseModalEdit = () => {
    resetForm();
    setShowModalEdit(false);
  };
  return (
    <div className="container" style={{ margin: "0 auto", maxWidth: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          padding: "10px",
        }}
      >
        <h2>Contratos de Construcción</h2>
        <Button
          style={{ backgroundColor: "#0E2442" }}
          appearance="primary"
          startIcon={<PlusIcon />}
          onClick={() => setShowModalCreate(true)}
        >
          Nuevo Contrato de Construcción
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          padding: "10px",
        }}
      >
        <p>
          En este módulo, puedes gestionar los Contratos de Construcción. Usa
          los botones a la derecha para gestionar la información del contrato
          correspondiente. Para agregar un nuevo contrato, haz clic en "Nuevo
          Contrato de Construcción".
        </p>
      </div>
      <div className="py-4">
        <Table
          height={400}
          wordWrap
          autoHeight
          data={contratoConstrucciones}
          onRowClick={(rowData) => {
            console.log(rowData);
          }}
        >
          <Column width={100} align="center" fixed>
            <HeaderCell>Cod</HeaderCell>
            <Cell dataKey="codContConstruccion" />
          </Column>

          <Column flexGrow={1} align="center" fixed>
            <HeaderCell>Documento</HeaderCell>
            <Cell>
              {(rowData) =>
                rowData.constructionDoc ? (
                  <a
                    href={`data:application/octet-stream;base64,${rowData.constructionDoc}`}
                    download={`${rowData.codContConstruccion}_Contrato.pdf`}
                  >
                    <FileDownloadIcon />
                  </a>
                ) : (
                  <span>No disponible</span>
                )
              }
            </Cell>
          </Column>

          <Column width={100} fixed="right">
            <HeaderCell>Vista previa</HeaderCell>
            <Cell>
              {(rowData) => (
                <IconButton
                  icon={<VisibleIcon />}
                  appearance="subtle"
                  onClick={() => handlePreview(rowData)}
                />
              )}
            </Cell>
          </Column>

          {/* Columna para Editar */}
          <Column width={100} fixed="right">
            <HeaderCell>Editar</HeaderCell>
            <Cell>
              {(rowData) => (
                <IconButton
                  icon={<EditIcon />}
                  appearance="subtle"
                  onClick={() => {
                    const proyecto = proyectos.find(
                      (p) => p.id === rowData.proyectoId
                    );
                    setSelectedContrato(rowData);
                    setFormValues({
                      constructionDoc: null,
                      proyectoId: proyecto ? proyecto.id : "",
                      codContConstruccion: rowData.codContConstruccion,
                    });
                    setShowModalEdit(true);
                  }}
                />
              )}
            </Cell>
          </Column>

          {/* Columna para Eliminar */}
          <Column width={100} fixed="right">
            <HeaderCell>Eliminar</HeaderCell>
            <Cell>
              {(rowData) => (
                <IconButton
                  icon={<TrashIcon />}
                  appearance="subtle"
                  onClick={() => handleDelete(rowData.id)}
                />
              )}
            </Cell>
          </Column>
        </Table>
      </div>

      <Modal open={showModalCreate} onClose={handleCloseModalCreate}>
        <Modal.Header>
          <Modal.Title>Nuevo Contrato de Construcción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="codContConstruccion">
              <Form.ControlLabel>Código de Contrato</Form.ControlLabel>
              <Form.Control
                name="codContConstruccion"
                value={formValues.codContConstruccion}
                onChange={(value) =>
                  handleInputChange(value, "codContConstruccion")
                }
              />
            </Form.Group>
            <Form.Group controlId="proyectoId">
              <Form.ControlLabel>Cod de Proyecto</Form.ControlLabel>
              <Form.Control
                name="proyectoId"
                value={formValues.proyectoId}
                onChange={(value) => handleProyectoChange(value)}
                accepter={SelectPicker}
                data={proyectosNoVinculados.map((proyecto) => ({
                  label: proyecto.codProyecto,
                  value: proyecto.id,
                }))}
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="constructionDoc">
              <Form.ControlLabel>Documento de Contrato</Form.ControlLabel>
              <input
                type="file"
                className="form-control"
                id="constructionDoc"
                name="constructionDoc"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleCreateContratoConstruccion}
            appearance="primary"
          >
            Crear
          </Button>
          <Button onClick={handleCloseModalCreate} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal open={showModalEdit} onClose={handleCloseModalEdit}>
        <Modal.Header>
          <Modal.Title>Editar Contrato de Construcción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="codContConstruccion">
              <Form.ControlLabel>Código de Contrato</Form.ControlLabel>
              <Form.Control
                name="codContConstruccion"
                value={formValues.codContConstruccion}
                onChange={(value) =>
                  handleInputChange(value, "codContConstruccion")
                }
              />
            </Form.Group>
            <Form.Group controlId="proyectoId">
              <Form.ControlLabel>Cod de Proyecto</Form.ControlLabel>
              <Form.Control
                name="proyectoId"
                value={formValues.proyectoId}
                onChange={(value) => handleProyectoChange(value)}
                accepter={SelectPicker}
                data={proyectos.map((proyecto) => ({
                  label: proyecto.codProyecto,
                  value: proyecto.id,
                }))}
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="constructionDoc">
              <Form.ControlLabel>Documento de Contrato</Form.ControlLabel>
              <input
                type="file"
                className="form-control"
                id="constructionDoc"
                name="constructionDoc"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleUpdateContratoConstruccion}
            appearance="primary"
          >
            Guardar
          </Button>
          <Button onClick={handleCloseModalEdit} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        open={selectedDocument !== null}
        onClose={() => setSelectedDocument(null)}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>Vista previa del documento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDocument && (
            <embed
              src={`data:application/pdf;base64,${selectedDocument}`}
              type="application/pdf"
              width="100%"
              height="600px"
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setSelectedDocument(null)} appearance="subtle">
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ContratoConstruccion;
