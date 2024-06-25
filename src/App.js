import React from "react";
import {
  Container,
  Navbar,
  Nav,
  Content,
  Sidebar,
  Sidenav,
  Header,
} from "rsuite";
import CogIcon from "@rsuite/icons/legacy/Cog";
import AngleLeftIcon from "@rsuite/icons/legacy/AngleDoubleLeft";
import AngleRightIcon from "@rsuite/icons/legacy/AngleDoubleRight";
import PageIcon from "@rsuite/icons/Page";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import GroupIcon from "@rsuite/icons/legacy/Group";
import MemberIcon from "@rsuite/icons/Member";
import TagAuthorizeIcon from "@rsuite/icons/TagAuthorize";
import AttachmentIcon from "@rsuite/icons/Attachment";
import FolderFillIcon from "@rsuite/icons/FolderFill";
import TreemapIcon from '@rsuite/icons/Treemap';
import CalendarIcon from '@rsuite/icons/Calendar';
import DocPassIcon from '@rsuite/icons/DocPass';



import "rsuite/dist/rsuite.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Trabajadores from "./components/Trabajadores/Trabajadores";
import DashboardPage from "./components/Dashboard/DashboardPage";
import AddTrabajadores from "./components/Trabajadores/AddTrabajadores";
import EditTrabajadores from "./components/Trabajadores/EditTrabajadores";
import Proveedores from "./components/Proveedores/Proveedores";
import AddProveedores from "./components/Proveedores/AddProveedores";
import EditProveedores from "./components/Proveedores/EditProveedores";
import Clientes from "./components/Clientes/Clientes";
import AddClientes from "./components/Clientes/AddClientes";
import EditClientes from "./components/Clientes/EditClientes";
import DatosClientes from "./components/DatosClientes/DatosClientes";
import AddDatosClientes from "./components/DatosClientes/AddDatosClientes";
import EditDatosClientes from "./components/DatosClientes/EditDatosClientes";
import ViewDatosClientes from "./components/DatosClientes/ViewDatosClientes";
import CatalogoProveedorId from "./components/CatalogoProveedores/CatalogoProveedorId";
//LogoConstruction
import LogoWithText from "./assets/images/LogoLINKS.png"
import LogoIcon from "./assets/images/IconoLINKS.png"
import DatosClienteId from "./components/DatosClientes/DatosClienteId";
import DepositosClienteId from "./components/Depositos/DepositosClienteId";
import PrerequisitosPlanoId from "./components/Prerequisitos/PrerequisitosPlanoId";
import DiseñosPlano from "./components/Planos/DiseñosPlano";
import AddDiseñosPlano from "./components/Planos/AddDiseñosPlano";
import EditDiseñosPlano from "./components/Planos/EditDiseñosPlano";
import AceptacionPlanoId from "./components/AceptacionPlano/AceptacionPlanoId";
import Contratos from "./components/Contratos/Contratos";
import AddContratos from "./components/Contratos/AddContratos";
import EditContratos from "./components/Contratos/EditContratos";
import Cronogramas from "./components/Cronogramas/Cronogramas";
import CronogramaPorId from "./components/Cronogramas/CronogramaPorId";
import Proyectos from "./components/Proyectos/Proyectos";
import ContratoConstruccion from "./components/ContratoConstruccion/ContratoConstruccion";
import ListaDeTrabajadoresPorProyecto from "./components/Proyectos/ListaDeTrabajadoresPorProyecto";
import ListaDeMaterialesPorProyecto from "./components/Proyectos/ListaDeMaterialesPorProyecto";
import Entrega from "./components/Entrega/Entrega";


