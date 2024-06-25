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
import EditIcon from "@rsuite/icons/Edit";
import PlusIcon from "@rsuite/icons/Plus";
import TrashIcon from "@rsuite/icons/Trash";
import PeoplesIcon from "@rsuite/icons/Peoples";
import ShoppingBagIcon from "@rsuite/icons/legacy/ShoppingBag";
import { SelectPicker, Tag } from "rsuite";

const { Column, HeaderCell, Cell } = Table;
const { StringType, NumberType } = Schema.Types;

const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [formValue, setFormValue] = useState({
    description: "",
    codProyecto: "",
    cronogramaId: null,
    encargadoId: null,
    dibujoPlanoId: null,
  });
  const [currentProyecto, setCurrentProyecto] = useState(null);
  const [cronogramasDisponibles, setCronogramasDisponibles] = useState([]);
  const [trabajadoresIngCivil, setTrabajadoresIngCivil] = useState([]);
  const [planosSinVincular, setPlanosSinVincular] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [proyectosCompletados, setProyectosCompletados] = useState([]);

  useEffect(() => {
    loadProyectos();
    loadCronogramasDisponibles();
    loadTrabajadoresIngCivil();
    loadPlanosSinVincular();
    fetchTrabajadores();
    loadEntregas();
  }, []);

  const resetFormValue = () => {
    setFormValue({
      description: "",
      codProyecto: "",
      cronogramaId: null,
      encargadoId: null,
      dibujoPlanoId: null,
    });
  };

  const fetchTrabajadores = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v2/trabajadores"
      );
      setTrabajadores(response.data);
    } catch (error) {
      console.error("Error fetching trabajadores:", error);
    }
  };

  const ingciviles = trabajadores.filter(
    (trabajador) => trabajador.rol === "Ing. Civil"
  );

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

  const loadEntregas = async () => {
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
      "¿Estás seguro de eliminar este proyecto?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/v2/proyectos/${id}`);
        loadProyectos();
      } catch (error) {
        console.error("Error deleting proyecto:", error);
      }
    }
  };

  const handleEdit = (proyecto) => {
    setCurrentProyecto(proyecto);
    setFormValue({
      description: proyecto.description,
      codProyecto: proyecto.codProyecto,
    });
    setShowModalEdit(true);
  };

  const handleFormChange = (value, field) => {
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      [field]: value,
    }));
  };

  const loadCronogramasDisponibles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v2/cronogramas-disponibles"
      );
      setCronogramasDisponibles(response.data);
    } catch (error) {
      console.error("Error fetching cronogramas disponibles:", error);
    }
  };

  const loadTrabajadoresIngCivil = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v2/trabajadores/ingciviles"
      );
      setTrabajadoresIngCivil(response.data);
    } catch (error) {
      console.error("Error fetching trabajadores Ing. Civil:", error);
    }
  };

  const loadPlanosSinVincular = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v2/planos-sin-vincular"
      );
      setPlanosSinVincular(response.data);
    } catch (error) {
      console.error("Error fetching planos sin vincular:", error);
    }
  };

  const model = Schema.Model({
    description: StringType().isRequired("La descripción es requerida"),
    codProyecto: NumberType().isRequired("El código del proyecto es requerido"),
    cronogramaId: NumberType().isRequired("El cronograma es requerido"),
    encargadoId: NumberType().isRequired("El encargado es requerido"),
    dibujoPlanoId: NumberType().isRequired("El diseño plano es requerido"),
  });

  const handleCreateProyecto = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v2/proyecto",
        formValue
      );
      setShowModalCreate(false);
      loadProyectos();
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Proyecto creado con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error creating proyecto:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al crear el proyecto.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const handleUpdateProyecto = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/v2/proyectos/${currentProyecto.id}`,
        formValue
      );
      setShowModalEdit(false);
      loadProyectos();
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Proyecto actualizado con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error updating proyecto:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al actualizar el proyecto.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const handleCloseCreateModal = () => {
    setShowModalCreate(false);
    resetFormValue();
  };
  
  const handleCloseEditModal = () => {
    setShowModalEdit(false);
    resetFormValue();
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
        <h2>Proyectos</h2>
        <Button
          style={{ backgroundColor: "#0E2442" }}
          appearance="primary"
          startIcon={<PlusIcon />}
          onClick={() => setShowModalCreate(true)}
        >
          Nuevo Proyecto
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
          En este módulo, puedes gestionar los Proyectos. Puedes ver los
          trabajadores asignados a un proyecto, ademas de ver los pedidos de
          materiales para cada proyecto. Para agregar un nuevo proyecto, haz
          clic en "Nuevo Proyecto".
        </p>
      </div>
      <div className="py-4">
        <Table
          height={400}
          wordWrap
          autoHeight
          data={proyectos}
          onRowClick={(rowData) => {
            console.log(rowData);
          }}
        >
          <Column width={150} fixed="left">
            <HeaderCell>Código</HeaderCell>
            <Cell dataKey="codProyecto" />
          </Column>

          <Column flexGrow={2}>
            <HeaderCell>Descripción</HeaderCell>
            <Cell dataKey="description" />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>Estado</HeaderCell>
            <Cell>
              {(rowData) => {
                const isCompleted = proyectosCompletados.includes(rowData.id);
                return (
                  <Tag color={isCompleted ? "green" : "orange"}>
                    {isCompleted ? "Completado" : "En ejecución"}
                  </Tag>
                );
              }}
            </Cell>
          </Column>

          <Column width={100} fixed="right">
            <HeaderCell>Trabajadores</HeaderCell>
            <Cell>
              {(rowData) => (
                <IconButton
                  appearance="subtle"
                  icon={<PeoplesIcon />}
                  as={Link}
                  to={`/proyectos/${rowData.id}/lista-de-trabajadores`}
                />
              )}
            </Cell>
          </Column>

          <Column width={100} fixed="right">
            <HeaderCell>Pedidos</HeaderCell>
            <Cell>
              {(rowData) => (
                <IconButton
                  appearance="subtle"
                  icon={<ShoppingBagIcon />}
                  as={Link}
                  to={`/proyectos/${rowData.id}/lista-de-materiales`}
                />
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

      {/* Modal para crear proyecto */}
      <Modal open={showModalCreate} onClose={() => setShowModalCreate(false)}>
        <Modal.Header>
          <Modal.Title>Nuevo Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="description">
              <Form.ControlLabel>Descripción</Form.ControlLabel>
              <Form.Control
                name="description"
                value={formValue.description}
                onChange={(value) => handleFormChange(value, "description")}
              />
            </Form.Group>
            <Form.Group controlId="codProyecto">
              <Form.ControlLabel>Código del Proyecto</Form.ControlLabel>
              <Form.Control
                name="codProyecto"
                value={formValue.codProyecto}
                onChange={(value) => handleFormChange(value, "codProyecto")}
              />
            </Form.Group>
            <Form.Group controlId="cronogramaId">
              <Form.ControlLabel>Cronograma</Form.ControlLabel>
              <Form.Control
                name="cronogramaId"
                accepter={SelectPicker}
                data={cronogramasDisponibles.map((cronograma) => ({
                  label: cronograma.codCronograma,
                  value: cronograma.id,
                }))}
                value={formValue.cronogramaId}
                onChange={(value) => handleFormChange(value, "cronogramaId")}
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="encargadoId">
              <Form.ControlLabel>Encargado</Form.ControlLabel>
              <Form.Control
                name="encargadoId"
                accepter={SelectPicker}
                data={ingciviles.map((trabajador) => ({
                  label: trabajador.fullName,
                  value: trabajador.id,
                }))}
                value={formValue.encargadoId}
                onChange={(value) => handleFormChange(value, "encargadoId")}
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="dibujoPlanoId">
              <Form.ControlLabel>Diseño Plano</Form.ControlLabel>
              <Form.Control
                name="dibujoPlanoId"
                value={formValue.dibujoPlanoId}
                onChange={(value) => handleFormChange(value, "dibujoPlanoId")}
                accepter={SelectPicker}
                data={planosSinVincular.map((plano) => ({
                  label: plano.codDiseño,
                  value: plano.id,
                }))}
                style={{ width: "100%" }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateProyecto} appearance="primary">
            Crear
          </Button>
          <Button onClick={handleCloseCreateModal} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar proyecto */}
      <Modal open={showModalEdit} onClose={() => setShowModalEdit(false)}>
        <Modal.Header>
          <Modal.Title>Editar Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="description">
              <Form.ControlLabel>Descripción</Form.ControlLabel>
              <Form.Control
                name="description"
                value={formValue.description}
                onChange={(value) => handleFormChange(value, "description")}
              />
            </Form.Group>
            <Form.Group controlId="codProyecto">
              <Form.ControlLabel>Código del Proyecto</Form.ControlLabel>
              <Form.Control
                name="codProyecto"
                value={formValue.codProyecto}
                onChange={(value) => handleFormChange(value, "codProyecto")}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpdateProyecto} appearance="primary">
            Guardar Cambios
          </Button>
          <Button onClick={handleCloseEditModal} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Proyectos;
