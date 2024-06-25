import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Table,
  IconButton,
  Button,
  Modal,
  Form,
  Schema,
  Message,
  toaster,
  SelectPicker,
  Input,
} from "rsuite";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import ArrowLeftIcon from "@rsuite/icons/ArrowLeft";
import PlusIcon from "@rsuite/icons/Plus";
import PeoplesCostomizeIcon from "@rsuite/icons/PeoplesCostomize";
import axios from "axios";

const { Column, HeaderCell, Cell } = Table;
const { StringType, NumberType } = Schema.Types;
const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));

const PrerequisitosPlanoId = () => {
  const { id } = useParams();
  const [prerequisitoPlano, setPrerequisitoPlano] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalQuotation, setShowModalQuotation] = useState(false);
  const [quotationData, setQuotationData] = useState(null);
  const [editedPrerequisitoPlanoId, setEditedPrerequisitoPlanoId] =
    useState(null);

  const [formData, setFormData] = useState({
    codReq: "",
    roomsQuantity: "",
    floorsQuantity: "",
    bathroomsQuantity: "",
    size: "",
    tastes: "",
    dislikes: "",
    clienteId: id,
    trabajadorId: "",
  });

  useEffect(() => {
    fetchPrerequisitoPlano();
    fetchTrabajadores();
  }, []);

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
  const calculateBasePrice = (
    roomsQuantity,
    floorsQuantity,
    bathroomsQuantity,
    size
  ) => {
    // Precio base por cada habitación
    const roomPrice = 5000;

    // Precio base por cada piso adicional
    const floorPrice = 10000;

    // Precio base por cada baño
    const bathroomPrice = 2500;

    // Precio base por tamaño en metros cuadrados
    const sizePrice = 1000;

    // Cálculo del precio base
    const basePrice =
      roomsQuantity * roomPrice +
      (floorsQuantity - 1) * floorPrice +
      bathroomsQuantity * bathroomPrice +
      parseInt(size) * sizePrice;

    return basePrice;
  };

  const handleGenerateQuotation = (rowData) => {
    const { roomsQuantity, floorsQuantity, bathroomsQuantity, size } = rowData;
    const quotationData = {
      rooms: roomsQuantity,
      floors: floorsQuantity,
      bathrooms: bathroomsQuantity,
      size: size,
      // Aquí puedes agregar la lógica para calcular el precio base y otros detalles de la cotización
      basePrice: calculateBasePrice(
        roomsQuantity,
        floorsQuantity,
        bathroomsQuantity,
        size
      ),
    };
    setQuotationData(quotationData);
    setShowModalQuotation(true);
  };

  const getTrabajadorNombre = (trabajadorId) => {
    const trabajador = trabajadores.find((t) => t.id === trabajadorId);
    return trabajador ? trabajador.fullName : "Desconocido";
  };

  const fetchPrerequisitoPlano = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v2/clientes/prerequisitos-plano/${id}`
      );
      console.log("Datos del cliente recibidos:", response.data);
      setPrerequisitoPlano(response.data);
    } catch (error) {
      console.error("Error fetching prerequisitos plano:", error);
    }
  };

  const handleInputChange = (value, field) => {
    setFormData({ ...formData, [field]: value });
  };

  const model = Schema.Model({
    codReq: StringType().isRequired("El código de requisito es requerido"),
    roomsQuantity: NumberType().isRequired(
      "La cantidad de cuartos es requerida"
    ),
    floorsQuantity: NumberType().isRequired(
      "La cantidad de pisos es requerida"
    ),
    bathroomsQuantity: NumberType().isRequired(
      "La cantidad de baños es requerida"
    ),
    size: StringType().isRequired("El tamaño es requerido"),
    tastes: StringType().isRequired("Los gustos son requeridos"),
    dislikes: StringType().isRequired("Los disgustos son requeridos"),
    trabajadorId: NumberType().isRequired("El arquitecto es requerido"),
  });

  const handleSubmit = async () => {
    try {
      if (editedPrerequisitoPlanoId) {
        await axios.put(
          `http://localhost:8080/api/v2/prerequisito-clientes/${editedPrerequisitoPlanoId}`,
          formData
        );
        setPrerequisitoPlano((prevPrerequisitoPlano) =>
          prevPrerequisitoPlano.map((item) =>
            item.id === editedPrerequisitoPlanoId
              ? { ...item, ...formData }
              : item
          )
        );
        toaster.push(
          <Message type="success" header="Éxito" duration={5000}>
            Requisito actualizado con éxito.
          </Message>,
          { placement: "topEnd" }
        );
      } else {
        const response = await axios.post(
          "http://localhost:8080/api/v2/prerequisito-cliente",
          formData
        );
        setPrerequisitoPlano((prevPrerequisitoPlano) => [
          ...prevPrerequisitoPlano,
          response.data,
        ]);
        toaster.push(
          <Message type="success" header="Éxito" duration={5000}>
            Requisito creado con éxito.
          </Message>,
          { placement: "topEnd" }
        );
      }
      setShowModalCreate(false);
      setShowModalEdit(false);
      setEditedPrerequisitoPlanoId(null);
      resetFormData();
    } catch (error) {
      console.error("Error al guardar el prerequisito plano:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al guardar el requisito.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const arquitectos = trabajadores.filter(
    (trabajador) => trabajador.rol === "Arquitecto"
  );

  const handleEditClick = (rowData) => {
    setEditedPrerequisitoPlanoId(rowData.id);
    setFormData(rowData);
    setShowModalEdit(true);
  };

  const handleDeleteClick = (id) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar este prerequisito plano?"
      )
    ) {
      deletePrerequisitoPlano(id);
    }
  };

  const deletePrerequisitoPlano = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v2/prerequisito-clientes/${id}`
      );
      setPrerequisitoPlano((prevPrerequisitoPlano) =>
        prevPrerequisitoPlano.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Error al eliminar el prerequisito plano:", error);
    }
  };

  const resetFormData = () => {
    setFormData({
      codReq: "",
      roomsQuantity: "",
      floorsQuantity: "",
      bathroomsQuantity: "",
      size: "",
      tastes: "",
      dislikes: "",
      clienteId: id,
      trabajadorId: "",
    });
  };

  const handleCloseModal = () => {
    setShowModalCreate(false);
    setShowModalEdit(false);
    setEditedPrerequisitoPlanoId(null);
    resetFormData();
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
        <h2>Requisitos del Cliente</h2>
        <div>
          <Button
            style={{ backgroundColor: "#0E2442", marginRight: "10px" }}
            appearance="primary"
            startIcon={<PlusIcon />}
            onClick={() => setShowModalCreate(true)}
          >
            Agregar Requisito
          </Button>
          <Button
            style={{ backgroundColor: "#0E2442" }}
            appearance="primary"
            startIcon={<ArrowLeftIcon />}
            as={Link}
            to="/clientes"
          >
            Volver a Clientes
          </Button>
        </div>
      </div>

      <div className="py-4">
        <Table height={400} wordWrap autoHeight data={prerequisitoPlano}>
          <Column width={100} align="center" fixed>
            <HeaderCell>Cod Requisito</HeaderCell>
            <Cell dataKey="codReq" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Arquitecto</HeaderCell>
            <Cell>
              {(rowData) => getTrabajadorNombre(rowData.trabajadorId)}
            </Cell>
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Gustos</HeaderCell>
            <Cell dataKey="tastes" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Disgustos</HeaderCell>
            <Cell dataKey="dislikes" />
          </Column>
          <Column width={100} fixed="right">
            <HeaderCell>Cotización</HeaderCell>
            <Cell>
              {(rowData) => (
                <IconButton
                  appearance="default"
                  icon={<PeoplesCostomizeIcon />}
                  onClick={() => handleGenerateQuotation(rowData)}
                />
              )}
            </Cell>
          </Column>

          <Column width={100} fixed="right">
            <HeaderCell>Detalles</HeaderCell>
            <Cell>
              {(rowData) => (
                <IconButton
                  appearance="default"
                  icon={<EditIcon />}
                  onClick={() => handleEditClick(rowData)}
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
                  onClick={() => handleDeleteClick(rowData.id)}
                />
              )}
            </Cell>
          </Column>
        </Table>
      </div>

      {/* Modal para crear requisito */}
      <Modal open={showModalCreate} onClose={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>Agregar Requisito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="codReq">
              <Form.ControlLabel>Código de Requisito</Form.ControlLabel>
              <Form.Control
                name="codReq"
                value={formData.codReq}
                onChange={(value) => handleInputChange(value, "codReq")}
              />
            </Form.Group>
            <Form.Group controlId="roomsQuantity">
              <Form.ControlLabel>Cantidad de Cuartos</Form.ControlLabel>
              <Form.Control
                name="roomsQuantity"
                value={formData.roomsQuantity}
                onChange={(value) => handleInputChange(value, "roomsQuantity")}
              />
            </Form.Group>
            <Form.Group controlId="floorsQuantity">
              <Form.ControlLabel>Cantidad de Pisos</Form.ControlLabel>
              <Form.Control
                name="floorsQuantity"
                value={formData.floorsQuantity}
                onChange={(value) => handleInputChange(value, "floorsQuantity")}
              />
            </Form.Group>
            <Form.Group controlId="bathroomsQuantity">
              <Form.ControlLabel>Cantidad de Baños</Form.ControlLabel>
              <Form.Control
                name="bathroomsQuantity"
                value={formData.bathroomsQuantity}
                onChange={(value) =>
                  handleInputChange(value, "bathroomsQuantity")
                }
              />
            </Form.Group>
            <Form.Group controlId="size">
              <Form.ControlLabel>Tamaño</Form.ControlLabel>
              <Form.Control
                name="size"
                value={formData.size}
                onChange={(value) => handleInputChange(value, "size")}
              />
            </Form.Group>
            <Form.Group controlId="tastes">
              <Form.ControlLabel>Gustos</Form.ControlLabel>
              <Form.Control
                name="tastes"
                value={formData.tastes}
                onChange={(value) => handleInputChange(value, "tastes")}
                accepter={Textarea}
                rows={2}
                style={{ resize: "both", width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="dislikes">
              <Form.ControlLabel>Disgustos</Form.ControlLabel>
              <Form.Control
                name="dislikes"
                value={formData.dislikes}
                onChange={(value) => handleInputChange(value, "dislikes")}
                accepter={Textarea}
                rows={2}
                style={{ resize: "both", width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="trabajadorId">
              <Form.ControlLabel>Arquitecto</Form.ControlLabel>
              <Form.Control
                name="trabajadorId"
                accepter={SelectPicker}
                data={arquitectos.map((trabajador) => ({
                  label: trabajador.fullName,
                  value: trabajador.id,
                }))}
                value={formData.trabajadorId}
                onChange={(value) => handleInputChange(value, "trabajadorId")}
                style={{ width: "100%" }}
              />
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

      {/* Modal para editar requisito */}
      <Modal open={showModalEdit} onClose={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>Editar Requisito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="codReq">
              <Form.ControlLabel>Código de Requisito</Form.ControlLabel>
              <Form.Control
                name="codReq"
                value={formData.codReq}
                onChange={(value) => handleInputChange(value, "codReq")}
              />
            </Form.Group>
            <Form.Group controlId="roomsQuantity">
              <Form.ControlLabel>Cantidad de Cuartos</Form.ControlLabel>
              <Form.Control
                name="roomsQuantity"
                value={formData.roomsQuantity}
                onChange={(value) => handleInputChange(value, "roomsQuantity")}
              />
            </Form.Group>
            <Form.Group controlId="floorsQuantity">
              <Form.ControlLabel>Cantidad de Pisos</Form.ControlLabel>
              <Form.Control
                name="floorsQuantity"
                value={formData.floorsQuantity}
                onChange={(value) => handleInputChange(value, "floorsQuantity")}
              />
            </Form.Group>
            <Form.Group controlId="bathroomsQuantity">
              <Form.ControlLabel>Cantidad de Baños</Form.ControlLabel>
              <Form.Control
                name="bathroomsQuantity"
                value={formData.bathroomsQuantity}
                onChange={(value) =>
                  handleInputChange(value, "bathroomsQuantity")
                }
              />
            </Form.Group>
            <Form.Group controlId="size">
              <Form.ControlLabel>Tamaño</Form.ControlLabel>
              <Form.Control
                name="size"
                value={formData.size}
                onChange={(value) => handleInputChange(value, "size")}
              />
            </Form.Group>
            <Form.Group controlId="tastes">
              <Form.ControlLabel>Gustos</Form.ControlLabel>
              <Form.Control
                name="tastes"
                value={formData.tastes}
                onChange={(value) => handleInputChange(value, "tastes")}
                accepter={Textarea}
                rows={2}
                style={{ resize: "both", width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="dislikes">
              <Form.ControlLabel>Disgustos</Form.ControlLabel>
              <Form.Control
                name="dislikes"
                value={formData.dislikes}
                onChange={(value) => handleInputChange(value, "dislikes")}
                accepter={Textarea}
                rows={2}
                style={{ resize: "both", width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="trabajadorId">
              <Form.ControlLabel>Arquitecto</Form.ControlLabel>
              <Form.Control
                name="trabajadorId"
                accepter={SelectPicker}
                data={arquitectos.map((trabajador) => ({
                  label: trabajador.fullName,
                  value: trabajador.id,
                }))}
                value={formData.trabajadorId}
                onChange={(value) => handleInputChange(value, "trabajadorId")}
                style={{ width: "100%" }}
              />
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
        open={showModalQuotation}
        onClose={() => setShowModalQuotation(false)}
      >
        <Modal.Header>
          <Modal.Title>Cotización Básica</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {quotationData && (
            <div>
              <p>Cantidad de Cuartos: {quotationData.rooms}</p>
              <p>Cantidad de Pisos: {quotationData.floors}</p>
              <p>Cantidad de Baños: {quotationData.bathrooms}</p>
              <p>Tamaño: {quotationData.size}</p>
              <p>Precio Base: {quotationData.basePrice}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setShowModalQuotation(false)}
            appearance="subtle"
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PrerequisitosPlanoId;
