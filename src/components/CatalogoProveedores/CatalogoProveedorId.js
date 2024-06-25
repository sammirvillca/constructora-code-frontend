import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Table, Button, IconButton, Modal, Form, Schema, Message, toaster } from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import ArrowLeftIcon from "@rsuite/icons/ArrowLeft";
import PlusIcon from "@rsuite/icons/Plus";
const { Column, HeaderCell, Cell } = Table;

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
  material: StringType().isRequired("El nombre del material es obligatorio."),
  amountMaterial: NumberType()
    .isInteger("Debe ser un número entero.")
    .isRequired("La cantidad es obligatoria."),
  cost: NumberType().isRequired("El costo es obligatorio."),
});

const CatalogoProveedorId = () => {
  const { id } = useParams();
  const [catalogo, setCatalogo] = useState([]);
  const [proveedor, setProveedor] = useState({});
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editedMaterialId, setEditedMaterialId] = useState(null);
  const [formData, setFormData] = useState({
    material: "",
    amountMaterial: 0,
    cost: 0.0,
  });

  useEffect(() => {
    fetchCatalogo();
  }, []);

  const fetchCatalogo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v2/catalogos-proveedor/proveedor/${id}`
      );
      setCatalogo(response.data);
    } catch (error) {
      console.error("Error fetching catalogo:", error);
    }
  };


  const handleInputChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (editedMaterialId) {
        await axios.put(
          `http://localhost:8080/api/v2/catalogos-proveedor/${editedMaterialId}`,
          formData
        );
        setCatalogo((prevCatalogo) =>
          prevCatalogo.map((item) =>
            item.id === editedMaterialId ? { ...item, ...formData } : item
          )
        );
        toaster.push(
          <Message type="success" header="Éxito" duration={5000}>
            Material actualizado con éxito.
          </Message>,
          { placement: "topEnd" }
        );
      } else {
        const response = await axios.post(
          "http://localhost:8080/api/v2/catalogo-proveedor",
          {
            ...formData,
            proveedorId: id,
          }
        );
        setCatalogo([...catalogo, response.data]);
        toaster.push(
          <Message type="success" header="Éxito" duration={5000}>
            Material agregado con éxito.
          </Message>,
          { placement: "topEnd" }
        );
      }
      resetForm();
      setShowModalCreate(false);
      setShowModalEdit(false);
    } catch (error) {
      console.error("Error saving material:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al guardar el material.
        </Message>,
        { placement: "topEnd" }
      );
    }
  };

  const handleEditMaterial = (rowData) => {
    setEditedMaterialId(rowData.id);
    setFormData({
      material: rowData.material,
      amountMaterial: rowData.amountMaterial,
      cost: rowData.cost,
    });
    setShowModalEdit(true);
  };

  const resetForm = () => {
    setFormData({ material: "", amountMaterial: 0, cost: 0.0 });
    setEditedMaterialId(null);
  };

  const handleCancel = () => {
    resetForm();
    setShowModalCreate(false);
    setShowModalEdit(false);
  };

  const handleDeleteMaterial = (materialId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este material?")) {
      deleteMaterial(materialId);
    }
  };

  const deleteMaterial = async (materialId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v2/catalogos-proveedor/${materialId}`
      );
      setCatalogo(catalogo.filter((item) => item.id !== materialId));
      toaster.push(
        <Message type="success" header="Éxito" duration={5000}>
          Material eliminado con éxito.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (error) {
      console.error("Error deleting material:", error);
      toaster.push(
        <Message type="error" header="Error" duration={5000}>
          Error al eliminar el material.
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
        <h2>Catálogo del Proveedor</h2>
        <Button
          style={{ backgroundColor: "#0E2442" }}
          appearance="primary"
          startIcon={<ArrowLeftIcon />}
          as={Link}
          to="/proveedores"
        >
          Volver a Proveedores
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <h3>Lista de Materiales</h3>
        <Button
          appearance="primary"
          style={{ backgroundColor: "#0E2442" }}
          startIcon={<PlusIcon />}
          onClick={() => setShowModalCreate(true)}
        >
          Agregar Material
        </Button>
      </div>
      <div className="py-4">
        <Table
          height={400}
          wordWrap
          autoHeight
          data={catalogo}
          onRowClick={(rowData) => {
            console.log(rowData);
          }}
        >
          <Column width={50} align="center" fixed>
            <HeaderCell>#</HeaderCell>
            <Cell>{(rowData, rowIndex) => <span>{rowIndex + 1}</span>}</Cell>
          </Column>
          <Column flexGrow={2}>
            <HeaderCell>Material</HeaderCell>
            <Cell dataKey="material" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Cantidad</HeaderCell>
            <Cell dataKey="amountMaterial" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Costo Unitario</HeaderCell>
            <Cell dataKey="cost" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Costo Total</HeaderCell>
            <Cell>
              {(rowData) =>
                `$${(rowData.amountMaterial * rowData.cost).toFixed(2)}`
              }
            </Cell>
          </Column>
          <Column width={100} fixed="right">
            <HeaderCell>Editar</HeaderCell>
            <Cell>
              {(rowData) => (
                <IconButton
                  appearance="default"
                  icon={<EditIcon />}
                  onClick={() => handleEditMaterial(rowData)}
                ></IconButton>
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
                  onClick={() => handleDeleteMaterial(rowData.id)}
                ></IconButton>
              )}
            </Cell>
          </Column>
        </Table>
      </div>
      {/* Modal para agregar material */}
      <Modal open={showModalCreate} onClose={handleCancel}>
        <Modal.Header>
          <Modal.Title>Agregar Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            model={model}
            formValue={formData}
            onChange={(formValue) => setFormData(formValue)}
          >
            <Form.Group controlId="material">
              <Form.ControlLabel>Material</Form.ControlLabel>
              <Form.Control name="material" />
            </Form.Group>
            <Form.Group controlId="amountMaterial">
              <Form.ControlLabel>Cantidad</Form.ControlLabel>
              <Form.Control name="amountMaterial" type="number" />
            </Form.Group>
            <Form.Group controlId="cost">
              <Form.ControlLabel>Costo Unitario</Form.ControlLabel>
              <Form.Control name="cost" type="number" step="0.01" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary">
            Guardar
          </Button>
          <Button onClick={handleCancel} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal para editar material */}
      <Modal open={showModalEdit} onClose={handleCancel}>
        <Modal.Header>
          <Modal.Title>Editar Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            model={model}
            formValue={formData}
            onChange={(formValue) => setFormData(formValue)}
          >
            <Form.Group controlId="material">
              <Form.ControlLabel>Material</Form.ControlLabel>
              <Form.Control name="material" />
            </Form.Group>
            <Form.Group controlId="amountMaterial">
              <Form.ControlLabel>Cantidad</Form.ControlLabel>
              <Form.Control name="amountMaterial" type="number" />
            </Form.Group>
            <Form.Group controlId="cost">
              <Form.ControlLabel>Costo Unitario</Form.ControlLabel>
              <Form.Control name="cost" type="number" step="0.01" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary">
            Guardar
          </Button>
          <Button onClick={handleCancel} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CatalogoProveedorId;