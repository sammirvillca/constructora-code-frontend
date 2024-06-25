import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CloseIcon from "@rsuite/icons/Close";
import CheckIcon from "@rsuite/icons/Check";
import { Button, ButtonToolbar } from "rsuite";
import axios from "axios";

const EditClientes = () => {
  let navigate = useNavigate();
  const { id } = useParams();

  const [cliente, setCliente] = useState({
    fullName: "",
    address: "",
    email: "",
    phone: "",
    numero: 0,
    codCliente: "",
  });

  const { fullName, address, email, phone, numero, codCliente } = cliente;

  useEffect(() => {
    loadCliente();
  }, []);

  const loadCliente = async () => {
    const result = await axios.get(
      `http://localhost:8080/api/v2/clientes/${id}`
    );
    setCliente(result.data);
  };

  const handleInputChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const updateCliente = async (e) => {
    e.preventDefault();
    console.log("Actualizando cliente...");
    await axios.put(`http://localhost:8080/api/v2/clientes/${id}`, cliente);
    navigate("/clientes");
  };

  return (
    <div className="container" style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Editar Cliente</h2>
      </div>
      <div className="py-4">
        <form onSubmit={updateCliente}>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="fullName">
              Nombre Cliente
            </label>
            <div className="col-sm-4">
              <input
                className="form-control"
                type="text"
                name="fullName"
                id="fullName"
                required
                value={fullName}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="address">
              Dirección
            </label>
            <div className="col-sm-4">
              <input
                className="form-control"
                type="text"
                name="address"
                id="address"
                required
                value={address}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="email">
              Email
            </label>
            <div className="col-sm-4">
              <input
                className="form-control"
                type="email"
                name="email"
                id="email"
                required
                value={email}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="phone">
              Celular
            </label>
            <div className="col-sm-4">
              <input
                className="form-control"
                type="text"
                name="phone"
                id="phone"
                required
                value={phone}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="codCliente">
              Código de Cliente
            </label>
            <div className="col-sm-4">
              <input
                className="form-control"
                type="text"
                name="codCliente"
                id="codCliente"
                required
                value={codCliente}
                onChange={(e) => handleInputChange(e)}
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
                Guardar
              </Button>
              <Button
                color="red"
                appearance="primary"
                startIcon={<CloseIcon />}
                as={Link}
                to="/clientes"
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

export default EditClientes;
