import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CloseIcon from "@rsuite/icons/Close";
import CheckIcon from "@rsuite/icons/Check";
import { Button, ButtonToolbar } from "rsuite";
import axios from "axios";

const EditProveedores = () => {
  let navigate = useNavigate();
  const { id } = useParams();

  const [proveedor, setProveedor] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    numero: 0,
  });

  const { name, address, email, phone, city, country, numero } = proveedor;

  useEffect(() => {
    loadProveedor();
  }, []);

  const loadProveedor = async () => {
    const result = await axios.get(
      `http://localhost:8080/api/v2/proveedor/${id}`
    );
    setProveedor(result.data);
  };

  const handleInputChange = (e) => {
    setProveedor({ ...proveedor, [e.target.name]: e.target.value });
  };

  const updateProveedor = async (e) => {
    e.preventDefault();
    console.log("Actualizando proveedor...");
    await axios.put(
      `http://localhost:8080/api/v2/proveedores/${id}`,
      proveedor
    );
    navigate("/proveedores");
  };
  return (
    <div className="container" style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Editar Proveedor</h2>
      </div>
      <div className="py-4">
        <form onSubmit={updateProveedor}>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="name">
              Empresa
            </label>
            <div className="col-sm-4">
              <input
                className="form-control"
                type="text"
                name="name"
                id="name"
                required
                value={name}
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
              Teléfono
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
            <label className="col-sm-2 col-form-label" htmlFor="city">
              Ciudad
            </label>
            <div className="col-sm-4">
              <input
                className="form-control"
                type="text"
                name="city"
                id="city"
                required
                value={city}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="country">
              País
            </label>
            <div className="col-sm-4">
              <input
                className="form-control"
                type="text"
                name="country"
                id="country"
                required
                value={country}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="numero">
              Codigo de Proveedor
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
                to="/proveedores"
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

export default EditProveedores;
