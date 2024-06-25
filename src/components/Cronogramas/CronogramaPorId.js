import React, { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button, Form, DatePicker, Input, Schema, toaster, Message } from "rsuite";
import ArrowLeftLineIcon from "@rsuite/icons/ArrowLeftLine";
import { API_BASE_URL } from "../../Config/Config";
const { StringType } = Schema.Types;

const CronogramaPorId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cronograma, setCronograma] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentActividad, setCurrentActividad] = useState(null);
  const [formValue, setFormValue] = useState({
    name: "",
    description: "",
    startDate: null,
    endDate: null,
  });

  const model = Schema.Model({
    name: StringType().isRequired("El nombre es requerido"),
    description: StringType().isRequired("La descripción es requerida"),
  });

  useEffect(() => {
    loadCronograma();
    loadActividades();
  }, []);

  const loadCronograma = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v2/cronograma/${id}`);
      setCronograma(response.data);
    } catch (error) {
      console.error("Error fetching cronograma:", error);
    }
  };

  const loadActividades = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v2/cronogramas/${id}/actividades`);
      setActividades(response.data);
    } catch (error) {
      console.error("Error fetching actividades:", error);
    }
  };

  const handleDateClick = (arg) => {
    setFormValue({
      ...formValue,
      startDate: new Date(arg.dateStr),
      endDate: new Date(arg.dateStr),
    });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEditClick = (actividad) => {
    setCurrentActividad(actividad);
    setFormValue({
      name: actividad.name,
      description: actividad.description,
      startDate: new Date(actividad.startDate),
      endDate: new Date(actividad.endDate),
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDeleteClick = async (actividadId) => {
    if (window.confirm("¿Estás seguro de eliminar esta actividad?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/v2/actividades/${actividadId}`);
        setActividades(actividades.filter((act) => act.id !== actividadId));
        setShowModal(false);
        toaster.push(
          <Message type="success" header="Éxito" duration={5000}>
            Actividad eliminada con éxito.
          </Message>,
          { placement: "topEnd" }
        );
      } catch (error) {
        console.error("Error deleting actividad:", error);
        toaster.push(
          <Message type="error" header="Error" duration={5000}>
            Error al eliminar la actividad.
          </Message>,
          { placement: "topEnd" }
        );
      }
    }
  };

  const handleFormChange = (value) => {
    setFormValue(value);
  };

  const handleFormSubmit = async () => {
    try {
      let response;
      if (isEdit) {
        response = await axios.put(`${API_BASE_URL}/api/v2/actividades/${currentActividad.id}`, formValue);
        setActividades(actividades.map((act) => (act.id === currentActividad.id ? response.data : act)));
        toaster.push(
          <Message type="success" header="Éxito" duration={5000}>
            Actividad actualizada con éxito.
          </Message>,
          { placement: "topEnd" }
        );
      } else {
        response = await axios.post(`${API_BASE_URL}/api/v2/cronogramas/${id}/actividad`, formValue);
        setActividades([...actividades, response.data]);
        toaster.push(
          <Message type="success" header="Éxito" duration={5000}>
            Actividad agregada con éxito.
          </Message>,
          { placement: "topEnd" }
        );
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving actividad:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al guardar la actividad.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const getEventColor = (event) => {
    if (event.extendedProps.isCronograma) {
      return "blue"; // Color para las fechas del cronograma
    }
    return "green"; // Color para las actividades
  };

  return (
    <div className="container" style={{ margin: "0 auto", maxWidth: "80%" }}>
      {cronograma && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Cronograma: {cronograma.codCronograma}</h2>
            <div>
              <Button appearance="default" onClick={() => navigate("/cronogramas")} style={{ marginRight: 10 }}>
                <ArrowLeftLineIcon /> Volver a Cronogramas
              </Button>
              <Button appearance="primary" onClick={() => { setFormValue({ name: "", description: "", startDate: null, endDate: null }); setIsEdit(false); setShowModal(true); }}>
                Agregar Actividad
              </Button>
            </div>
          </div>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={[
              {
                title: "Inicio Cronograma",
                start: cronograma.startDate,
                end: cronograma.startDate,
                extendedProps: { isCronograma: true },
              },
              {
                title: "Fin Cronograma",
                start: cronograma.endDate,
                end: cronograma.endDate,
                extendedProps: { isCronograma: true },
              },
              ...actividades.map((act) => ({
                title: act.name,
                start: act.startDate,
                end: act.endDate,
                extendedProps: { isCronograma: false },
                id: act.id,
              })),
            ]}
            eventContent={(eventInfo) => (
              <div style={{ backgroundColor: getEventColor(eventInfo.event) }}>
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
              </div>
            )}
            dateClick={handleDateClick}
            eventClick={(info) => {
              const actividad = actividades.find((act) => act.id === info.event.id);
              if (actividad) handleEditClick(actividad);
            }}
          />
          <Modal open={showModal} onClose={() => setShowModal(false)}>
            <Modal.Header>
              <Modal.Title>{isEdit ? "Editar Actividad" : "Agregar Actividad"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form
                fluid
                onChange={handleFormChange}
                formValue={formValue}
                model={model}
                onSubmit={handleFormSubmit}
              >
                <Form.Group controlId="name">
                  <Form.ControlLabel>Nombre</Form.ControlLabel>
                  <Form.Control name="name" />
                </Form.Group>
                <Form.Group controlId="description">
                  <Form.ControlLabel>Descripción</Form.ControlLabel>
                  <Form.Control name="description" />
                </Form.Group>
                <Form.Group controlId="startDate">
                  <Form.ControlLabel>Fecha Inicio</Form.ControlLabel>
                  <DatePicker
                    oneTap
                    block
                    style={{ width: "100%" }}
                    format="yyyy-MM-dd"
                    value={formValue.startDate}
                    onChange={(date) => setFormValue({ ...formValue, startDate: date })}
                  />
                </Form.Group>
                <Form.Group controlId="endDate">
                  <Form.ControlLabel>Fecha Fin</Form.ControlLabel>
                  <DatePicker
                    oneTap
                    block
                    style={{ width: "100%" }}
                    format="yyyy-MM-dd"
                    value={formValue.endDate}
                    onChange={(date) => setFormValue({ ...formValue, endDate: date })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleFormSubmit} appearance="primary">
                {isEdit ? "Guardar Cambios" : "Guardar"}
              </Button>
              {isEdit && (
                <Button onClick={() => handleDeleteClick(currentActividad.id)} appearance="danger">
                  Eliminar
                </Button>
              )}
              <Button onClick={() => setShowModal(false)} appearance="subtle">
                Cancelar
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default CronogramaPorId;