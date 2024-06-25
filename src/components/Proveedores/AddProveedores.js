import { Link, useNavigate } from "react-router-dom";
import { Button, ButtonToolbar } from "rsuite";
import CloseIcon from "@rsuite/icons/Close";
import CheckIcon from "@rsuite/icons/Check";
import { useState } from "react";
import axios from "axios";

const AddProveedores = () => {
    let navigate = useNavigate();

    const [proveedor, setProveedor] = useState({
        name:'',
        address:'',
        city:'',
        country:'',
        phone:'',
        email:'',
        numero: 0,
    });

    const {
        name,
        address,
        city,
        country,
        phone,
        email,
        numero
    } = proveedor;

    const handleInputChange = (e) => {
        setProveedor({
            ...proveedor,
            [e.target.name] : e.target.value,
        });
    };

    const saveProveedor = async (e) => {
        e.preventDefault();
        console.log("Guardando proveedor...");
        await axios.post("http://localhost:8080/api/v2/proveedor", proveedor);
        navigate("/proveedores");
    };

    

    return (
      <div className="container" style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Nuevo Proveedor</h2>
        </div>
    
        <div className="py-4">
          <form onSubmit={saveProveedor}>
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

export default AddProveedores;