const headerStyles = {
  padding: 10,
  fontSize: 16,
  minHeight: 56,
  background: "#0E2442",
  color: " #fff",
  whiteSpace: "nowrap",
  overflow: "hidden",
  display: 'flex', 
  alignItems: 'center',
};
const NavToggle = ({ expand, onChange }) => {
  return (
    <Navbar appearance="subtle" className="nav-toggle">
      <Nav>
        <Nav.Menu
          noCaret
          placement="topStart"
          trigger="click"
          title={<CogIcon style={{ width: 20, height: 20 }} size="sm" />}
        >
          <Nav.Item>Help</Nav.Item>
          <Nav.Item>Settings</Nav.Item>
          <Nav.Item>Sign out</Nav.Item>
        </Nav.Menu>
      </Nav>

      <Nav pullRight>
        <Nav.Item onClick={onChange} style={{ width: 56, textAlign: "center" }}>
          {expand ? <AngleLeftIcon /> : <AngleRightIcon />}
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

function App() {
  const [expand, setExpand] = React.useState(true);
  return (
    <div className="show-fake-browser sidebar-page">
      <BrowserRouter>
        <Container>
          <Sidebar
            style={{ display: "flex", flexDirection: "column" }}
            width={expand ? 260 : 56}
            collapsible
          >
            <Sidenav.Header>
              <div style={headerStyles}>
                <img
                  src={expand ? LogoWithText : LogoIcon}
                  alt="Logo"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
            </Sidenav.Header>
            <Sidenav
              expanded={expand}
              defaultOpenKeys={["3"]}
              appearance="subtle"
            >
              <Sidenav.Body>
                <Nav>
                  <Nav.Item eventKey="1" icon={<DashboardIcon />} as={Link} to="/">
                    Dashboard
                  </Nav.Item>
                  <Nav.Item eventKey="2" icon={<GroupIcon />} as={Link} to="/clientes">
                    Clientes
                  </Nav.Item>
                  <Nav.Item eventKey="3" icon={<MemberIcon />} as={Link} to="/trabajadores">
                    Trabajadores
                  </Nav.Item>
                  <Nav.Item eventKey="4" icon={<TagAuthorizeIcon />} as={Link} to="/proveedores">
                    Proveedores
                  </Nav.Item>
                  <Nav.Item eventKey="5" icon={<TreemapIcon />} as={Link} to="/planos">
                    Planos
                  </Nav.Item>
                  <Nav.Menu
                    eventKey="6"
                    trigger="hover"
                    title="Contratos"
                    icon={<FolderFillIcon />}
                    placement="rightStart"
                  >
                    <Nav.Item eventKey="6-1" as={Link} to="/contratos-planos">Plano</Nav.Item>
                    <Nav.Item eventKey="6-2" as={Link} to="/contratos-construccion">Construcción</Nav.Item>

                  </Nav.Menu>
                  <Nav.Item eventKey="7" icon={<CalendarIcon />} as={Link} to="/cronogramas"> 
                    Cronogramas
                  </Nav.Item>
                  <Nav.Item eventKey="8" icon={<PageIcon />} as={Link} to="/proyectos">
                    Proyectos
                  </Nav.Item>

                  <Nav.Item eventKey="9" icon={<DocPassIcon />} as={Link} to="/entregas">
                    Entregas
                  </Nav.Item>
                  
                </Nav>
              </Sidenav.Body>
            </Sidenav>
            <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
          </Sidebar>

          <Container className="container-back">
            <Header></Header> {/*aqui va la cabezera*/}
            <Content className="content-container">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/trabajadores" element={<Trabajadores />} />
                <Route path="/trabajadores/nuevo-trabajador" element={<AddTrabajadores />} />
                <Route path="/trabajadores/modificar-trabajador/:id" element={<EditTrabajadores />} />
                <Route path="/proveedores" element={<Proveedores />} />
                <Route path="/proveedores/nuevo-proveedor" element={<AddProveedores />} />
                <Route path="/proveedores/modificar-proveedor/:id" element={<EditProveedores />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/clientes/nuevo-cliente" element={<AddClientes />} />
                <Route path="/clientes/modificar-cliente/:id" element={<EditClientes />} />
                <Route path="/datosclientes" element={<DatosClientes />} />
                <Route path="/addDatosCLientes" element={<AddDatosClientes />} />
                <Route path="/editDatosClientes/:id" element={<EditDatosClientes />} />
                <Route path="/viewDatosClientes/:id" element={<ViewDatosClientes />} />
                <Route path="/proveedores/catalogo/:id" element={<CatalogoProveedorId />} />
                <Route path="/clientes/propiedades/:id" element={<DatosClienteId />} />
                <Route path="/clientes/propiedades/depositos/:id" element={<DepositosClienteId />} />
                <Route path="/clientes/prerequisitos-plano/:id" element={<PrerequisitosPlanoId />} />
                <Route path="/planos" element={<DiseñosPlano />} />
                <Route path="/planos/nuevo-plano" element={<AddDiseñosPlano />} />
                <Route path="/planos/modificar-plano/:id" element={<EditDiseñosPlano />} />
                <Route path="/planos/estado-aceptacion/:id" element={<AceptacionPlanoId />} />
                <Route path="/contratos-planos" element={<Contratos />} />
                <Route path="/contratos/nuevo-contrato" element={<AddContratos />} />
                <Route path="/contratos/modificar-contrato/:id" element={<EditContratos />} />
                <Route path="/cronogramas" element={<Cronogramas />} />
                <Route path="/cronogramas/detalles/:id" element={<CronogramaPorId />} />
                <Route path="/proyectos" element={<Proyectos />} />
                <Route path="/contratos-construccion" element={<ContratoConstruccion />} />
                <Route path="/proyectos/:id/lista-de-trabajadores" element={<ListaDeTrabajadoresPorProyecto />} />
                <Route path="/proyectos/:id/lista-de-materiales" element={<ListaDeMaterialesPorProyecto />} />
                <Route path="/entregas" element={<Entrega />} />

              </Routes>
            </Content>
          </Container>
        </Container>
      </BrowserRouter>
    </div>
  );
}

export default App;
