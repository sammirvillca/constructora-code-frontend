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
} from "rsuite";
import { Link } from "react-router-dom";
import SearchIcon from "@rsuite/icons/Search";
import EditIcon from "@rsuite/icons/Edit";
import PlusIcon from "@rsuite/icons/Plus";
import TrashIcon from "@rsuite/icons/Trash";
import TextImageIcon from "@rsuite/icons/TextImage";
import PublicOpinionIcon from "@rsuite/icons/PublicOpinion";

const { Column, HeaderCell, Cell } = Table;
const { StringType } = Schema.Types;

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [formValue, setFormValue] = useState({
    fullName: "",
    address: "",
    email: "",
    phone: "",
    codCliente: "",
  });
  const [currentCliente, setCurrentCliente] = useState(null);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v2/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este cliente?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/v2/clientes/${id}`);
        loadClientes();
      } catch (error) {
        console.error("Error deleting cliente:", error);
      }
    }
  };

  const handleEdit = (cliente) => {
    setCurrentCliente(cliente);
    setFormValue({
      fullName: cliente.fullName,
      address: cliente.address,
      email: cliente.email,
      phone: cliente.phone,
      codCliente: cliente.codCliente,
    });
    setShowModalEdit(true);
  };

  const handleFormChange = (value, field) => {
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      [field]: value,
    }));
  };

  const model = Schema.Model({
    fullName: StringType().isRequired("El nombre del cliente es requerido"),
    address: StringType().isRequired("La dirección es requerida"),
    email: StringType()
      .isEmail("Ingrese un correo electrónico válido")
      .isRequired("El correo electrónico es requerido"),
    phone: StringType().isRequired("El número de teléfono es requerido"),
    codCliente: StringType().isRequired("El código del cliente es requerido"),
  });

  const handleCreateCliente = async () => {
    try {
      await axios.post("http://localhost:8080/api/v2/cliente", formValue);
      setShowModalCreate(false);
      loadClientes();
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Cliente creado con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error creating cliente:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al crear el cliente.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const handleUpdateCliente = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/v2/clientes/${currentCliente.id}`,
        formValue
      );
      setShowModalEdit(false);
      loadClientes();
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Cliente actualizado con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error updating cliente:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al actualizar el cliente.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  // Function to reset form values
  const resetFormValue = () => {
    setFormValue({
      fullName: "",
      address: "",
      email: "",
      phone: "",
      codCliente: "",
    });
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
        <h2>Clientes</h2>
        <Button
          style={{ backgroundColor: "#0E2442" }}
          appearance="primary"
          startIcon={<PlusIcon />}
          onClick={() => {
            resetFormValue();
            setShowModalCreate(true);
          }}
        >
          Nuevo Cliente
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
          En este módulo, puedes gestionar a los Clientes de la Constructora.
          Usa los botones a la derecha para gestionar la información del cliente
          correspondiente. Para agregar un nuevo cliente, haz clic en "Nuevo
          Cliente".
        </p>
      </div>
      <div className="py-4">
        <Table
          height={400}
          wordWrap
          autoHeight
          data={clientes}
          onRowClick={(rowData) => {
            console.log(rowData);
          }}
        >
          <Column width={80} align="center" fixed>
            <HeaderCell>Cod</HeaderCell>
            <Cell dataKey="codCliente" />
          </Column>

          <Column width={150}>
            <HeaderCell>Nombre</HeaderCell>
            <Cell dataKey="fullName" />
          </Column>
          <Column flexGrow={2}>
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="email" />
          </Column>

          <Column width={100}>
            <HeaderCell>Teléfono</HeaderCell>
            <Cell dataKey="phone" />
          </Column>

          <Column flexGrow={2}>
            <HeaderCell>Dirección</HeaderCell>
            <Cell dataKey="address" />
          </Column>

          <Column width={100} fixed="right">
            <HeaderCell>Requisitos</HeaderCell>
            <Cell>
              {(rowData) => (
                <Link to={`/clientes/prerequisitos-plano/${rowData.id}`}>
                  <IconButton
                    appearance="default"
                    icon={<PublicOpinionIcon />}
                  ></IconButton>
                </Link>
              )}
            </Cell>
          </Column>

          <Column width={100} fixed="right">
            <HeaderCell>Propiedades</HeaderCell>
            <Cell>
              {(rowData) => (
                <Link to={`/clientes/propiedades/${rowData.id}`}>
                  <IconButton
                    appearance="default"
                    icon={<TextImageIcon />}
                  ></IconButton>
                </Link>
              )}
            </Cell>
          </Column>

          <Column width={100} fixed="right">
            <HeaderCell>Editar</HeaderCell>
            <Cell>
              {(rowData) => (
                <IconButton
                  appearance="subtle"
                  icon={<EditIcon />}
                  onClick={() => handleEdit(rowData)}
                />
              )}
            </Cell>
          </Column>

          <Column width={100} fixed="right">
            <HeaderCell>Eliminar</HeaderCell>
            <Cell>
              {(rowData) => (
                <IconButton
                  appearance="subtle"
                  icon={<TrashIcon />}
                  onClick={() => handleDelete(rowData.id)}
                />
              )}
            </Cell>
          </Column>
        </Table>
      </div>

      {/* Modal para crear cliente */}
      <Modal
        open={showModalCreate}
        onClose={() => {
          resetFormValue();
          setShowModalCreate(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>Nuevo Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="fullName">
              <Form.ControlLabel>Nombre</Form.ControlLabel>
              <Form.Control
                name="fullName"
                value={formValue.fullName}
                onChange={(value) => handleFormChange(value, "fullName")}
              />
            </Form.Group>
            <Form.Group controlId="address">
              <Form.ControlLabel>Dirección</Form.ControlLabel>
              <Form.Control
                name="address"
                value={formValue.address}
                onChange={(value) => handleFormChange(value, "address")}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.ControlLabel>Correo Electrónico</Form.ControlLabel>
              <Form.Control
                name="email"
                value={formValue.email}
                onChange={(value) => handleFormChange(value, "email")}
              />
            </Form.Group>
            <Form.Group controlId="phone">
              <Form.ControlLabel>Teléfono</Form.ControlLabel>
              <Form.Control
                name="phone"
                value={formValue.phone}
                onChange={(value) => handleFormChange(value, "phone")}
              />
            </Form.Group>
            <Form.Group controlId="codCliente">
              <Form.ControlLabel>Código del Cliente</Form.ControlLabel>
              <Form.Control
                name="codCliente"
                value={formValue.codCliente}
                onChange={(value) => handleFormChange(value, "codCliente")}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateCliente} appearance="primary">
            Crear
          </Button>
          <Button
            onClick={() => {
              resetFormValue();
              setShowModalCreate(false);
            }}
            appearance="subtle"
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar cliente */}
      <Modal
        open={showModalEdit}
        onClose={() => {
          resetFormValue();
          setShowModalEdit(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>Editar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="fullName">
              <Form.ControlLabel>Nombre</Form.ControlLabel>
              <Form.Control
                name="fullName"
                value={formValue.fullName}
                onChange={(value) => handleFormChange(value, "fullName")}
              />
            </Form.Group>
            <Form.Group controlId="address">
              <Form.ControlLabel>Dirección</Form.ControlLabel>
              <Form.Control
                name="address"
                value={formValue.address}
                onChange={(value) => handleFormChange(value, "address")}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.ControlLabel>Correo Electrónico</Form.ControlLabel>
              <Form.Control
                name="email"
                value={formValue.email}
                onChange={(value) => handleFormChange(value, "email")}
              />
            </Form.Group>
            <Form.Group controlId="phone">
              <Form.ControlLabel>Teléfono</Form.ControlLabel>
              <Form.Control
                name="phone"
                value={formValue.phone}
                onChange={(value) => handleFormChange(value, "phone")}
              />
            </Form.Group>
            <Form.Group controlId="codCliente">
              <Form.ControlLabel>Código del Cliente</Form.ControlLabel>
              <Form.Control
                name="codCliente"
                value={formValue.codCliente}
                onChange={(value) => handleFormChange(value, "codCliente")}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpdateCliente} appearance="primary">
            Guardar Cambios
          </Button>
          <Button
            onClick={() => {
              resetFormValue();
              setShowModalEdit(false);
            }}
            appearance="subtle"
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Clientes;
