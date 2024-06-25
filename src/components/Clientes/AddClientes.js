import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from "@rsuite/icons/Close";
import CheckIcon from "@rsuite/icons/Check";
import { Button, ButtonToolbar } from "rsuite";
import axios from "axios";
const AddClientes = () => {
  let navigate = useNavigate();

  const [cliente, setCliente] = useState({
    fullName: "",
    address: "",
    email: "",
    phone: "",
    numero: 0,
  });

  const { fullName, address, email, phone, numero } = cliente;

  const handleInputChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  const saveCliente = async (e) => {
    e.preventDefault();
    console.log("Guardando cliente...");
    await axios.post("http://localhost:8080/api/v2/cliente", cliente);
    navigate("/clientes");
  };

  return (
    <div className="container" style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Nuevo Cliente</h2>
      </div>

      <div className="py-4">
        <form onSubmit={saveCliente}>
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
            <label className="col-sm-2 col-form-label" htmlFor="numero">
              Codigo de Cliente
            </label>
            <div className="col-sm-4">
              <input
                className="form-control"
                type="number"
                name="numero"
                id="numero"
                required
                value={numero}
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

export default AddClientes;
