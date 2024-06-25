import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  IconButton,
  Modal,
  Form,
  Schema,
  Message,
  toaster,
  SelectPicker,
  Input,
  Tag,
  DatePicker,
} from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import PlusIcon from "@rsuite/icons/Plus";
import CheckIcon from "@rsuite/icons/Check";
import { API_BASE_URL } from "../../Config/Config";

const { Column, HeaderCell, Cell } = Table;
const { StringType, NumberType, DateType } = Schema.Types;
const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));

const DiseñosPlano = () => {
  const [dibujosPlano, setDibujosPlano] = useState([]);
  const [prerequisitosPlano, setPrerequisitosPlano] = useState([]);
  const [aceptacionesPlano, setAceptacionesPlano] = useState([]);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalAceptacion, setShowModalAceptacion] = useState(false);
  const [formValue, setFormValue] = useState({
    atmosphere: "",
    circulationFlow: "",
    funcionality: "",
    dimensions: "",
    prerequisitoPlanoId: "",
    codDiseño: "",
    estado: "En Espera",
  });
  const [formValueAceptacion, setFormValueAceptacion] = useState({
    id: null,
    acceptanceDate: null,
    comments: "",
    dibujoPlanoId: null,
    estado: "",
  });
  const [selectedDibujoPlano, setSelectedDibujoPlano] = useState(null);
  const [clienteName, setClienteName] = useState("");

  useEffect(() => {
    loadDibujosPlano();
    loadPrerequisitosPlano();
    loadAceptacionesPlano();
  }, []);

  const loadDibujosPlano = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v2/dibujos-planos`
      );
      console.log("Dibujos plano cargados:", response.data);
      setDibujosPlano(response.data);
    } catch (error) {
      console.error("Error fetching dibujos plano:", error);
    }
  };

  const loadPrerequisitosPlano = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v2/prerequisitos-no-vinculados`
      );
      setPrerequisitosPlano(response.data);
    } catch (error) {
      console.error("Error fetching prerequisitos plano no vinculados:", error);
    }
  };

  const loadAceptacionesPlano = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v2/aceptacion-planos`
      );
      console.log("Aceptaciones plano cargadas:", response.data);
      setAceptacionesPlano(response.data);
    } catch (error) {
      console.error("Error fetching aceptaciones plano:", error);
    }
  };

  const handleInputChange = (value, field) => {
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      [field]: value,
    }));
  };

  const handlePrerequisitoChange = (value) => {
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      prerequisitoPlanoId: value,
    }));

    const selectedPrerequisito = prerequisitosPlano.find(
      (prerequisito) => prerequisito.id === value
    );
    if (selectedPrerequisito) {
      setClienteName(selectedPrerequisito.clienteFullName || "");
    } else {
      setClienteName("");
    }
  };

  const model = Schema.Model({
    atmosphere: StringType().isRequired("La atmósfera es requerida"),
    circulationFlow: StringType().isRequired(
      "El flujo de circulación es requerido"
    ),
    funcionality: StringType().isRequired("La funcionalidad es requerida"),
    dimensions: StringType().isRequired("Las dimensiones son requeridas"),
    prerequisitoPlanoId: NumberType().isRequired(
      "El prerequisito de plano es requerido"
    ),
    codDiseño: StringType().isRequired("El código de diseño es requerido"),
  });

  const modelAceptacion = Schema.Model({
    acceptanceDate: DateType().isRequired(
      "La fecha de aceptación es requerida"
    ),
    comments: StringType().isRequired("Los comentarios son requeridos"),
    estado: StringType().isRequired("El estado es requerido"),
  });

  const handleCreateDibujoPlano = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v2/dibujo-plano`,
        formValue
      );
      console.log("Dibujo plano creado:", response.data);
      setShowModalCreate(false);
      loadDibujosPlano();
      resetFormValue();
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Diseño de plano creado con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error creating dibujo plano:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al crear el diseño de plano.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const handleUpdateDibujoPlano = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v2/dibujo-planos/${selectedDibujoPlano.id}`,
        formValue
      );
      console.log("Dibujo plano actualizado:", response.data);
      setShowModalEdit(false);
      loadDibujosPlano();
      resetFormValue();
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Diseño de plano actualizado con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error updating dibujo plano:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al actualizar el diseño de plano.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const resetFormValue = () => {
    setFormValue({
      atmosphere: "",
      circulationFlow: "",
      funcionality: "",
      dimensions: "",
      prerequisitoPlanoId: "",
      codDiseño: "",
      estado: "En Espera",
    });
    setClienteName("");
  };

  const resetFormValueAceptacion = () => {
    setFormValueAceptacion({
      id: null,
      acceptanceDate: null,
      comments: "",
      dibujoPlanoId: null,
      estado: "",
    });
  };

  const handleEditDibujoPlano = async (rowData) => {
    setSelectedDibujoPlano(rowData);
    setFormValue({
      atmosphere: rowData.atmosphere,
      circulationFlow: rowData.circulationFlow,
      funcionality: rowData.funcionality,
      dimensions: rowData.dimensions,
      prerequisitoPlanoId: rowData.prerequisitoPlanoId,
      codDiseño: rowData.codDiseño,
      estado: rowData.estado,
    });

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v2/prerequisito/${rowData.prerequisitoPlanoId}`
      );
      const prerequisitoPlano = response.data;
      setClienteName(prerequisitoPlano.clienteFullName || "");
    } catch (error) {
      console.error("Error fetching prerequisito plano:", error);
      setClienteName("");
    }

    setShowModalEdit(true);
  };

  const handleCloseModal = () => {
    setShowModalCreate(false);
    setShowModalEdit(false);
    setSelectedDibujoPlano(null);
    resetFormValue();
  };

  const handleInputChangeAceptacion = (value, field) => {
    setFormValueAceptacion((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleEditAceptacionPlano = (aceptacion) => {
    setFormValueAceptacion({
      id: aceptacion.id,
      acceptanceDate: new Date(aceptacion.acceptanceDate),
      comments: aceptacion.comments,
      dibujoPlanoId: aceptacion.dibujoPlanoId,
      estado: aceptacion.estado,
    });
    setShowModalAceptacion(true);
  };

  const handleUpdateAceptacionPlano = async () => {
    try {
      let response;
      if (formValueAceptacion.id) {
        response = await axios.put(
          `${API_BASE_URL}/api/v2/aceptacion-planos/${formValueAceptacion.id}`,
          formValueAceptacion
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/api/v2/aceptacion-plano`,
          formValueAceptacion
        );
      }
      console.log("Aceptación plano actualizada/creada:", response.data);

      setShowModalAceptacion(false);
      await loadAceptacionesPlano();
      await loadDibujosPlano();
      resetFormValueAceptacion();
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Aceptación de plano{" "}
          {formValueAceptacion.id ? "actualizada" : "creada"} con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error updating/creating aceptación plano:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al {formValueAceptacion.id ? "actualizar" : "crear"} la
          aceptación de plano.
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
        <h2>Planos</h2>
        <Button
          style={{ backgroundColor: "#0E2442" }}
          appearance="primary"
          startIcon={<PlusIcon />}
          onClick={() => setShowModalCreate(true)}
        >
          Nuevo Plano
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
          En este módulo, puedes gestionar los Planos elaborados para los
          requerimientos del cliente. Usa los botones a la derecha para
          gestionar la información del plano correspondiente. Para agregar un
          nuevo plano, haz clic en "Nuevo Plano".
        </p>
      </div>
      <div className="py-4">
        <Table
          height={400}
          wordWrap
          autoHeight
          data={dibujosPlano}
          onRowClick={(rowData) => {
            console.log(rowData);
          }}
        >
          <Column width={100} align="center" fixed>
            <HeaderCell>Cod</HeaderCell>
            <Cell dataKey="codDiseño" />
          </Column>

          <Column width={150}>
            <HeaderCell>Atmósfera</HeaderCell>
            <Cell dataKey="atmosphere" />
          </Column>
          <Column flexGrow={2}>
            <HeaderCell>Flujo de Circulación</HeaderCell>
            <Cell dataKey="circulationFlow" />
          </Column>
          <Column flexGrow={2}>
            <HeaderCell>Funcionalidad</HeaderCell>
            <Cell dataKey="funcionality" />
          </Column>
          <Column flexGrow={2}>
            <HeaderCell>Dimensiones</HeaderCell>
            <Cell dataKey="dimensions" />
          </Column>

          <Column width={150} flexGrow={1}>
            <HeaderCell>Estado</HeaderCell>
            <Cell>
              {(rowData) => {
                const aceptacion = aceptacionesPlano.find(
                  (a) => a.dibujoPlanoId === rowData.id
                );
                const estado = aceptacion ? aceptacion.estado : rowData.estado;
                console.log(
                  "Estado para dibujo plano",
                  rowData.id,
                  ":",
                  estado
                );
                return (
                  <Tag
                    color={
                      estado === "Aceptado"
                        ? "green"
                        : estado === "Rechazado"
                        ? "red"
                        : "orange"
                    }
                  >
                    {estado}
                  </Tag>
                );
              }}
            </Cell>
          </Column>

          <Column width={100} fixed="right">
            <HeaderCell>Aceptación</HeaderCell>
            <Cell>
              {(rowData) => {
                const aceptacion = aceptacionesPlano.find(
                  (a) => a.dibujoPlanoId === rowData.id
                );
                if (aceptacion) {
                  return (
                    <IconButton
                      appearance="subtle"
                      icon={<EditIcon />}
                      onClick={() => handleEditAceptacionPlano(aceptacion)}
                    />
                  );
                } else {
                  return (
                    <IconButton
                      appearance="subtle"
                      icon={<CheckIcon />}
                      onClick={() => {
                        setFormValueAceptacion((prevState) => ({
                          ...prevState,
                          dibujoPlanoId: rowData.id,
                        }));
                        setShowModalAceptacion(true);
                      }}
                    />
                  );
                }
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
                  onClick={() => handleEditDibujoPlano(rowData)}
                />
              )}
            </Cell>
          </Column>
        </Table>
      </div>

      {/* Modal para crear diseño de plano */}
      <Modal open={showModalCreate} onClose={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>Nuevo Diseño de Plano</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="atmosphere">
              <Form.ControlLabel>Atmósfera</Form.ControlLabel>
              <Form.Control
                rows={3}
                name="atmosphere"
                value={formValue.atmosphere}
                onChange={(value) => handleInputChange(value, "atmosphere")}
                accepter={Textarea}
              />
            </Form.Group>
            <Form.Group controlId="circulationFlow">
              <Form.ControlLabel>Flujo de Circulación</Form.ControlLabel>
              <Form.Control
                rows={3}
                name="circulationFlow"
                value={formValue.circulationFlow}
                onChange={(value) =>
                  handleInputChange(value, "circulationFlow")
                }
                accepter={Textarea}
              />
            </Form.Group>
            <Form.Group controlId="funcionality">
              <Form.ControlLabel>Funcionalidad</Form.ControlLabel>
              <Form.Control
                rows={3}
                name="funcionality"
                value={formValue.funcionality}
                onChange={(value) => handleInputChange(value, "funcionality")}
                accepter={Textarea}
              />
            </Form.Group>
            <Form.Group controlId="dimensions">
              <Form.ControlLabel>Dimensiones</Form.ControlLabel>
              <Form.Control
                rows={3}
                name="dimensions"
                value={formValue.dimensions}
                onChange={(value) => handleInputChange(value, "dimensions")}
                accepter={Textarea}
              />
            </Form.Group>
            <Form.Group controlId="prerequisitoPlanoId">
              <Form.ControlLabel>Prerequisito de Plano</Form.ControlLabel>
              <Form.Control
                name="prerequisitoPlanoId"
                value={formValue.prerequisitoPlanoId}
                onChange={(value) => handlePrerequisitoChange(value)}
                accepter={SelectPicker}
                data={prerequisitosPlano.map((prerequisito) => ({
                  label: prerequisito.codReq,
                  value: prerequisito.id,
                }))}
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="clienteName">
              <Form.ControlLabel>Cliente</Form.ControlLabel>
              <Form.Control name="clienteName" value={clienteName} readOnly />
            </Form.Group>
            <Form.Group controlId="codDiseño">
              <Form.ControlLabel>Código de Diseño</Form.ControlLabel>
              <Form.Control
                name="codDiseño"
                value={formValue.codDiseño}
                onChange={(value) => handleInputChange(value, "codDiseño")}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateDibujoPlano} appearance="primary">
            Crear
          </Button>
          <Button onClick={handleCloseModal} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar diseño de plano */}
      <Modal open={showModalEdit} onClose={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>Editar Diseño de Plano</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={model}>
            <Form.Group controlId="atmosphere">
              <Form.ControlLabel>Atmósfera</Form.ControlLabel>
              <Form.Control
                rows={3}
                name="atmosphere"
                value={formValue.atmosphere}
                onChange={(value) => handleInputChange(value, "atmosphere")}
                accepter={Textarea}
              />
            </Form.Group>
            <Form.Group controlId="circulationFlow">
              <Form.ControlLabel>Flujo de Circulación</Form.ControlLabel>
              <Form.Control
                rows={3}
                name="circulationFlow"
                value={formValue.circulationFlow}
                onChange={(value) =>
                  handleInputChange(value, "circulationFlow")
                }
                accepter={Textarea}
              />
            </Form.Group>
            <Form.Group controlId="funcionality">
              <Form.ControlLabel>Funcionalidad</Form.ControlLabel>
              <Form.Control
                rows={3}
                name="funcionality"
                value={formValue.funcionality}
                onChange={(value) => handleInputChange(value, "funcionality")}
                accepter={Textarea}
              />
            </Form.Group>
            <Form.Group controlId="dimensions">
              <Form.ControlLabel>Dimensiones</Form.ControlLabel>
              <Form.Control
                rows={3}
                name="dimensions"
                value={formValue.dimensions}
                onChange={(value) => handleInputChange(value, "dimensions")}
                accepter={Textarea}
              />
            </Form.Group>
            <Form.Group controlId="prerequisitoPlanoId">
              <Form.ControlLabel>Prerequisito de Plano</Form.ControlLabel>
              <Form.Control
                name="prerequisitoPlanoId"
                value={formValue.prerequisitoPlanoId}
                onChange={(value) => handlePrerequisitoChange(value)}
                accepter={SelectPicker}
                data={prerequisitosPlano.map((prerequisito) => ({
                  label: prerequisito.codReq,
                  value: prerequisito.id,
                }))}
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="clienteName">
              <Form.ControlLabel>Cliente</Form.ControlLabel>
              <Form.Control name="clienteName" value={clienteName} readOnly />
            </Form.Group>
            <Form.Group controlId="codDiseño">
              <Form.ControlLabel>Código de Diseño</Form.ControlLabel>
              <Form.Control
                name="codDiseño"
                value={formValue.codDiseño}
                onChange={(value) => handleInputChange(value, "codDiseño")}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpdateDibujoPlano} appearance="primary">
            Guardar Cambios
          </Button>
          <Button onClick={handleCloseModal} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para crear/editar aceptación de plano */}
      <Modal
        open={showModalAceptacion}
        onClose={() => {
          setShowModalAceptacion(false);
          resetFormValueAceptacion();
        }}
      >
        <Modal.Header>
          <Modal.Title>
            {formValueAceptacion.id ? "Editar" : "Nueva"} Aceptación de Plano
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid model={modelAceptacion}>
            <Form.Group controlId="acceptanceDate">
              <Form.ControlLabel>Fecha de Aceptación</Form.ControlLabel>
              <Form.Control
                name="acceptanceDate"
                accepter={DatePicker}
                value={formValueAceptacion.acceptanceDate}
                onChange={(value) =>
                  handleInputChangeAceptacion(value, "acceptanceDate")
                }
              />
            </Form.Group>
            <Form.Group controlId="comments">
              <Form.ControlLabel>Comentarios</Form.ControlLabel>
              <Form.Control
                rows={3}
                name="comments"
                accepter={Textarea}
                value={formValueAceptacion.comments}
                onChange={(value) =>
                  handleInputChangeAceptacion(value, "comments")
                }
              />
            </Form.Group>
            <Form.Group controlId="estado">
              <Form.ControlLabel>Estado</Form.ControlLabel>
              <Form.Control
                name="estado"
                accepter={SelectPicker}
                data={[
                  { label: "Aceptado", value: "Aceptado" },
                  { label: "Rechazado", value: "Rechazado" },
                  { label: "En Revisión", value: "En Revisión" },
                ]}
                value={formValueAceptacion.estado}
                onChange={(value) =>
                  handleInputChangeAceptacion(value, "estado")
                }
                style={{ width: "100%" }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpdateAceptacionPlano} appearance="primary">
            {formValueAceptacion.id ? "Actualizar" : "Crear"}
          </Button>
          <Button
            onClick={() => {
              setShowModalAceptacion(false);
              resetFormValueAceptacion();
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

export default DiseñosPlano;
