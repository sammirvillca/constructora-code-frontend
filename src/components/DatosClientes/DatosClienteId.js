import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Table, IconButton, Button, Modal, Form, Schema, Message, toaster } from "rsuite";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import ArrowLeftIcon from "@rsuite/icons/ArrowLeft";
import CreditCardPlusIcon from "@rsuite/icons/CreditCardPlus";
import FileDownloadIcon from "@rsuite/icons/FileDownload";
import PlusIcon from "@rsuite/icons/Plus";
import VisibleIcon from '@rsuite/icons/Visible';
import axios from "axios";
import { API_BASE_URL } from "../../Config/Config";
const { Column, HeaderCell, Cell } = Table;
const { StringType } = Schema.Types;

const DatosClienteId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [datosCliente, setDatosCliente] = useState([]);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [editedDatosClienteId, setEditedDatosClienteId] = useState(null);
  const [formValues, setFormValues] = useState({
    groundDirection: "",
    landArea: "",
    typeConstruction: "",
    propertyDoc: null,
  });

  useEffect(() => {
    fetchDatosCliente();
  }, []);

  const fetchDatosCliente = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v2/clientes/propiedades/${id}`);
      console.log("Datos del cliente recibidos:", response.data);
      setDatosCliente(response.data);
    } catch (error) {
      console.error("Error fetching datos cliente:", error);
    }
  };

  const deleteDatosCliente = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v2/datos-clientes/${id}`);
      setDatosCliente(datosCliente.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting datos cliente:", error);
    }
  };

  const handlePreview = (rowData) => {
    setSelectedDocument(rowData.propertyDoc);
  };

  const handleInputChange = (value, field) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormValues({ ...formValues, [name]: files[0] });
  };

  const model = Schema.Model({
    groundDirection: StringType().isRequired("La dirección es requerida"),
    landArea: StringType().isRequired("El área del terreno es requerida"),
    typeConstruction: StringType().isRequired("El tipo de construcción es requerido"),
  });

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("groundDirection", formValues.groundDirection);
    formData.append("landArea", formValues.landArea);
    formData.append("typeConstruction", formValues.typeConstruction);
    if (formValues.propertyDoc) {
      formData.append("propertyDoc", formValues.propertyDoc);
    }
    formData.append("clienteId", id);

    try {
      if (editedDatosClienteId) {
        await axios.put(`${API_BASE_URL}/api/v2/datos-clientes/${editedDatosClienteId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setDatosCliente((prevDatosCliente) =>
          prevDatosCliente.map((item) => (item.id === editedDatosClienteId ? { ...item, ...formValues } : item))
        );
        toaster.push(
          <Message type="success" header="Éxito" duration={5000}>
            Datos del cliente actualizados con éxito.
          </Message>,
          { placement: "topEnd" }
        );
      } else {
        const response = await axios.post(`${API_BASE_URL}/api/v2/datos-cliente`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setDatosCliente([...datosCliente, response.data]);
        toaster.push(
          <Message type="success" header="Éxito" duration={5000}>
            Datos del cliente creados con éxito.
          </Message>,
          { placement: "topEnd" }
        );
      }
      setShowModalCreate(false);
      setShowModalEdit(false);
      setEditedDatosClienteId(null);
      resetFormValues();
    } catch (error) {
      console.error("Error saving datos cliente:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al guardar los datos del cliente.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const handleViewDeposits = (propiedadId) => {
    navigate(`/clientes/propiedades/depositos/${propiedadId}`, {
      state: { clienteId: id },
    });
  };

  const handleEditDatosCliente = (rowData) => {
    setEditedDatosClienteId(rowData.id);
    setFormValues({
      groundDirection: rowData.groundDirection,
      landArea: rowData.landArea,
      typeConstruction: rowData.typeConstruction,
      propertyDoc: null,
    });
    setShowModalEdit(true);
  };

  const handleDeleteDatosCliente = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar estos datos del cliente?")) {
      deleteDatosCliente(id);
    }
  };

  const resetFormValues = () => {
    setFormValues({
      groundDirection: "",
      landArea: "",
      typeConstruction: "",
      propertyDoc: null,
    });
    document.getElementById("propertyDoc").value = "";
  };

  const handleCloseModal = () => {
    setShowModalCreate(false);
    setShowModalEdit(false);
    setEditedDatosClienteId(null);
    resetFormValues();
  };

  return (
    <div className="container" style={{ margin: "0 auto", maxWidth: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <h2>Datos del Cliente</h2>
        <div>
          <Button
            style={{ backgroundColor: "#0E2442", marginRight: "10px" }}
            appearance="primary"
            startIcon={<PlusIcon />}
            onClick={() => setShowModalCreate(true)}
          >
            Registrar Nueva Propiedad
          </Button>
          <Button
            style={{ backgroundColor: "#0E2442" }}
            appearance="primary"
            startIcon={<ArrowLeftIcon />}
            as={Link}
            to="/clientes"
          >
            Volver a Clientes
          </Button>
        </div>
      </div>

      <div className="py-4">
        <Table
          height={400}
          wordWrap
          autoHeight
          data={datosCliente}
          onRowClick={(rowData) => {
            console.log(rowData);
          }}
        >
          <Column width={50} align="center" fixed>
            <HeaderCell>#</HeaderCell>
            <Cell>{(rowData, rowIndex) => <span>{rowIndex + 1}</span>}</Cell>
          </Column>

          <Column flexGrow={2}>
            <HeaderCell>Dirección</HeaderCell>
            <Cell dataKey="groundDirection" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Área del Terreno</HeaderCell>
            <Cell dataKey="landArea" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Tipo de Construcción</HeaderCell>
            <Cell dataKey="typeConstruction" />
          </Column>
          <Column flexGrow={1} fixed="right">
            <HeaderCell>Documento Propiedad</HeaderCell>
            <Cell>
              {(rowData) =>
                rowData.propertyDoc ? (
                  <a
                    href={`data:application/pdf;base64,${rowData.propertyDoc}`}
                    download={`DocumentoPropiedad_Cod${rowData.id}.pdf`}
                  >
                    <IconButton icon={<FileDownloadIcon />} appearance="link" />
                  </a>
                ) : (
                  "No disponible"
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

          <Column width={100} fixed="right">
            <HeaderCell>Depositos</HeaderCell>
            <Cell>
              {(rowData) => (
                <IconButton
                  appearance="default"
                  icon={<CreditCardPlusIcon />}
                  onClick={() => handleViewDeposits(rowData.id)}
                ></IconButton>
              )}
            </Cell>
          </Column>
          <Column width={100} fixed="right">
            <HeaderCell>Editar</HeaderCell>
            <Cell>
              {(rowData) => (
                <IconButton
                  appearance="default"
                  icon={<EditIcon />}
                  onClick={() => handleEditDatosCliente(rowData)}
                />
              )}
            </Cell>
          </Column>
          <Column width={100} fixed="right">
            <HeaderCell>Eliminar</HeaderCell>
            <Cell>
              {(rowData) => (
                <IconButton
                  appearance="default"
                  icon={<TrashIcon />}
                  onClick={() => handleDeleteDatosCliente(rowData.id)}
                />
              )}
            </Cell>
          </Column>
        </Table>
      </div>

      {/* Modal para crear datos cliente */}
      <Modal open={showModalCreate} onClose={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>Registrar Nueva Propiedad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="groundDirection">
              <Form.ControlLabel>Dirección</Form.ControlLabel>
              <Form.Control
                name="groundDirection"
                value={formValues.groundDirection}
                onChange={(value) => handleInputChange(value, "groundDirection")}
              />
            </Form.Group>
            <Form.Group controlId="landArea">
              <Form.ControlLabel>Área del Terreno</Form.ControlLabel>
              <Form.Control
                name="landArea"
                value={formValues.landArea}
                onChange={(value) => handleInputChange(value, "landArea")}
              />
            </Form.Group>
            <Form.Group controlId="typeConstruction">
              <Form.ControlLabel>Tipo de Construcción</Form.ControlLabel>
              <Form.Control
                name="typeConstruction"
                value={formValues.typeConstruction}
                onChange={(value) => handleInputChange(value, "typeConstruction")}
              />
            </Form.Group>
            <Form.Group controlId="propertyDoc">
              <Form.ControlLabel>Documento Propiedad</Form.ControlLabel>
              <input
                type="file"
                className="form-control"
                id="propertyDoc"
                name="propertyDoc"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary">
            Agregar
          </Button>
          <Button onClick={handleCloseModal} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar datos cliente */}
      <Modal open={showModalEdit} onClose={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>Editar Datos Propiedad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="groundDirection">
              <Form.ControlLabel>Dirección</Form.ControlLabel>
              <Form.Control
                name="groundDirection"
                value={formValues.groundDirection}
                onChange={(value) => handleInputChange(value, "groundDirection")}
              />
            </Form.Group>
            <Form.Group controlId="landArea">
              <Form.ControlLabel>Área del Terreno</Form.ControlLabel>
              <Form.Control
                name="landArea"
                value={formValues.landArea}
                onChange={(value) => handleInputChange(value, "landArea")}
              />
            </Form.Group>
            <Form.Group controlId="typeConstruction">
              <Form.ControlLabel>Tipo de Construcción</Form.ControlLabel>
              <Form.Control
                name="typeConstruction"
                value={formValues.typeConstruction}
                onChange={(value) => handleInputChange(value, "typeConstruction")}
              />
            </Form.Group>
            <Form.Group controlId="propertyDoc">
              <Form.ControlLabel>Documento Propiedad</Form.ControlLabel>
              <input
                type="file"
                className="form-control"
                id="propertyDoc"
                name="propertyDoc"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary">
            Guardar
          </Button>
          <Button onClick={handleCloseModal} appearance="subtle">
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

export default DatosClienteId;