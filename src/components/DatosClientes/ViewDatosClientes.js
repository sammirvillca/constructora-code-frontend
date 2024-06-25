import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "rsuite";
import PagePreviousIcon from "@rsuite/icons/PagePrevious";
import FileDownloadIcon from "@rsuite/icons/FileDownload";
import axios from "axios";

const ViewDatosClientes = () => {
  const { id } = useParams();
  const [datosCliente, setDatosCliente] = useState({
    groundDirection: "",
    landArea: "",
    typeConstruction: "",
    propertyDoc: null,
    cliente: null,
  });

  useEffect(() => {
    loadDatosCliente();
  }, []);

  const loadDatosCliente = async () => {
    const result = await axios.get(
      `http://localhost:8080/api/v1/datos-cliente/${id}`
    );
    setDatosCliente(result.data);
  };

  const { groundDirection, landArea, typeConstruction, propertyDoc, cliente } =
    datosCliente;

  const descargarDocumento = async () => {
    try {
      const datosClienteId = id;

      const response = await axios.get(
        `http://localhost:8080/api/v1/datos/${datosClienteId}/documento`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `DocumentoPropiedad${datosClienteId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el documento:", error);
    }
  };

  return (
    <div className="container" style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Detalles Datos Cliente</h2>
      </div>

      <div className="py-4">
        <div className="mb-4 row">
          <label className="col-sm-2 col-form-label">Cliente</label>
          <div className="col-sm-4">
            <input
              className="form-control"
              type="text"
              value={cliente?.fullName || ""}
              readOnly
            />
          </div>
        </div>
        <div className="mb-4 row">
          <label className="col-sm-2 col-form-label">Dirección Terreno</label>
          <div className="col-sm-4">
            <input
              className="form-control"
              type="text"
              value={groundDirection}
              readOnly
            />
          </div>
        </div>
        <div className="mb-4 row">
          <label className="col-sm-2 col-form-label">Área Terreno</label>
          <div className="col-sm-4">
            <input
              className="form-control"
              type="text"
              value={landArea}
              readOnly
            />
          </div>
        </div>
        <div className="mb-4 row">
          <label className="col-sm-2 col-form-label">Tipo Construcción</label>
          <div className="col-sm-4">
            <input
              className="form-control"
              type="text"
              value={typeConstruction}
              readOnly
            />
          </div>
        </div>
        <div className="mb-4 row">
          <label className="col-sm-2 col-form-label">Documento Propiedad</label>
          <div className="col-sm-4">
            {propertyDoc && (
              <Button
                color="blue"
                appearance="primary"
                startIcon={<FileDownloadIcon />}
                style={{width:"100%"}}
                onClick={descargarDocumento}
              >
                Ver Documento
              </Button>
            )}
          </div>
        </div>
        <div className="mb-4 row">
          <Link to="/datosclientes">
            <Button
              color="blue"
              appearance="primary"
              startIcon={<PagePreviousIcon />}
              style={{ width: "49%" }}
            >
              Volver
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewDatosClientes;
