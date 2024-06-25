import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Container, Content, FlexboxGrid, Panel, Header, Loader } from 'rsuite';
import axios from 'axios';
import { 
  FaUsers, 
  FaHardHat, 
  FaProjectDiagram, 
  FaCheckCircle, 
  FaTruck,
  FaChartLine
} from 'react-icons/fa';
import { API_BASE_URL } from "../../Config/Config";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    totalClientes: 0,
    totalTrabajadores: 0,
    totalProyectos: 0,
    proyectosEntregados: 0,
    totalProveedores: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [clientes, trabajadores, proyectos, proveedores, entregas] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/v2/clientes`),
          axios.get(`${API_BASE_URL}/api/v2/trabajadores`),
          axios.get(`${API_BASE_URL}/api/v2/proyectos`),
          axios.get(`${API_BASE_URL}/api/v2/proveedores`),
          axios.get(`${API_BASE_URL}/api/v2/entregas`),

        ]);

        console.log('Clientes:', clientes.data);
        console.log('Trabajadores:', trabajadores.data);
        console.log('Proyectos:', proyectos.data);
        console.log('Proveedores:', proveedores.data);
        console.log('Entregas:', entregas.data);


        setDashboardData({
          totalClientes: Array.isArray(clientes.data) ? clientes.data.length : 0,
          totalTrabajadores: Array.isArray(trabajadores.data) ? trabajadores.data.length : 0,
          totalProyectos: Array.isArray(proyectos.data) ? proyectos.data.length : 0,
          proyectosEntregados: Array.isArray(entregas.data) ? entregas.data.length :0,
          totalProveedores: Array.isArray(proveedores.data) ? proveedores.data.length : 0

        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Error al cargar los datos del dashboard. Por favor, intente de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const CardInfo = ({ title, value, icon, color }) => (
    <Panel shaded style={{ height: '100%' }}>
      <FlexboxGrid justify="space-between" align="middle">
        <FlexboxGrid.Item colspan={16}>
          <h3 style={{ margin: 0 }}>{value}</h3>
          <p style={{ color: '#575757', margin: 0 }}>{title}</p>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={8} style={{ textAlign: 'right' }}>
          {React.createElement(icon, { size: 48, color: color })}
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </Panel>
  );

  if (loading) {
    return (
      <Container>
        <Content style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
          <Loader size="lg" content="Cargando datos..." />
        </Content>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Content style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
          <p style={{color: 'red'}}>{error}</p>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Helmet>
        <title>Dashboard - Sistema de Construcción</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <Header>
        <h2><FaChartLine style={{ marginRight: '10px' }} /> Dashboard</h2>
        <p style={{ color: '#575757' }}>Resumen general del sistema</p>
      </Header>

      <Content>
        <FlexboxGrid justify="space-between" style={{ marginBottom: '20px' }}>
          <FlexboxGrid.Item colspan={24} md={12} lg={8}>
            <CardInfo 
              title="Total Clientes" 
              value={dashboardData.totalClientes} 
              icon={FaUsers} 
              color="#4caf50"
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={24} md={12} lg={8}>
            <CardInfo 
              title="Total Trabajadores" 
              value={dashboardData.totalTrabajadores} 
              icon={FaHardHat} 
              color="#2196f3"
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={24} md={12} lg={8}>
            <CardInfo 
              title="Total Proyectos" 
              value={dashboardData.totalProyectos} 
              icon={FaProjectDiagram} 
              color="#ff9800"
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={24} md={12} lg={8}>
            <CardInfo 
              title="Proyectos Entregados" 
              value={dashboardData.proyectosEntregados} 
              icon={FaCheckCircle} 
              color="#9c27b0"
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={24} md={12} lg={8}>
            <CardInfo 
              title="Total Proveedores" 
              value={dashboardData.totalProveedores} 
              icon={FaTruck} 
              color="#f44336"
            />
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Content>
    </Container>
  );
};

export default DashboardPage;