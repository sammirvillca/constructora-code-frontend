import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  Button,
  Table,
  DatePicker,
  Modal,
  Form,
  SelectPicker,
  InputNumber,
  toaster,
  Message,
  IconButton,
} from "rsuite";
import ArrowLeftIcon from "@rsuite/icons/ArrowLeft";
import PlusIcon from "@rsuite/icons/Plus";
import TrashIcon from "@rsuite/icons/Trash";
import { API_BASE_URL } from "../../Config/Config";
const { Column, HeaderCell, Cell } = Table;

const ListaDeMaterialesPorProyecto = () => {
  const { id } = useParams();
  const [pedidos, setPedidos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [formData, setFormData] = useState({
    orderDate: null,
    amountMaterial: null,
    catalogoProveedorId: null,
  });
  const [proveedores, setProveedores] = useState([]);
  const [catalogosProveedor, setCatalogosProveedor] = useState([]);
  const [selectedProveedorId, setSelectedProveedorId] = useState(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  useEffect(() => {
    fetchPedidosMateriales();
  }, []);

  const fetchPedidosMateriales = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v2/proyecto/${id}/ordenes-pedido-material`
      );
      setPedidos(response.data);
    } catch (error) {
      console.error("Error fetching pedidos de materiales:", error);
    }
  };

  const handleOpenModal = async () => {
    setShowModal(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v2/proveedores`
      );
      setProveedores(response.data);
    } catch (error) {
      console.error("Error fetching proveedores:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetFormData();
  };

  const handleProveedorChange = async (proveedorId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v2/proveedor/${proveedorId}/catalogos`
      );
      setCatalogosProveedor(response.data);
      setSelectedProveedorId(proveedorId);
      setFormData({ ...formData, catalogoProveedorId: null });
    } catch (error) {
      console.error("Error fetching catálogos de proveedor:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/v2/orden-pedido-material`, {
        ...formData,
        proyectoId: id,
      });
      fetchPedidosMateriales();
      handleCloseModal();
      toaster.push(
        <Message type="success">Pedido agregado correctamente</Message>,
        { placement: "topEnd", duration: 3000 }
      );
    } catch (error) {
      console.error("Error agregando pedido:", error);
      toaster.push(<Message type="error">Error al agregar el pedido</Message>, {
        placement: "topEnd",
        duration: 3000,
      });
    }
  };

  const resetFormData = () => {
    setFormData({
      orderDate: null,
      amountMaterial: null,
      catalogoProveedorId: null,
    });
    setSelectedProveedorId(null);
    setCatalogosProveedor([]);
  };

  const handleEditarPedido = (pedido) => {
    setPedidoSeleccionado(pedido);
    setFormData({
      orderDate: pedido.orderDate,
      amountMaterial: pedido.amountMaterial,
      catalogoProveedorId: pedido.catalogoProveedorId,
    });
    setSelectedProveedorId(pedido.proveedorId);
    setShowModalEditar(true);
  };

  const handleActualizarPedido = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/v2/orden-pedido-materiales/${pedidoSeleccionado.id}`,
        formData
      );
      fetchPedidosMateriales();
      setShowModalEditar(false);
      toaster.push(
        <Message type="success">Pedido actualizado correctamente</Message>,
        { placement: "topEnd", duration: 3000 }
      );
    } catch (error) {
      console.error("Error actualizando pedido:", error);
      toaster.push(
        <Message type="error">Error al actualizar el pedido</Message>,
        { placement: "topEnd", duration: 3000 }
      );
    }
  };

  const handleEliminarPedido = async (pedidoId) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este pedido?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `${API_BASE_URL}/api/v2/orden-pedido-materiales/${pedidoId}`
        );
        fetchPedidosMateriales();
        toaster.push(
          <Message type="success">Pedido eliminado correctamente</Message>,
          { placement: "topEnd", duration: 3000 }
        );
      } catch (error) {
        console.error("Error eliminando pedido:", error);
        toaster.push(
          <Message type="error">Error al eliminar el pedido</Message>,
          { placement: "topEnd", duration: 3000 }
        );
      }
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
        <h2>Lista de Ordenes de Materiales del Proyecto</h2>
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
        <h3>Lista de Materiales</h3>
        <Button
          appearance="primary"
          style={{ backgroundColor: "#0E2442" }}
          startIcon={<PlusIcon />}
          onClick={handleOpenModal}
        >
          Agregar Pedidos
        </Button>
      </div>
      <div className="py-4">
        <Table height={400}
          wordWrap
          autoHeight
          data={pedidos}
          onRowClick={(rowData) => {
            console.log(rowData);
          }}>
          <Column width={50} align="center">
            <HeaderCell>#</HeaderCell>
            <Cell>{(rowData, rowIndex) => <span>{rowIndex + 1}</span>}</Cell>
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>Proveedor</HeaderCell>
            <Cell dataKey="proveedorNombre" />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>Material</HeaderCell>
            <Cell dataKey="materialNombre" />
          </Column>

          <Column flexGrow={2} align="center">
            <HeaderCell>Fecha de Pedido</HeaderCell>
            <Cell>
              {(rowData) => (
                <DatePicker
                  format="yyyy-MM-dd"
                  value={new Date(rowData.orderDate)}
                  readOnly
                  block
                  style={{ width: "100%" }}
                />
              )}
            </Cell>
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>Cantidad</HeaderCell>
            <Cell dataKey="amountMaterial" />
          </Column>

          <Column width={100} fixed="right">
            <HeaderCell>Eliminar</HeaderCell>
            <Cell>
              {(rowData) => (
                <IconButton
                  appearance="subtle"
                  icon={<TrashIcon />}
                  onClick={() => handleEliminarPedido(rowData.id)}
                />
              )}
            </Cell>
          </Column>
        </Table>
      </div>
      <Modal open={showModal} onClose={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>Agregar Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            <Form.Group controlId="proveedorId">
              <Form.ControlLabel>Proveedor</Form.ControlLabel>
              <Form.Control
                accepter={SelectPicker}
                data={proveedores}
                valueKey="id"
                labelKey="name"
                value={selectedProveedorId}
                onChange={handleProveedorChange}
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="catalogoProveedorId">
              <Form.ControlLabel>Material</Form.ControlLabel>
              <Form.Control
                accepter={SelectPicker}
                data={catalogosProveedor}
                valueKey="id"
                labelKey="material"
                value={formData.catalogoProveedorId}
                onChange={(value) =>
                  setFormData({ ...formData, catalogoProveedorId: value })
                }
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="orderDate">
              <Form.ControlLabel>Fecha de Pedido</Form.ControlLabel>
              <Form.Control
                accepter={DatePicker}
                value={formData.orderDate}
                onChange={(value) =>
                  setFormData({ ...formData, orderDate: value })
                }
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="amountMaterial">
              <Form.ControlLabel>Cantidad</Form.ControlLabel>
              <Form.Control
                accepter={InputNumber}
                value={formData.amountMaterial}
                onChange={(value) =>
                  setFormData({ ...formData, amountMaterial: value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" onClick={handleSubmit}>
            Agregar
          </Button>
          <Button appearance="subtle" onClick={handleCloseModal}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal open={showModalEditar} onClose={() => setShowModalEditar(false)}>
        <Modal.Header>
          <Modal.Title>Editar Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            <Form.Group controlId="proveedorId">
              <Form.ControlLabel>Proveedor</Form.ControlLabel>
              <Form.Control
                accepter={SelectPicker}
                data={proveedores}
                valueKey="id"
                labelKey="name"
                value={selectedProveedorId}
                onChange={handleProveedorChange}
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="catalogoProveedorId">
              <Form.ControlLabel>Material</Form.ControlLabel>
              <Form.Control
                accepter={SelectPicker}
                data={catalogosProveedor}
                valueKey="id"
                labelKey="material"
                value={formData.catalogoProveedorId}
                onChange={(value) =>
                  setFormData({ ...formData, catalogoProveedorId: value })
                }
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="orderDate">
              <Form.ControlLabel>Fecha de Pedido</Form.ControlLabel>
              <Form.Control
                accepter={DatePicker}
                value={formData.orderDate}
                onChange={(value) =>
                  setFormData({ ...formData, orderDate: value })
                }
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group controlId="amountMaterial">
              <Form.ControlLabel>Cantidad</Form.ControlLabel>
              <Form.Control
                accepter={InputNumber}
                value={formData.amountMaterial}
                onChange={(value) =>
                  setFormData({ ...formData, amountMaterial: value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" onClick={handleActualizarPedido}>
            Actualizar
          </Button>
          <Button appearance="subtle" onClick={() => setShowModalEditar(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListaDeMaterialesPorProyecto;
