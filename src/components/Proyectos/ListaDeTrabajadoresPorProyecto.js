import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Table, Button, Modal, Form, Message, toaster } from "rsuite";
import ArrowLeftIcon from "@rsuite/icons/ArrowLeft";
import PlusIcon from "@rsuite/icons/Plus";
import { API_BASE_URL } from "../../Config/Config";
const { Column, HeaderCell, Cell } = Table;

const ListaDeTrabajadoresPorProyecto = () => {
  const { id } = useParams();
  const [trabajadores, setTrabajadores] = useState([]);
  const [trabajadoresDisponibles, setTrabajadoresDisponibles] = useState([]);
  const [showModalAsignar, setShowModalAsignar] = useState(false);
  const [trabajadoresSeleccionados, setTrabajadoresSeleccionados] = useState(
    []
  );
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [trabajadoresADesvincular, setTrabajadoresADesvincular] = useState([]);

  useEffect(() => {
    fetchTrabajadoresAsignados();
  }, []);

  useEffect(() => {
    if (showModalAsignar) {
      fetchTrabajadoresDisponibles();
    }
  }, [showModalAsignar]);

  const fetchTrabajadoresDisponibles = async () => {
    try {
      const [disponiblesResponse, asignadosResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v2/trabajadores`),
        axios.get(`${API_BASE_URL}/api/v2/proyecto/${id}/trabajadores`),
      ]);

      const disponibles = disponiblesResponse.data;
      const asignados = asignadosResponse.data;

      const trabajadoresDisponiblesFiltrados = disponibles.filter(
        (trabajador) =>
          !asignados.some((asignado) => asignado.id === trabajador.id)
      );

      setTrabajadoresDisponibles(trabajadoresDisponiblesFiltrados);
    } catch (error) {
      console.error("Error fetching trabajadores disponibles:", error);
    }
  };

  const handleSeleccionarTrabajadorDisponible = (trabajadorId) => {
    if (trabajadoresSeleccionados.includes(trabajadorId)) {
      setTrabajadoresSeleccionados(
        trabajadoresSeleccionados.filter((id) => id !== trabajadorId)
      );
    } else {
      setTrabajadoresSeleccionados([
        ...trabajadoresSeleccionados,
        trabajadorId,
      ]);
    }
  };

  const fetchTrabajadoresAsignados = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v2/proyecto/${id}/trabajadores`
      );
      setTrabajadores(response.data);
    } catch (error) {
      console.error("Error fetching trabajadores asignados:", error);
    }
  };

  const handleAsignarTrabajadores = async () => {
    try {
      const trabajadoresAAsignar = [
        ...trabajadores.map((trabajador) => trabajador.id),
        ...trabajadoresSeleccionados,
      ];

      await axios.post(
        `${API_BASE_URL}/api/v2/proyecto/${id}/trabajadores`,
        trabajadoresAAsignar
      );

      fetchTrabajadoresAsignados();
      setTrabajadoresSeleccionados([]);
      setShowModalAsignar(false);
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Trabajadores asignados con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error asignando trabajadores:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al asignar trabajadores.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const handleSeleccionarTrabajador = (rowData) => {
    const trabajadorId = rowData.id;
    if (trabajadoresSeleccionados.includes(trabajadorId)) {
      setTrabajadoresSeleccionados(
        trabajadoresSeleccionados.filter((id) => id !== trabajadorId)
      );
    } else {
      setTrabajadoresSeleccionados([
        ...trabajadoresSeleccionados,
        trabajadorId,
      ]);
    }
  };

  const handleEditarTrabajadores = () => {
    setShowModalEditar(true);
    setTrabajadoresADesvincular([]);
  };

  const handleSeleccionarTrabajadorADesvincular = (trabajadorId) => {
    if (trabajadoresADesvincular.includes(trabajadorId)) {
      setTrabajadoresADesvincular(
        trabajadoresADesvincular.filter((id) => id !== trabajadorId)
      );
    } else {
      setTrabajadoresADesvincular([...trabajadoresADesvincular, trabajadorId]);
    }
  };

  const handleDesvincularTrabajadores = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/v2/proyecto/${id}/desvincular-trabajadores`,
        trabajadoresADesvincular
      );
      fetchTrabajadoresAsignados();
      setTrabajadoresADesvincular([]);
      setShowModalEditar(false);
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Trabajadores desvinculados con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error desvinculando trabajadores:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al desvincular trabajadores.
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
        <h2>Lista de Trabajadores del Proyecto</h2>
        <Button
          style={{ backgroundColor: "#0E2442" }}
          appearance="primary"
          startIcon={<ArrowLeftIcon />}
          as={Link}
          to="/proyectos"
        >
          Volver a Proyectos
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <h3>Trabajadores Asignados</h3>
        <Button
          appearance="primary"
          style={{ backgroundColor: "#0E2442", marginRight: "10px" }}
          startIcon={<PlusIcon />}
          onClick={() => setShowModalAsignar(true)}
        >
          Asignar Trabajadores
        </Button>
        <Button
          appearance="primary"
          style={{ backgroundColor: "#FF5C5C" }}
          onClick={handleEditarTrabajadores}
        >
          Editar Trabajadores
        </Button>
      </div>
      <div className="py-4">
        <Table
          height={400}
          wordWrap
          autoHeight
          data={trabajadores}
          onRowClick={handleSeleccionarTrabajador}
          rowClassName={(rowData) =>
            rowData?.id && trabajadoresSeleccionados.includes(rowData.id)
          }
        >
          <Column width={50} align="center" fixed>
            <HeaderCell>#</HeaderCell>
            <Cell>{(rowData, rowIndex) => <span>{rowIndex + 1}</span>}</Cell>
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Nombre Completo</HeaderCell>
            <Cell dataKey="fullName" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Cédula de Identidad</HeaderCell>
            <Cell dataKey="identityCard" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Rol</HeaderCell>
            <Cell dataKey="rol" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Dirección</HeaderCell>
            <Cell dataKey="address" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Telefóno</HeaderCell>
            <Cell dataKey="phone" />
          </Column>
        </Table>
      </div>
      {/* Modal para asignar trabajadores */}
      <Modal
        open={showModalAsignar}
        onClose={() => setShowModalAsignar(false)}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>Asignar Trabajadores</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Selecciona los trabajadores que deseas asignar al proyecto.</p>
          <Table height={400} data={trabajadoresDisponibles}>
            <Column width={100} align="center" fixed>
              <HeaderCell>Cod</HeaderCell>
              <Cell dataKey="codTrabajador"></Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>Nombre Completo</HeaderCell>
              <Cell dataKey="fullName" />
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>Rol</HeaderCell>
              <Cell dataKey="rol" />
            </Column>
            <Column width={100} align="center">
              <HeaderCell>Seleccionar</HeaderCell>
              <Cell>
                {(rowData) => (
                  <input
                    type="checkbox"
                    checked={trabajadoresSeleccionados.includes(rowData.id)}
                    onChange={() =>
                      handleSeleccionarTrabajadorDisponible(rowData.id)
                    }
                  />
                )}
              </Cell>
            </Column>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAsignarTrabajadores} appearance="primary">
            Asignar
          </Button>
          <Button
            onClick={() => setShowModalAsignar(false)}
            appearance="subtle"
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar trabajadores */}
      <Modal
        open={showModalEditar}
        onClose={() => setShowModalEditar(false)}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>Editar Trabajadores Asignados</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Selecciona los trabajadores que deseas desvincular del proyecto.
          </p>
          <Table height={400} data={trabajadores}>
            <Column width={50} align="center" fixed>
              <HeaderCell>#</HeaderCell>
              <Cell>{(rowData, rowIndex) => <span>{rowIndex + 1}</span>}</Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>Nombre Completo</HeaderCell>
              <Cell dataKey="fullName" />
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>Rol</HeaderCell>
              <Cell dataKey="rol" />
            </Column>
            <Column width={100} align="center">
              <HeaderCell>Desvincular</HeaderCell>
              <Cell>
                {(rowData) => (
                  <input
                    type="checkbox"
                    checked={trabajadoresADesvincular.includes(rowData.id)}
                    onChange={() =>
                      handleSeleccionarTrabajadorADesvincular(rowData.id)
                    }
                  />
                )}
              </Cell>
            </Column>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDesvincularTrabajadores} appearance="primary">
            Desvincular
          </Button>
          <Button onClick={() => setShowModalEditar(false)} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListaDeTrabajadoresPorProyecto;
