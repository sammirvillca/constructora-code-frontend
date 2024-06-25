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
  SelectPicker
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

const Contratos = () => {
  const [contratos, setContratos] = useState([]);
  const [clientesNoVinculados, setClientesNoVinculados] = useState([]);
  const [planosNoVinculados, setPlanosNoVinculados] = useState([]);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [formValues, setFormValues] = useState({
    description: "",
    deadlines: "",
    prices: "",
    contractDocument: null,
    datosClienteId: "",
    dibujoPlanoId: "",
    codContrato: "",
  });
  const [selectedContrato, setSelectedContrato] = useState(null);
  const [clienteName, setClienteName] = useState("");

  useEffect(() => {
    loadContratos();
    fetchClientesNoVinculados();
    fetchPlanosNoVinculados();
  }, []);

  const loadContratos = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v2/contratos-planos`
      );
      setContratos(response.data);
    } catch (error) {
      console.error("Error fetching contratos:", error);
    }
  };

  const fetchClientesNoVinculados = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v2/propiedades-no-vinculados`
      );
      setClientesNoVinculados(response.data);
      console.log("Clientes no vinculados:", response.data);
    } catch (error) {
      console.error("Error fetching clientes no vinculados:", error);
    }
  };
  
  const fetchPlanosNoVinculados = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v2/dibujo-plano-no-vinculados`
      );
      setPlanosNoVinculados(response.data);
      console.log("Planos no vinculados:", response.data);
    } catch (error) {
      console.error("Error fetching planos no vinculados:", error);
    }
  };

  const handleInputChange = (value, field) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormValues({ ...formValues, [name]: files[0] });
  };

  const handleClienteChange = (value) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      datosClienteId: value,
    }));

    const selectedCliente = clientesNoVinculados.find(
      (cliente) => cliente.id === value
    );
    if (selectedCliente) {
      setClienteName(selectedCliente.groundDirection);
    } else {
      setClienteName("");
    }
  };

  const handlePlanoChange = (value) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      dibujoPlanoId: value,
    }));
  };

  const handlePreview = (rowData) => {
    setSelectedDocument(rowData.contractDocument);
  };

  const model = Schema.Model({
    description: StringType().isRequired("La descripción es requerida"),
    deadlines: StringType().isRequired("Las fechas límite son requeridas"),
    prices: NumberType().isRequired("El precio es requerido"),
    datosClienteId: NumberType().isRequired("El cliente es requerido"),
    dibujoPlanoId: NumberType().isRequired("El diseño de plano es requerido"),
    codContrato: StringType().isRequired("El código de contrato es requerido"),
  });

  const handleCreateContrato = async () => {
    try {
      const formData = new FormData();
      formData.append("description", formValues.description);
      formData.append("deadlines", formValues.deadlines);
      formData.append("prices", formValues.prices);
      formData.append("contractDocument", formValues.contractDocument);
      formData.append("datosClienteId", formValues.datosClienteId);
      formData.append("dibujoPlanoId", formValues.dibujoPlanoId);
      formData.append("codContrato", formValues.codContrato);

      await axios.post(
        `${API_BASE_URL}/api/v2/contrato-plano`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowModalCreate(false);
      loadContratos();
      resetForm();
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Contrato creado con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error creating contrato:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al crear el contrato.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const handleUpdateContrato = async () => {
    try {
      const formData = new FormData();
      formData.append("description", formValues.description);
      formData.append("deadlines", formValues.deadlines);
      formData.append("prices", formValues.prices);
      formData.append("contractDocument", formValues.contractDocument);
      formData.append("datosClienteId", formValues.datosClienteId);
      formData.append("dibujoPlanoId", formValues.dibujoPlanoId);
      formData.append("codContrato", formValues.codContrato);

      await axios.put(
        `${API_BASE_URL}/api/v2/contrato-planos/${selectedContrato.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowModalEdit(false);
      loadContratos();
      resetForm();
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Contrato actualizado con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error updating contrato:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al actualizar el contrato.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este contrato?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `${API_BASE_URL}/api/v2/contrato-planos/${id}`
        );
        loadContratos();
      } catch (error) {
        console.error("Error deleting contrato:", error);
      }
    }
  };

  const resetForm = () => {
    setFormValues({
      description: "",
      deadlines: "",
      prices: "",
      contractDocument: null,
      datosClienteId: "",
      dibujoPlanoId: "",
      codContrato: "",
    });
    setClienteName("");
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
        <h2>Contratos sobre Plano</h2>
        <Button
          style={{ backgroundColor: "#0E2442" }}
          appearance="primary"
          startIcon={<PlusIcon />}
          onClick={() => setShowModalCreate(true)}
        >
          Nuevo Contrato Plano
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
          En este módulo, puedes gestionar los Contratos sobre los Planos. Usa
          los botones a la derecha para gestionar la información del contrato
          correspondiente. Para agregar un nuevo contrato, haz clic en "Nuevo
          Contrato".
        </p>
      </div>
      <div className="py-4">
        <Table
          height={400}
          wordWrap
          autoHeight
          data={contratos}
          onRowClick={(rowData) => {
            console.log(rowData);
          }}
        >
          <Column width={100} align="center" fixed>
            <HeaderCell>Cod</HeaderCell>
            <Cell dataKey="codContrato" />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>Descripción</HeaderCell>
            <Cell dataKey="description" />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>Fechas Límite</HeaderCell>
            <Cell dataKey="deadlines" />
          </Column>

          <Column width={120} align="center" fixed>
            <HeaderCell>Precios</HeaderCell>
            <Cell dataKey="prices" />
          </Column>

          <Column flexGrow={1} align="center" fixed>
            <HeaderCell>Documento</HeaderCell>
            <Cell>
              {(rowData) =>
                rowData.contractDocument ? (
                  <a
                    href={`data:application/octet-stream;base64,${rowData.contractDocument}`}
                    download={`${rowData.codContrato}_Contrato.pdf`}
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
                    setSelectedContrato(rowData);
                    setFormValues({
                      description: rowData.description,
                      deadlines: rowData.deadlines,
                      prices: rowData.prices,
                      contractDocument: null,
                      datosClienteId: rowData.datosClienteId,
                      dibujoPlanoId: rowData.dibujoPlanoId,
                      codContrato: rowData.codContrato,
                    });
                    setClienteName(rowData.groundDirection);
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
          <Modal.Title>Nuevo Contrato</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="codContrato">
              <Form.ControlLabel>Código de Contrato</Form.ControlLabel>
              <Form.Control
                name="codContrato"
                value={formValues.codContrato}
                onChange={(value) => handleInputChange(value, "codContrato")}
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.ControlLabel>Descripción</Form.ControlLabel>
              <Form.Control
                name="description"
                value={formValues.description}
                accepter={Textarea}
                onChange={(value) => handleInputChange(value, "description")}
                rows={2}
                style={{ resize: "both", width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="deadlines">
              <Form.ControlLabel>Fechas Límites</Form.ControlLabel>
              <Form.Control
                name="deadlines"
                value={formValues.deadlines}
                accepter={Textarea}
                onChange={(value) => handleInputChange(value, "deadlines")}
                rows={2}
                style={{ resize: "both", width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="prices">
              <Form.ControlLabel>Precios</Form.ControlLabel>
              <Form.Control
                name="prices"
                value={formValues.prices}
                onChange={(value) => handleInputChange(value, "prices")}
              />
            </Form.Group>
            <Form.Group controlId="datosClienteId">
              <Form.ControlLabel>Propiedad</Form.ControlLabel>
              <Form.Control
                name="datosClienteId"
                value={formValues.datosClienteId}
                onChange={(value) => handleClienteChange(value)}
                accepter={SelectPicker}
                data={clientesNoVinculados.map((cliente) => ({
                  label: cliente.groundDirection,
                  value: cliente.id,
                }))}
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="dibujoPlanoId">
              <Form.ControlLabel>Cod del Plano</Form.ControlLabel>
              <Form.Control
                name="dibujoPlanoId"
                value={formValues.dibujoPlanoId}
                onChange={handlePlanoChange}
                accepter={SelectPicker}
                data={planosNoVinculados.map((plano) => ({
                  label: plano.codDiseño,
                  value: plano.id,
                }))}
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="contractDocument">
              <Form.ControlLabel>Documento de Contrato</Form.ControlLabel>
              <input
                type="file"
                className="form-control"
                id="contractDocument"
                name="contractDocument"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateContrato} appearance="primary">
            Crear
          </Button>
          <Button onClick={handleCloseModalCreate} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal open={showModalEdit} onClose={handleCloseModalEdit}>
        <Modal.Header>
          <Modal.Title>Editar Contrato</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="codContrato">
              <Form.ControlLabel>Código de Contrato</Form.ControlLabel>
              <Form.Control
                name="codContrato"
                value={formValues.codContrato}
                onChange={(value) => handleInputChange(value, "codContrato")}
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.ControlLabel>Descripción</Form.ControlLabel>
              <Form.Control
                name="description"
                value={formValues.description}
                accepter={Textarea}
                onChange={(value) => handleInputChange(value, "description")}
                rows={2}
                style={{ resize: "both", width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="deadlines">
              <Form.ControlLabel>Fechas Límites</Form.ControlLabel>
              <Form.Control
                name="deadlines"
                value={formValues.deadlines}
                accepter={Textarea}
                onChange={(value) => handleInputChange(value, "deadlines")}
                rows={2}
                style={{ resize: "both", width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="prices">
              <Form.ControlLabel>Precios</Form.ControlLabel>
              <Form.Control name="prices" value={formValues.prices} />
            </Form.Group>
            <Form.Group controlId="datosClienteId">
              <Form.ControlLabel>Propiedad</Form.ControlLabel>
              <Form.Control
                name="datosClienteId"
                value={formValues.datosClienteId}
                accepter={SelectPicker}
                data={clientesNoVinculados.map((cliente) => ({
                  label: cliente.groundDirection,
                  value: cliente.id,
                }))}
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="dibujoPlanoId">
              <Form.ControlLabel>Cod del Plano</Form.ControlLabel>
              <Form.Control
                name="dibujoPlanoId"
                value={formValues.dibujoPlanoId}
                onChange={handlePlanoChange}
                accepter={SelectPicker}
                data={planosNoVinculados.map((plano) => ({
                  label: plano.drawingType,
                  value: plano.id,
                }))}
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="contractDocument">
              <Form.ControlLabel>Documento de Contrato</Form.ControlLabel>
              <input
                type="file"
                className="form-control"
                id="contractDocument"
                name="contractDocument"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpdateContrato} appearance="primary">
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

export default Contratos;
