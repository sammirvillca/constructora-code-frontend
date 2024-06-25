import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, ButtonToolbar } from "rsuite";
import CloseIcon from "@rsuite/icons/Close";
import CheckIcon from "@rsuite/icons/Check";
import axios from "axios";

const EditContratos = () => {
  let navigate = useNavigate();
  const { id } = useParams();

  const [contrato, setContrato] = useState({
    description: "",
    deadlines: "",
    prices: 0,
    contractDocument: null,
    datosClienteId: "",
    dibujoPlanoId: "",
    numero: 0,
  });

  const [clientesNoVinculados, setClientesNoVinculados] = useState([]);
  const [dibujoPlanosNoVinculados, setDibujoPlanosNoVinculados] = useState([]);
  const [clienteName, setClienteName] = useState("");

  useEffect(() => {
    fetchContrato();
    fetchClientesNoVinculados();
    fetchDibujoPlanosNoVinculados();
  }, []);

  const fetchContrato = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v2/contrato-plano/${id}`
      );
      setContrato(response.data);
    } catch (error) {
      console.error("Error fetching contrato:", error);
    }
  };

  const fetchClientesNoVinculados = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v2/propiedades-no-vinculados"
      );
      setClientesNoVinculados(response.data);
    } catch (error) {
      console.error("Error fetching clientes no vinculados:", error);
    }
  };

  const fetchDibujoPlanosNoVinculados = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v2/dibujo-plano-no-vinculados"
      );
      setDibujoPlanosNoVinculados(response.data);
    } catch (error) {
      console.error("Error fetching dibujo planos no vinculados:", error);
    }
  };

  const {
    description,
    deadlines,
    prices,
    contractDocument,
    datosClienteId,
    dibujoPlanoId,
    numero,
  } = contrato;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContrato((prevContrato) => ({
      ...prevContrato,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setContrato((prevContrato) => ({
      ...prevContrato,
      contractDocument: file,
    }));
  };

  const handleClienteChange = (e) => {
    const clienteId = e.target.value;
    setContrato((prevContrato) => ({
      ...prevContrato,
      datosClienteId: clienteId,
    }));

    const selectedCliente = clientesNoVinculados.find(
      (cliente) => cliente.id === parseInt(clienteId)
    );
    if (selectedCliente) {
      setClienteName(selectedCliente.groundDirection);
    } else {
      setClienteName("");
    }
  };

  const updateContrato = async (e) => {
    e.preventDefault();
    console.log("Actualizando contrato...");

    const formData = new FormData();
    formData.append("description", description);
    formData.append("deadlines", deadlines);
    formData.append("prices", prices);
    formData.append("contractDocument", contractDocument);
    formData.append("datosClienteId", datosClienteId);
    formData.append("dibujoPlanoId", dibujoPlanoId);
    formData.append("numero", numero);

    try {
      await axios.put(
        `http://localhost:8080/api/v2/contrato-planos/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/contratos-planos");
    } catch (error) {
      console.error("Error updating contrato:", error);
    }
  };

  return (
    <div className="container" style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Editar Contrato</h2>
      </div>

      <div className="py-4">
        <form onSubmit={updateContrato}>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="description">
              Descripción
            </label>
            <div className="col-sm-4">
              <textarea
                className="form-control"
                rows={3}
                name="description"
                id="description"
                value={description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="deadlines">
              Fechas Límite
            </label>
            <div className="col-sm-4">
              <textarea
                className="form-control"
                rows={3}
                name="deadlines"
                id="deadlines"
                value={deadlines}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="prices">
              Precio
            </label>
            <div className="col-sm-4">
              <input
                type="number"
                className="form-control"
                name="prices"
                id="prices"
                value={prices}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label
              className="col-sm-2 col-form-label"
              htmlFor="contractDocument"
            >
              Documento del Contrato
            </label>
            <div className="col-sm-4">
              <input
                type="file"
                className="form-control"
                name="contractDocument"
                id="contractDocument"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="datosClienteId">
              Cliente
            </label>
            <div className="col-sm-4">
              <select
                className="form-control"
                name="datosClienteId"
                id="datosClienteId"
                value={datosClienteId}
                onChange={handleClienteChange}
              >
                <option value="">Seleccionar Cliente</option>
                {clientesNoVinculados.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.id}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label">
              Dirección de Propiedad
            </label>
            <div className="col-sm-4">
              <input
                type="text"
                className="form-control"
                readOnly
                value={clienteName}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="dibujoPlanoId">
              Diseño de Plano
            </label>
            <div className="col-sm-4">
              <select
                className="form-control"
                name="dibujoPlanoId"
                id="dibujoPlanoId"
                value={dibujoPlanoId}
                onChange={handleInputChange}
              >
                <option value="">Seleccionar Diseño de Plano</option>
                {dibujoPlanosNoVinculados.map((plano) => (
                  <option key={plano.id} value={plano.id}>
                    {plano.id}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="numero">
              Número
            </label>
            <div className="col-sm-4">
              <input
                type="number"
                className="form-control"
                name="numero"
                id="numero"
                value={numero}
                onChange={handleInputChange}
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
                to="/contratos-planos"
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

export default EditContratos;
