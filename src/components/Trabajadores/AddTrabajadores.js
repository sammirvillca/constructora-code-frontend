import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ButtonToolbar, Button } from "rsuite";
import CloseIcon from "@rsuite/icons/Close";
import CheckIcon from "@rsuite/icons/Check";

const AddTrabajadores = () => {
  let navigate = useNavigate();

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

  const handleInputChange = (e) => {
    setTrabajador({
      ...trabajador,
      [e.target.name]: e.target.value,
    });
  };

  const saveTrabajador = async (e) => {
    e.preventDefault();
    console.log("Guardando proveedor...");
    await axios.post("http://localhost:8080/api/v2/trabajador", trabajador);
    navigate("/trabajadores");
  };

  return (
    <div className="container" style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2> Nuevo Trabajador </h2>
      </div>

      <div className="py-4">
        <form onSubmit={saveTrabajador}>
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
            {/* <div className="col-sm-2">
              <button type="submit" className="btn btn-outline-success btn-lg">
                Guardar
              </button>
            </div>
            <div className="col-sm-2">
              <Link
                to={"/trabajadores"}
                type="submit"
                className="btn btn-outline-warning btn-lg"
              >
                Cancelar
              </Link>
            </div> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTrabajadores;
