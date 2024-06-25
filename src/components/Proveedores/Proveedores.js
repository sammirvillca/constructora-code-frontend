import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, IconButton, Modal, Form, Schema, Message, toaster } from "rsuite";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import PlusIcon from "@rsuite/icons/Plus";
import ListIcon from '@rsuite/icons/List';
import { API_BASE_URL } from "../../Config/Config";
const { Column, HeaderCell, Cell } = Table;
const { StringType, NumberType } = Schema.Types;

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [formValue, setFormValue] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    codProveedor: "",
  });
  const [currentProveedor, setCurrentProveedor] = useState(null);

  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v2/proveedores`);
      setProveedores(response.data);
    } catch (error) {
      console.error("Error fetching proveedores:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este proveedor?");
    if (confirmDelete) {
      try {
        await axios.delete(`${API_BASE_URL}/api/v2/proveedores/${id}`);
        loadProveedores();
      } catch (error) {
        console.error("Error deleting proveedor:", error);
      }
    }
  };

  const handleEdit = (proveedor) => {
    setCurrentProveedor(proveedor);
    setFormValue({
      name: proveedor.name,
      address: proveedor.address,
      city: proveedor.city,
      country: proveedor.country,
      phone: proveedor.phone,
      email: proveedor.email,
      codProveedor: proveedor.codProveedor,
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
    name: StringType().isRequired("El nombre del proveedor es requerido"),
    address: StringType().isRequired("La dirección es requerida"),
    city: StringType().isRequired("La ciudad es requerida"),
    country: StringType().isRequired("El país es requerido"),
    phone: StringType().isRequired("El número de teléfono es requerido"),
    email: StringType().isEmail("Ingrese un correo electrónico válido").isRequired("El correo electrónico es requerido"),
    codProveedor: StringType().isRequired("El código del proveedor es requerido"),
  });

  const handleCreateProveedor = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/v2/proveedor`, formValue);
      setShowModalCreate(false);
      loadProveedores();
      resetFormValue();
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Proveedor creado con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error creating proveedor:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al crear el proveedor.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const handleUpdateProveedor = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/v2/proveedores/${currentProveedor.id}`, formValue);
      setShowModalEdit(false);
      loadProveedores();
      resetFormValue();
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Proveedor actualizado con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error updating proveedor:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al actualizar el proveedor.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const resetFormValue = () => {
    setFormValue({
      name: "",
      address: "",
      city: "",
      country: "",
      phone: "",
      email: "",
      codProveedor: "",
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
        <h2>Proveedores</h2>
        <Button
          style={{ backgroundColor: "#0E2442" }}
          appearance="primary"
          startIcon={<PlusIcon />}
          onClick={() => setShowModalCreate(true)}
        >
          Nuevo Proveedor
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
          En este módulo, puedes gestionar los Proveedores de la Constructora. Usa los botones a la derecha para gestionar la información del proveedor correspondiente. Para agregar un nuevo proveedor, haz clic en "Nuevo Proveedor".
        </p>
      </div>
      <div className="py-4">
        <Table height={400} wordWrap autoHeight data={proveedores}>
          <Column width={100} align="center" fixed>
            <HeaderCell>Cod</HeaderCell>
            <Cell dataKey="codProveedor" />
          </Column>

          <Column width={150}>
            <HeaderCell>Nombre</HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column flexGrow={2}>
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="email" />
          </Column>
          <Column flexGrow={2}>
            <HeaderCell>Dirección</HeaderCell>
            <Cell dataKey="address" />
          </Column>
          <Column flexGrow={2}>
            <HeaderCell>Teléfono</HeaderCell>
            <Cell dataKey="phone" />
          </Column>

          <Column width={100} fixed="right">
            <HeaderCell>Catálogo</HeaderCell>
            <Cell>
              {(rowData) => (
                <Link to={`/proveedores/catalogo/${rowData.id}`}>
                  <IconButton appearance="default" icon={<ListIcon />}></IconButton>
                </Link>
              )}
            </Cell>
          </Column>

          <Column width={100} fixed="right">
            <HeaderCell>Editar</HeaderCell>
            <Cell>
              {(rowData) => (
                <IconButton appearance="subtle" icon={<EditIcon />} onClick={() => handleEdit(rowData)} />
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

      {/* Modal para crear proveedor */}
      <Modal open={showModalCreate} onClose={() => setShowModalCreate(false)}>
        <Modal.Header>
          <Modal.Title>Nuevo Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="name">
              <Form.ControlLabel>Nombre</Form.ControlLabel>
              <Form.Control
                name="name"
                value={formValue.name}
                onChange={(value) => handleFormChange(value, "name")}
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
            <Form.Group controlId="city">
              <Form.ControlLabel>Ciudad</Form.ControlLabel>
              <Form.Control
                name="city"
                value={formValue.city}
                onChange={(value) => handleFormChange(value, "city")}
              />
            </Form.Group>
            <Form.Group controlId="country">
              <Form.ControlLabel>País</Form.ControlLabel>
              <Form.Control
                name="country"
                value={formValue.country}
                onChange={(value) => handleFormChange(value, "country")}
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
            <Form.Group controlId="email">
              <Form.ControlLabel>Correo Electrónico</Form.ControlLabel>
              <Form.Control
                name="email"
                value={formValue.email}
                onChange={(value) => handleFormChange(value, "email")}
              />
            </Form.Group>
            <Form.Group controlId="codProveedor">
              <Form.ControlLabel>Código del Proveedor</Form.ControlLabel>
              <Form.Control
                name="codProveedor"
                value={formValue.codProveedor}
                onChange={(value) => handleFormChange(value, "codProveedor")}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateProveedor} appearance="primary">
            Crear
          </Button>
          <Button
            onClick={() => {
              setShowModalCreate(false);
              resetFormValue();
            }}
            appearance="subtle"
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar proveedor */}
      <Modal open={showModalEdit} onClose={() => setShowModalEdit(false)}>
        <Modal.Header>
          <Modal.Title>Editar Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="name">
              <Form.ControlLabel>Nombre</Form.ControlLabel>
              <Form.Control
                name="name"
                value={formValue.name}
                onChange={(value) => handleFormChange(value, "name")}
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
            <Form.Group controlId="city">
              <Form.ControlLabel>Ciudad</Form.ControlLabel>
              <Form.Control
                name="city"
                value={formValue.city}
                onChange={(value) => handleFormChange(value, "city")}
              />
            </Form.Group>
            <Form.Group controlId="country">
              <Form.ControlLabel>País</Form.ControlLabel>
              <Form.Control
                name="country"
                value={formValue.country}
                onChange={(value) => handleFormChange(value, "country")}
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
            <Form.Group controlId="email">
              <Form.ControlLabel>Correo Electrónico</Form.ControlLabel>
              <Form.Control
                name="email"
                value={formValue.email}
                onChange={(value) => handleFormChange(value, "email")}
              />
            </Form.Group>
            <Form.Group controlId="codProveedor">
              <Form.ControlLabel>Código del Proveedor</Form.ControlLabel>
              <Form.Control
                name="codProveedor"
                value={formValue.codProveedor}
                onChange={(value) => handleFormChange(value, "codProveedor")}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpdateProveedor} appearance="primary">
            Guardar Cambios
          </Button>
          <Button
            onClick={() => {
              setShowModalEdit(false);
              resetFormValue();
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

export default Proveedores;