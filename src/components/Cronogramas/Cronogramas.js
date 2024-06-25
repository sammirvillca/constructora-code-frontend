import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Table,
  IconButton,
  DatePicker,
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
import OpenIcon from "@rsuite/icons/ArrowRight";
import { API_BASE_URL } from "../../Config/Config";

const { Column, HeaderCell, Cell } = Table;
const { StringType, NumberType, DateType } = Schema.Types;

const Cronogramas = () => {
  const [cronogramas, setCronogramas] = useState([]);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [formValue, setFormValue] = useState({
    startDate: null,
    endDate: null,
    codCronograma: "",
  });
  const [currentCronograma, setCurrentCronograma] = useState(null);

  useEffect(() => {
    loadCronogramas();
  }, []);

  const resetFormValue = () => {
    setFormValue({
      startDate: null,
      endDate: null,
      codCronograma: "",
    });
  };

  const loadCronogramas = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v2/cronogramas`
      );
      setCronogramas(response.data);
    } catch (error) {
      console.error("Error fetching cronogramas:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este cronograma?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`${API_BASE_URL}/api/v2/cronogramas/${id}`);
        loadCronogramas();
      } catch (error) {
        console.error("Error deleting cronograma:", error);
      }
    }
  };

  const handleEdit = (cronograma) => {
    setCurrentCronograma(cronograma);
    setFormValue({
      startDate: new Date(cronograma.startDate),
      endDate: new Date(cronograma.endDate),
      codCronograma: cronograma.codCronograma,
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
    startDate: DateType().isRequired("La fecha de inicio es requerida"),
    endDate: DateType().isRequired("La fecha de fin es requerida"),
    codCronograma: StringType().isRequired(
      "El código del cronograma es requerido"
    ),
  });

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const handleCreateCronograma = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v2/cronograma`,
        null,
        {
          params: {
            startDate: formatDate(formValue.startDate),
            endDate: formatDate(formValue.endDate),
            codCronograma: formValue.codCronograma,
          },
        }
      );
      setShowModalCreate(false);
      loadCronogramas();
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Cronograma creado con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error creating cronograma:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al crear el cronograma.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const handleUpdateCronograma = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/v2/cronogramas/${currentCronograma.id}`,
        null,
        {
          params: {
            startDate: formatDate(formValue.startDate),
            endDate: formatDate(formValue.endDate),
            codCronograma: formValue.codCronograma,
          },
        }
      );
      setShowModalEdit(false);
      loadCronogramas();
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Cronograma actualizado con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error updating cronograma:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al actualizar el cronograma.
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
        <h2>Cronogramas</h2>
        <Button
          style={{ backgroundColor: "#0E2442" }}
          appearance="primary"
          startIcon={<PlusIcon />}
          onClick={() => setShowModalCreate(true)}
        >
          Nuevo Cronograma
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
          En este módulo, puedes gestionar los Cronogramas. Para mas detalles de
          las actividades de un cronograma ve a "Detalles". Para agregar un
          nuevo cronograma, haz clic en "Nuevo Cronograma".
        </p>
      </div>
      <div className="py-4">
        <Table
          height={400}
          wordWrap
          autoHeight
          data={cronogramas}
          onRowClick={(rowData) => {
            console.log(rowData);
          }}
        >
          <Column width={150} align="center">
            <HeaderCell>Código</HeaderCell>
            <Cell dataKey="codCronograma" />
          </Column>

          <Column flexGrow={2} align="center">
            <HeaderCell>Fecha Inicio</HeaderCell>
            <Cell>
              {(rowData) => (
                <DatePicker
                  format="yyyy-MM-dd"
                  value={new Date(rowData.startDate)}
                  readOnly
                  block
                  style={{ width: "100%" }}
                />
              )}
            </Cell>
          </Column>

          <Column flexGrow={2} align="center">
            <HeaderCell>Fecha Fin</HeaderCell>
            <Cell>
              {(rowData) => (
                <DatePicker
                  format="yyyy-MM-dd"
                  value={new Date(rowData.endDate)}
                  readOnly
                  block
                  style={{ width: "100%" }}
                />
              )}
            </Cell>
          </Column>

          <Column width={100} fixed="right">
            <HeaderCell>Detalles</HeaderCell>
            <Cell>
              {(rowData) => (
                <IconButton
                  appearance="subtle"
                  icon={<OpenIcon />}
                  as={Link}
                  to={`/cronogramas/detalles/${rowData.id}`}
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

      {/* Modal para crear cronograma */}
      <Modal open={showModalCreate} onClose={() => setShowModalCreate(false)}>
        <Modal.Header>
          <Modal.Title>Nuevo Cronograma</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="startDate">
              <Form.ControlLabel>Fecha Inicio</Form.ControlLabel>
              <Form.Control
                accepter={DatePicker}
                oneTap
                block
                style={{ width: "100%" }}
                format="yyyy-MM-dd"
                value={formValue.startDate}
                onChange={(value) => handleFormChange(value, "startDate")}
              />
            </Form.Group>
            <Form.Group controlId="endDate">
              <Form.ControlLabel>Fecha Fin</Form.ControlLabel>
              <Form.Control
                accepter={DatePicker}
                oneTap
                block
                style={{ width: "100%" }}
                format="yyyy-MM-dd"
                value={formValue.endDate}
                onChange={(value) => handleFormChange(value, "endDate")}
              />
            </Form.Group>
            <Form.Group controlId="codCronograma">
              <Form.ControlLabel>Código del Cronograma</Form.ControlLabel>
              <Form.Control
                name="codCronograma"
                value={formValue.codCronograma}
                onChange={(value) => handleFormChange(value, "codCronograma")}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateCronograma} appearance="primary">
            Crear
          </Button>
          <Button onClick={handleCloseCreateModal} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar cronograma */}
      <Modal open={showModalEdit} onClose={() => setShowModalEdit(false)}>
        <Modal.Header>
          <Modal.Title>Editar Cronograma</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="startDate">
              <Form.ControlLabel>Fecha Inicio</Form.ControlLabel>
              <Form.Control
                accepter={DatePicker}
                oneTap
                block
                style={{ width: "100%" }}
                format="yyyy-MM-dd"
                value={formValue.startDate}
                onChange={(value) => handleFormChange(value, "startDate")}
              />
            </Form.Group>
            <Form.Group controlId="endDate">
              <Form.ControlLabel>Fecha Fin</Form.ControlLabel>
              <Form.Control
                accepter={DatePicker}
                oneTap
                block
                style={{ width: "100%" }}
                format="yyyy-MM-dd"
                value={formValue.endDate}
                onChange={(value) => handleFormChange(value, "endDate")}
              />
            </Form.Group>
            <Form.Group controlId="codCronograma">
              <Form.ControlLabel>Código del Cronograma</Form.ControlLabel>
              <Form.Control
                name="codCronograma"
                value={formValue.codCronograma}
                onChange={(value) => handleFormChange(value, "codCronograma")}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpdateCronograma} appearance="primary">
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

export default Cronogramas;