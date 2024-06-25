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
  DatePicker,
  SelectPicker,
  Tag,
} from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import PlusIcon from "@rsuite/icons/Plus";
import TrashIcon from "@rsuite/icons/Trash";

const { Column, HeaderCell, Cell } = Table;
const { StringType, DateType, NumberType } = Schema.Types;

const Entrega = () => {
  const [entregas, setEntregas] = useState([]);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [formValue, setFormValue] = useState({
    codEntrega: "",
    deadline: null,
    proyectoId: null,
  });
  const [currentEntrega, setCurrentEntrega] = useState(null);
  const [proyectosSinEntrega, setProyectosSinEntrega] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [proyectosCompletados, setProyectosCompletados] = useState([]);

  useEffect(() => {
    loadEntregas();
    loadProyectosSinEntrega();
    loadProyectos();
    loadClientes();
    loadProyectosCompletados();
  }, []);

  const resetForm = () => {
    setFormValue({
      codEntrega: "",
      deadline: null,
      proyectoId: null,
    });
  };
  const loadProyectos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v2/proyectos"
      );
      setProyectos(response.data);
    } catch (error) {
      console.error("Error fetching proyectos:", error);
    }
  };

  const loadClientes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v2/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    }
  };

  const loadEntregas = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v2/entregas");
      console.log("Entregas recibidas:", response.data);
      setEntregas(
        response.data.map((entrega) => ({
          ...entrega,
          proyectoCodProyecto: entrega.proyecto?.codProyecto,
          clienteFullName: entrega.cliente?.fullName,
        }))
      );
    } catch (error) {
      console.error("Error fetching entregas:", error);
    }
  };

  const loadProyectosSinEntrega = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v2/proyectos-sin-entrega"
      );
      setProyectosSinEntrega(response.data);
    } catch (error) {
      console.error("Error fetching proyectos sin entrega:", error);
    }
  };

  const loadProyectosCompletados = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v2/entregas");
      const proyectosEntregados = response.data.map(
        (entrega) => entrega.proyectoId
      );
      setProyectosCompletados(proyectosEntregados);
    } catch (error) {
      console.error("Error fetching entregas:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar esta entrega?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/v2/entregas/${id}`);
        loadEntregas();
      } catch (error) {
        console.error("Error deleting entrega:", error);
      }
    }
  };

  const handleEdit = (entrega) => {
    setCurrentEntrega(entrega);
    setFormValue({
      codEntrega: entrega.codEntrega,
      deadline: new Date(entrega.deadline),
      proyectoId: entrega.proyectoId,
    });
    setShowModalEdit(true);
  };

  const handleFormChange = (value, field) => {
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      [field]: value,
    }));
  };

  const closeCreateModal = () => {
    setShowModalCreate(false);
    resetForm();
  };

  const closeEditModal = () => {
    setShowModalEdit(false);
    resetForm();
  };

  const model = Schema.Model({
    codEntrega: StringType().isRequired("El código de entrega es requerido"),
    deadline: DateType().isRequired("La fecha de entrega es requerida"),
    proyectoId: NumberType().isRequired("El proyecto es requerido"),
  });

  const handleCreateEntrega = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v2/entrega",
        formValue
      );
      setShowModalCreate(false);
      loadEntregas();
      setProyectosCompletados([...proyectosCompletados, formValue.proyectoId]);
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Entrega creada con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error creating entrega:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al crear la entrega.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const handleUpdateEntrega = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/v2/entregas/${currentEntrega.id}`,
        formValue
      );
      setShowModalEdit(false);
      loadEntregas();
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Entrega actualizada con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error updating entrega:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al actualizar la entrega.
        </Message>,
        { placement: "topEnd" }
      );
    }
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
        <h2>Entregas</h2>
        <Button
          style={{ backgroundColor: "#0E2442" }}
          appearance="primary"
          startIcon={<PlusIcon />}
          onClick={() => setShowModalCreate(true)}
        >
          Nueva Entrega
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
          En este módulo, puedes gestionar las Entregas. Para agregar una nueva
          entrega, haz clic en "Nueva Entrega".
        </p>
      </div>
      <div className="py-4">
        <Table height={400} wordWrap autoHeight data={entregas}>
          <Column width={150} fixed="left">
            <HeaderCell>Código</HeaderCell>
            <Cell dataKey="codEntrega" />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>Fecha de Entrega</HeaderCell>
            <Cell>
              {(rowData) => new Date(rowData.deadline).toLocaleDateString()}
            </Cell>
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>Proyecto</HeaderCell>
            <Cell>
              {(rowData) => {
                const proyecto = proyectos.find(
                  (p) => p.id === rowData.proyectoId
                );
                return proyecto ? proyecto.codProyecto : "";
              }}
            </Cell>
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>Cliente</HeaderCell>
            <Cell>
              {(rowData) => {
                const cliente = clientes.find(
                  (c) => c.id === rowData.clienteId
                );
                return cliente ? cliente.fullName : "";
              }}
            </Cell>
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>Estado del Proyecto</HeaderCell>
            <Cell>
              {(rowData) => {
                const isCompleted = proyectosCompletados.includes(
                  rowData.proyectoId
                );
                return (
                  <Tag color={isCompleted ? "green" : "orange"}>
                    {isCompleted ? "Completado" : "En ejecución"}
                  </Tag>
                );
              }}
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

      {/* Modal para crear entrega */}
      <Modal open={showModalCreate} onClose={closeCreateModal}>
        <Modal.Header>
          <Modal.Title>Nueva Entrega</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="codEntrega">
              <Form.ControlLabel>Código de Entrega</Form.ControlLabel>
              <Form.Control
                name="codEntrega"
                value={formValue.codEntrega}
                onChange={(value) => handleFormChange(value, "codEntrega")}
              />
            </Form.Group>
            <Form.Group controlId="deadline">
              <Form.ControlLabel>Fecha de Entrega</Form.ControlLabel>
              <Form.Control
                name="deadline"
                accepter={DatePicker}
                value={formValue.deadline}
                onChange={(value) => handleFormChange(value, "deadline")}
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="proyectoId">
              <Form.ControlLabel>Proyecto</Form.ControlLabel>
              <Form.Control
                name="proyectoId"
                accepter={SelectPicker}
                data={proyectosSinEntrega.map((proyecto) => ({
                  label: proyecto.codProyecto,
                  value: proyecto.id,
                }))}
                value={formValue.proyectoId}
                onChange={(value) => handleFormChange(value, "proyectoId")}
                style={{ width: "100%" }}
              />
            </Form.Group>
            {formValue.proyectoId && (
              <>
                <Form.Group>
                  <Form.ControlLabel>Código del Cliente</Form.ControlLabel>
                  <Form.Control
                    name="clienteCodCliente"
                    value={
                      proyectosSinEntrega.find(
                        (p) => p.id === formValue.proyectoId
                      )?.clienteCodCliente || ""
                    }
                    readOnly
                  />
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>Nombre del Cliente</Form.ControlLabel>
                  <Form.Control
                    name="clienteFullName"
                    value={
                      proyectosSinEntrega.find(
                        (p) => p.id === formValue.proyectoId
                      )?.clienteFullName || ""
                    }
                    readOnly
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateEntrega} appearance="primary">
            Crear
          </Button>
          <Button onClick={closeCreateModal} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar entrega */}
      <Modal open={showModalEdit} onClose={closeEditModal}>
        <Modal.Header>
          <Modal.Title>Editar Entrega</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="codEntrega">
              <Form.ControlLabel>Código de Entrega</Form.ControlLabel>
              <Form.Control
                name="codEntrega"
                value={formValue.codEntrega}
                onChange={(value) => handleFormChange(value, "codEntrega")}
              />
            </Form.Group>
            <Form.Group controlId="deadline">
              <Form.ControlLabel>Fecha de Entrega</Form.ControlLabel>
              <Form.Control
                name="deadline"
                accepter={DatePicker}
                value={formValue.deadline}
                onChange={(value) => handleFormChange(value, "deadline")}
                style={{ width: "100%" }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpdateEntrega} appearance="primary">
            Guardar Cambios
          </Button>
          <Button onClick={closeEditModal} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Entrega;
