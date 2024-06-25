import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, ButtonToolbar, DatePicker, Input } from 'rsuite';
import CloseIcon from '@rsuite/icons/Close';
import CheckIcon from '@rsuite/icons/Check';
import axios from 'axios';

const AceptacionPlanoId = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [aceptacionPlano, setAceptacionPlano] = useState({
    acceptanceDate: null,
    comments: '',
    dibujoPlanoId: id,
  });

  useEffect(() => {
    fetchAceptacionPlano();
  }, []);

  const fetchAceptacionPlano = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v2/aceptacion-plano/${id}`);
      setAceptacionPlano(response.data);
    } catch (error) {
      console.error('Error fetching aceptación plano:', error);
    }
  };

  const handleInputChange = (value, name) => {
    setAceptacionPlano((prevAceptacionPlano) => ({
      ...prevAceptacionPlano,
      [name]: value,
    }));
  };

  const saveAceptacionPlano = async () => {
    try {
      await axios.post('http://localhost:8080/api/v2/aceptacion-plano', aceptacionPlano);
      navigate('/planos');
    } catch (error) {
      console.error('Error saving aceptación plano:', error);
    }
  };

  const updateAceptacionPlano = async () => {
    try {
      await axios.put(`http://localhost:8080/api/v2/aceptacion-planos/${id}`, aceptacionPlano);
      navigate('/planos');
    } catch (error) {
      console.error('Error updating aceptación plano:', error);
    }
  };

  return (
    <div className="container" style={{ marginTop: '20px' }}>
      <h2>Configurar Aceptación de Plano</h2>
      <div className="mb-4 row">
        <label className="col-sm-2 col-form-label" htmlFor="acceptanceDate">
          Fecha de Aceptación
        </label>
        <div className="col-sm-4">
          <DatePicker
            id="acceptanceDate"
            value={aceptacionPlano.acceptanceDate}
            onChange={(value) => handleInputChange(value, 'acceptanceDate')}
          />
        </div>
      </div>
      <div className="mb-4 row">
        <label className="col-sm-2 col-form-label" htmlFor="comments">
          Comentarios
        </label>
        <div className="col-sm-4">
          <Input
            as="textarea"
            rows={3}
            id="comments"
            value={aceptacionPlano.comments}
            onChange={(value) => handleInputChange(value, 'comments')}
          />
        </div>
      </div>
      <ButtonToolbar>
        {aceptacionPlano.id ? (
          <Button
            color="green"
            appearance="primary"
            startIcon={<CheckIcon />}
            onClick={updateAceptacionPlano}
          >
            Actualizar
          </Button>
        ) : (
          <Button
            color="green"
            appearance="primary"
            startIcon={<CheckIcon />}
            onClick={saveAceptacionPlano}
          >
            Guardar
          </Button>
        )}
        <Button
          color="red"
          appearance="primary"
          startIcon={<CloseIcon />}
          onClick={() => navigate('/planos')}
        >
          Cancelar
        </Button>
      </ButtonToolbar>
    </div>
  );
};

export default AceptacionPlanoId;