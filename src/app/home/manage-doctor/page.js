// pages/usuarios/index.js
'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { graphQLClient, setGraphQLClientHeaders } from '@/services/graphql';
import { gql } from "graphql-request"

export default function UsuariosIndex() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState([]);
  const { data, status } = useSession();
  const modalRef = useRef();

  useEffect(() => {
    if (status === "unauthenticated") {
        router.push("/auth/signin")
    }
    if (status === "authenticated") {
        fetchUsuarios(data.accessToken);
    }
  }, [status]);

  const fetchUsuarios = async (token) => {
    try {
      setGraphQLClientHeaders({
        authorization: `Bearer ${token}`,
      })

      const query = `
      query ListarUsuario {
        listarUsuario {
          id
          name
          lastName
          address
          ci
          sexo
          contactNumber
          titulo
          user {
            id
            username
            email
            role
          }
        }
      }
    `;

      const data = await graphQLClient.request(query);
      const response = data?.listarUsuario
      setUsuarios(response); // Establece los usuarios en el estado
    } catch (error) {
        if (error.response) {
            if (error.response.errors && error.response.errors[0] && error.response.errors[0].message) {
                if (error.response.errors[0].message === "Unauthorized") {
                    signOut();
                    router.push('/auth/signin')
                }
            }
          }
    }
  };

  const handleCrearUsuario = () => {
    router.push('/home/manage-doctor/create');
  };

  const handleActualizarUsuario = (doctorData) => {
    localStorage.setItem('doctorData', JSON.stringify(doctorData));
    router.push(`/home/manage-doctor/edit`);
  };

  const handleEliminarUsuario = (id) => {
    // Lógica para eliminar usuario (aún no implementada)
    console.log('Eliminar usuario con ID:', id);
    showModal();
  };

  const showModal = () => {
    const modal = new bootstrap.Modal(modalRef.current);
    modal.show();
  };

  const onCancel = () => {
    console.log("Cancelado ...")
  }

  const onConfirm = () => {
    console.log("Confirmado ...")
  }

  return (
    <div className="container">
      <h1>Lista de Usuarios</h1>
      <button className="btn btn-primary mb-3" onClick={handleCrearUsuario}>Crear Usuario</button>
      <div className="modal fade" ref={modalRef} tabIndex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="confirmModalLabel">Confirm Action</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Are you sure you want to proceed?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onCancel}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={onConfirm}>Confirm</button>
            </div>
          </div>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Dirección</th>
            <th>CI</th>
            <th>Sexo</th>
            <th>Número de Contacto</th>
            <th>Título</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.name}</td>
              <td>{usuario.lastName}</td>
              <td>{usuario.address}</td>
              <td>{usuario.ci}</td>
              <td>{usuario.sexo}</td>
              <td>{usuario.contactNumber}</td>
              <td>{usuario.titulo}</td>
              <td>
                <button className="btn btn-info" onClick={() => handleActualizarUsuario(usuario)}>Actualizar</button>
                <button className="btn btn-danger ml-2" onClick={() => handleEliminarUsuario(usuario.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
