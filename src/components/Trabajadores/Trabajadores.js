import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, IconButton, Button, Modal, Form, Schema, Message, toaster, SelectPicker } from "rsuite";
import { Link } from "react-router-dom";
import SearchIcon from "@rsuite/icons/Search";
import EditIcon from "@rsuite/icons/Edit";
import PlusIcon from "@rsuite/icons/Plus";
import TrashIcon from "@rsuite/icons/Trash";

const { Column, HeaderCell, Cell } = Table;
const { StringType, NumberType } = Schema.Types;

const Trabajadores = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [formValue, setFormValue] = useState({
    fullName: "",
    identityCard: "",
    rol: "",
    address: "",
    email: "",
    phone: "",
    codTrabajador: "",
  });
  const [currentTrabajador, setCurrentTrabajador] = useState(null);

  useEffect(() => {
    loadTrabajadores();
  }, []);

  const loadTrabajadores = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v2/trabajadores");
      setTrabajadores(response.data);
    } catch (error) {
      console.error("Error fetching trabajadores:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este trabajador?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/v2/trabajadores/${id}`);
        loadTrabajadores();
      } catch (error) {
        console.error("Error deleting trabajador:", error);
      }
    }
  };

  const handleEdit = (trabajador) => {
    setCurrentTrabajador(trabajador);
    setFormValue({
      fullName: trabajador.fullName,
      identityCard: trabajador.identityCard,
      rol: trabajador.rol,
      address: trabajador.address,
      email: trabajador.email,
      phone: trabajador.phone,
      codTrabajador: trabajador.codTrabajador,
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
    fullName: StringType().isRequired("El nombre del trabajador es requerido"),
    identityCard: StringType().isRequired("La cédula de identidad es requerida"),
    rol: StringType().isRequired("El rol es requerido"),
    address: StringType().isRequired("La dirección es requerida"),
    email: StringType()
      .isEmail("Ingrese un correo electrónico válido")
      .isRequired("El correo electrónico es requerido"),
    phone: StringType().isRequired("El número de teléfono es requerido"),
    codTrabajador: StringType().isRequired("El código del trabajador es requerido"),
  });

  const roles = [
    { label: "Arquitecto", value: "Arquitecto" },
    { label: "Obrero", value: "Obrero" },
    { label: "Ing. Civil", value: "Ing. Civil" },
    { label: "Administración", value: "Administracion" },
  ];

  const handleCreateTrabajador = async () => {
    try {
      await axios.post("http://localhost:8080/api/v2/trabajador", formValue);
      setShowModalCreate(false);
      loadTrabajadores();
      resetFormValue();
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Trabajador creado con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error creating trabajador:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al crear el trabajador.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const handleUpdateTrabajador = async () => {
    try {
      await axios.put(`http://localhost:8080/api/v2/trabajadores/${currentTrabajador.id}`, formValue);
      setShowModalEdit(false);
      loadTrabajadores();
      resetFormValue();
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Trabajador actualizado con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error updating trabajador:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al actualizar el trabajador.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const resetFormValue = () => {
    setFormValue({
      fullName: "",
      identityCard: "",
      rol: "",
      address: "",
      email: "",
      phone: "",
      codTrabajador: "",
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
        <h2>Trabajadores</h2>
        <Button
          style={{ backgroundColor: "#0E2442" }}
          appearance="primary"
          startIcon={<PlusIcon />}
          onClick={() => setShowModalCreate(true)}
        >
          Nuevo Trabajador
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
          En este módulo, puedes gestionar a los Trabajadores de la Constructora. Usa los botones a la derecha para
          gestionar la información del trabajador correspondiente. Para agregar un nuevo trabajador, haz clic en "Nuevo
          Trabajador".
        </p>
      </div>
      <div className="py-4">
        <Table height={400} wordWrap autoHeight data={trabajadores}>
          <Column width={100} align="center" fixed>
            <HeaderCell>Cod</HeaderCell>
            <Cell dataKey="codTrabajador" />
          </Column>

          <Column width={150}>
            <HeaderCell>Nombre</HeaderCell>
            <Cell dataKey="fullName" />
          </Column>
          <Column flexGrow={2}>
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="email" />
          </Column>

          <Column flexGrow={2}>
            <HeaderCell>Teléfono</HeaderCell>
            <Cell dataKey="phone" />
          </Column>

          <Column flexGrow={2}>
            <HeaderCell>Rol</HeaderCell>
            <Cell dataKey="rol" />
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

      {/* Modal para crear trabajador */}
      <Modal open={showModalCreate} onClose={() => setShowModalCreate(false)}>
        <Modal.Header>
          <Modal.Title>Nuevo Trabajador</Modal.Title>
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
            <Form.Group controlId="identityCard">
              <Form.ControlLabel>Cédula de Identidad</Form.ControlLabel>
              <Form.Control
                name="identityCard"
                value={formValue.identityCard}
                onChange={(value) => handleFormChange(value, "identityCard")}
              />
            </Form.Group>
            <Form.Group controlId="rol">
              <Form.ControlLabel>Rol</Form.ControlLabel>
              <Form.Control
                name="rol"
                accepter={SelectPicker}
                data={roles}
                value={formValue.rol}
                onChange={(value) => handleFormChange(value, "rol")}
                style={{ width: "100%" }}
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
            <Form.Group controlId="codTrabajador">
              <Form.ControlLabel>Código del Trabajador</Form.ControlLabel>
              <Form.Control
                name="codTrabajador"
                value={formValue.codTrabajador}
                onChange={(value) => handleFormChange(value, "codTrabajador")}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateTrabajador} appearance="primary">
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

      {/* Modal para editar trabajador */}
      <Modal open={showModalEdit} onClose={() => setShowModalEdit(false)}>
        <Modal.Header>
          <Modal.Title>Editar Trabajador</Modal.Title>
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
            <Form.Group controlId="identityCard">
              <Form.ControlLabel>Cédula de Identidad</Form.ControlLabel>
              <Form.Control
                name="identityCard"
                value={formValue.identityCard}
                onChange={(value) => handleFormChange(value, "identityCard")}
              />
            </Form.Group>
            <Form.Group controlId="rol">
              <Form.ControlLabel>Rol</Form.ControlLabel>
              <Form.Control
                name="rol"
                accepter={SelectPicker}
                data={roles}
                value={formValue.rol}
                onChange={(value) => handleFormChange(value, "rol")}
                style={{ width: "100%" }}
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
            <Form.Group controlId="codTrabajador">
              <Form.ControlLabel>Código del Trabajador</Form.ControlLabel>
              <Form.Control
                name="codTrabajador"
                value={formValue.codTrabajador}
                onChange={(value) => handleFormChange(value, "codTrabajador")}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpdateTrabajador} appearance="primary">
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

export default Trabajadores;