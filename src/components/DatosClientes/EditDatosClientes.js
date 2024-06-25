import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CloseIcon from "@rsuite/icons/Close";
import CheckIcon from "@rsuite/icons/Check";
import { Button, ButtonToolbar, SelectPicker } from 'rsuite';
import axios from 'axios';

const EditDatosClientes = () => {
  const { id } = useParams();
  let navigate = useNavigate();

  const [datosCliente, setDatosCliente] = useState({
    groundDirection: '',
    landArea: '',
    typeConstruction: '',
    propertyDoc: null,
    cliente: null,
  });

  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    loadDatosCliente();
    loadClientes();
  }, []);

  const loadDatosCliente = async () => {
    const result = await axios.get(`http://localhost:8080/api/v1/datos-cliente/${id}`);
    setDatosCliente(result.data);
  };

  const loadClientes = async () => {
    const result = await axios.get("http://localhost:8080/api/v1/clientes");
    setClientes(result.data.map(cliente => ({ label: cliente.fullName, value: cliente.id })));
  };

  const { groundDirection, landArea, typeConstruction, propertyDoc, cliente } = datosCliente;

  const handleInputChange = (e) => {
    setDatosCliente({ ...datosCliente, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setDatosCliente({ ...datosCliente, propertyDoc: e.target.files[0] });
  };

  const handleClienteChange = (value) => {
    setDatosCliente({ ...datosCliente, cliente: { id: value } });
  };

  const updateDatosCliente = async (e) => {
    e.preventDefault();
    console.log("Actualizando datos cliente...");

    const formData = new FormData();
    formData.append("groundDirection", groundDirection);
    formData.append("landArea", landArea);
    formData.append("typeConstruction", typeConstruction);
    formData.append("propertyDoc", propertyDoc);
    formData.append("cliente", JSON.stringify(cliente));

    await axios.put(`http://localhost:8080/api/v1/datos-cliente/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    navigate("/datosclientes");
  };

  return (
    <div className="container" style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Editar Datos Cliente</h2>
      </div>
      <div className="py-4">
        <form onSubmit={updateDatosCliente}>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="cliente">
              Cliente
            </label>
            <div className="col-sm-4">
              <SelectPicker
                data={clientes}
                value={cliente?.id}
                onChange={handleClienteChange}
                searchable={true}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="groundDirection">
              Dirección Terreno
            </label>
            <div className="col-sm-4">
              <input
                className="form-control"
                type="text"
                name="groundDirection"
                id="groundDirection"
                required
                value={groundDirection}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="landArea">
              Área Terreno
            </label>
            <div className="col-sm-4">
              <input
                className="form-control"
                type="text"
                name="landArea"
                id="landArea"
                required
                value={landArea}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="typeConstruction">
              Tipo Construcción
            </label>
            <div className="col-sm-4">
              <input
                className="form-control"
                type="text"
                name="typeConstruction"
                id="typeConstruction"
                required
                value={typeConstruction}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="propertyDoc">
              Documento Propiedad
            </label>
            <div className="col-sm-4">
              <input
                className="form-control"
                type="file"
                name="propertyDoc"
                id="propertyDoc"
                onChange={(e) => handleFileChange(e)}
              />
            </div>
          </div>
          <div className="row mb-5">
            <ButtonToolbar>
              <Button
                color="green"
                appearance="primary"
                startIcon={<CheckIcon />}
                type="submit"
              >
                Actualizar
              </Button>
              <Button
                color="red"
                appearance="primary"
                startIcon={<CloseIcon />}
                as={Link}
                to="/datosclientes"
              >
                Cancelar
              </Button>
            </ButtonToolbar>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDatosClientes;