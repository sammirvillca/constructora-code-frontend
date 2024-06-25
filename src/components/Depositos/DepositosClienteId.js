import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Table, IconButton, Button, Modal, Form, Schema, Message, toaster } from "rsuite";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import ArrowLeftIcon from "@rsuite/icons/ArrowLeft";
import FileDownloadIcon from "@rsuite/icons/FileDownload";
import PlusIcon from "@rsuite/icons/Plus";
import VisibleIcon from '@rsuite/icons/Visible';
import axios from "axios";
import { SelectPicker, DatePicker } from "rsuite";
import moment from "moment";



const { Column, HeaderCell, Cell } = Table;
const { StringType, DateType } = Schema.Types;

const DepositosClienteId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const clienteId = location.state?.clienteId;
  const [depositosCliente, setDepositosCliente] = useState([]);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [editedDepositoId, setEditedDepositoId] = useState(null);
  const [formValues, setFormValues] = useState({
    payDetails: "",
    payMethod: "",
    payDate: "",
    payPhoto: null,
  });

  useEffect(() => {
    fetchDepositosCliente();
  }, []);

  const fetchDepositosCliente = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v2/clientes/propiedades/depositos/${id}`
      );
      console.log("Depositos del cliente recibidos:", response.data);
      setDepositosCliente(response.data);
    } catch (error) {
      console.error("Error fetching depositos cliente:", error);
    }
  };

  const deleteDepositoCliente = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v2/depositos-cliente/${id}`);
      setDepositosCliente(depositosCliente.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting deposito cliente:", error);
    }
  };

  const handleInputChange = (value, field) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormValues({ ...formValues, [name]: files[0] });
  };

  const handlePreview = (rowData) => {
    setSelectedDocument(rowData.payPhoto);
  };

  const model = Schema.Model({
    payDetails: StringType().isRequired("Los detalles del pago son requeridos"),
    payMethod: StringType().isRequired("El método de pago es requerido"),
    payDate: DateType().isRequired("La fecha de pago es requerida"),
  });

  const payMethodOptions = [
    { label: "Transferencia bancaria", value: "Transferencia bancaria" },
    { label: "Pago al contado", value: "Pago al contado" },
    { label: "Pago a plazos", value: "Pago a plazos" },
  ];

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("payDetails", formValues.payDetails);
    formData.append("payMethod", formValues.payMethod);
    formData.append("payDate", moment(formValues.payDate).format("YYYY-MM-DD"));
    if (formValues.payPhoto) {
      formData.append("payPhoto", formValues.payPhoto);
    }
    formData.append("datosClienteId", id);

    try {
      if (editedDepositoId) {
        await axios.put(`http://localhost:8080/api/v2/depositos-cliente/${editedDepositoId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setDepositosCliente((prevDepositos) =>
          prevDepositos.map((item) => (item.id === editedDepositoId ? { ...item, ...formValues } : item))
        );
        toaster.push(
          <Message type="success" header="Éxito" duration={5000}>
            Depósito del cliente actualizado con éxito.
          </Message>,
          { placement: "topEnd" }
        );
      } else {
        const response = await axios.post("http://localhost:8080/api/v2/deposito-cliente", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setDepositosCliente([...depositosCliente, response.data]);
        toaster.push(
          <Message type="success" header="Éxito" duration={5000}>
            Depósito del cliente creado con éxito.
          </Message>,
          { placement: "topEnd" }
        );
      }
      setShowModalCreate(false);
      setShowModalEdit(false);
      setEditedDepositoId(null);
      resetFormValues();
    } catch (error) {
      console.error("Error saving deposito cliente:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al guardar el depósito del cliente.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const handleEditDeposito = (rowData) => {
    setEditedDepositoId(rowData.id);
    setFormValues({
      payDetails: rowData.payDetails,
      payMethod: rowData.payMethod,
      payDate: moment(rowData.payDate).format("YYYY-MM-DD"),
      payPhoto: null,
    });
    setShowModalEdit(true);
  };

  const handleDeleteDeposito = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este depósito?")) {
      deleteDepositoCliente(id);
    }
  };

  const resetFormValues = () => {
    setFormValues({
      payDetails: "",
      payMethod: "",
      payDate: "",
      payPhoto: null,
    });
    document.getElementById("payPhoto").value = "";
  };

  const handleCloseModal = () => {
    setShowModalCreate(false);
    setShowModalEdit(false);
    setEditedDepositoId(null);
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
        <h2>Depositos del Cliente</h2>
        <div>
          <Button
            style={{ backgroundColor: "#0E2442", marginRight: "10px" }}
            appearance="primary"
            startIcon={<PlusIcon />}
            onClick={() => setShowModalCreate(true)}
          >
            Agregar Depósito
          </Button>
          <Button
            style={{ backgroundColor: "#0E2442" }}
            appearance="primary"
            startIcon={<ArrowLeftIcon />}
            onClick={() => navigate(`/clientes/propiedades/${clienteId}`)}
          >
            Volver a Propiedades
          </Button>
        </div>
      </div>

      <div className="py-4">
        <Table
          height={400}
          wordWrap
          autoHeight
          data={depositosCliente}
          onRowClick={(rowData) => {
            console.log(rowData);
          }}
        >
          <Column width={50} align="center" fixed>
            <HeaderCell>#</HeaderCell>
            <Cell>{(rowData, rowIndex) => <span>{rowIndex + 1}</span>}</Cell>
          </Column>

          <Column flexGrow={2}>
            <HeaderCell>Detalles del Pago</HeaderCell>
            <Cell dataKey="payDetails" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Método de Pago</HeaderCell>
            <Cell dataKey="payMethod" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Fecha de Pago</HeaderCell>
            <Cell dataKey="payDate" />
          </Column>
          <Column flexGrow={1} fixed="right">
            <HeaderCell>Comprobante de Pago</HeaderCell>
            <Cell>
              {(rowData) =>
                rowData.payPhoto ? (
                  <a
                    href={`data:application/pdf;base64,${rowData.payPhoto}`}
                    download={`ComprobantePago_Cod${rowData.id}.pdf`}
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
            <HeaderCell>Editar</HeaderCell>
            <Cell>
              {(rowData) => (
                <IconButton
                  appearance="default"
                  icon={<EditIcon />}
                  onClick={() => handleEditDeposito(rowData)}
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
                  onClick={() => handleDeleteDeposito(rowData.id)}
                />
              )}
            </Cell>
          </Column>
        </Table>
      </div>

      {/* Modal para crear depósito cliente */}
      <Modal open={showModalCreate} onClose={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>Agregar Depósito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="payDetails">
              <Form.ControlLabel>Detalles de Pago</Form.ControlLabel>
              <Form.Control
                name="payDetails"
                value={formValues.payDetails}
                onChange={(value) => handleInputChange(value, "payDetails")}
              />
            </Form.Group>
            <Form.Group controlId="payMethod">
              <Form.ControlLabel>Método de Pago</Form.ControlLabel>
              <Form.Control
                name="payMethod"
                accepter={SelectPicker}
                data={payMethodOptions}
                value={formValues.payMethod}
                onChange={(value) => handleInputChange(value, "payMethod")}
                block
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="payDate">
              <Form.ControlLabel>Fecha de Pago</Form.ControlLabel>
              <Form.Control
                name="payDate"
                accepter={DatePicker}
                value={formValues.payDate}
                onChange={(value) => handleInputChange(value, "payDate")}
                oneTap
                block
                style={{ width: "100%" }}
                format="yyyy-MM-dd"
              />
            </Form.Group>
            <Form.Group controlId="payPhoto">
              <Form.ControlLabel>Comprobante de Pago</Form.ControlLabel>
              <input
                type="file"
                className="form-control"
                id="payPhoto"
                name="payPhoto"
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

      {/* Modal para editar depósito cliente */}
      <Modal open={showModalEdit} onClose={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>Editar Depósito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="payDetails">
              <Form.ControlLabel>Detalles de Pago</Form.ControlLabel>
              <Form.Control
                name="payDetails"
                value={formValues.payDetails}
                onChange={(value) => handleInputChange(value, "payDetails")}
              />
            </Form.Group>
            <Form.Group controlId="payMethod">
              <Form.ControlLabel>Método de Pago</Form.ControlLabel>
              <Form.Control
                name="payMethod"
                accepter={SelectPicker}
                data={payMethodOptions}
                value={formValues.payMethod}
                onChange={(value) => handleInputChange(value, "payMethod")}
                block
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="payDate">
              <Form.ControlLabel>Fecha de Pago</Form.ControlLabel>
              <Form.Control
                name="payDate"
                accepter={DatePicker}
                value={moment(formValues.payDate).toDate()}
                onChange={(value) => handleInputChange(value, "payDate")}
                oneTap
                block
                style={{ width: "100%" }}
                format="yyyy-MM-dd"
              />
            </Form.Group>
            <Form.Group controlId="payPhoto">
              <Form.ControlLabel>Comprobante de Pago</Form.ControlLabel>
              <input
                type="file"
                className="form-control"
                id="payPhoto"
                name="payPhoto"
                onChange={handleFileChange}
              />
              <small className="form-text text-muted">
                Archivo actual:{" "}
                {depositosCliente.find((item) => item.id === editedDepositoId)?.payPhoto?.name || "N/A"}
              </small>
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

export default DepositosClienteId;