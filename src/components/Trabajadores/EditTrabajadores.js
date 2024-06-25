import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import CloseIcon from "@rsuite/icons/Close";
import CheckIcon from "@rsuite/icons/Check";
import { Button, ButtonToolbar } from "rsuite";

const EditTrabajadores = () => {
  let navigate = useNavigate();

  const { id } = useParams();

  const [trabajador, setTrabajador] = useState({
    fullName: "",
    identityCard: "",
    rol: "",
    address: "",
    email: "",
    phone: "",
    numero: 0, // Agregar el campo numero
  });

  const { fullName, identityCard, rol, address, email, phone, numero } = trabajador;

  useEffect(() => {
    loadTrabajador();
  }, []);

  const loadTrabajador = async () => {
    const result = await axios.get(
      `http://localhost:8080/api/v2/trabajador/${id}`
    );
    setTrabajador(result.data);
  };

  const handleInputChange = (e) => {
    setTrabajador({
      ...trabajador,
      [e.target.name]: e.target.value,
    });
  };

  const updateTrabajador = async (e) => {
    e.preventDefault();
    await axios.put(
      `http://localhost:8080/api/v2/trabajadores/${id}`,
      trabajador
    );
    navigate("/trabajadores");
  };

  return (
    <div className="container" style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Editar Trabajador</h2>
      </div>
      <div className="py-4">
        <form onSubmit={updateTrabajador}>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="fullName">
              Nombre Completo
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
            <label className="col-sm-2 col-form-label" htmlFor="identityCard">
              CI
            </label>
            <div className="col-sm-4">
              <input
                className="form-control"
                type="text"
                name="identityCard"
                id="identityCard"
                required
                value={identityCard}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="rol">
              Rol
            </label>
            <div className="col-sm-4">
            <select
                className="form-control"
                type="text"
                name="rol"
                id="rol"
                required
                value={rol}
                onChange={(e) => handleInputChange(e)}
              >
                <option value=""></option>
                <option value="Arquitecto">Arquitecto</option>
                <option value="Obrero">Obrero</option>
                <option value="Ing. Civil">Ing. Civil</option>
                <option value="Administracion">Administración</option>
              </select>
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
              Codigo de Trabajador
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
                to="/trabajadores"
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

export default EditTrabajadores;
