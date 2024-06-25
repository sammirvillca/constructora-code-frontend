import React, { useEffect, useState } from "react";
import { Button, Table, IconButton } from "rsuite";
import TrashIcon from "@rsuite/icons/Trash";
import SearchIcon from "@rsuite/icons/Search";
import EditIcon from "@rsuite/icons/Edit";
import PlusIcon from "@rsuite/icons/Plus";
import axios from "axios";
import { Link } from "react-router-dom";
const { Column, HeaderCell, Cell } = Table;

const DatosClientes = () => {
  const [datosClientes, setDatosClientes] = useState([]);

  useEffect(() => {
    loadDatosClientes();
  }, []);

  const loadDatosClientes = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/v1/datos-clientes"
    );
    setDatosClientes(response.data);
  };

  const deleteDatosClientes = async (id) => {
    await axios.delete(`http://localhost:8080/api/v1/datos-clientes/${id}`);
    loadDatosClientes();
  };

  return (
    <div
      className="container"
      style={{ marginTop: "20px", marginLeft: "20px", marginRight: "20px" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          marginRight: "20px",
        }}
      >
        <h2>Datos Clientes</h2>
        <Button
          color="blue"
          appearance="primary"
          startIcon={<PlusIcon />}
          as={Link}
          to="/adddatosclientes"
        >
          Nuevos Datos Cliente
        </Button>
      </div>
      <div className="py-4">
        <Table
          height={400}
          wordWrap
          autoHeight
          data={datosClientes}
          onRowClick={(rowData) => {
            console.log(rowData);
          }}
        >
          <Column width={60} align="center" fixed>
            <HeaderCell>Cod</HeaderCell>
            <Cell dataKey="id" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Cod Cliente</HeaderCell>
            <Cell>{(rowData) => rowData.cliente.id}</Cell>
          </Column>
          <Column flexGrow={2}>
            <HeaderCell>Nombre Cliente</HeaderCell>
            <Cell>{(rowData) => rowData.cliente.fullName}</Cell>
          </Column>
          <Column flexGrow={2}>
            <HeaderCell>Dirección Terreno</HeaderCell>
            <Cell dataKey="groundDirection" />
          </Column>
          <Column width={100}>
            <HeaderCell>Area Terreno</HeaderCell>
            <Cell dataKey="landArea" />
          </Column>
          <Column width={150}>
            <HeaderCell>Tipo Construcción</HeaderCell>
            <Cell dataKey="typeConstruction" />
          </Column>
          <Column width={100} fixed="right">
            <HeaderCell>Editar</HeaderCell>
            <Cell>
              {(rowData) => (
                <Link to={`/editDatosClientes/${rowData.id}`}>
                  <IconButton
                    appearance="default"
                    icon={<EditIcon />}
                  ></IconButton>
                </Link>
              )}
            </Cell>
          </Column>
          <Column width={100} fixed="right">
            <HeaderCell>Detalles</HeaderCell>
            <Cell>
              {(rowData) => (
                <Link to={`/viewDatosClientes/${rowData.id}`}>
                  <IconButton
                    appearance="default"
                    icon={<SearchIcon />}
                  ></IconButton>
                </Link>
              )}
            </Cell>
          </Column>
          <Column width={100} fixed="right">
            <HeaderCell>Eliminar</HeaderCell>
            <Cell>
              {(rowData) => (
                <IconButton
                  appearance="default"
                  icon={<TrashIcon />}
                  onClick={() => deleteDatosClientes(rowData.id)}
                ></IconButton>
              )}
            </Cell>
          </Column>
        </Table>
      </div>
    </div>
  );
};

export default DatosClientes;
